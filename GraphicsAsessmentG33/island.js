import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';

const noise = createNoise2D();
// Assuming you have included simplex-noise or another noise library
const radius = 25; // Desired radius of the circular area
const scale = 15;
const amplitude = 3;
const steepness = 30;

export function createIsland() {
    const material = new THREE.MeshPhongMaterial({ color: 0x808080, specular: 0x111111, shininess: 10});
    material.flatShading = false;
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1000, 1000);
    const island = new THREE.Mesh(geometry, material);
    island.castShadow = true;
    island.receiveShadow = true;
    island.rotateX(Math.PI / -2);

    flipFaces(geometry);   // Flip the faces if needed
    invertNormals(geometry); // Invert normals to correct the orientation


    const positions = geometry.attributes.position.array;

    const fixedHeight = 25; // Height where the red arrow points
    const edgeRadius = radius; // This should be the same as the island radius to ensure boundary alignment

    for (let i = 0; i < positions.length; i += 3) {
        let x = positions[i];
        let y = positions[i + 1];

        const distance = Math.sqrt(x * x + y * y);
        
        if (distance > edgeRadius) {
            // Correcting position to lie exactly on the radius
            const angle = Math.atan2(y, x);
            positions[i] = Math.cos(angle) * edgeRadius; // Adjust x to be on the radius
            positions[i + 1] = Math.sin(angle) * edgeRadius; // Adjust y to be on the radius
            positions[i + 2] = fixedHeight; // Set fixed height for edge vertices
        } else if (distance >= radius) {
            // Adjust the height to fixedHeight if it's on the boundary
            positions[i + 2] = fixedHeight;
        } else {
            // Calculate height for inner vertices as before
            const value = noise(x / scale, y / scale);
            const coneHeight = x * x / steepness + y * y / steepness;
            positions[i + 2] = value * amplitude + amplitude + coneHeight; // Modify z component
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



