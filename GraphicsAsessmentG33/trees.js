import * as THREE from 'three';


// // GUI
// const gui = new dat.GUI();
// const settings = {
//     treeType: 'Fir Tree',
//     season: 'Summer'
// };

export function updateSeason(season) {
    scene.traverse(function (object) {
        if (object.isMesh && object.material && object.material.name === "foliageMaterial") {
            let color;
            switch (season) {
                case 'Winter':
                    color = new THREE.Color(0xFFFFFF); // White for snow
                    break;
                case 'Spring':
                    color = new THREE.Color(`hsl(${Math.random() * 60 + 60}, 100%, 50%)`); // Hue between 60 (yellow-green) and 120 (green), full saturation, lightness at 50%
                    break;
                case 'Summer':
                    color = new THREE.Color(`hsl(120, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 30}%)`); // Fully green with slight variation in saturation and lightness
                    break;
                case 'Autumn':
                    color = new THREE.Color(`hsl(${Math.random() * 60 + 20}, 100%, 50%)`); // Hue between 20 (orange-red) and 80 (yellow), full saturation, lightness at 50%
                    break;
            }
            object.material.color = color;
            object.material.needsUpdate = true;
        }
    });
}


export function createFirTree() {
    const tree = new THREE.Group();

    // Material
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x87714A });
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x4A664A, flatShading: true });
    foliageMaterial.name = "foliageMaterial";

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2 + Math.random() * 0.5, 12); // Procedural height
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    tree.add(trunk);

    // General foliage
    const tierHeights = [0.6, 0.5, 0.4, 0.3, 0.2].map(h => h + Math.random() * 0.2); // Procedural height
    const tierRadii = [1, 0.8, 0.6, 0.4, 0.3].map(r => r * (0.8 + Math.random() * 0.4)); // Procedural radius
    let yPos = trunk.position.y + 0.5;

    // Specific foliage
    tierHeights.forEach((height, i) => {
        const radius = tierRadii[i];
        const geometry = new THREE.ConeGeometry(radius, height*2, 6, 1, false, Math.random());
        const mesh = new THREE.Mesh(geometry, foliageMaterial);
        mesh.position.y = yPos + height;
        yPos += height * 0.75;
        tree.add(mesh);
    });

    return tree;
}

export function createOakTree() {
    const tree = new THREE.Group();

    // Material
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x7C5B42 });
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x10471C, flatShading: true });
    foliageMaterial.name = "foliageMaterial";

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.25 + Math.random() * 0.05, 2 + Math.random() * 0.5, 12); // Procedural base size and height
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    tree.add(trunk);

    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(2 * (0.8 + Math.random() * 0.4), 4, 4); // Procedural foliage size
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3.5 + Math.random() * 0.5; // Procedural position of foliage
    tree.add(foliage);

    return tree;
}

export function createBirchTree() {
    const tree = new THREE.Group();

    // Bark texture
    const loader = new THREE.TextureLoader();
    const barkTexture = loader.load('./textures/istockphoto-842448670-612x612.jpg');

    // Material
    const trunkMaterial = new THREE.MeshLambertMaterial({ map: barkTexture });
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0xFFAC1C, flatShading: true });
    foliageMaterial.name = "foliageMaterial";

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3 + Math.random() * 0.5, 12);  // Procedural height
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    tree.add(trunk);

    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(0.5 * (0.8 + Math.random() * 0.4), 4, 4);
    let yPos = 2.5;
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) { // Between 1 and 3 foliage spheres
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = yPos;
        yPos += 0.6;
        tree.add(foliage);
    }

    return tree;
}

// let currentTree = createFirTree();
// scene.add(currentTree);

// gui.add(settings, 'treeType', ['Fir Tree', 'Oak Tree', 'Birch Tree']).onChange(value => {
//     scene.remove(currentTree);
//     if (value === 'Oak Tree') {
//         currentTree = createOakTree();
//     } else if (value === 'Birch Tree') {
//         currentTree = createBirchTree();
//     } else {
//         currentTree = createFirTree();
//     }
//     scene.add(currentTree);
// });
// gui.add(settings, 'season', ['Winter', 'Spring', 'Summer', 'Autumn']).onChange(updateSeason);

// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }

// animate();