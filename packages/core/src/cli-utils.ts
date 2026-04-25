/**
 * CLI Utilities
 *
 * Path helpers and utilities for CLI - no React Native dependencies
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

let _dirname: string | null = null;

const getDirname = () => {
  if (_dirname !== null) return _dirname;

  try {
    // ESM: derive __dirname from import.meta.url
    const moduleUrl = import.meta.url;
    _dirname = dirname(fileURLToPath(moduleUrl));
  } catch {
    // Fallback if import.meta.url unavailable
    _dirname = '';
  }

  return _dirname;
};

// Lazy-evaluated path functions
const getLocalRegistryPath = () => {
  const __dirname = getDirname();
  if (!__dirname) return '';

  try {
    // Try bundled registry in same dir (installed package: dist/registry)
    const bundledPath = join(__dirname, 'registry');
    if (existsSync(bundledPath)) return bundledPath;

    // Try dev mode: dist/../src/registry
    const devPath = join(__dirname, '..', 'src', 'registry');
    if (existsSync(devPath)) return devPath;
  } catch {}

  // Return empty if none found - remote registry fallback
  return '';
};

const getLocalComponentsPath = () => {
  const __dirname = getDirname();
  return __dirname ? join(__dirname, '..', 'src', 'components') : '';
};

const getLocalSourcePath = () => {
  const __dirname = getDirname();
  return __dirname ? join(__dirname, '..', 'src') : '';
};

const getLocalTemplatesPath = () => {
  const __dirname = getDirname();
  return __dirname ? join(__dirname, '..', 'src', 'templates') : '';
};

// Path constants - lazily evaluated
export const LOCAL_REGISTRY_PATH = getLocalRegistryPath();
export const LOCAL_COMPONENTS_PATH = getLocalComponentsPath();
export const LOCAL_SOURCE_PATH = getLocalSourcePath();
export const LOCAL_TEMPLATES_PATH = getLocalTemplatesPath();
