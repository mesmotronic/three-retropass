# RetroPass

A Three.js post-processing pass for applying a retro-style effect with color quantization and dithering.

## Features
- Supports 2, 4, 16, or 256 color palettes
- Optional Bayer dithering
- Customizable resolution and pixel ratio
- Dynamic palette updates

## Installation
Install the package via npm:
```bash
npm install @mesmotronic/three-retropass
```

## Usage
Create a `RetroPass` instance and add it to your post-processing pipeline.

### Example
```typescript
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RetroPass } from '@mesmotronic/three-retropass';

// Setup scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add RetroPass
const retroPass = new RetroPass({
  resolution: new THREE.Vector2(320, 200),
  colorCount: 16,
  dithering: true,
});
composer.addPass(retroPass);

// Animation loop
function animate() {
  composer.render();
  requestAnimationFrame(animate);
}
animate();
```

## API
- `RetroPass(parameters: RetroPassParameters)`: Creates a new retro effect pass
- `setSize(width: number, height: number)`: Updates resolution
- `setPalette(colors: THREE.Color[])`: Updates color palette
- `getColorPalette(colorCount: ColorCount)`: Returns default palette for given color count

## Parameters
- `resolution`: `THREE.Vector2` - Output resolution (default: 320x200)
- `colorCount`: `2 | 4 | 16 | 256` - Number of colors (default: 16)
- `colorPalette`: `THREE.Color[]` - Custom palette (default: based on colorCount)
- `dithering`: `boolean` - Enable/disable dithering (default: true)
- `pixelRatio`: `number` - Scaling factor for resolution (default: 0)

## License
BSD-3-Clause