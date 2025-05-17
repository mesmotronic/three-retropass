import * as THREE from 'three';

/**
 * Convert THREE.Color[] to DataTexture
 */
export function createColorTexture(colors: THREE.Color[]): THREE.DataTexture {
  const width = colors.length;
  const height = 1;
  const data = new Uint8Array(width * 4); // RGBA

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    data[i * 4] = Math.floor(color.r * 255); // R
    data[i * 4 + 1] = Math.floor(color.g * 255); // G
    data[i * 4 + 2] = Math.floor(color.b * 255); // B
    data[i * 4 + 3] = 255; // A (fully opaque)
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );

  texture.needsUpdate = true;

  return texture;
}
