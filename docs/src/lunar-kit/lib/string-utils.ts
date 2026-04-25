/**
 * String Utility Functions
 * 
 * Shared string manipulation utilities for templates and generators
 */

/**
 * Convert string to snake_case
 * Example: "loginButton" → "login_button"
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Convert string to PascalCase
 * Example: "login-button" → "LoginButton"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Convert string to camelCase
 * Example: "login-button" → "loginButton"
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to kebab-case
 * Example: "loginButton" → "login-button"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}
