/**
 * Template Exports
 * 
 * All templates for Lunar Kit CLI generators
 */

// Scaffolding Templates
export { generateModuleApiTemplate } from './scaffolding/module-api';
export type { ModuleApiTemplateOptions } from './scaffolding/module-api';

export { generateModuleTypeTemplate } from './scaffolding/module-type';
export type { ModuleTypeTemplateOptions } from './scaffolding/module-type';

export { generateModuleTestTemplate } from './scaffolding/module-test';
export type { ModuleTestTemplateOptions } from './scaffolding/module-test';

export { generateServiceTemplate } from './scaffolding/service';
export type { ServiceTemplateOptions } from './scaffolding/service';

export { generateTypeTemplate } from './scaffolding/type';
export type { TypeTemplateOptions } from './scaffolding/type';

export { generateConfigTemplate } from './scaffolding/config';
export type { ConfigTemplateOptions } from './scaffolding/config';

// Navigation Templates
export { generateStackNavigatorTemplate } from './navigation/stack-navigator';
export type { StackNavigatorTemplateOptions } from './navigation/stack-navigator';

export { generateTabNavigatorTemplate } from './navigation/tab-navigator';
export type { TabNavigatorTemplateOptions } from './navigation/tab-navigator';

export { generateDrawerNavigatorTemplate } from './navigation/drawer-navigator';
export type { DrawerNavigatorTemplateOptions } from './navigation/drawer-navigator';

// Testing Templates
export { generateTestSetupTemplate } from './testing/test-setup';
export { generateTestUtilsTemplate } from './testing/test-utils';
export { generateMocksTemplate } from './testing/mocks';

// String Utilities
export {
  toSnakeCase,
  toPascalCase,
  toCamelCase,
  toKebabCase,
} from '../lib/string-utils';
