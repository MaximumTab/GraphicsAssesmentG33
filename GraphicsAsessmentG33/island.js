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

    // Return the mesh (island)
    return island;
}