import { defineConfig } from 'tsup';
import path from 'path';
import alias from 'esbuild-plugin-alias';

export default defineConfig({
  entry: ['src/index.ts', 'src/templates.ts', 'src/cli-utils.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  outDir: 'dist',
  // Externalize peer dependencies and external packages
  external: [
    'expo-router',
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'lucide-react-native',
    'class-variance-authority',
    'nativewind',
    'clsx',
    'tailwind-merge',
    'react-hook-form',
    'dayjs',
    'dayjs/plugin/isBetween',
    'dayjs/plugin/customParseFormat',
    'dayjs/plugin/weekday',
    'dayjs/plugin/weekOfYear',
    'zustand'
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
