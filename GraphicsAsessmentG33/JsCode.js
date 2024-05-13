
import * as THREE from 'three';
import { GLTFLoader } from './build/GLTFLoader.js';
import { OrbitControls } from './build/controls/OrbitControls.js';
import { createDayNightSlider, createSunAndMoon } from './daynight.js';
import { createGrass } from './grass.js';
import { createIsland } from './island.js';
import { CreateLake } from './lake.js';
import { createFirTree, createOakTree, createBirchTree } from './trees.js';
import { createCloud } from './clouds.js';




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
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    //Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Add Island
    //const island = createComplexFloatingIsland();
    //scene.add(island); 

    // Create day-night slider
    createDayNightSlider(scene); 
    createSunAndMoon(scene)

    //Add island
    const island = createIsland();
    scene.add(island);

   /// Add grass on the island
   const { grass, grassRing } = createGrass(island);
   scene.add(grass);
   scene.add(grassRing);

    

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
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0, -100, 0);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

     // Adding trees
     const firTree = createFirTree();
     const oakTree = createOakTree();
     const birchTree = createBirchTree();
 
     firTree.position.set(-5, approximateFlatTopY + 15.5, 0);
     scene.add(firTree);
 
     oakTree.position.set(5, approximateFlatTopY + 15.5, 0);
     scene.add(oakTree);

     birchTree.position.set(-10, approximateFlatTopY + 15.5, 0);
     scene.add(birchTree);

     //add lake+
     const lake = CreateLake();
     scene.add(lake);
     lake.position.set(0, approximateFlatTopY + 15, 0);

     //Add clouds
     const cloud = createCloud(3);
     cloud.position.set(-5, 40, 0);
     scene.add(cloud);

     //add grass:

     
     

    
     
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
    const grassRadius = 24; // Outer radius of the grass area
    const lakeRadius = 5; // Radius of the lake
    let angle = Math.random() * Math.PI * 2; // Random angle

    // Ensure random distance is outside the lake's radius
    let r = Math.sqrt(Math.random() * (grassRadius * grassRadius - lakeRadius * lakeRadius) + lakeRadius * lakeRadius);
    let x = r * Math.cos(angle);
    let z = r * Math.sin(angle);

    return new THREE.Vector3(x, approximateFlatTopY + 15.1, z); // Adjust the Y position as needed
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