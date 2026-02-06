import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const REGISTRY_URL = 'https://raw.githubusercontent.com/yourusername/lunar-kit/main/packages/core/src/registry';

// Path untuk registry yang ter-bundle di npm package
export const LOCAL_REGISTRY_PATH = path.join(__dirname, '..', 'src', 'registry');
export const LOCAL_COMPONENTS_PATH = path.join(__dirname, '..', 'src', 'components');
export const LOCAL_SOURCE_PATH = path.join(__dirname, '..', 'src');

// Export registry utilities
// export * from './registry';
// export * from './components';
