import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { IUniform } from 'three';

/**
 * Valid color count values for the RetroPass effect
 */
export type ColorCount = 2 | 4 | 16 | 256;

/**
 * Interface for RetroPass constructor parameters
 */
export interface RetroPassParameters {
  resolution?: THREE.Vector2;
  colorCount?: ColorCount;
  colorPalette?: THREE.Color[];
  dithering?: boolean;
  pixelRatio?: number;
}

/**
 * Interface for shader uniforms used in RetroShader
 */
export interface RetroShaderUniforms {
  tDiffuse: IUniform<THREE.Texture | null>;
  resolution: IUniform<THREE.Vector2>;
  colorCount: IUniform<number>;
  paletteTexture: IUniform<THREE.DataTexture>;
  dithering: IUniform<boolean>;
}

/**
 * Generates a color palette based on the specified color count
 * @param colorCount - Number of colors in the palette (2, 4, 16, or 256)
 * @returns Array of THREE.Color objects representing the palette
 * @throws Error if colorCount is invalid
 */
export function getColorPalette(colorCount: ColorCount): THREE.Color[] {
  switch (colorCount) {
    case 2:
      return [
        new THREE.Color(0.0, 0.0, 0.0), // Black
        new THREE.Color(1.0, 1.0, 1.0), // White
      ];
    case 4:
      return [
        new THREE.Color(0.0, 0.0, 0.0), // Black
        new THREE.Color(1.0, 1.0, 1.0), // White
        new THREE.Color(1.0, 0.0, 0.0), // Red
        new THREE.Color(0.0, 1.0, 0.0), // Green
      ];
    case 16:
      return [
        new THREE.Color(0.0, 0.0, 0.0), // #000000
        new THREE.Color(0.2, 0.2, 0.2), // #333333
        new THREE.Color(0.4, 0.4, 0.4), // #666666
        new THREE.Color(0.6, 0.6, 0.6), // #999999
        new THREE.Color(0.8, 0.8, 0.8), // #CCCCCC
        new THREE.Color(1.0, 0.0, 0.0), // #FF0000
        new THREE.Color(0.0, 1.0, 0.0), // #00FF00
        new THREE.Color(0.0, 0.2, 0.0), // #003300
        new THREE.Color(0.0, 0.4, 0.0), // #006600
        new THREE.Color(0.0, 0.6, 0.0), // #009900
        new THREE.Color(0.0, 0.8, 0.0), // #00CC00
        new THREE.Color(0.0, 0.0, 1.0), // #0000FF
        new THREE.Color(1.0, 1.0, 1.0), // #FFFFFF
        new THREE.Color(1.0, 0.2, 0.2), // #FF3333
        new THREE.Color(1.0, 0.4, 0.4), // #FF6666
        new THREE.Color(1.0, 0.6, 0.6), // #FF9999
      ];
    case 256: {
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
      return palette.slice(0, 256);
    }
    default:
      throw new Error('Invalid colorCount');
  }
}

/**
 * Creates a DataTexture from an array of THREE.Color objects
 * @param colors - Array of THREE.Color objects to convert to texture
 * @returns THREE.DataTexture containing the color palette
 */
function createPaletteTexture(colors: THREE.Color[]): THREE.DataTexture {
  const width = colors.length;
  const height = 1;
  const data = new Uint8Array(width * 3);

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    data[i * 3] = Math.floor(color.r * 255);
    data[i * 3 + 1] = Math.floor(color.g * 255);
    data[i * 3 + 2] = Math.floor(color.b * 255);
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBFormat,
    THREE.UnsignedByteType
  );
  texture.needsUpdate = true;
  return texture;
}

/**
 * Shader configuration for retro-style post-processing effect
 */
