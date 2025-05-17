import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { validColorCounts } from "../models/ColorCount";
import { RetroPassParameters } from '../models/RetroPassParameters';
import { RetroShader } from '../shaders/RetroShader';
import { createColorPalette } from '../utils/createColorPalette';
import { createColorTexture } from '../utils/createColorTexture';

/**
 * Post-processing pass for applying a retro-style effect with color quantization and dithering
 */
export class RetroPass extends ShaderPass {
  protected size = new THREE.Vector2();

  #colorPalette!: THREE.Color[];
  #autoDitheringOffset: boolean = false;
  #autoResolution: boolean = false;
  #pixelRatio: number = 0;

  /**
   * Creates a new RetroPass instance
   * @param parameters - Configuration parameters for the retro effect
   */
  constructor({
    colorCount = 16,
    colorPalette,
    dithering = true,
    ditheringOffset = 0.2,
    autoDitheringOffset = false,
    pixelRatio = 0.25,
    resolution = new THREE.Vector2(320, 200),
    autoResolution = false,
  }: RetroPassParameters = {}) {
    super(RetroShader);

    this.dithering = dithering;
    this.ditheringOffset = ditheringOffset;
    this.autoDitheringOffset = autoDitheringOffset;
    this.pixelRatio = pixelRatio;

    this.resolution = resolution;
    this.autoResolution = autoResolution;

    if (colorPalette) {
      this.colorPalette = colorPalette;
    } else {
      this.colorCount = colorCount;
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
   * Whether to automatically update the resolution based on the specified pixelRatio
   */
  public get autoResolution(): boolean {
    return this.#autoResolution;
  }
  public set autoResolution(value: boolean) {
    if (this.#autoResolution !== value) {
      this.#autoResolution = value;
      this.updateResolution();
    }
  }

  /**
   * Pixel ratio to use if autoResolution is true, typically 0.0-1.0 (optional)
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
    if (!validColorCounts.includes(colorCount)) {
      throw new Error(`Invalid colorPalette, must contain ${validColorCounts.join(', ')} colours`);
    }

    const colorTexture = createColorTexture(colors);

    this.uniforms.colorCount.value = colorCount;
    this.uniforms.colorTexture.value?.dispose();
    this.uniforms.colorTexture.value = colorTexture;

    if (this.autoDitheringOffset) {
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
   * Set the pixel resolution to use (used by EffectComposer)
   * @see {@link RetroPass.resolution}
   */
  public setSize(width: number, height: number): void {
    this.size.set(width, height);
    this.updateResolution();
  }

  /**
   * Updates the resolution based on the current pixel ratio and size
   */
  protected updateResolution(): void {
    if (this.autoResolution) {
      this.resolution.set(this.size.x * this.pixelRatio, this.size.y * this.pixelRatio);
    }
  }

  /**
   * Updates the dithering offset based on the current color count
   */
  protected updateDitheringOffset(): void {
    if (this.autoDitheringOffset) {
      this.ditheringOffset = 1.0 / (this.colorCount - 1);
    }
  }
}