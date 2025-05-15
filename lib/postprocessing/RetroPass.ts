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
  tDiffuse: IUniform<THREE.Texture | null>;
  resolution: IUniform<THREE.Vector2>;
  colorCount: IUniform<number>;
  colorTexture: IUniform<THREE.DataTexture>;
  dithering: IUniform<boolean>;
  ditheringOffset: IUniform<number>;
}

/**
 * Creates a color palette based on the specified color count
 */
export function createColorPalette(colorCount: ColorCount): THREE.Color[] {
  switch (colorCount) {
    // Monochrome
    case 2:
      return [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0xFFFFFF), // White
      ];

    // CGA mode 1
    case 4:
      return [
        new THREE.Color(0x000000), // Black
        new THREE.Color(0x00AAAA), // Cyan
        new THREE.Color(0xAA00AA), // Magenta
        new THREE.Color(0xFFFFFF), // White
      ];

    // Microsoft Windows Standard VGA 16 Color Palette
    case 16:
      return [
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
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(320, 200) },
    colorCount: { value: 16 },
    colorTexture: { value: createColorTexture(createColorPalette(16)) },
    dithering: { value: true },
    ditheringOffset: { value: 0.2 },
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
    uniform sampler2D colorTexture;
    uniform bool dithering;
    uniform float ditheringOffset;

    varying vec2 vUv;

    // Bayer matrix 4x4
    const float bayer4x4[16] = float[16](
      0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0,
      12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0,
      3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0,
      15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0
    );

    void main() {
      // Compute retro UV for pixelation
      vec2 retroUV = (floor(vUv * resolution) + 0.5) / resolution;
      vec3 c = texture2D(tDiffuse, retroUV).rgb;

      // Compute retro pixel coordinates
      vec2 retroCoord = floor(vUv * resolution);

      if (dithering) {
        float offset = 0.0;
        // Skip dithering for pure black pixels
        if (!(c.r == 0.0 && c.g == 0.0 && c.b == 0.0)) {
          int ix = int(mod(retroCoord.x, 4.0));
          int iy = int(mod(retroCoord.y, 4.0));
          float bayer = bayer4x4[iy * 4 + ix];
          offset = (bayer - 0.5) * ditheringOffset;
        }
        c += vec3(offset);
        c = clamp(c, 0.0, 1.0);
      }

      // Find closest color in palette
      vec3 closestColor = vec3(0.0);
      float minDist = 1e6;
      for (int i = 0; i < colorCount; i++) {
        vec3 paletteColor = texture2D(colorTexture, vec2((float(i) + 0.5) / float(colorCount), 0.5)).rgb;
        float dist = distance(c, paletteColor);
        if (dist < minDist) {
          minDist = dist;
          closestColor = paletteColor;
        }
      }

      gl_FragColor = vec4(closestColor, 1.0);
    }
  `,
};

/**
 * Post-processing pass for applying a retro-style effect with color quantization and dithering
 */
export class RetroPass extends ShaderPass {
  protected size = new THREE.Vector2();

  #autoDitheringOffset: boolean = false;
  #colorPalette!: THREE.Color[];
  #pixelRatio: number = 0;

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
    if (this.#autoDitheringOffset) {
      this.updateDitheringOffset();
    }

    this.#colorPalette = colors.slice();
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
   * The amount of dithering to apply, typically 0.0 to 1.0
   */
  public get ditheringOffset(): number {
    return this.uniforms.ditheringOffset.value;
  }
  public set ditheringOffset(value: number) {
    this.uniforms.ditheringOffset.value = value;
  }

  /**
   * Whether to automatically update the dithering offset based on the color count
   */
  public get autoDitheringOffset(): boolean {
    return this.#autoDitheringOffset;
  }
  public set autoDitheringOffset(value: boolean) {
    if (this.#autoDitheringOffset !== value) {
      this.#autoDitheringOffset = value;
      if (value) {
        this.updateDitheringOffset();
      }
    }
  }

  /**
   * Pixel ratio to use, typically 0.0-1.0, overrides resolution if set (optional)
   */
  get pixelRatio(): number {
    return this.#pixelRatio;
  }
  set pixelRatio(value: number) {
    if (this.#pixelRatio !== value) {
      this.#pixelRatio = value;
      this.updateResolution();
    }
  }

  /**
   * Set the pixel resolution to use (used by EffectComposer)
   * @see {@link RetroPass.resolution}
   */
  public setSize(width: number, height: number): void {
    if (this.pixelRatio) {
      this.updateResolution();
    }
    this.size.set(width, height);
  }

  protected updateResolution(): void {
    if (this.pixelRatio) {
      this.resolution.set(this.size.x * this.#pixelRatio, this.size.y * this.#pixelRatio);
    }
  }

  /**
   * Updates the dithering offset based on the current color count
   */
  protected updateDitheringOffset(): void {
    if (this.#autoDitheringOffset) {
      const colorCount = this.uniforms.colorCount.value;
      if (colorCount > 1) {
        this.uniforms.ditheringOffset.value = 1.0 / (colorCount - 1);
      } else {
        this.uniforms.ditheringOffset.value = 0.0;
      }
    }
  }
}