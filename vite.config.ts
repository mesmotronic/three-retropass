import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['lib'],
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json"),
    })
  ],
  build: {
    lib: {
      entry: {
        'webgl/index': resolve(__dirname, 'lib/webgl/index.ts'),
        'webgpu/index': resolve(__dirname, 'lib/webgpu/index.ts'),
      },
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'three',
        /^three\//,
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
      },
    },
  }

});
