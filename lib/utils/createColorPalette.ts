import * as THREE from 'three';
import { ColorCount } from '../models/ColorCount';

/**
 * Creates a color palette based on the specified color count
 */
export function createColorPalette(colorCount: ColorCount): THREE.Color[] {
  let colorPalette: THREE.Color[] = [];

  switch (true) {
    // 4096 colours - Full Atari STE / Amiga color palette
    case colorCount > 512: {
      const palette: THREE.Color[] = [];
      for (let r = 0; r < 16; r++) {
        for (let g = 0; g < 16; g++) {
          for (let b = 0; b < 16; b++) {
            palette.push(new THREE.Color(r / 15, g / 15, b / 15));
          }
        }
      }
      colorPalette = palette;
      break;
    }

    // 512 colours - Full Atari ST (before E) color palette
    case colorCount > 256: {
      const palette: THREE.Color[] = [];
      for (let r = 0; r < 8; r++) {
        for (let g = 0; g < 8; g++) {
          for (let b = 0; b < 8; b++) {
            palette.push(new THREE.Color(r / 7, g / 7, b / 7));
          }
        }
      }
      colorPalette = palette;
      break;
    }

    // 256 colours - Web safe palette plus grayscale
    case colorCount > 16: {
      const palette: THREE.Color[] = [];
      const steps = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
      for (let r of steps) {
        for (let g of steps) {
          for (let b of steps) {
            palette.push(new THREE.Color(r, g, b));
          }
        }
      }
      for (let i = 0; i < 40; i++) {
        const v = i / 39.0;
        palette.push(new THREE.Color(v, v, v));
      }
      colorPalette = palette.slice(0, 256);
      break;
    }

    // 16 colours - Microsoft Windows Standard VGA Palette
    case colorCount > 4: {
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