export const RetroShader: {
  uniforms: RetroShaderUniforms;
  vertexShader: string;
  fragmentShader: string;
} = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(320, 200) },
    colorCount: { value: 16 },
    paletteTexture: { value: createPaletteTexture(getColorPalette(16)) },
    dithering: { value: true },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform int colorCount;
    uniform sampler2D paletteTexture;
    uniform bool dithering;
    varying vec2 vUv;

    const float bayerMatrix[16] = float[16](
      0.0 / 16.0,  8.0 / 16.0,  2.0 / 16.0, 10.0 / 16.0,
      12.0 / 16.0,  4.0 / 16.0, 14.0 / 16.0,  6.0 / 16.0,
      3.0 / 16.0, 11.0 / 16.0,  1.0 / 16.0,  9.0 / 16.0,
      15.0 / 16.0,  7.0 / 16.0, 13.0 / 16.0,  5.0 / 16.0
    );

    float getBayerDither(vec2 pos) {
      int x = int(mod(pos.x * resolution.x, 4.0));
      int y = int(mod(pos.y * resolution.y, 4.0));
      return bayerMatrix[y * 4 + x];
    }

    vec3 nearestColor(vec3 color) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      float index = clamp(luminance * float(colorCount), 0.0, float(colorCount - 1));
      float u = (index + 0.5) / float(colorCount);
      return texture2D(paletteTexture, vec2(u, 0.5)).rgb;
    }

    vec3 ditheredColor(vec3 color, vec2 uv) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      float dither = getBayerDither(uv);
      float scaledLuminance = luminance * float(colorCount - 1);
      int index = int(scaledLuminance);
      if (dither > scaledLuminance - float(index)) {
        index = min(index + 1, colorCount - 1);
      }
      float u = (float(index) + 0.5) / float(colorCount);
      return texture2D(paletteTexture, vec2(u, 0.5)).rgb;
    }

    void main() {
      vec2 pixelatedUv = floor(vUv * resolution) / resolution;
      vec3 color = texture2D(tDiffuse, pixelatedUv).rgb;
      vec3 quantizedColor = dithering ? ditheredColor(color, vUv) : nearestColor(color);
      gl_FragColor = vec4(quantizedColor, 1.0);
    }
  `,
};

/**
 * Post-processing pass for applying a retro-style effect with color quantization and dithering
 */
export class RetroPass extends ShaderPass {
  pixelRatio: number;
  private paletteTexture: THREE.DataTexture;

  /**
   * Creates a new RetroPass instance
   * @param parameters - Configuration parameters for the retro effect
   */
  constructor(parameters: RetroPassParameters = {}) {
    super(RetroShader);
    this.pixelRatio = parameters.pixelRatio !== undefined ? parameters.pixelRatio : 0;

    const defaults: Required<RetroPassParameters> = {
      resolution: new THREE.Vector2(320, 200),
      colorCount: 16,
      colorPalette: getColorPalette(16),
      dithering: true,
      pixelRatio: 0,
    };

    const params: Required<RetroPassParameters> = { ...defaults, ...parameters };

    if (![2, 4, 16, 256].includes(params.colorCount)) {
      console.warn('colorCount must be 2, 4, 16, or 256. Defaulting to 16.');
      params.colorCount = 16;
      params.colorPalette = getColorPalette(16);
    }

    if (params.colorPalette.length !== params.colorCount) {
      console.warn('colorPalette length does not match colorCount. Using default palette.');
      params.colorPalette = getColorPalette(params.colorCount);
    }

    this.paletteTexture = createPaletteTexture(params.colorPalette);

    this.uniforms.resolution.value.copy(params.resolution);
    this.uniforms.colorCount.value = params.colorCount;
    this.uniforms.paletteTexture.value = this.paletteTexture;
    this.uniforms.dithering.value = params.dithering;
  }

  /**
   * Updates the resolution of the retro effect
   * @param width - New width in pixels
   * @param height - New height in pixels
   */
  setSize(width: number, height: number): void {
    if (this.pixelRatio && this.pixelRatio > 0) {
      this.uniforms.resolution.value.set(width * this.pixelRatio, height * this.pixelRatio);
    }
  }

  /**
   * Updates the color palette used in the retro effect
   * @param colors - Array of THREE.Color objects for the new palette
   */
  setPalette(colors: THREE.Color[]): void {
    if (colors.length !== this.uniforms.colorCount.value) {
      console.warn('New palette length does not match colorCount. Ignoring update.');
      return;
    }
    const newTexture = createPaletteTexture(colors);
    this.uniforms.paletteTexture.value = newTexture;
    if (this.paletteTexture) {
      this.paletteTexture.dispose();
    }
    this.paletteTexture = newTexture;
  }
}