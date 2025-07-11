import * as THREE from 'three';
import { ColorCount } from '../models/ColorCount';

/**
 * Creates a 3D cube quantized colour palette using NxNxN steps where N is the 
 * number of levels per channel, optionally padded with greyscale to the 
 * specified palette size
 */
export function createQuantizedColorPalette(levels: number, paletteSize = 0): THREE.Color[] {
  const palette: THREE.Color[] = [];
  let divisor = levels - 1;

  for (let r = 0; r < levels; r++) {
    for (let g = 0; g < levels; g++) {
      for (let b = 0; b < levels; b++) {
        palette.push(new THREE.Color(r / divisor, g / divisor, b / divisor));
      }
    }
  }

  const cubeSize = palette.length;
  divisor = paletteSize - cubeSize - 1;

  while (palette.length < paletteSize) {
    const v = (palette.length - cubeSize) / divisor;
    palette.push(new THREE.Color(v, v, v));
  }

  return palette;
}

/**
 * Creates a color palette based on the specified color count
 */
export function createColorPalette(colorCount: ColorCount): THREE.Color[] {
  let colorPalette: THREE.Color[] = [];

  switch (true) {
    // 4096 colours - Full Atari STE / Amiga color palette
    case colorCount > 512: {
      colorPalette = createQuantizedColorPalette(16);
      break;
    }

    // 512 colours - Full Atari ST (before E) color palette
    case colorCount > 256: {
      colorPalette = createQuantizedColorPalette(8);
      break;
    }

    // 256 colours - Web safe colours plus grayscale
    case colorCount > 128: {
      colorPalette = createQuantizedColorPalette(6, 256);
      break;
    }

    // 128 colours - Similar to Atari XL/XE
    case colorCount > 64: {
      colorPalette = createQuantizedColorPalette(5, 128);
      break;
    }

    // 64 colours - Similar to NES, Sega Master System
    case colorCount > 32: {
      colorPalette = createQuantizedColorPalette(4);
      break;
    }

    // 32 colours
    case colorCount > 16: {
      colorPalette = createQuantizedColorPalette(3, 32);
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
      colorPalette = createQuantizedColorPalette(2);
      break;
    }

    // 4 colours - CGA mode 1
    case colorCount > 2: {
      colorPalette = [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0x00AAAA), // Cyan
        new THREE.Color(0xAA00AA), // Magenta
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
    console.warn(`No default color palette found for ${colorCount} colors, using ${colorPalette.length} colors instead.`);
  }

  return colorPalette;
}
