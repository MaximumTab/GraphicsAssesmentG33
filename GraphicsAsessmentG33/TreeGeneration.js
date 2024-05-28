import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';
import { createBirchTree, createFirTree, createOakTree } from './trees.js';

const noise = createNoise2D();

export function generateTrees(island) {
    const trees = new THREE.Group();

    for (let i = 0; i < 100; i++) {
        const x = (Math.random() - 0.5) * island.geometry.parameters.width;
        const y = (Math.random() - 0.5) * island.geometry.parameters.height;

        const noiseValue = noise(x * 0.1, y * 0.1);
        const z = 25;

        const distanceFromCenter = Math.sqrt(x * x + y * y);
        if (distanceFromCenter < island.geometry.parameters.width / 2) {
            let tree;

            const treeType = Math.random();
            if (treeType < 0.33) {
                tree = createFirTree();
            } else if (treeType < 0.66) {
                tree = createOakTree();
            } else {
                tree = createBirchTree();
            }

            tree.rotation.x = Math.PI / 2;
            tree.position.set(x, y, z);
            trees.add(tree);
        }
    }

    island.add(trees);
}