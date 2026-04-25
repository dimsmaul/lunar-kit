export {};

const noop = () => {};
export const TurboModuleRegistry = { get: () => null, enrich: () => ({}) };
export const requireNativeComponent = () => noop;
export const unstable_batchedUpdates = noop;