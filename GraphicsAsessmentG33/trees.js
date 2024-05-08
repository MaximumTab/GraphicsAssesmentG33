import * as THREE from 'three';


/* GUI
const gui = new dat.GUI();
const settings = {
    treeType: 'Fir Tree'
};*/ 

export function createFirTree() {
    const tree = new THREE.Group();

    //Material
    const material = new THREE.MeshLambertMaterial({ color: 0x006400 });
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    //Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 12);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.5;
    tree.add(trunk);

    //Tiered Leaves
    const tierHeights = [0.6, 0.5, 0.4, 0.3, 0.2];
    const tierRadii = [1, 0.8, 0.6, 0.4, 0.3];
    let yPos = trunk.position.y + 0.5;

    tierHeights.forEach((height, i) => {
        const radius = tierRadii[i] * (0.9 + Math.random() * 0.2);
        const geometry = new THREE.ConeGeometry(radius, height, 12);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = yPos + height / 2;
        yPos += height * 0.75;
        tree.add(mesh);
    });

    return tree;
}

export function createOakTree() {
    const tree = new THREE.Group();

    //Material
    const material = new THREE.MeshLambertMaterial({ color: 0x006400 });
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    //Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.25, 2, 12);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    tree.add(trunk);

    //Leaves
    const foliageGeometry = new THREE.SphereGeometry(2, 5, 5);
    const foliage = new THREE.Mesh(foliageGeometry, material);
    foliage.position.y = 3.5;
    tree.add(foliage);

    return tree;
}

/*let currentTree = createFirTree();
scene.add(currentTree);

gui.add(settings, 'treeType', ['Fir Tree', 'Oak Tree']).onChange(value => {
    scene.remove(currentTree);
    if (value === 'Oak Tree') {
        currentTree = createOakTree();
    } else {
        currentTree = createFirTree();
    }
    scene.add(currentTree);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();*/