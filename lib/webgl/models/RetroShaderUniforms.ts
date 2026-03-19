import * as THREE from 'three';
import { IUniform } from 'three';

/**
 * Interface for shader uniforms used in RetroShader
 */
export interface RetroShaderUniforms {
  tDiffuse: IUniform<THREE.Texture | null>;
  uResolution: IUniform<THREE.Vector2>;
  uColorCount: IUniform<number>;
  uColorTexture: IUniform<THREE.DataTexture>;
  uDithering: IUniform<boolean>;
  uDitheringOffset: IUniform<number>;
  uIsQuantized: IUniform<boolean>;
  uInverted: IUniform<boolean>;

  [uniform: string]: THREE.IUniform<any>;
}
