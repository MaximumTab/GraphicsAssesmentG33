
import * as THREE from 'three';
import { createNoise2D } from './build/simplex-noise/dist/esm/simplex-noise.js';

const noise = createNoise2D();
// Define geometry parameters
const mgeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
const mradius = 5;
const mradiusSquared = mradius * mradius;
const mscale = 0.5;
const mamplitude = 3;

// CreateMountain function
function CreateMountain() {
    const vertices = mgeometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i]; // X coordinate
        const y = vertices[i + 1]; // Y coordinate
        const distanceSquared = x * x + y * y; // Distance squared from the center

        if (distanceSquared <= mradiusSquared) {
            const distance = Math.sqrt(distanceSquared); // Distance from the center
            const depthFactor = -(1 - (distance / mradius)) * 2; // Depth factor decreases linearly from center to edge
            const z = noise(x * mscale, y * mscale); // Get noise value for (x, y)

            // Calculate new z-value
            vertices[i + 2] = z - (depthFactor * mamplitude);
        } else {
            // Remove vertices outside the range
            vertices[i] = 0;
            vertices[i + 1] = 0;
            vertices[i + 2] = 0;
        }
    }

    mgeometry.attributes.position.needsUpdate = true;
    mgeometry.computeVertexNormals();
    mgeometry.rotateX(-Math.PI / 2);
    return mgeometry;
}

// Vertex shader
const vertexShader = `
    varying float vHeight;

    void main() {
        vHeight = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment shader
const fragmentShader = `
    varying float vHeight;

    void main() {
        vec3 lowColor = vec3(0, 0, 0);  // Dark green
        vec3 highColor = vec3(1.0, 1.0, 1.0); // White

        // Adjust the mixFactor to extend the green range
        float mixFactor = smoothstep(-3.0, 15.0, vHeight); // Adjusted range for a larger green side
        vec3 color = mix(lowColor, highColor, mixFactor);

        gl_FragColor = vec4(color, 1.0);
    }
`;


// Function to create the mountain mesh
export function createMountainMesh() {
    const mountainGeometry = CreateMountain();

    // Custom Shader Material
    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // Create a mesh from the geometry and custom shader material
    const mountainMesh = new THREE.Mesh(mountainGeometry, shaderMaterial);

    return mountainMesh;
}

export { mamplitude, mscale };
