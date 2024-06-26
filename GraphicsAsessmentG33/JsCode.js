import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { generateTrees } from './TreeGeneration.js';
import { GLTFLoader } from './build/GLTFLoader.js';
import { OrbitControls } from './build/controls/OrbitControls.js';
import { createCloud } from './clouds.js';
import { createDayNightSlider, createLightingToggleButton, createSunAndMoon } from './daynight.js';
import { createGrass } from './grass.js';
import { createIsland, updateSeed } from './island.js';
import { createMountainMesh } from './mountain.js';
import { createWaterBody, waterUniforms } from './pond.js';

var camera, scene, renderer, controls;
export let numberofTrees = 100;
export let scale = 15; //idk smth dont change too much tho
export let amplitude = 3; // function peaks
var numberOfEachModel = 50;
var approximateFlatTopY = 10;
const gui = new GUI();
const params = {
    amplitude: 3,
    scale: 15,
    graass: 50,
    numberofTrees: 100
};
var obj = { add:function(){ updateSeed(scene) }};
gui.add(obj,'add').name('Randomize Seed');
gui.add(params, 'amplitude', 0, 10).onChange(function(value){
    amplitude = params.amplitude;
    updateSeed(scene);
});
gui.add(params, 'scale', 0, 30).onChange(function(value){
    scale = params.scale;
    updateSeed(scene);
});
gui.add(params, 'graass', 0, 500).onChange(function(value){
    numberOfEachModel = params.graass;
    reset();
});
gui.add(params, 'numberofTrees', 0, 500).onChange(function(value){
    numberofTrees = params.numberofTrees;
    updateSeed(scene);
});

init();
animate();
onWindowResize();


const mountain = createMountainMesh();



function init() {

    //Add Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x317ef5);
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

    // Create day-night slider and lighting toggle button
    createDayNightSlider(scene);
    createLightingToggleButton(scene);
    createSunAndMoon(scene);
    //Add island
}
function generateObjects(){
    const island = createIsland();  // Create island
    scene.add(island);  // Add island to the scene
    scene.island = island;

    //Add Trees
    generateTrees(island);


   // Add grass on the island
   const { grass, grassRing } = createGrass(island);
   scene.add(grass);
   scene.add(grassRing);

    
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

     //add lake+
     const lake = createWaterBody();
     scene.add(lake);
     lake.position.set(0, approximateFlatTopY + 15, 0);

     //Add clouds
    //  const cloud = createCloud(3);
    //  cloud.position.set(-5, 40, 0);
    //  scene.add(cloud);

     const clouds = new THREE.Group();
     for (let i = 1; i < 7; i++) {
        const cloud = createCloud(Math.floor(Math.random()*5)+3);
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 10;
        cloud.position.set(Math.cos(angle) * distance, 40 + Math.random() * 10, Math.sin(angle) * distance);

        clouds.add(cloud);
     }
     scene.add(clouds);

     
     mountain.scale.set(1.7, 1.7, 1.7);
     mountain.position.set(-15, approximateFlatTopY + 15, 0);
     scene.add(mountain);

     //add grass:
     grassGerenation();
     

}
var grasses = [];
function grassGerenation(){
        // Load multiple models randomly placed on the grass
        const modelNames = ['grass1.glb', 'grass2.glb', 'grass3.glb']; // Assuming names of models
        // Example: Place 5 of each model
   
       modelNames.forEach(modelName => {
           for (let i = 0; i < numberOfEachModel; i++) {
               let scale = 5; // Adjust scale based on your model specifics
               loadModel(`./models/${modelName}`, scale, `${modelName}-${i}`);
           }
       });
}
generateObjects();



function loadModel(modelPath, scale, modelName) {
    const loader = new GLTFLoader();
    const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    loader.load(modelPath, function(gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isMesh) {
                node.material = greenMaterial;
            }
        });

        model.scale.set(scale, scale, scale);
        model.position.copy(randomPositionOnGrass());
        model.name = modelName; // Useful for debugging
        scene.add(model);
        grasses.push(model);
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


function reset(){
    grasses.forEach(grass => scene.remove(grass));
    grassGerenation();
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
    waterUniforms.time.value += 0.01;
}