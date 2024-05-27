import * as THREE from 'three';
import * as BufferGeometryUtils from './utils/BufferGeometryUtils.js';
// import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
// import * as dat from '/node_modules/dat.gui/build/dat.gui.module.js';

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 0, 15);
// camera.lookAt(0,0,1);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;

// const gui = new dat.GUI();

// const settings = {
//     numTufts: 3
//   };

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
    const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    return cloud;
}

// function updateCloud(scene){
//     if (cloud) {
//         scene.remove(cloud);
//         cloud.geometry.dispose();
//         cloud.material.dispose();
//     }

//     cloud = createCloud(settings);

//     scene.add(cloud);
// }

// updateCloud();

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
// directionalLight.position.set(1, 1, 0).normalize();
// scene.add(directionalLight);

// const lightFolder = gui.addFolder('Light');
// lightFolder.add(directionalLight, 'intensity', 0, 2, 0.1);
// lightFolder.open();

// const cloudFolder = gui.addFolder('Cloud');
// cloudFolder.add(settings, 'numTufts', 3, 10).step(1).onChange(updateCloud);
// cloudFolder.open();

// function animate() {
//     requestAnimationFrame(animate);

//     controls.update();

//     cloud.rotation.y += 0.005;

//     renderer.render(scene, camera);
// }

// animate();

export { createCloud };