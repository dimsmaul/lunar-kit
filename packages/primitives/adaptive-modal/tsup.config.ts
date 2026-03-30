import { defineConfig } from 'tsup';
import path from 'path';
import alias from 'esbuild-plugin-alias';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  outDir: 'dist',
  // Externalize peer dependencies
  external: [
    'react',
    'react-native',
    'react-dom',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.plugins = [
      alias({
        '@': path.resolve(__dirname, './src'),
      })
    ];
  },
});
