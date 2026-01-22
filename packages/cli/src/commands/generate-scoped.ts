import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig, toSnakeCase, toPascalCase, toCamelCase } from '../utils/helpers.js';
import { updateBarrelExport } from '../utils/barrel.js';
import { addToRouting } from '../utils/routing.js';

// Generate module-scoped view
export async function generateModuleView(modulePath: string, viewName: string) {
  const spinner = ora('Generating module view...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist. Create it first with: lk g mod ${modulePath}`);
      return;
    }

    const viewDir = path.join(moduleFullPath, 'view');
    await fs.ensureDir(viewDir);

    const fileName = `${toSnakeCase(viewName)}.tsx`;
    const componentName = toPascalCase(viewName);
    
    const viewContent = `import React from 'react';
import { View, Text } from 'react-native';

export default function ${componentName}View() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">${componentName}</Text>
    </View>
  );
}
`;

    const filePath = path.join(viewDir, fileName);
    await fs.writeFile(filePath, viewContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export { default as ${componentName}View } from './view/${toSnakeCase(viewName)}';`
    );

    // Add to routing
    await addToRouting(config, `${modulePath}/${viewName}`, fileName);

    spinner.succeed(chalk.green(`View ${viewName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/view/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate module view');
    console.error(error);
  }
}

// Generate module-scoped component
export async function generateModuleComponent(modulePath: string, componentName: string) {
  const spinner = ora('Generating module component...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const componentDir = path.join(moduleFullPath, 'components');
    await fs.ensureDir(componentDir);

    const fileName = `${toSnakeCase(componentName)}.tsx`;
    const exportName = toPascalCase(componentName);
    
    const componentContent = `import React from 'react';
import { View, Text } from 'react-native';

interface ${exportName}Props {
  // Add props here
}

export function ${exportName}({}: ${exportName}Props) {
  return (
    <View className="p-4">
      <Text className="text-lg font-semibold">${exportName}</Text>
    </View>
  );
}
`;

    const filePath = path.join(componentDir, fileName);
    await fs.writeFile(filePath, componentContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export { ${exportName} } from './components/${toSnakeCase(componentName)}';`
    );

    spinner.succeed(chalk.green(`Component ${componentName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/components/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate module component');
    console.error(error);
  }
}

// Generate module-scoped store
export async function generateModuleStore(modulePath: string, storeName: string) {
  const spinner = ora('Generating module store...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const storeDir = path.join(moduleFullPath, 'store');
    await fs.ensureDir(storeDir);

    const fileName = `${toSnakeCase(storeName)}.ts`;
    const hookName = `use${toPascalCase(storeName)}Store`;
    
    const storeContent = `import { create } from 'zustand';

interface ${toPascalCase(storeName)}State {
  // Add state here
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const ${hookName} = create<${toPascalCase(storeName)}State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
`;

    const filePath = path.join(storeDir, fileName);
    await fs.writeFile(filePath, storeContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export { ${hookName} } from './store/${toSnakeCase(storeName)}';`
    );

    spinner.succeed(chalk.green(`Store ${storeName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/store/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate module store');
    console.error(error);
  }
}

// Generate module-scoped hook
export async function generateModuleHook(modulePath: string, hookName: string) {
  const spinner = ora('Generating module hook...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const hookDir = path.join(moduleFullPath, 'hooks');
    await fs.ensureDir(hookDir);

    const fileName = toCamelCase(hookName.startsWith('use') ? hookName : `use${toPascalCase(hookName)}`) + '.ts';
    const exportName = toCamelCase(fileName.replace('.ts', ''));
    
    const hookContent = `import { useState, useEffect } from 'react';

export function ${exportName}() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Add side effects here
  }, []);

  return { value, setValue };
}
`;

    const filePath = path.join(hookDir, fileName);
    await fs.writeFile(filePath, hookContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(moduleFullPath, 'index.ts'),
      `export { ${exportName} } from './hooks/${fileName.replace('.ts', '')}';`
    );

    spinner.succeed(chalk.green(`Hook ${hookName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/hooks/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate module hook');
    console.error(error);
  }
}
