import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { RetroPass } from '@mesmotronic/three-retropass';
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
renderer.setPixelRatio(window.devicePixelRatio);
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
retroPass.enabled = true;
composer.addPass(retroPass);

const gui = new GUI();
const platformNames = retroPlatforms.map(p => p.name);
const params = { platform: platformNames[0] };

gui.add(retroPass, 'enabled').name('Use RetroPass?');

const retroPassFolder = gui.addFolder('RetroPass');
retroPassFolder.add(retroPass, 'dithering').name('Use Dithering?');
retroPassFolder.add(params, 'platform', platformNames).name('Retro Platform').onChange(name => {
  const selected = retroPlatforms.find(p => p.name === name);
  if (selected) {
    const { name, ...rest } = selected;
    Object.assign(retroPass, rest);
  }
});
retroPassFolder.open();

const resizeHandler = () => {

  const { innerWidth, innerHeight } = window;
  let width, height;

  if (innerWidth > innerHeight) {
    height = innerHeight;
    width = height / 3 * 4;
  } else {
    width = innerWidth;
    height = width / 4 * 3;
  }

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

};

window.addEventListener('resize', resizeHandler);
resizeHandler();

function animate() {

  const delta = clock.getDelta();

  mixer.update(delta);

  controls.update();

  stats.update();

  composer.render();

}