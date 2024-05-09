
import * as THREE from 'three';
import { GLTFLoader } from './build/GLTFLoader.js';
import { OrbitControls } from './build/controls/OrbitControls.js';
import { createDayNightSlider, createSunAndMoon } from './daynight.js';
import { createFirTree, createOakTree } from './trees.js';



var camera, scene, renderer, controls;
var approximateFlatTopY = 10;

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

    // Create day-night slider
    createDayNightSlider(scene); 
    createSunAndMoon(scene)

   /// Add grass on the island
    addGrassOnIsland(island);

    // Load multiple models randomly placed on the grass
    const modelNames = ['grass1.glb', 'grass2.glb', 'grass3.glb']; // Assuming names of models
    const numberOfEachModel = 100; // Example: Place 5 of each model

    modelNames.forEach(modelName => {
        for (let i = 0; i < numberOfEachModel; i++) {
            let scale = 5; // Adjust scale based on your model specifics
            loadModel(`./models/${modelName}`, scale, `${modelName}-${i}`);
        }
    });



    // Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 100);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, -100, 0);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

     // Adding trees
     const firTree = createFirTree();
     const oakTree = createOakTree();
 
     firTree.position.set(-5, approximateFlatTopY + 5, 0);
     scene.add(firTree);
 
     oakTree.position.set(5, approximateFlatTopY + 5, 0);
     scene.add(oakTree);

     const gltfLoader = new GLTFLoader();
}

function loadModel(modelPath, scale, modelName) {
    const loader = new GLTFLoader();
    loader.load(modelPath, function(gltf) {
        const model = gltf.scene;
        model.scale.set(scale, scale, scale);
        model.position.copy(randomPositionOnGrass());
        model.name = modelName; // Useful for debugging
        scene.add(model);
    });
}

function randomPositionOnGrass() {
    const radius = 20; // Radius of the grass plane, adjust to match its actual size
    let angle = Math.random() * Math.PI * 2; // Random angle
    let r = radius * Math.sqrt(Math.random()); // Random distance from the center
    let x = r * Math.cos(angle);
    let z = r * Math.sin(angle);
    return new THREE.Vector3(x, approximateFlatTopY + 5, z); // Adjust the Y position as needed
}

function addGrassOnIsland(island) {
    const flattenLevel = approximateFlatTopY; // The flat top y-level of the island

    // Increasing the segment count for finer detail
    const topRadius = 21.5; // Adjust this value based on the actual size of the flat top of your island
    const segments = 16; // Increased number of segments for a smooth circle
    const height = 1; // The thickness of the grass layer

    // Create a circular grass area with thickness
    const grassGeometry = new THREE.CylinderGeometry(topRadius, topRadius, height, segments);
    grassGeometry.rotateX(Math.PI / 1); // Rotate to lay flat like a disk

    // Use a flat green color for the grass, making it appear as a uniform surface
    var grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2f6b37, side: THREE.DoubleSide });

    // Create the grass mesh
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.set(island.position.x, flattenLevel + 4.5, island.position.z);

    scene.add(grass);
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