
import * as THREE from 'three';
import {OrbitControls} from './build/controls/OrbitControls.js';

var camera, scene, renderer, controls;

init();
animate();
onWindowResize();


function init() {
    //Add Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0762ad);
    var ratio = window.innerWidth / window.innerHeight;

    //Add Camera
    camera = new THREE.PerspectiveCamera(70, ratio, 0.1, 100000);
    camera.position.set(0, 15, 50); 
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //Add Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Add Island
    const island = createComplexFloatingIsland();
    scene.add(island); 

    // Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 100);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, -100, 0);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    //Add cube
    const cube = createSimpleCube();
    scene.add(cube);

    //Add Items 
    placeItemOnIslandWithRaycasting(island, cube, scene);

}

function createSimpleCube() {
    // Define the geometry for a cube (size of 1x1x1)
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Define the material, basic color without lighting
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color

    // Create a mesh with the geometry and material
    const cube = new THREE.Mesh(geometry, material);

    // Return the cube mesh
    return cube;
}

function createComplexFloatingIsland() {
    
    const baseGeometry = new THREE.IcosahedronGeometry(10, 4);
    const positions = baseGeometry.attributes.position;
    const verticesCount = positions.count;
    const vertex = new THREE.Vector3();

    // Compute the max and min height of vertices to scale the displacement accordingly
    let maxHeight = 0;
    let minHeight = Infinity;
    for (let i = 0; i < verticesCount; i++) {
        vertex.fromBufferAttribute(positions, i);
        if (vertex.y > maxHeight) maxHeight = vertex.y;
        if (vertex.y < minHeight) minHeight = vertex.y;
    }
    
    const flattenLevel = maxHeight * 0.5;//when the top gets flat

    // Modify vertices to create the island shape
    for (let i = 0; i < verticesCount; i++) {
        vertex.fromBufferAttribute(positions, i);

        // Calculate the relative height of the vertex within the island
        const relativeHeight = (vertex.y - minHeight) / (maxHeight - minHeight);

        // Displace vertices outwards more as they are higher up
        const displacement = relativeHeight * 2; //bulge
        
        vertex.x *= 1 + displacement;
        vertex.z *= 1 + displacement;

        // Flatten the top of the island
        if (vertex.y > flattenLevel) {
            vertex.y = flattenLevel + (vertex.y - flattenLevel) * 0.1;
        }

        // Apply the modified position back to the geometry
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    // Notify Three.js that the position buffer needs to be updated
    positions.needsUpdate = true;

    // Recalculate normals for the lighting after modifying the geometry
    baseGeometry.computeVertexNormals();

    // Create a mesh with the modified geometry and a simple gray material
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Medium gray
    const island = new THREE.Mesh(baseGeometry, islandMaterial); // Define 'island' here

    // Position the island to float
    island.position.y = 5; // Adjust height as needed

    // Return the mesh (island)
    return island;
}


function placeItemOnIslandWithRaycasting(island, item, scene) { 														//Does not work yet
    // Raycaster to find the top surface of the island
    const raycaster = new THREE.Raycaster();
    
    // Compute bounding box of the island geometry to find the highest Y position
    island.geometry.computeBoundingBox();
    const highestPoint = island.geometry.boundingBox.max.y;

    // Start the ray from well above the highest point of the island, looking down
    const startPosition = new THREE.Vector3(island.position.x, island.position.y + highestPoint + 100, island.position.z);
    const direction = new THREE.Vector3(0, -1, 0); // Ray directed downwards
    raycaster.set(startPosition, direction);

    // Check for intersections with the island
    const intersections = raycaster.intersectObject(island, true); // use 'true' for recursive if island has children

    if (intersections.length > 0) {
        // If there's an intersection, use the point directly
        const intersectionPoint = intersections[0].point;
        
        // Offset the item by half its height to ensure it sits 'on' the surface, not 'in' it
        // Compute the bounding box to get the height of the item
        item.geometry.computeBoundingBox();
        const itemHeight = item.geometry.boundingBox.getSize(new THREE.Vector3()).y;

        // Set the item's position to be on the intersected point
        item.position.copy(intersectionPoint).add(new THREE.Vector3(0, itemHeight / 2, 0));

        // Add the item to the scene
        scene.add(item);
    }
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}