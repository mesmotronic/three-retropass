import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { IUniform } from 'three';

const validColorCounts = [2, 4, 16, 256];

/**
 * Valid color count values for the RetroPass effect
 */
export type ColorCount = typeof validColorCounts[number];

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
  resolution: IUniform<THREE.Vector2>;
  colorCount: IUniform<number>;
  colorTexture: IUniform<THREE.DataTexture>;
  dithering: IUniform<boolean>;
}

/**
 * Creates a color palette based on the specified color count
 */
export function createColorPalette(colorCount: ColorCount): THREE.Color[] {
  switch (colorCount) {
    // Monochrome
    case 2:
      return [
        new THREE.Color(0.0, 0.0, 0.0), // Black
        new THREE.Color(1.0, 1.0, 1.0), // White
      ];

    // CGA mode 1
    case 4:
      return [
        new THREE.Color(0.0, 0.0, 0.0), // Black
        new THREE.Color(0.0, 1.0, 1.0), // Cyan
        new THREE.Color(1.0, 0.0, 1.0), // Magenta
        new THREE.Color(1.0, 1.0, 1.0), // White
      ];

    // Original web safe palette
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

    // Web safe palette plus grayscale
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

    default: {
      throw new Error(`Invalid colorCount (${colorCount}), must be ${validColorCounts.join(', ')}`);
    }
  }
}

/**
 * Convert THREE.Color[] to DataTexture
 */
export function createColorTexture(colors: THREE.Color[]): THREE.DataTexture {
  const width = colors.length;
  const height = 1;
  const data = new Uint8Array(width * 4); // RGBA: 4 components per pixel

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

/**
 * Shader that creates retro-style post-processing effect
 */
export const RetroShader: {
  uniforms: RetroShaderUniforms;
  vertexShader: string;
  fragmentShader: string;
} = {
  uniforms: {
    resolution: { value: new THREE.Vector2(320, 200) },
    colorCount: { value: 16 },
    colorTexture: { value: createColorTexture(createColorPalette(16)) },
    dithering: { value: true },
  },

  vertexShader: /* glsl */ `
  `,

  fragmentShader: /* glsl */ `
  `,
};

/**
 * Post-processing pass for applying a retro-style effect with color quantization and dithering
 */
export class RetroPass extends ShaderPass {
  /**
   * Pixel ratio to use, typically 0.0-1.0, overrides resolution if set (optional)
   */
  public pixelRatio: number;

  #colorPalette!: THREE.Color[];

  /**
   * Creates a new RetroPass instance
   * @param parameters - Configuration parameters for the retro effect
   */
  constructor({
    resolution,
    colorCount,
    colorPalette,
    dithering,
    pixelRatio,
  }: RetroPassParameters) {
    super(RetroShader);

    this.resolution = resolution ?? new THREE.Vector2(320, 200);
    this.pixelRatio = pixelRatio ?? 0;
    this.dithering = dithering ?? false;

    if (colorPalette) {
      this.colorPalette = colorPalette;
    } else {
      this.colorCount = colorCount ?? 16;
    }
  }

  /**
   * Pixel resolution to use
   */
  public get resolution(): THREE.Vector2 {
    return this.uniforms.resolution.value;
  }
  public set resolution(value: THREE.Vector2) {
    if (!value.equals(this.uniforms.resolution.value)) {
      this.uniforms.resolution.value.copy(value);
    }
  }

  /**
   * The number of colors in the palette
   */
  public get colorCount(): number {
    return this.uniforms.colorCount.value;
  }
  public set colorCount(value: number) {
    if (value !== this.colorCount) {
      if (!validColorCounts.includes(value)) {
        throw new Error(`Invalid colorCount (${value}), must be ${validColorCounts.join(', ')}`);
      }
      this.colorPalette = createColorPalette(value);
    }
  }

  /**
   * Whether or not to apply dithering
   */
  public get dithering(): boolean {
    return this.uniforms.dithering.value;
  }
  public set dithering(value: boolean) {
    this.uniforms.dithering.value = value;
  }

  /**
   * The current color palette
   */
  public get colorPalette(): THREE.Color[] {
    return this.#colorPalette;
  }
  public set colorPalette(colors: THREE.Color[]) {
    const colorCount = colors?.length;
    if (!colorCount || !validColorCounts.includes(colorCount)) {
      throw new Error(`Invalid colorPalette, must contain ${validColorCounts.join(', ')} colours`);
    }

    const colorTexture = createColorTexture(colors);

    this.uniforms.colorCount.value = colorCount;
    this.uniforms.colorTexture.value?.dispose();
    this.uniforms.colorTexture.value = colorTexture;

    this.#colorPalette = colors.slice();
  }

  public setSize(width: number, height: number): void {
    const { pixelRatio } = this;
    if (pixelRatio) {
      this.resolution.set(width * pixelRatio, height * pixelRatio);
    }
  }
}