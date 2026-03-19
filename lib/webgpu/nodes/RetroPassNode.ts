import * as THREE from 'three';
import {
  clamp,
  convertToTexture,
  float,
  floor,
  Fn,
  If,
  int,
  Loop,
  nodeObject,
  not,
  texture as tslTexture,
  uniform,
  uv,
  vec2,
  vec3,
  vec4
} from 'three/tsl';
import { TempNode } from 'three/webgpu';
import { RetroPassParameters } from '../../models/RetroPassParameters';
import { createColorPalette } from '../../utils/createColorPalette';
import { createColorTexture } from '../../utils/createColorTexture';
import { isValidColorCount } from '../../utils/isValidColorCount';

/**
 * TSL node that applies a retro-style post-processing effect with
 * pixelation, color quantization, and ordered (Bayer) dithering.
 *
 * Designed for use with Three.js WebGPURenderer and PostProcessing.
 *
 * @augments TempNode
 * @example
 * import { pass } from 'three/tsl';
 * import { retroPass } from '@mesmotronic/three-retropass/webgpu';
 *
 * const scenePass = pass(scene, camera);
 * const postProcessing = new PostProcessing(renderer);
 * postProcessing.outputNode = retroPass(scenePass.getTextureNode(), { colorCount: 16 });
 */
export class RetroPassNode extends TempNode {

  static get type(): string {
    return 'RetroPassNode';
  }

  /** Input texture node (the scene render) */
  public textureNode: ReturnType<typeof convertToTexture>;

  /** @private Uniform for retro resolution (e.g. 320×200) */
  private _resolution = uniform(new THREE.Vector2(320, 200));

  /** @private Uniform for dithering on/off */
  private _dithering = uniform(true);

  /** @private Uniform for dithering strength */
  private _ditheringOffset = uniform(0.2);

  /** @private Uniform for number of colors */
  private _colorCount = uniform(16);

  /** @private Uniform for whether this is a quantized (cube) palette */
  private _isQuantized = uniform(true);

  /** @private TextureNode for the palette */
  private _colorTextureNode = tslTexture(createColorTexture(createColorPalette(16)));

  /** @private Uniform for whether to invert the image */
  private _inverted = uniform(false);

  // Internal state not exposed via uniforms
  #colorPalette!: THREE.Color[];
  #autoDitheringOffset = false;
  #autoResolution = false;
  #pixelRatio = 0.25;
  #size = new THREE.Vector2();

