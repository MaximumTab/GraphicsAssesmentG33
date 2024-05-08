import * as THREE from 'three';
import { OrbitControls } from './build/controls/OrbitControls.js';
import { createTree } from './tree.js';
import { createDayNightSlider, createSunAndMoon } from './daynight.js';

var camera, scene, renderer, controls;
var approximateFlatTopY = 10;

init();
animate();
onWindowResize();

function printCameraPosition() {
    console.log("Camera position:", camera.position.x, camera.position.y, camera.position.z);
    requestAnimationFrame(printCameraPosition);
}

// Call the function to start printing the camera position
printCameraPosition();
function init() {
    //Add Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0064FF);
    var ratio = window.innerWidth / window.innerHeight;

    //Add Camera
    camera = new THREE.PerspectiveCamera(70, ratio, 0.1, 100000);
    camera.position.set(0, 20, -100);
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
    placeCubeOnTopOfIsland(island, cube);
    const tree = createTree();
    // Adjust the position of the tree to be on top of the island
    tree.position.set(0, approximateFlatTopY + 5, 0); // Adjust Y based on the trunk's height and island's flat top
    scene.add(tree);

    // Create day-night slider
    createDayNightSlider(scene); 
    createSunAndMoon(scene)
       


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

    approximateFlatTopY = flattenLevel + (maxHeight - flattenLevel) * 0.1;
    console.log(approximateFlatTopY);

    // Return the mesh (island)
    return island;
   
   
}


function placeCubeOnTopOfIsland(island, cube) {

    const flattenLevel = approximateFlatTopY; // This is the y position of the island's flat top.

    const cubeHeight = 1; // Half the cube's height, since its position is based on the cube's center.

    const yOffset = cubeHeight / 2 + 0.1;

    cube.position.set(0, flattenLevel + yOffset, 0);
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