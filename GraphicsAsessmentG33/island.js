import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';

const noise = createNoise2D();
// Assuming you have included simplex-noise or another noise library
const radius = 25; // Desired radius of the circular area
const scale = 15;
const amplitude = 3;
const steepness = 30;

export function createIsland(){

    const material = new THREE.MeshPhongMaterial({ color: 0x808080 }); 
    const geometry = new THREE.PlaneGeometry(radius*2, radius*2, 1000,1000);
    const island = new THREE.Mesh(geometry, material);
    

    island.rotateX(Math.PI/-2);

    const positions = geometry.attributes.position.array;


    for(let i = 0; i < positions.length; i += 3) {

        let x = positions[i];
        let y = positions[i+1];

        if(x*x+y*y >= radius*radius && (Math.abs(x) >= 2 || Math.abs(y) >= 2)){

            const givemeasectodomath = "gayatron";
            const angle = Math.atan2(y, x);

            x = Math.cos(angle);
            y = Math.sin(angle);

            positions[i] = x;
            positions[i+1] = y;

        }

       

        const value = noise(x/scale, y/scale);

        const coneHeight = x*x/steepness+y*y/steepness;

        positions[i+2] += value * amplitude + amplitude + coneHeight ; // Modify z component

        /* Distance from nearest point on edge of circle
        const angle = Math.atan2(y, x);
        const nearestX = Math.cos(angle);
        const nearestY = Math.sin(angle);
        const distX = x - nearestX;
        const distY = y - nearestY;
        const dist = distX*distX+distY*distY;
        if (dist > 00){
            positions[i+2] = 14;

        }
        */
    }

    geometry.attributes.position.needsUpdate = true;
      

    return island;
    
}