  /**
   * @param textureNode - The texture node that provides the input image
   * @param parameters  - Configuration parameters for the retro effect
   */
  constructor(
    textureNode: ReturnType<typeof convertToTexture>,
    {
      colorCount = 16,
      colorPalette,
      dithering = true,
      ditheringOffset = 0.2,
      autoDitheringOffset = false,
      pixelRatio = 0.25,
      resolution = new THREE.Vector2(320, 200),
      autoResolution = false,
    }: RetroPassParameters = {}
  ) {
    super('vec4');

    this.textureNode = textureNode;

    // Apply initial settings via setters so validation runs
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

  // ─── Resolution ──────────────────────────────────────────────────────────

  public get resolution(): THREE.Vector2 {
    return this._resolution.value;
  }
  public set resolution(value: THREE.Vector2) {
    if (!value.equals(this._resolution.value)) {
      this._resolution.value.copy(value);
    }
  }

  public get autoResolution(): boolean {
    return this.#autoResolution;
  }
  public set autoResolution(value: boolean) {
    if (this.#autoResolution !== value) {
      this.#autoResolution = value;
      this.#updateResolution();
    }
  }

  public get pixelRatio(): number {
    return this.#pixelRatio;
  }
  public set pixelRatio(value: number) {
    if (this.#pixelRatio !== value) {
      this.#pixelRatio = value;
      this.#updateResolution();
    }
  }

  // ─── Color ───────────────────────────────────────────────────────────────

  public get colorCount(): number {
    return this._colorCount.value;
  }
  public set colorCount(value: number) {
    if (value !== this.colorCount) {
      if (!isValidColorCount(value)) {
        throw new Error(`Invalid colorCount, must be between 2 and 4096`);
      }
      this._isQuantized.value = true;
      this.#setColorPalette(createColorPalette(value));
    }
  }

  public get colorPalette(): THREE.Color[] {
    return this.#colorPalette;
  }
  public set colorPalette(colors: THREE.Color[]) {
    const count = colors?.length;
    if (!isValidColorCount(count)) {
      throw new Error(`Invalid colorPalette, must contain between 2 and 4096 colours`);
    }
    this._isQuantized.value = false;
    this.#setColorPalette(colors);
  }

  // ─── Dithering ───────────────────────────────────────────────────────────

  public get dithering(): boolean {
    return this._dithering.value;
  }
  public set dithering(value: boolean) {
    this._dithering.value = value;
  }

  public get ditheringOffset(): number {
    return this._ditheringOffset.value;
  }
  public set ditheringOffset(value: number) {
    this._ditheringOffset.value = value;
  }

  public get autoDitheringOffset(): boolean {
    return this.#autoDitheringOffset;
  }
  public set autoDitheringOffset(value: boolean) {
    if (this.#autoDitheringOffset !== value) {
      this.#autoDitheringOffset = value;
      if (value) {
        this.#updateDitheringOffset();
      }
    }
  }

  // ─── Invert ──────────────────────────────────────────────────────────────

  public get inverted(): boolean {
    return this._inverted.value;
  }
  public set inverted(value: boolean) {
    this._inverted.value = value;
  }

  // ─── Size (called by PostProcessing / EffectComposer equivalent) ──────────

  /**
   * Called by the renderer / PostProcessing pipeline when the output size
   * changes. Mirrors the `setSize` API from the WebGL ShaderPass.
   */
  public setSize(width: number, height: number): void {
    this.#size.set(width, height);
    this.#updateResolution();
  }

  // ─── TSL node graph ──────────────────────────────────────────────────────

  /**
   * Builds the TSL node graph implementing the retro effect.
   */
  setup(/* builder */) {

    const textureNode = this.textureNode;
    const uvNode = textureNode.uvNode ? vec2(textureNode.uvNode.xy) : nodeObject(uv());

    const uResolution = this._resolution;
    const uDithering = this._dithering;
    const uDitheringOffset = this._ditheringOffset;
    const uColorCount = this._colorCount;
    const uColorTextureNode = this._colorTextureNode;
    const uIsQuantized = this._isQuantized;
    const uInverted = this._inverted;

    // ── Bayer 4×4 ordered-dither matrix ──────────────────────────────────
    // 16 entries encoded as four vec4 rows; indexed by (iy * 4 + ix).
    const bayer = [
      vec4(0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0),
      vec4(12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0),
      vec4(3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0),
      vec4(15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0),
    ];

    // Look up a Bayer value by integer (ix, iy) coordinates in [0,3]
    const bayerLookup = Fn(([ix, iy]: [ReturnType<typeof int>, ReturnType<typeof int>]) => {
      const result = float(0).toVar();
      If(iy.equal(int(0)), () => {
        If(ix.equal(int(0)), () => { result.assign(bayer[0].x); })
          .ElseIf(ix.equal(int(1)), () => { result.assign(bayer[0].y); })
          .ElseIf(ix.equal(int(2)), () => { result.assign(bayer[0].z); })
          .Else(() => { result.assign(bayer[0].w); });
      }).ElseIf(iy.equal(int(1)), () => {
        If(ix.equal(int(0)), () => { result.assign(bayer[1].x); })
          .ElseIf(ix.equal(int(1)), () => { result.assign(bayer[1].y); })
          .ElseIf(ix.equal(int(2)), () => { result.assign(bayer[1].z); })
          .Else(() => { result.assign(bayer[1].w); });
      }).ElseIf(iy.equal(int(2)), () => {
        If(ix.equal(int(0)), () => { result.assign(bayer[2].x); })
          .ElseIf(ix.equal(int(1)), () => { result.assign(bayer[2].y); })
          .ElseIf(ix.equal(int(2)), () => { result.assign(bayer[2].z); })
          .Else(() => { result.assign(bayer[2].w); });
      }).Else(() => {
        If(ix.equal(int(0)), () => { result.assign(bayer[3].x); })
          .ElseIf(ix.equal(int(1)), () => { result.assign(bayer[3].y); })
          .ElseIf(ix.equal(int(2)), () => { result.assign(bayer[3].z); })
          .Else(() => { result.assign(bayer[3].w); });
      });
      return result;
    });

    // Fast cube-quantization path for large auto-generated palettes (≥27 colors)
    const quantizeCube = Fn(([c, colorCount]: [ReturnType<typeof vec3>, ReturnType<typeof int>]) => {
      const stepsF = floor(float(colorCount).pow(float(1.0 / 3.0)));
      const maxIdx = stepsF.sub(float(1.0));
      const r = floor(c.x.mul(maxIdx).add(0.5)).div(maxIdx);
      const g = floor(c.y.mul(maxIdx).add(0.5)).div(maxIdx);
      const b = floor(c.z.mul(maxIdx).add(0.5)).div(maxIdx);
      return vec3(r, g, b);
    });

    // Main retro effect
    const retroEffect = Fn(() => {

      // 1. Pixelation – snap UV to the retro grid
      const retroUV = floor(uvNode.mul(uResolution)).add(vec2(0.5, 0.5)).div(uResolution);
      const retroCoord = floor(uvNode.mul(uResolution));

      // 2. Sample scene colour, optionally invert
      const c = vec3(textureNode.sample(retroUV).rgb).toVar();

      If(uInverted, () => {
        c.assign(vec3(1.0).sub(c));
      });

      // 3. Ordered (Bayer) dithering — skip for pure black pixels
      If(uDithering, () => {
        If(
          c.x.greaterThan(0.0).or(c.y.greaterThan(0.0)).or(c.z.greaterThan(0.0)),
          () => {
            const ix = int(retroCoord.x.mod(4.0));
            const iy = int(retroCoord.y.mod(4.0));
            const bayerVal = bayerLookup(ix, iy);
            const offset = bayerVal.sub(0.5).mul(uDitheringOffset);
            c.assign(clamp(c.add(vec3(offset, offset, offset)), vec3(0.0), vec3(1.0)));
          }
        );
      });

      // 4. Color quantization
      const closestColor = vec3(0.0).toVar();

      If(
        not(uIsQuantized).or(uColorCount.lessThan(int(27))),
        () => {
          // Brute-force search — always correct for small / explicit palettes
          const minDist = float(1e6).toVar();
          Loop({ start: int(0), end: int(uColorCount) }, ({ i }) => {
            const u = float(i).add(0.5).div(float(uColorCount));
            const paletteColor = vec3(uColorTextureNode.sample(vec2(u, 0.5)).rgb);
            const dist = c.distance(paletteColor);
            If(dist.lessThan(minDist), () => {
              minDist.assign(dist);
              closestColor.assign(paletteColor);
            });
          });
        }
      ).Else(() => {
        // Fast cube quantization for large auto-palettes
        closestColor.assign(quantizeCube(c, uColorCount));
      });

      return vec4(closestColor, float(1.0));
    });

    return retroEffect();
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  #updateResolution(): void {
    if (this.#autoResolution) {
      this._resolution.value.set(
        this.#size.x * this.#pixelRatio,
        this.#size.y * this.#pixelRatio,
      );
    }
  }

  #updateDitheringOffset(): void {
    if (this.#autoDitheringOffset) {
      this._ditheringOffset.value = 0.03 + 0.97 / (this.colorCount - 1);
    }
  }

  #setColorPalette(colors: THREE.Color[]): void {
    const count = colors.length;
    const newTex = createColorTexture(colors);

    this._colorCount.value = count;
    (this._colorTextureNode.value as THREE.DataTexture)?.dispose();
    this._colorTextureNode.value = newTex;

    if (this.#autoDitheringOffset) {
      this.#updateDitheringOffset();
    }

    this.#colorPalette = colors.slice();
  }
}

/**
 * TSL convenience function for creating a RetroPassNode.
 *
 * @tsl
 * @function
 * @param node       - Input node (scene render texture or any vec4 node)
 * @param parameters - Retro effect configuration
 * @returns A node-wrapped RetroPassNode ready for use in PostProcessing
 *
 * @example
 * import { pass } from 'three/tsl';
 * import { retroPass } from '@mesmotronic/three-retropass/webgpu';
 *
 * const scenePass = pass(scene, camera);
 * postProcessing.outputNode = retroPass(scenePass.getTextureNode(), {
 *   colorCount: 4,
 *   dithering: true,
 * });
 */
export const retroPass = (
  node: Parameters<typeof convertToTexture>[0],
  parameters?: RetroPassParameters
) => nodeObject(new RetroPassNode(convertToTexture(node), parameters));

export default RetroPassNode;
