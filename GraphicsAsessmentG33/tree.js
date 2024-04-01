import * as THREE from 'three';

export function createTree() {
    const treeGroup = new THREE.Group();

    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(0, 1.5, 0); 
    treeGroup.add(trunk);

    const createLeaf = function(positionY) {
        const leafGeometry = new THREE.ConeGeometry(1.5, 3, 32);
        const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.y = positionY;
        treeGroup.add(leaf);
    }


    const leavesPositions = [3, 4.5, 6]; 
    leavesPositions.forEach(pos => createLeaf(pos));

    return treeGroup;
}