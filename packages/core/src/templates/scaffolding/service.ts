/**
 * Global Service Template
 * 
 * Usage: lunar g service auth
 * Generates: src/services/auth.ts
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface ServiceTemplateOptions {
  serviceName: string;
}

export function generateServiceTemplate(options: ServiceTemplateOptions): string {
  const { serviceName } = options;
  const serviceNamePascal = toPascalCase(serviceName);
  const serviceNameCamel = toPascalCase(serviceName);
  const serviceNameLowerFirst = serviceNameCamel.charAt(0).toLowerCase() + serviceNameCamel.slice(1);
  const snakeName = toSnakeCase(serviceName);

  return `/**
 * ${serviceNamePascal}Service
 * 
 * Handles all API calls and business logic for ${serviceName}
 */

import { api } from '@/lib/api';
import type { AxiosResponse } from 'axios';

// ============================================
// Type Definitions
// ============================================

export interface ${serviceNamePascal}Item {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add more fields here
}

export interface ${serviceNamePascal}CreateRequest {
  // Add required fields
  name: string;
}

export interface ${serviceNamePascal}UpdateRequest {
  // Add updatable fields
  name?: string;
}

// ============================================
// Service Class
// ============================================

class ${serviceNamePascal}Service {
  private basePath = '/${snakeName}';

  /**
   * Get all items
   */
  async getAll(params?: Record<string, any>): Promise<${serviceNamePascal}Item[]> {
    const response = await api.get(this.basePath, { params });
    return response.data.data;
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<${serviceNamePascal}Item> {
    const response = await api.get(\`\${this.basePath}/\${id}\`);
    return response.data.data;
  }

  /**
   * Create new item
   */
  async create(data: ${serviceNamePascal}CreateRequest): Promise<${serviceNamePascal}Item> {
    const response = await api.post(this.basePath, data);
    return response.data.data;
  }

  /**
   * Update item
   */
  async update(id: string, data: ${serviceNamePascal}UpdateRequest): Promise<${serviceNamePascal}Item> {
    const response = await api.put(\`\${this.basePath}/\${id}\`, data);
    return response.data.data;
  }

  /**
   * Delete item
   */
  async delete(id: string): Promise<void> {
    await api.delete(\`\${this.basePath}/\${id}\`);
  }
}

// ============================================
// Export Singleton Instance
// ============================================

export const ${serviceNameLowerFirst}Service = new ${serviceNamePascal}Service();
`;
}

export default generateServiceTemplate;
