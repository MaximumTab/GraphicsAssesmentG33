import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';
import  {seededRandom} from './meth/MathUtils.js';
import { generateTrees } from './TreeGeneration.js';


let sceneTemp;
let seed = 170803; //adjust on input for different island shapes
let noise = createNoise2D(function() { return seededRandom(seed) }); //when using: noise = createNoise2D(function() { return seededRandom(seed) }); to update

//island parameters 
export let radius = 25; //top island radius
export let scale = 15; //idk smth dont change too much tho
export let amplitude = 3; // function peaks
export let steepness = 30; //changes height inderectly how far the walls go up 

export function createIsland() {
    const material = new THREE.MeshPhongMaterial({ color: 0x808080, specular: 0x111111, shininess: 10});
    material.flatShading = false;
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1000, 1000);
    const island = new THREE.Mesh(geometry, material);
    island.castShadow = true;
    island.receiveShadow = true;
    island.rotateX(Math.PI / -2);

    flipFaces(geometry);  
    invertNormals(geometry); 


    const positions = geometry.attributes.position.array;

    const fixedHeight = 25; // Height where the verticies get draged up to
    const edgeRadius = radius; // This should be the same as the island radius to ensure boundary alignment

    for (let i = 0; i < positions.length; i += 3) {
        let x = positions[i];
        let y = positions[i + 1];
        let z = positions[i + 2];
    
        const distance = Math.sqrt(x * x + y * y);
        
        if (distance >= edgeRadius) {
            // Adjust vertices on or outside the circle radius onto that radius
            const angle = Math.atan2(y, x);
            positions[i] = Math.cos(angle) * edgeRadius;  // Adjust x to be on the radius
            positions[i + 1] = Math.sin(angle) * edgeRadius;  // Adjust y to be on the radius
            positions[i + 2] = fixedHeight;  // Set fixed height for edge vertices
        } else {
            // Calculate height for inner vertices as before
            const value = noise(x / scale, y / scale);
            const coneHeight = x * x / steepness + y * y / steepness;
            z = value * amplitude + amplitude + coneHeight;
            positions[i + 2] = Math.min(z, fixedHeight);  // Ensure no vertex is above the fixed height
        }
    }

    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;

    return island;
}

function invertNormals(geometry) {
    const normals = geometry.attributes.normal.array;
    for (let i = 0; i < normals.length; i++) {
        normals[i] = -normals[i]; // Invert each component of the normal
    }
    geometry.attributes.normal.needsUpdate = true; // Flag the normals to be updated on the GPU
}

function flipFaces(geometry) {
    for (let i = 0; i < geometry.index.array.length; i += 3) {
        const a = geometry.index.array[i];
        const b = geometry.index.array[i + 1];
        geometry.index.array[i] = b;
        geometry.index.array[i + 1] = a;
    }
    geometry.index.needsUpdate = true; // Flag the indices to be updated on the GPU
}



export function updateSeed(scene) {
    seed = Math.floor(Math.random() * 10000);  // new seed generator
    noise = createNoise2D(function() { return seededRandom(seed) });  // Update noise function with new seed
    
    const island = createIsland(scene);  // Create a new island with updated noise
    
    if (scene.island) {
        scene.remove(scene.island);  // Remove the old island if it exists
    }
    scene.island = island;  // Reference the new island in the scene object for future updates
    scene.add(island);  // Add the new island to the scene
    generateTrees(island);
}






