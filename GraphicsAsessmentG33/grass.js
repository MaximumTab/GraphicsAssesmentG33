import * as THREE from 'three';

export function createGrass(island) {
    const outerRadius = 25; // Adjust this value based on the actual size of the flat top of your island
    const innerRadius = 5; // Adjust this to create a suitable hole size for the lake
    const segments = 256; // Increased number of segments for a smooth circle

    // Create a ring geometry for the grass area with an inner hole
    const grassGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    grassGeometry.rotateX(Math.PI / 2); // Rotate to lay flat

    // Use a flat green color for the grass, making it appear as a uniform surface
    var grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2f6b37, side: THREE.DoubleSide });

    // Create the grass mesh
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    // Set position to be aligned with the island mesh
    grass.position.set(island.position.x, island.position.y+25, island.position.z); // Adjust Y coordinate as needed

    return grass;
}

function grassTerainRaiser() {


}