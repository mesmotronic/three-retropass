import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { RetroPass } from '@mesmotronic/three-retropass';
import { CrtPass } from '@mesmotronic/three-crtpass';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { retroPlatforms } from './retroPlatforms.js';

let mixer;

const clock = new THREE.Clock();
const container = document.getElementById('container');

const stats = new Stats();
container.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(2.0, window.devicePixelRatio));
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 2, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://threejs.org/examples/jsm/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', function (gltf) {

  const model = gltf.scene;
  model.position.set(1, 1, 0);
  model.scale.set(0.01, 0.01, 0.01);
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();

  renderer.setAnimationLoop(animate);

}, undefined, function (e) {

  console.error(e);

});

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const retroPass = new RetroPass({ autoDitheringOffset: true, ...retroPlatforms[0] });
retroPass.quantizeEnabled = false;
retroPass.enabled = true;
composer.addPass(retroPass);

const crtPass = new CrtPass();
crtPass.enabled = false;
crtPass.scanLineIntensity = 0.25;
crtPass.grainAmount = 0.4;
composer.addPass(crtPass);

const gui = new GUI();
const platformNames = retroPlatforms.map(p => p.name);
const params = { platform: platformNames[0], fixedRatio: true };

let selectedPlatform = retroPlatforms[0];

gui.add(retroPass, 'enabled').name('Use RetroPass?');
gui.add(crtPass, 'enabled').name('Use CrtPass?');
gui.add(params, 'fixedRatio').name('Use 4:3 Ratio?').onFinishChange(updateControllers);

const examplesFolder = gui.addFolder('Example Retro Platforms');
examplesFolder.add(params, 'platform', platformNames).name('Platform / Palette').onChange(name => {
  selectedPlatform = retroPlatforms.find(p => p.name === name);
  applySelectedPlatform();
});
examplesFolder.open();

const retroFolder = gui.addFolder('RetroPass');
retroFolder.add(retroPass, 'dithering').name('Use Dithering?');
retroFolder.add(retroPass, 'autoResolution').name('Dynamic Res?').onChange(() => {
  if (retroPass.autoResolution) {
    updateControllers();
  } else {
    applySelectedPlatform();
  }
});
retroFolder.add(retroPass.resolution, 'x', 32, 1920, 1.0).name('Resolution X').onChange(value => {
  retroPass.resolution.set(value, retroPass.resolution.y);
  retroPass.autoResolution = false;
  updateControllers();
});
retroFolder.add(retroPass.resolution, 'y', 32, 1080, 1.0).name('Resolution Y').onChange(value => {
  retroPass.resolution.set(retroPass.resolution.x, value);
  retroPass.autoResolution = false;
  updateControllers();
});
retroFolder.add(retroPass, 'pixelRatio', 0.05, 1.0, 0.05).name('Pixel Ratio').onChange(() => {
  retroPass.autoResolution = true;
  updateControllers();
});
retroFolder.open();

const crtFolder = gui.addFolder('CrtPass');
crtFolder.add(crtPass, 'scanLineDensity', 0, window.innerHeight, 1).name('Scan Line Density');
crtFolder.add(crtPass, 'scanLineIntensity', 0, 1).name('Scan Line Intensity');
crtFolder.add(crtPass, 'grainAmount', 0, 1).name('Grain Amount');
crtFolder.open();

function applySelectedPlatform() {
  const { name, ...rest } = selectedPlatform;
  Object.assign(retroPass, rest, {
    autoResolution: false,
    autoDitheringOffset: true,
  });

  updateControllers();
}

function updateControllers() {
  retroFolder.controllers.forEach(control => control.updateDisplay());
  resizeHandler();
};


function animate() {

  mixer.update(clock.getDelta());
  crtPass.update(clock.getElapsedTime());

  controls.update();
  stats.update();
  composer.render();

}

function resizeHandler() {

  const { innerWidth, innerHeight } = window;
  let width, height;

  if (!params.fixedRatio) {
    width = innerWidth;
    height = innerHeight;
  } else if (innerWidth > innerHeight) {
    height = innerHeight;
    width = height / 3 * 4;
  } else {
    width = innerWidth;
    height = width / 4 * 3;
  }

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);

};

window.addEventListener('resize', resizeHandler);
resizeHandler();

window.gui = gui; // Expose GUI globally for debugging
window.retroPass = retroPass; // Expose RetroPass globally for debugging