export async function register() {
  // Define __DEV__ global for React Native packages
  if (typeof globalThis !== "undefined") {
    (globalThis as Record<string, unknown>).__DEV__ =
      process.env.NODE_ENV !== "production";
  }
}
