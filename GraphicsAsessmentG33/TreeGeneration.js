import * as THREE from 'three';
import { numberofTrees } from './JsCode.js';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';
import { createBirchTree, createFirTree, createOakTree } from './trees.js';
const noise = createNoise2D();

export function generateTrees(island) {
    const trees = new THREE.Group();

    for (let i = 0; i < numberofTrees; i++) {
        const x = (Math.random() - 0.5) * island.geometry.parameters.width;
        const y = (Math.random() - 0.5) * island.geometry.parameters.height;
        const z = 25;

        const distanceFromCenter = Math.sqrt(x * x + y * y);
        if (distanceFromCenter < island.geometry.parameters.width / 2 && 5 < distanceFromCenter) {
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
            tree.castShadow = true;
            tree.receiveShadow = true;
            trees.add(tree);
           
        }
    }

    island.add(trees);
}