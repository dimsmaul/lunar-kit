/**
 * CLI Utilities
 * 
 * Path helpers and utilities for CLI - no React Native dependencies
 */

const getPath = () => {
  try {
    const path = require('path');
    const getDirname = new Function('return __dirname') as () => string;
    const __dirname = getDirname();

    if (__dirname) {
      return { path, __dirname };
    }
  } catch {
    // React Native or browser - return fallback
  }
  return { path: null, __dirname: '' };
};

let _paths: { path: any; __dirname: string } | null = null;
const getPaths = () => {
  if (!_paths) {
    _paths = getPath();
  }
  return _paths;
};

// Lazy-evaluated path functions
const getLocalRegistryPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'registry') : '';
};

const getLocalComponentsPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'components') : '';
};

const getLocalSourcePath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src') : '';
};

const getLocalTemplatesPath = () => {
  const { path, __dirname } = getPaths();
  return path ? path.join(__dirname, '..', 'src', 'templates') : '';
};

// Path constants - lazily evaluated
export const LOCAL_REGISTRY_PATH = getLocalRegistryPath();
export const LOCAL_COMPONENTS_PATH = getLocalComponentsPath();
export const LOCAL_SOURCE_PATH = getLocalSourcePath();
export const LOCAL_TEMPLATES_PATH = getLocalTemplatesPath();
