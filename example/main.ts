import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { pass } from 'three/tsl';
import { RenderPipeline, WebGPURenderer } from 'three/webgpu';
import { createColorPalette, retroPass, RetroPassNode, RetroPassParameters } from '../lib/webgpu';
import './main.css';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

// Renderer setup
const renderer = new WebGPURenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const spheres: THREE.Mesh[] = [];
const geometry = new THREE.SphereGeometry(0.5, 16, 16);

const colorPalette = createColorPalette(256);

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 16; j++) {
    const colorIndex = i * 16 + j;
    const material = new THREE.MeshPhongMaterial({
      color: colorPalette[colorIndex],
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      (i - 7.5) * 1.25,
      (j - 7.5) * 1.25,
      0
    );
    spheres.push(sphere);
  }
}

scene.add(...spheres);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight1.position.set(5, 5, 10);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-5, -5, 10);
scene.add(directionalLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 20);
pointLight.position.set(0, 0, 8);
scene.add(pointLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Post processing
const retroParams: RetroPassParameters = {
  resolution: new THREE.Vector2(320, 200),
  colorCount: 16,
  dithering: true,
  pixelRatio: 0.1,
};

const scenePass = pass(scene, camera);
const retroNode = retroPass(scenePass.getTextureNode(), retroParams) as RetroPassNode;

const postProcessing = new RenderPipeline(renderer);
postProcessing.outputNode = retroNode;

retroNode.setSize(window.innerWidth, window.innerHeight);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// GUI
const gui = new GUI();
gui.add({ shading: true }, 'shading').name('Use shading?').onChange((value: boolean) => {
  spheres.forEach((sphere) => {
    const material = sphere.material as THREE.MeshPhongMaterial;
    const { color } = material;

    sphere.material = value
      ? new THREE.MeshPhongMaterial({ color })
      : new THREE.MeshBasicMaterial({ color });
  });
});
const retroFolder = gui.addFolder('RetroPass Parameters');
retroFolder.add(retroNode, 'colorCount', [2, 4, 8, 16, 32, 64, 128, 256, 512, 4096]).name('Color Count');
retroFolder.add(retroNode, 'dithering').name('Dithering');
retroFolder.add({ resolutionX: retroNode.resolution.x }, 'resolutionX', 64, 1280, 10).name('Resolution X').onChange((value: number) => {
  retroNode.resolution = new THREE.Vector2(value, retroNode.resolution.y);
});
retroFolder.add({ resolutionY: retroNode.resolution.y }, 'resolutionY', 64, 720, 10).name('Resolution Y').onChange((value: number) => {
  retroNode.resolution = new THREE.Vector2(retroNode.resolution.x, value);
});
retroFolder.add(retroNode, 'autoResolution').name('Auto Resolution?');
retroFolder.add(retroNode, 'pixelRatio', 0.1, window.devicePixelRatio, 0.05).name('Pixel Ratio');

const palettes: { [key: string]: THREE.Color[] | null; } = {
  Default: null,
  'ST Med-res (4 colours)': [
    new THREE.Color(0.0, 0.0, 0.0), // Black
    new THREE.Color(1.0, 1.0, 1.0), // White
    new THREE.Color(1.0, 0.0, 0.0), // Red
    new THREE.Color(0.0, 1.0, 0.0), // Green
  ],
  'PICO-8 (16 colours)': [
    new THREE.Color(0x000000), // Black
    new THREE.Color(0x1D2B53), // Dark Blue
    new THREE.Color(0x7E2553), // Dark Purple
    new THREE.Color(0x008751), // Dark Green
    new THREE.Color(0xAB5236), // Brown
    new THREE.Color(0x5F574F), // Dark Grey
    new THREE.Color(0xC2C3C7), // Light Grey
    new THREE.Color(0xFFF1E8), // White
    new THREE.Color(0xFF004D), // Red
    new THREE.Color(0xFFA300), // Orange
    new THREE.Color(0xFFEC27), // Yellow
    new THREE.Color(0x00E436), // Green
    new THREE.Color(0x29ADFF), // Blue
    new THREE.Color(0x83769C), // Lavender
    new THREE.Color(0xFF77A8), // Pink
    new THREE.Color(0xFFCCAA), // Peach
  ],
};
retroFolder.add({ colorPalette: 'Default' }, 'colorPalette', Object.keys(palettes)).name('Color Palette').onChange((value: string) => {
  retroNode.colorPalette = palettes[value] ?? createColorPalette(retroNode.colorCount);
});
retroFolder.add(retroNode, 'ditheringOffset', 0, 1, 0.05).name('Dithering Offset');
retroFolder.add(retroNode, 'autoDitheringOffset').name('Auto Offset?');
retroFolder.add(retroNode, 'inverted').name('Inverted');

// Handle window resize
const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', resize);
resize();

// Animation loop
renderer.setAnimationLoop(async () => {
  controls.update();
  postProcessing.render();
  stats.update();
});
