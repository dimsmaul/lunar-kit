// Polyfill for React Native globals required by react-native-web and related packages
// This must be imported before any React Native packages

(globalThis as unknown as { __DEV__: boolean }).__DEV__ =
  process.env.NODE_ENV !== "production";

export {};
