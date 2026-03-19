# RetroPass for Three.js

Inspired by [STDOOM](https://github.com/indyjo/STDOOM), RetroPass is a WebGL post-processing effect for Three.js that enables you to give your project a retro look and feel, with pixelation and colour quantisation for a nostalgic, low-res aesthetic — ideal for games or apps evoking classic video game vibes.

Specify any number of colours up to 4096 to create a performance optimised (quantised cube) palette, or create a custom palette of any size from 2 to 4096 colours.

[See it in action.](https://mesmotronic.github.io/three-retropass/)

## Installation

```bash
npm install @mesmotronic/three-retropass
```

Requires `three` as a peer dependency.

## Usage

### WebGL

Here’s an example of how to use RetroPass in your Three.js project, showing a basic scene with a retro effect at 320x200 resolution with 16 colours and dithering enabled.

```javascript
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { RetroPass } from "@mesmotronic/three-retropass";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
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

### WebGPU

Here's the equivalent example using RetroPass as a TSL node with WebGPURenderer and RenderPipeline.

```javascript
import * as THREE from "three";
import { WebGPURenderer, RenderPipeline } from "three/webgpu";
import { pass } from "three/tsl";
import { retroPass } from "@mesmotronic/three-retropass/webgpu";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGPURenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Post processing setup
const scenePass = pass(scene, camera);
const retroNode = retroPass(scenePass.getTextureNode(), {
  resolution: new THREE.Vector2(320, 200),
  colorCount: 16,
  dithering: true,
});

const renderPipeline = new RenderPipeline(renderer);
renderPipeline.outputNode = retroNode;

// Render loop
async function animate() {
  requestAnimationFrame(animate);
  await renderPipeline.renderAsync();
}
animate();
```

Properties can be updated at any time:

```javascript
retroNode.colorCount = 4;
retroNode.dithering = false;
retroNode.inverted = true;
```

## API Reference

| Name                  | Description                                                         | Constructor | Property |
| --------------------- | ------------------------------------------------------------------- | ----------- | -------- |
| `resolution`          | `THREE.Vector2` specifying the resolution of the retro effect.      | ✓           | ✓        |
| `autoResolution`      | `Boolean` to enable or disable automatic resolution handling.       | ✓           | ✓        |
| `pixelRatio`          | `Number` for the pixel ratio, overrides resolution if set.          | ✓           | ✓        |
| `colorCount`          | `Number` indicating the number of colours in the palette.           | ✓           | ✓        |
| `colorPalette`        | Array of `THREE.Color` objects defining the colour palette.         | ✓           | ✓        |
| `dithering`           | `Boolean` to enable or disable dithering.                           | ✓           | ✓        |
| `ditheringOffset`     | `Number` controlling the dithering offset.                          | ✓           | ✓        |
| `autoDitheringOffset` | `Boolean` to enable or disable automatic dithering offset handling. | ✓           | ✓        |

## Screenshots

Example screenshots using default palettes with [Littlest Tokyo](https://artstation.com/artwork/1AGwX) by
[Glen Fox](https://artstation.com/glenatron), CC Attribution.

![Screenshot 2025-05-16 at 22 51 38](https://github.com/user-attachments/assets/a5eb9b18-8802-4a25-96fc-449dbedf170e)
Original

![Screenshot 2025-05-16 at 23 16 33](https://github.com/user-attachments/assets/e2897897-ee3c-4a8f-802c-7d185e0ab70d)
320x200 2 colours (monochrome)

![Screenshot 2025-05-16 at 22 51 52](https://github.com/user-attachments/assets/a3f68162-2e72-4b10-a2c1-b35e24f62489)
320x200 4 colours (CGA mode 1)

![Screenshot 2025-05-16 at 22 52 02](https://github.com/user-attachments/assets/bab38ec2-fe22-453b-ac3e-81f818b7bb73)
320x200 16 colours (MS VGA)

![Screenshot 2025-05-16 at 22 52 14](https://github.com/user-attachments/assets/980d0cee-39a0-43e5-b816-937412b8e4d9)
320x200 256 colours (web safe)
320x200 256 colours (web safe)

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025, Mesmotronic Limited
