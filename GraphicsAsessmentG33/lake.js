import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

/*const gui = new GUI();
const params = {
    amplitude: 5,
    scale: 0.05,
    x: 0,
    y: 0
};
gui.add(params, 'amplitude', 0, 10).onChange(function(value){
    updateTerrain();
});
gui.add(params, 'scale', 0, 1).onChange(function(value){
    updateTerrain();
});
gui.add(params, 'x', 0, 10).onChange(function(value){
    updateTerrain();
});
gui.add(params, 'y', 0, 10).onChange(function(value){
    updateTerrain();
});*/
export function CreateLake(){
    updateTerrain();
    const material = new THREE.MeshPhongMaterial({ color: 0x964B00, wireframe: false });
    const lake = new THREE.Mesh(geometry, material);
    lake.rotation.x = -Math.PI / 2;
    lake.add(createWater());
    const rocks = createRocks();
    rocks.forEach(rock => lake.add(rock));
    return lake;
}
    

const noise = createNoise2D();
const geometry = new THREE.PlaneGeometry(10, 10, 100, 100); // Plane size: 10x10, subdivided into 100x100 segments
const centerOffsetX = 5; // Center at half of the plane width
const centerOffsetY = 5; // Center at half of the plane height
const radius = 5; // Desired radius of the circular area
const radiusSquared = radius * radius; // Square the radius for faster comparison// Maximum constant depth adjustment at the center
const scale = 0.7;
const amplitude = 3;
function updateTerrain() {
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i]; // Adjust x to center
        const y = vertices[i + 1]; // Adjust y to center
        const distanceSquared = x * x + y * y; // Calculate distance squared from center

        if (distanceSquared <= radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const depthFactor = 1 - (distance / radius); // Linear depth decrease from center to edge
            const z = noise(x * scale, y * scale); // Get noise value
            if (z - (depthFactor * amplitude) < 0) {
                vertices[i + 2] = z - (depthFactor * amplitude); // Subtract depth based on distance from center
            }
            else {
                vertices[i + 2] = - (depthFactor); // Flatten the bottom
            }
        } else {
            vertices[i + 2] = 0; // Flatten outside the circle
        }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Necessary for proper shading and smoothing
    return geometry;
}

updateTerrain();
// Water    
function createRocks(){
    const lakeRadius = 5; // Radius of the lake
    const numberOfRocks = 30; // Set a fixed number of rocks
    const rocks = []; // Array to store the rocks
    
    for (let i = 0; i < numberOfRocks; i++) {
        const angle = (i / numberOfRocks) * 2 * Math.PI; // Evenly spaced in circular pattern
        const rockRadius = Math.random() * 0.5 + 0.2; // Random rock radius between 0.2 and 0.7
        const x = lakeRadius * Math.cos(angle); // Position rocks exactly on the edge of the lake
        const z = lakeRadius * Math.sin(angle);
        const rockGeometry = new THREE.SphereGeometry(rockRadius, 20, 20);
        const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, 0, z);
        rocks.push(rock); // Add the rock to the array
    }
    
    return rocks; // Return the array of rocks
}
function createWater(){
    const waterRadius = 5; // Same as the radius of the circular terrain
    const segments = 32; // Define the smoothness of the circle's edge
    const waterGeometry = new THREE.CircleGeometry(waterRadius, segments);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x0096c7, // A nice water blue
        transparent: true,
        opacity: 0.6,
        reflectivity: 0.6
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(0, 0.1, 0); // Centered and slightly above the lake bed to avoid z-fighting
    water.rotation.x = -Math.PI / 2; // Rotate to lie flat
    
    scene.add(water);
    return water;
}
