import * as THREE from 'three';

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

export function createWaterBody() {
    const water = createWater();
    const rocks = createRocks();
    rocks.forEach(rock => water.add(rock));
    water.rotation.x = -Math.PI / 2;
    return water;
}

export { waterUniforms };
