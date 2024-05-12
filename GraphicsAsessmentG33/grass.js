import * as THREE from 'three';

export function createGrass(island) {

    // Increasing the segment count for finer detail
    const topRadius = 25; // Adjust this value based on the actual size of the flat top of your island
    const segments = 64; // Increased number of segments for a smooth circle
    const height = 1; // The thickness of the grass layer

    // Create a circular grass area with thickness
    const grassGeometry = new THREE.CylinderGeometry(topRadius, topRadius, height, segments);
    grassGeometry.rotateX(Math.PI / 1); // Rotate to lay flat like a disk

    // Use a flat green color for the grass, making it appear as a uniform surface
    var grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2f6b37, side: THREE.DoubleSide });

    // Create the grass mesh
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.set(island.position.x, island.position.y + 25, island.position.z);

    return grass;
}

function grassTerainRaiser() {


}