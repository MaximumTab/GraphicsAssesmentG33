import * as THREE from 'three';
import { OrbitControls } from './build/controls/OrbitControls.js';

function updateBackgroundColor(scene, timeOfDay) {
    const colors = [
        0x000000, // Midnight (night)
        0x96EAFD, // Morning
        0x0064FF, // Day
        0x826F58, // Evening
        0x000000  // Midnight again (night)
    ];

    const dayLength = 24;
    const segmentLength = dayLength / (colors.length - 1);
    const segmentIndex = Math.floor(timeOfDay / segmentLength);
    const t = (timeOfDay % segmentLength) / segmentLength;
    const color = new THREE.Color().setHex(colors[segmentIndex]).lerp(new THREE.Color().setHex(colors[segmentIndex + 1]), t);
    scene.background = color;

    // Add or remove stars based on the time of day
    if (segmentIndex === 0 || segmentIndex === colors.length - 1) {
        addStars(scene);
    } else {
        removeStars(scene);
    }

    // Update positions of sun and moon
    const sun = scene.getObjectByName('sun');
    const moon = scene.getObjectByName('moon');
    if (sun && moon) {
        // Adjust initial positions and rotation
        const sunAngle = Math.PI * 2 * (timeOfDay / dayLength - 0.25);
        const moonAngle = Math.PI * 2 * ((timeOfDay + dayLength / 2) / dayLength - 0.25);

        sun.position.set(Math.cos(sunAngle) * 100, Math.sin(sunAngle) * 100, 0);
        sun.rotation.z = sunAngle - Math.PI / 2; // Correct rotation

        moon.position.set(Math.cos(moonAngle) * 100, Math.sin(moonAngle) * 100, 0);
        moon.rotation.z = moonAngle - Math.PI / 2; // Correct rotation
    }
}
// Day Night Slider
function createDayNightSlider(scene) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 24; // 24 segments/hours
    slider.value = 12; // start at 12
    slider.step = 0.1;
    slider.style.position = 'absolute'; 
    slider.style.top = '10px'; 
    slider.style.left = '10px'; 
    slider.addEventListener('input', function(event) {
        const timeOfDay = parseFloat(event.target.value);
        updateBackgroundColor(scene, timeOfDay);
    });
    document.body.appendChild(slider);
}

// add stars
function addStars(scene) {
    const numStars = 500; 
    const radius = 100; 
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1
    });
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numStars * 3); 
    const vertices = new Float32Array(numStars); 

    for (let i = 0; i < numStars; i++) {
        const theta = Math.random() * Math.PI * 2; 
        const phi = Math.random() * Math.PI; 
        const x = Math.cos(theta) * Math.sin(phi) * radius;
        const y = Math.cos(phi) * radius;
        const z = Math.sin(theta) * Math.sin(phi) * radius;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        vertices[i] = 0.1; 
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(vertices, 1));

    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = 'stars'; // Assign a name to the stars object

    scene.add(stars);
}

// remove stars
function removeStars(scene) {
    const stars = scene.getObjectByName('stars');
    if (stars) {
        scene.remove(stars);
    }
}

// Function to create sun and moon
function createSunAndMoon(scene) {
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'sun';
    scene.add(sun);

    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = 'moon';
    scene.add(moon);
}

export { createDayNightSlider, createSunAndMoon };


