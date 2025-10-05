import * as THREE from 'three';
import { ColorCount } from '../models/ColorCount';

/**
 * Creates a 3D cube quantized colour palette the same or smaller than the
 * specified size, by default padded with greyscale up to the size.
 */
export function createQuantizedColorPalette(size = 0, padded = true): THREE.Color[] {
  const levels = Math.min(16, Math.floor(Math.pow(size + 1, 1 / 3)));
  const palette: THREE.Color[] = [];
  let divisor = levels - 1;

  for (let r = 0; r < levels; r++) {
    for (let g = 0; g < levels; g++) {
      for (let b = 0; b < levels; b++) {
        palette.push(new THREE.Color(r / divisor, g / divisor, b / divisor));
      }
    }
  }

  if (padded) {
    const cubeSize = palette.length;
    divisor = size - cubeSize - 1;

    while (palette.length < size) {
      const v = (palette.length - cubeSize) / divisor;
      palette.push(new THREE.Color(v, v, v));
    }
  }

  return palette;
}

/**
 * Creates a color palette based on the specified color count
 */
export function createColorPalette(colorCount: ColorCount): THREE.Color[] {
  let colorPalette: THREE.Color[] = [];

  switch (true) {
    // Find optimised palette closest to the requested color count
    case colorCount > 16: {
      colorPalette = createQuantizedColorPalette(colorCount);
      break;
    }

    // 16 colours - Microsoft Windows Standard VGA Palette
    case colorCount > 8: {
      colorPalette = [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0x0000AA), // Blue
        new THREE.Color(0x00AA00), // Green
        new THREE.Color(0x00AAAA), // Cyan
        new THREE.Color(0xAA0000), // Red
        new THREE.Color(0xAA00AA), // Magenta
        new THREE.Color(0xAA5500), // Brown
        new THREE.Color(0xAAAAAA), // Light Gray
        new THREE.Color(0x555555), // Dark Gray
        new THREE.Color(0x5555FF), // Light Blue
        new THREE.Color(0x55FF55), // Light Green
        new THREE.Color(0x55FFFF), // Light Cyan
        new THREE.Color(0xFF5555), // Light Red
        new THREE.Color(0xFF55FF), // Light Magenta
        new THREE.Color(0xFFFF55), // Yellow
        new THREE.Color(0xFFFFFF), // White
      ];
      break;
    }

    // 8 colours - Similar to ZX Spectrum (without dark shades), BBC Micro, Acorn Electron
    case colorCount > 4: {
      colorPalette = createQuantizedColorPalette(colorCount);
      break;
    }

    // 4 colours - CGA Mode 1 (Palette 0, High Intensity)
    case colorCount > 2: {
      colorPalette = [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0x55FFFF), // Cyan
        new THREE.Color(0xFF55FF), // Magenta
        new THREE.Color(0xFFFFFF), // White
      ];
      break;
    }

    // 2 colours - Monochrome
    case colorCount >= 0: {
      colorPalette = [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0xFFFFFF), // White
      ];
      break;
    }

    default: {
      throw new Error(`Invalid colorCount: ${colorCount}`);
    }
  }

  if (colorPalette.length !== colorCount) {
    console.warn(`${colorCount} colour palette not available, returned ${colorPalette.length}.`);
  }

  return colorPalette;
}
