/**
 * Module API Template
 * 
 * Usage: lunar g mod:api auth/auth-api
 * Generates: modules/auth/api/auth-api.ts
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface ModuleApiTemplateOptions {
  apiName: string;
  moduleName: string;
}

export function generateModuleApiTemplate(options: ModuleApiTemplateOptions): string {
  const { apiName, moduleName } = options;
  const exportName = toPascalCase(`${apiName}Api`);
  const snakeName = toSnakeCase(apiName);

  return `/**
 * ${toPascalCase(moduleName)} API Layer
 * 
 * Handles all API calls for ${moduleName} module
 */

import { api } from '@/lib/api';
import type { AxiosResponse } from 'axios';

// ============================================
// Type Definitions
// ============================================

export interface ${toPascalCase(apiName)}Response {
  data: any;
  message?: string;
  success: boolean;
}

// ============================================
// API Endpoints
// ============================================

export const ${exportName} = {
  /**
   * GET - Fetch item by ID
   */
  getById: async (id: string): Promise<${toPascalCase(apiName)}Response> => {
    const response = await api.get(\`/${snakeName}/\${id}\`);
    return response.data;
  },

  /**
   * GET - Fetch all items
   */
  getAll: async (params?: Record<string, any>): Promise<${toPascalCase(apiName)}Response> => {
    const response = await api.get('/${snakeName}', { params });
    return response.data;
  },

  /**
   * POST - Create new item
   */
  create: async (data: any): Promise<${toPascalCase(apiName)}Response> => {
    const response = await api.post('/${snakeName}', data);
    return response.data;
  },

  /**
   * PUT - Update item
   */
  update: async (id: string, data: any): Promise<${toPascalCase(apiName)}Response> => {
    const response = await api.put(\`/${snakeName}/\${id}\`, data);
    return response.data;
  },

  /**
   * DELETE - Remove item
   */
  delete: async (id: string): Promise<${toPascalCase(apiName)}Response> => {
    const response = await api.delete(\`/${snakeName}/\${id}\`);
    return response.data;
  },
};
`;
}

export default generateModuleApiTemplate;
