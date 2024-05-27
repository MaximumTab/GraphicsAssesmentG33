import * as THREE from 'three';
import * as BufferGeometryUtils from './utils/BufferGeometryUtils.js';

let cloud;

function createCloud(numTufts) {
    const tufts = [];
    const sizeVariance = 1;

    for (let i = 0; i < numTufts; i++) {
        const radius = 1 + Math.random() * sizeVariance;
        const segments = Math.round(4 + Math.random() * 3);

        const tuft = new THREE.SphereGeometry(radius, segments, segments);
        tuft.translate(
            (Math.random() - 0.5) * numTufts,
            (Math.random() - 0.5) * (radius+1),
            (Math.random() - 0.5) * (radius+1)
        );

        tufts.push(tuft);
    }

    const cloudGeometry = BufferGeometryUtils.mergeGeometries(tufts);
    const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    return cloud;
}

export { createCloud };