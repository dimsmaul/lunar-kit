/**
 * Global Config Template
 * 
 * Usage: lunar g config app
 * Generates: src/config/app.ts
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface ConfigTemplateOptions {
  configName: string;
}

export function generateConfigTemplate(options: ConfigTemplateOptions): string {
  const { configName } = options;
  const configNamePascal = toPascalCase(configName);
  const configNameCamel = toPascalCase(configName);
  const configNameLowerFirst = configNameCamel.charAt(0).toLowerCase() + configNameCamel.slice(1);

  return `/**
 * ${configNamePascal} Configuration
 * 
 * Centralized configuration management for ${configName}
 */

// ============================================
// Configuration Interface
// ============================================

export interface ${configNamePascal}Config {
  /**
   * Enable or disable the feature
   */
  enabled: boolean;

  /**
   * API endpoint (optional)
   */
  apiUrl?: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Number of retries for failed requests
   */
  retries?: number;

  /**
   * Debug mode
   */
  debug?: boolean;
}

// ============================================
// Default Configuration
// ============================================

export const ${configNameLowerFirst}Config: ${configNamePascal}Config = {
  enabled: true,
  apiUrl: process.env.EXPO_PUBLIC_${configName.toUpperCase()}_API_URL,
  timeout: 30000,
  retries: 3,
  debug: __DEV__,
};

// ============================================
// Configuration Helpers
// ============================================

/**
 * Get configuration with optional overrides
 */
export function get${configNamePascal}Config(
  overrides?: Partial<${configNamePascal}Config>
): ${configNamePascal}Config {
  return {
    ...${configNameLowerFirst}Config,
    ...overrides,
  };
}

/**
 * Initialize configuration with custom values
 * Call this during app initialization
 */
export function init${configNamePascal}Config(
  config?: Partial<${configNamePascal}Config>
): void {
  if (config) {
    Object.assign(${configNameLowerFirst}Config, config);
  }

  // Validate required configuration
  if (${configNameLowerFirst}Config.enabled && !${configNameLowerFirst}Config.apiUrl) {
    console.warn('[${configNamePascal}Config] API URL is not configured');
  }

  if (__DEV__) {
    console.log('[${configNamePascal}Config] Initialized:', ${configNameLowerFirst}Config);
  }
}
`;
}

export default generateConfigTemplate;
