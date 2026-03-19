import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RetroPassParameters } from '../../models/RetroPassParameters';
import { RetroShader } from '../shaders/RetroShader';
import { createColorPalette } from '../../utils/createColorPalette';
import { createColorTexture } from '../../utils/createColorTexture';
import { isValidColorCount } from "../../utils/isValidColorCount";

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
    return this.uniforms.uResolution.value;
  }
  public set resolution(value: THREE.Vector2) {
    if (!value.equals(this.uniforms.uResolution.value)) {
      this.uniforms.uResolution.value.copy(value);
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
    return this.uniforms.uColorCount.value;
  }
  public set colorCount(value: number) {
    if (value !== this.colorCount) {
      if (!isValidColorCount(value)) {
        throw new Error(`Invalid colorPalette, must contain between 2 and 4096 colours`);
      }
      this.uniforms.uIsQuantized.value = true;
      this.setColorPalette(createColorPalette(value));
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
    if (!isValidColorCount(colorCount)) {
      throw new Error(`Invalid colorPalette, must contain between 2 and 4096 colours`);
    }
    this.uniforms.uIsQuantized.value = false;
    this.setColorPalette(colors);
  }

  /**
   * Whether or not to apply dithering
   */
  public get dithering(): boolean {
    return this.uniforms.uDithering.value;
  }
  public set dithering(value: boolean) {
    this.uniforms.uDithering.value = value;
  }

  /**
   * The amount of dithering to apply, typically 0.0 to 1.0
   */
  public get ditheringOffset(): number {
    return this.uniforms.uDitheringOffset.value;
  }
  public set ditheringOffset(value: number) {
    this.uniforms.uDitheringOffset.value = value;
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
   * Whether to invert the image before processing
   */
  public get inverted(): boolean {
    return this.uniforms.uInverted.value;
  }
  public set inverted(value: boolean) {
    this.uniforms.uInverted.value = value;
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
      this.ditheringOffset = 0.03 + 0.97 / (this.colorCount - 1);
    }
  }

  protected setColorPalette(colors: THREE.Color[]): void {
    const colorCount = colors?.length;
    const colorTexture = createColorTexture(colors);

    this.uniforms.uColorCount.value = colorCount;
    this.uniforms.uColorTexture.value?.dispose();
    this.uniforms.uColorTexture.value = colorTexture;

    if (this.autoDitheringOffset) {
      this.updateDitheringOffset();
    }

    this.#colorPalette = colors.slice();
  }
}
