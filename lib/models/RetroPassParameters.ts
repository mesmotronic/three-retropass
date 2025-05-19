import * as THREE from 'three';
import { ColorCount } from './ColorCount';

/**
 * Interface for RetroPass constructor parameters
 */
export interface RetroPassParameters {
  resolution?: THREE.Vector2;
  autoResolution?: boolean;
  colorCount?: ColorCount;
  colorPalette?: THREE.Color[];
  dithering?: boolean;
  pixelRatio?: number;
  ditheringOffset?: number;
  autoDitheringOffset?: boolean;
}
