/**
 * Module TypeScript Types Template
 * 
 * Usage: lunar g mod:type auth/user
 * Generates: modules/auth/types/user.ts
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface ModuleTypeTemplateOptions {
  typeName: string;
  moduleName: string;
}

export function generateModuleTypeTemplate(options: ModuleTypeTemplateOptions): string {
  const { typeName } = options;
  const interfaceName = toPascalCase(typeName);
  const snakeName = toSnakeCase(typeName);

  return `/**
 * ${interfaceName} Type Definitions
 * 
 * TypeScript interfaces and types for ${typeName}
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

export interface ${interfaceName}CreateRequest {
  // Add required fields for creation
  name: string;
  description?: string;
}

export interface ${interfaceName}UpdateRequest {
  // Add fields that can be updated
  name?: string;
  description?: string;
}

// ============================================
// Response Types
// ============================================

export interface ${interfaceName}Response {
  data: ${interfaceName};
  message?: string;
  success: boolean;
}

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

export interface ${interfaceName}ListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
`;
}

export default generateModuleTypeTemplate;
