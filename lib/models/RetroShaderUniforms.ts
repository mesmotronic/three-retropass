import * as THREE from 'three';
import { IUniform } from 'three';

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
  quantizeEnabled: IUniform<boolean>;

  [uniform: string]: THREE.IUniform<any>;
}
