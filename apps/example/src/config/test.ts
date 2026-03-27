/**
 * Test Configuration
 * 
 * Centralized configuration management for test
 */

// ============================================
// Configuration Interface
// ============================================

export interface TestConfig {
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

export const testConfig: TestConfig = {
  enabled: true,
  apiUrl: process.env.EXPO_PUBLIC_TEST_API_URL,
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
export function getTestConfig(
  overrides?: Partial<TestConfig>
): TestConfig {
  return {
    ...testConfig,
    ...overrides,
  };
}

/**
 * Initialize configuration with custom values
 * Call this during app initialization
 */
export function initTestConfig(
  config?: Partial<TestConfig>
): void {
  if (config) {
    Object.assign(testConfig, config);
  }

  // Validate required configuration
  if (testConfig.enabled && !testConfig.apiUrl) {
    console.warn('[TestConfig] API URL is not configured');
  }

  if (__DEV__) {
    console.log('[TestConfig] Initialized:', testConfig);
  }
}
