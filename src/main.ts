import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { createColorPalette, RetroPass, RetroPassParameters } from '../lib/postprocessing/RetroPass';
import './main.css';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Define a curated palette of bright and medium-shade colors
const sphereColors = [
  new THREE.Color(1.0, 0.0, 0.0), // Red
  new THREE.Color(1.0, 0.5, 0.0), // Orange
  new THREE.Color(1.0, 1.0, 0.0), // Yellow
  new THREE.Color(0.0, 1.0, 0.0), // Green
  new THREE.Color(0.0, 0.0, 1.0), // Blue
  new THREE.Color(0.3, 0.0, 0.5), // Indigo
  new THREE.Color(0.5, 0.0, 1.0), // Violet
  new THREE.Color(1.0, 0.0, 1.0), // Magenta
  new THREE.Color(0.0, 1.0, 1.0), // Cyan
  new THREE.Color(1.0, 1.0, 1.0), // White
  new THREE.Color(0.5, 0.5, 0.0), // Olive
  new THREE.Color(0.5, 0.0, 0.5), // Purple
  new THREE.Color(0.0, 0.5, 0.5), // Teal
  new THREE.Color(0.5, 0.5, 0.5), // Gray
  new THREE.Color(0.7, 0.3, 0.3), // Medium Red
];

// Create 10 spheres with highly metallic, shiny materials
const spheres: THREE.Mesh[] = [];
const geometry = new THREE.SphereGeometry(1, 32, 32);
for (let i = 0; i < sphereColors.length; i++) {
  // const material = new THREE.MeshStandardMaterial({
  //   color: sphereColors[i], // Assign color from palette
  //   metalness: 0.9, // Nearly fully metallic for bright, reflective look
  //   roughness: 0.05, // Very low roughness for mirror-like shininess
  // });
  const material = new THREE.MeshBasicMaterial({
    color: sphereColors[i], // Assign color from palette
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8
  );
  scene.add(sphere);
  spheres.push(sphere);
}

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4); // Brighter ambient for base illumination
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3.0); // Strong primary light
directionalLight1.position.set(5, 5, 10); // Adjusted for broader coverage
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Stronger secondary light
directionalLight2.position.set(-5, -5, 10); // Adjusted for broader coverage
scene.add(directionalLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 20); // Dynamic highlights
pointLight.position.set(0, 0, 8);
scene.add(pointLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// EffectComposer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// RetroPass
const retroParams: RetroPassParameters = {
  resolution: new THREE.Vector2(320, 200),
  colorCount: 16,
  colorPalette: createColorPalette(16),
  dithering: false,
  pixelRatio: 0,
};
const retroPass = new RetroPass(retroParams);
composer.addPass(retroPass);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// GUI
const gui = new GUI();
const retroFolder = gui.addFolder('RetroPass Parameters');
retroFolder.add({ enabled: retroPass.enabled }, 'enabled').name('Enabled').onChange((value: boolean) => {
  retroPass.enabled = value;
});
retroFolder.add({ colorCount: retroPass.colorCount }, 'colorCount', [2, 4, 16, 256]).name('Color Count').onChange((value: number) => {
  retroPass.colorCount = value;
});
retroFolder.add({ dithering: retroPass.dithering }, 'dithering').name('Dithering').onChange((value: boolean) => {
  retroPass.dithering = value;
});
retroFolder.add({ resolutionX: retroPass.resolution.x }, 'resolutionX', 100, 1280, 10).name('Resolution X').onChange((value: number) => {
  retroPass.resolution = new THREE.Vector2(value, retroPass.resolution.y);
});
retroFolder.add({ resolutionY: retroPass.resolution.y }, 'resolutionY', 100, 720, 10).name('Resolution Y').onChange((value: number) => {
  retroPass.resolution = new THREE.Vector2(retroPass.resolution.x, value);
});
retroFolder.add({ pixelRatio: retroPass.pixelRatio }, 'pixelRatio', 0, 2, 0.1).name('Pixel Ratio').onChange((value: number) => {
  retroPass.pixelRatio = value;
});
const palettes: { [key: string]: THREE.Color[] | null; } = {
  Default: null,
  Custom4: [
    new THREE.Color(0.0, 0.0, 0.0), // Black
    new THREE.Color(0.0, 1.0, 1.0), // Cyan
    new THREE.Color(1.0, 0.0, 0.0), // Red
    new THREE.Color(0.0, 1.0, 0.0), // Green
  ],
  Custom16: [
    new THREE.Color(0.0, 0.0, 0.0),
    new THREE.Color(0.1, 0.1, 0.1),
    new THREE.Color(0.2, 0.2, 0.2),
    new THREE.Color(0.3, 0.3, 0.3),
    new THREE.Color(0.4, 0.4, 0.4),
    new THREE.Color(0.5, 0.5, 0.5),
    new THREE.Color(0.6, 0.6, 0.6),
    new THREE.Color(0.7, 0.7, 0.7),
    new THREE.Color(0.8, 0.8, 0.8),
    new THREE.Color(0.9, 0.9, 0.9),
    new THREE.Color(1.0, 0.0, 0.0),
    new THREE.Color(0.0, 1.0, 0.0),
    new THREE.Color(0.0, 0.0, 1.0),
    new THREE.Color(1.0, 1.0, 0.0),
    new THREE.Color(1.0, 0.0, 1.0),
    new THREE.Color(0.0, 1.0, 1.0),
  ],
};
retroFolder.add({ colorPalette: 'Default' }, 'colorPalette', Object.keys(palettes)).name('Color Palette').onChange((value: string) => {
  retroPass.colorPalette = palettes[value] ?? createColorPalette(retroPass.colorCount);
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
renderer.setAnimationLoop(() => {
  controls.update();
  composer.render();
  stats.update();
});