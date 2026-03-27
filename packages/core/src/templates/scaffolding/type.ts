/**
 * Global Type Template
 * 
 * Usage: lunar g type user
 * Generates: src/types/user.ts
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface TypeTemplateOptions {
  typeName: string;
}

export function generateTypeTemplate(options: TypeTemplateOptions): string {
  const { typeName } = options;
  const interfaceName = toPascalCase(typeName);
  const snakeName = toSnakeCase(typeName);

  return `/**
 * ${interfaceName} Type Definitions
 * 
 * Shared TypeScript interfaces and types for ${typeName}
 */

// ============================================
// Main Interface
// ============================================

export interface ${interfaceName} {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add more fields here
}

// ============================================
// Request Types
// ============================================

/**
 * Request payload for creating ${interfaceName.toLowerCase()}
 */
export interface ${interfaceName}CreateRequest {
  // Add required fields for creation
  name: string;
  description?: string;
}

/**
 * Request payload for updating ${interfaceName.toLowerCase()}
 */
export interface ${interfaceName}UpdateRequest {
  // Add fields that can be updated
  name?: string;
  description?: string;
}

// ============================================
// Response Types
// ============================================

/**
 * API response for single ${interfaceName.toLowerCase()}
 */
export interface ${interfaceName}Response {
  data: ${interfaceName};
  message?: string;
  success: boolean;
}

/**
 * API response for list of ${interfaceName.toLowerCase()}
 */
export interface ${interfaceName}ListResponse {
  data: ${interfaceName}[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Query Parameters
// ============================================

/**
 * Query parameters for listing ${interfaceName.toLowerCase()}
 */
export interface ${interfaceName}ListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
`;
}

export default generateTypeTemplate;
