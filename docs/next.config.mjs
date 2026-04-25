import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['nativewind', 'react-native-css-interop'],
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'lucide-react-native': 'lucide-react',
      'expo-router': '@lk-stubs/expo-router',
      'expo-modules-core': '@lk-stubs/expo-modules-core',
      'react-native-gesture-handler': '@lk-stubs/react-native-gesture-handler',
      'react-native-reanimated': '@lk-stubs/react-native-reanimated',
      'react-native-screens': '@lk-stubs/react-native-screens',
      '@react-navigation/native': '@lk-stubs/react-navigation-native',
      '@react-navigation/bottom-tabs': '@lk-stubs/react-navigation-bottom-tabs',
      '@react-navigation/native-stack': '@lk-stubs/react-navigation-native-stack',
      'react-native-safe-area-context': '@lk-stubs/react-native-safe-area-context',
    },
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
  },
};

export default withMDX(config);
