/**
 * Templates Entry Point
 * 
 * Pure template generators for CLI - no React Native dependencies
 */

// String Utilities
export {
  toSnakeCase,
  toPascalCase,
  toCamelCase,
  toKebabCase,
} from './lib/string-utils';

// Scaffolding Templates
export { generateModuleApiTemplate } from './templates/scaffolding/module-api';
export type { ModuleApiTemplateOptions } from './templates/scaffolding/module-api';

export { generateModuleTypeTemplate } from './templates/scaffolding/module-type';
export type { ModuleTypeTemplateOptions } from './templates/scaffolding/module-type';

export { generateModuleTestTemplate } from './templates/scaffolding/module-test';
export type { ModuleTestTemplateOptions } from './templates/scaffolding/module-test';

export { generateServiceTemplate } from './templates/scaffolding/service';
export type { ServiceTemplateOptions } from './templates/scaffolding/service';

export { generateTypeTemplate } from './templates/scaffolding/type';
export type { TypeTemplateOptions } from './templates/scaffolding/type';

export { generateConfigTemplate } from './templates/scaffolding/config';
export type { ConfigTemplateOptions } from './templates/scaffolding/config';

// Navigation Templates
export { generateStackNavigatorTemplate } from './templates/navigation/stack-navigator';
export type { StackNavigatorTemplateOptions } from './templates/navigation/stack-navigator';

export { generateTabNavigatorTemplate } from './templates/navigation/tab-navigator';
export type { TabNavigatorTemplateOptions } from './templates/navigation/tab-navigator';

export { generateDrawerNavigatorTemplate } from './templates/navigation/drawer-navigator';
export type { DrawerNavigatorTemplateOptions } from './templates/navigation/drawer-navigator';

// Testing Templates
export { generateTestSetupTemplate } from './templates/testing/test-setup';
export { generateTestUtilsTemplate } from './templates/testing/test-utils';
export { generateMocksTemplate } from './templates/testing/mocks';
