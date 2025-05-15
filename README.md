# RetroPass for Three.js

RetroPass is a WebGL post-processing effect for Three.js that simulates the look of retro graphics, applying pixelation and colour quantisation for a nostalgic, low-resolution aesthetic — ideal for games or apps evoking classic video game vibes.

## Installation

```bash
npm install @mesmotronic/three-retropass
```

Requires `three` as a peer dependency.

## Usage

Here’s an example of how to use RetroPass in your Three.js project, showing a basic scene with a retro effect at 320x200 resolution with 16 colours and dithering enabled.

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RetroPass } from '@mesmotronic/three-retropass';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Composer setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add RetroPass
const retroPass = new RetroPass({ resolution: new THREE.Vector2(320, 200), colorCount: 16, dithering: true });
composer.addPass(retroPass);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
animate();
```

## API Reference

| Name | Description | Constructor | Property |
| --- | --- | --- | --- |
| `resolution` | `THREE.Vector2` object specifying the resolution of the retro effect (default: 320x200). | ✓ | ✓ |
| `colorCount` | Number indicating the number of colours in the palette (default: 16). | ✓ | ✓ |
| `colorPalette` | Array of `THREE.Color` objects defining the colour palette (default: predefined palette). | ✓ | ✓ |
| `dithering` | Boolean to enable or disable dithering (default: true). | ✓ | ✓ |
| `pixelRatio` | Number for the pixel ratio, used to override resolution if set (default: 0). | ✓ | ✓ |
