import * as THREE from 'three';

const MIN_COLOR_COUNT = 2;
const MAX_COLOR_COUNT = 4096;

export const validColorCounts = Array.from({ length: MAX_COLOR_COUNT - MIN_COLOR_COUNT + 1 }).map((_, i) => i + 2);

export function isValidColorCount(colorCount: number): boolean {
  return colorCount === THREE.MathUtils.clamp(colorCount, MIN_COLOR_COUNT, MAX_COLOR_COUNT);
}
