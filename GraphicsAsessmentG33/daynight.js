import * as THREE from 'three';

let useSunMoonLighting = false;
let ambientLight;
let sunLight, moonLight;
let starsAdded = false; 

function updateBackgroundColor(scene, timeOfDay) {
    const colors = [
        0x000000,
        0x000000,
        0x96EAFD,
        0x317ef5, 
        0x010238, 
        0x000000, 
        0x000000  
    ];

    const dayLength = 24;
    const segmentLength = dayLength / (colors.length - 1);
    const segmentIndex = Math.floor(timeOfDay / segmentLength);
    const t = (timeOfDay % segmentLength) / segmentLength;
    const color = new THREE.Color().setHex(colors[segmentIndex]).lerp(new THREE.Color().setHex(colors[segmentIndex + 1]), t);
    scene.background = color;

    const sun = scene.getObjectByName('sun');
    const moon = scene.getObjectByName('moon');
    if (sun && moon) {
        const sunAngle = Math.PI * 2 * (timeOfDay / dayLength - 0.25);
        const moonAngle = Math.PI * 2 * ((timeOfDay + dayLength / 2) / dayLength - 0.25);

        sun.position.set(Math.cos(sunAngle) * 100, Math.sin(sunAngle) * 100, 0);
        sun.rotation.z = sunAngle - Math.PI / 2;

        moon.position.set(Math.cos(moonAngle) * 100, Math.sin(moonAngle) * 100, 0);
        moon.rotation.z = moonAngle - Math.PI / 2;

        if (useSunMoonLighting) {
            updateLighting(scene, sun, moon);
        }
    }

    if (timeOfDay < 6 || timeOfDay > 15) {
        if (!starsAdded) {
            addStars(scene);
            starsAdded = true;
        }
    } else {
        removeStars(scene);
    }
}


function updateLighting(scene, sun, moon) {
    if (!ambientLight) {
        ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
    }

    if (!sunLight) {
        sunLight = new THREE.DirectionalLight(0xffd700, 1);
        sunLight.castShadow = true;
        scene.add(sunLight);
    }

    if (!moonLight) {
        moonLight = new THREE.DirectionalLight(0xaaaaff, 0.5);
        scene.add(moonLight);
    }

    const sunIntensity = Math.max(0, sun.position.y / 100);
    const moonIntensity = Math.max(0, moon.position.y / 100);

    sunLight.intensity = sunIntensity * 5; 
    moonLight.intensity = moonIntensity * 3; 

    sunLight.position.copy(sun.position);
    moonLight.position.copy(moon.position);

    ambientLight.intensity = 0; 
}

function createDayNightSlider(scene) {
    const sliderContainer = document.createElement('div');
    sliderContainer.style.position = 'absolute';
    sliderContainer.style.top = '170px';
    sliderContainer.style.right = '10px';
    document.body.appendChild(sliderContainer);

    const sliderText = document.createElement('span');
    sliderText.textContent = 'Time of Day Control   ';
    sliderText.style.color = 'white';
    sliderText.style.fontSize = '13px'; 
    sliderText.style.fontFamily = 'Arial, sans-serif'; 
    sliderContainer.appendChild(sliderText);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 24;
    slider.value = 12;
    slider.step = 0.1;
    slider.style.background = 'black';
    slider.style.color = 'white';
    slider.style.fontSize = '13px';
    slider.style.fontFamily = 'Arial, sans-serif'; 
    slider.setAttribute('aria-label', 'Time of Day Control');
    sliderContainer.appendChild(slider);

    slider.addEventListener('input', function(event) {
        const timeOfDay = parseFloat(event.target.value);
        updateBackgroundColor(scene, timeOfDay);
    });

    updateBackgroundColor(scene, 12);
}

function createLightingToggleButton(scene) {
    const button = document.createElement('button');
    button.innerText = 'Enable Sun/Moon Lighting';
    button.style.position = 'absolute';
    button.style.top = '200px';
    button.style.right = '10px';
    button.style.background = 'black';
    button.style.color = 'white';
    button.style.fontSize = '13px'; 
    button.style.fontFamily = 'Arial, sans-serif'; 
    button.setAttribute('aria-label', 'Toggle Sun/Moon Lighting');
    button.addEventListener('click', function() {
        useSunMoonLighting = !useSunMoonLighting;
        if (useSunMoonLighting) {
            button.innerText = 'Disable Sun/Moon Lighting';
            const slider = document.querySelector('input[type="range"]');
            updateBackgroundColor(scene, parseFloat(slider.value));
            disableOtherLights(scene);
        } else {
            button.innerText = 'Enable Sun/Moon Lighting';
            enableOtherLights(scene);
            scene.remove(sunLight);
            scene.remove(moonLight);
            sunLight = null;
            moonLight = null;
            if (ambientLight) {
                ambientLight.intensity = 0.1;  
            }
        }
    });
    document.body.appendChild(button);
}


function disableOtherLights(scene) {
    scene.traverse(object => {
        if (object.isLight && object !== sunLight && object !== moonLight) {
            object.visible = false;
        }
    });
}

function enableOtherLights(scene) {
    scene.traverse(object => {
        if (object.isLight && object !== sunLight && object !== moonLight) {
            object.visible = true;
        }
    });
}

function addStars(scene) {
    const numStars = 5000;
    const radius = 5000;
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
    stars.name = 'stars';

    scene.add(stars);
}

function removeStars(scene) {
    if (starsAdded) {
        const stars = scene.getObjectByName('stars');
        if (stars) {
            scene.remove(stars);
            starsAdded = false;
        }
    }
}


function createSunAndMoon(scene) {
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'sun';
    sun.position.set(100, 0, 0);
    sun.rotation.z = -Math.PI / 2;
    scene.add(sun);

    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = 'moon';
    moon.position.set(-100, 0, 0);
    moon.rotation.z = -Math.PI / 2;
    scene.add(moon);

    updateBackgroundColor(scene, 12);
}

export { createDayNightSlider, createLightingToggleButton, createSunAndMoon, removeStars, starsAdded };
