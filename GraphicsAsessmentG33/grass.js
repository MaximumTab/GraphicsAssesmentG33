import * as THREE from 'three';

export function createGrass(island) {
    const outerRadius = 25; 
    const innerRadius = 5;
    const segments = 256;

    //dounut for the edge
    const radius = outerRadius; 
    const tube = 0.1  ;
    const radialSegments = 256 ;               
    const tubularSegments =256;                   


    //ring geometry for the grass area with hole
    const grassGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    const grassGeometryRing = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    grassGeometry.rotateX(Math.PI / 2); // Rotate to lay flat
    grassGeometryRing.rotateX(Math.PI / 2);

    // Use a flat green color for the grass, making it appear as a uniform surface
    var grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2f6b37, side: THREE.DoubleSide });

    // Create the grass mesh
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    const grassRing = new THREE.Mesh(grassGeometryRing, grassMaterial);
    // Set position to be aligned with the island mesh
    grass.position.set(island.position.x, island.position.y+25, island.position.z); // Adjust Y coordinate as needed
    grassRing.position.set(island.position.x, island.position.y+25, island.position.z)
    
    grass.receiveShadow = true;

    return { grass, grassRing };
}

