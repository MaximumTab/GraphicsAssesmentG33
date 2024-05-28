import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';

const waterVertexShader = `
uniform float time;
uniform float waveFrequency;
uniform float waveAmplitude;

void main() {
    vec3 pos = position;
    float wave = sin(pos.x * waveFrequency + time) * waveAmplitude;
    pos.z += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const waterFragmentShader = `
uniform vec3 color;
uniform float opacity;

void main() {
    gl_FragColor = vec4(color, opacity);
}
`;

const waterUniforms = {
    time: { value: 0 },
    waveFrequency: { value: 1.0 },
    waveAmplitude: { value: 0.5 },
    color: { value: new THREE.Color(0x0096c7) },
    opacity: { value: 0.6 }
};

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: waterUniforms,
    transparent: true
});

function createRocks() {
    const lakeRadius = 5;
    const numberOfRocks = 30;
    const rocks = [];
    for (let i = 0; i < numberOfRocks; i++) {
        const angle = (i / numberOfRocks) * 2 * Math.PI;
        const rockRadius = Math.random() * 0.5 + 0.2;
        const x = lakeRadius * Math.cos(angle); 
        const z = lakeRadius * Math.sin(angle);
        const rockGeometry = new THREE.SphereGeometry(rockRadius, 20, 20);
        const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(z, x, 0);
        rocks.push(rock);
    }
    return rocks;
}

function createWater() {
    const waterRadius = 5;
    const segments = 32;
    const waterGeometry = new THREE.CircleGeometry(waterRadius, segments);

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.set(0, 0.2, 0);
    return water;
}
const noise = createNoise2D();
const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
const radius = 5; // Desired radius of the circular area
const radiusSquared = radius * radius; // Square the radius for faster comparison// Maximum constant depth adjustment at the center
const scale = 0.7;
const amplitude = 3;
function updateTerrain() {
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i]; // Adjust x to center
        const y = vertices[i + 1]; // Adjust y to center
        const distanceSquared = x * x + y * y; // Calculate distance squared from center

        if (distanceSquared <= radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const depthFactor = 1 - (distance / radius); // Linear depth decrease from center to edge
            const z = noise(x * scale, y * scale); // Get noise value
            if (z - (depthFactor * amplitude) < 0) {
                vertices[i + 2] = z - (depthFactor * amplitude); // Subtract depth based on distance from center
            }
            else {
                vertices[i + 2] = - (depthFactor); // Flatten the bottom
            }
        } else {
            vertices[i + 2] = -0.1; // Flatten outside the circle
        }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}
export function createWaterBody() {
    const water = createWater();
    const rocks = createRocks();
    rocks.forEach(rock => water.add(rock));
    const material = new THREE.MeshPhongMaterial({ color: 0x964B00, wireframe: false });
    const lake = new THREE.Mesh(updateTerrain(), material);
    water.add(lake);
    water.rotation.x = -Math.PI / 2;
    return water;
}



export { waterUniforms };
