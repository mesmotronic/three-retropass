import * as THREE from "three";
import { RetroShaderUniforms } from "../models/RetroShaderUniforms";
import { createColorTexture } from "../utils/createColorTexture";
import { createColorPalette } from "../utils/createColorPalette";

interface RetroShaderParameters extends THREE.ShaderMaterialParameters {
  uniforms: RetroShaderUniforms;
}

/**
 * Shader that creates retro-style post-processing effect
 */
export const RetroShader: RetroShaderParameters = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(320, 200) },
    colorCount: { value: 16 },
    colorTexture: { value: createColorTexture(createColorPalette(16)) },
    dithering: { value: true },
    ditheringOffset: { value: 0.2 },
    isQuantized: { value: true },
    isSrgb: { value: true },
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
    uniform bool isQuantized;
    uniform bool isSrgb;

    varying vec2 vUv;

    // Bayer matrix 4x4
    const float bayer4x4[16] = float[16](
      0.0 / 16.0, 8.0 / 16.0, 2.0 / 16.0, 10.0 / 16.0,
      12.0 / 16.0, 4.0 / 16.0, 14.0 / 16.0, 6.0 / 16.0,
      3.0 / 16.0, 11.0 / 16.0, 1.0 / 16.0, 9.0 / 16.0,
      15.0 / 16.0, 7.0 / 16.0, 13.0 / 16.0, 5.0 / 16.0
    );

    // Convert linear color to sRGB to correct brightness
    vec3 linearToSrgb(vec3 linearColor) {
      if (!isSrgb) {
        vec3 cutoff = step(vec3(0.0031308), linearColor);
        vec3 lower = linearColor * 12.92;
        vec3 higher = 1.055 * pow(linearColor, vec3(1.0/2.4)) - 0.055;
        return mix(lower, higher, cutoff);
      }

      return linearColor;
    }

    // Quantize color to palette index for N colors (N = 2..4096)
    int quantizeToPaletteIndex(vec3 c, int colorCount) {
      // Find the number of steps per channel
      int steps = int(pow(float(colorCount), 1.0/3.0) + 0.5);
      steps = max(1, steps);
      int r = int(clamp(floor(c.r * float(steps - 1) + 0.5), 0.0, float(steps - 1)));
      int g = int(clamp(floor(c.g * float(steps - 1) + 0.5), 0.0, float(steps - 1)));
      int b = int(clamp(floor(c.b * float(steps - 1) + 0.5), 0.0, float(steps - 1)));
      return r * steps * steps + g * steps + b;
    }

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

      vec3 closestColor = vec3(0.0);

      // By default we use brute-force for small palettes, quantize for large
      if (isQuantized == false || colorCount < 64) {
        float minDist = 1e6;
        for (int i = 0; i < colorCount; i++) {
          vec3 paletteColor = texture2D(colorTexture, vec2((float(i) + 0.5) / float(colorCount), 0.5)).rgb;
          float dist = distance(c, paletteColor);
          if (dist < minDist) {
            minDist = dist;
            closestColor = paletteColor;
          }
        }
      } else {
        int idx = quantizeToPaletteIndex(c, colorCount);
        float paletteIndex = (float(idx) + 0.5) / float(colorCount);
        closestColor = texture2D(colorTexture, vec2(paletteIndex, 0.5)).rgb;
      }

      gl_FragColor = vec4(linearToSrgb(closestColor), 1.0);
    }
  `,
};
