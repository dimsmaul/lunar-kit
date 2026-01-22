import fs from 'fs-extra';
import path from 'path';

export async function loadConfig() {
  const configPath = path.join(process.cwd(), 'kit.config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return await fs.readJson(configPath);
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

export function toPascalCase(str: string): string {
  return str
    .replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
