// import fs from 'fs-extra';
// import path from 'path';
// import chalk from 'chalk';
// import ora from 'ora';
// // import prompts from 'prompts';
// import { loadConfig, toSnakeCase, toPascalCase, toCamelCase } from '../utils/helpers.js';
// import { updateBarrelExport } from '../utils/barrel.js';
// import { addToRouting } from '../utils/routing.js';

// // Generate module-scoped view
// export async function generateModuleView(modulePath: string, viewName: string) {
//   const spinner = ora('Generating module view...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
//     if (!fs.existsSync(moduleFullPath)) {
//       spinner.fail(`Module ${modulePath} does not exist. Create it first with: lk g mod ${modulePath}`);
//       return;
//     }

//     const viewDir = path.join(moduleFullPath, 'view');
//     await fs.ensureDir(viewDir);

//     const createViewName = toSnakeCase(viewName);
//     // /splash-6-view_view.tsx ini masih kelolosan
//     // intinya pastikan kalau user create dengan view, maka akan di remove "_view" dan ditambahkan, meminimalisir duplikasi _view_view
//     const existingViewSuffix = ['_view', 'View', '-view'].find(suffix => createViewName.endsWith(suffix));
//     const finalViewName = existingViewSuffix
//       ? createViewName.slice(0, -existingViewSuffix.length)
//       : createViewName;

//     const fileName = `${toSnakeCase(finalViewName)}_view.tsx`;
//     const componentName = toPascalCase(`${finalViewName}_view`);
    
//     const viewContent = `import React from 'react';
// import { View, Text } from 'react-native';

// export default function ${componentName}View() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-2xl font-bold">${componentName}</Text>
//     </View>
//   );
// }
// `;

//     const filePath = path.join(viewDir, fileName);
//     await fs.writeFile(filePath, viewContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(moduleFullPath, 'index.ts'),
//       `export { default as ${componentName}View } from './view/${toSnakeCase(finalViewName)}';`
//     );

//     // Add to routing
//     await addToRouting(config, `${modulePath}/${finalViewName}`, fileName, 'view');

//     spinner.succeed(chalk.green(`View ${viewName} created in module ${modulePath}`));
//     console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/view/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate module view');
//     console.error(error);
//   }
// }

// // Generate module-scoped component
// export async function generateModuleComponent(modulePath: string, componentName: string) {
//   const spinner = ora('Generating module component...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
//     if (!fs.existsSync(moduleFullPath)) {
//       spinner.fail(`Module ${modulePath} does not exist.`);
//       return;
//     }

//     const componentDir = path.join(moduleFullPath, 'components');
//     await fs.ensureDir(componentDir);

//     const fileName = `${toSnakeCase(componentName)}.tsx`;
//     const exportName = toPascalCase(componentName);
    
//     const componentContent = `import React from 'react';
// import { View, Text } from 'react-native';

// interface ${exportName}Props {
//   // Add props here
// }

// export function ${exportName}({}: ${exportName}Props) {
//   return (
//     <View className="p-4">
//       <Text className="text-lg font-semibold">${exportName}</Text>
//     </View>
//   );
// }
// `;

//     const filePath = path.join(componentDir, fileName);
//     await fs.writeFile(filePath, componentContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(moduleFullPath, 'index.ts'),
//       `export { ${exportName} } from './components/${toSnakeCase(componentName)}';`
//     );

//     spinner.succeed(chalk.green(`Component ${componentName} created in module ${modulePath}`));
//     console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/components/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate module component');
//     console.error(error);
//   }
// }

// // Generate module-scoped store
// export async function generateModuleStore(modulePath: string, storeName: string) {
//   const spinner = ora('Generating module store...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
//     if (!fs.existsSync(moduleFullPath)) {
//       spinner.fail(`Module ${modulePath} does not exist.`);
//       return;
//     }

//     const storeDir = path.join(moduleFullPath, 'store');
//     await fs.ensureDir(storeDir);

//     const fileName = `${toSnakeCase(storeName)}.ts`;
//     const hookName = `use${toPascalCase(storeName)}Store`;
    
//     const storeContent = `import { create } from 'zustand';

// interface ${toPascalCase(storeName)}State {
//   // Add state here
//   count: number;
//   increment: () => void;
//   decrement: () => void;
// }

// export const ${hookName} = create<${toPascalCase(storeName)}State>((set) => ({
//   count: 0,
//   increment: () => set((state) => ({ count: state.count + 1 })),
//   decrement: () => set((state) => ({ count: state.count - 1 })),
// }));
// `;

//     const filePath = path.join(storeDir, fileName);
//     await fs.writeFile(filePath, storeContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(moduleFullPath, 'index.ts'),
//       `export { ${hookName} } from './store/${toSnakeCase(storeName)}';`
//     );

//     spinner.succeed(chalk.green(`Store ${storeName} created in module ${modulePath}`));
//     console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/store/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate module store');
//     console.error(error);
//   }
// }

// // Generate module-scoped hook
// export async function generateModuleHook(modulePath: string, hookName: string) {
//   const spinner = ora('Generating module hook...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
//     if (!fs.existsSync(moduleFullPath)) {
//       spinner.fail(`Module ${modulePath} does not exist.`);
//       return;
//     }

//     const hookDir = path.join(moduleFullPath, 'hooks');
//     await fs.ensureDir(hookDir);

//     const fileName = toCamelCase(hookName.startsWith('use') ? hookName : `use${toPascalCase(hookName)}`) + '.ts';
//     const exportName = toCamelCase(fileName.replace('.ts', ''));
    
//     const hookContent = `import { useState, useEffect } from 'react';

// export function ${exportName}() {
//   const [value, setValue] = useState(null);

//   useEffect(() => {
//     // Add side effects here
//   }, []);

//   return { value, setValue };
// }
// `;

//     const filePath = path.join(hookDir, fileName);
//     await fs.writeFile(filePath, hookContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(moduleFullPath, 'index.ts'),
//       `export { ${exportName} } from './hooks/${fileName.replace('.ts', '')}';`
//     );

//     spinner.succeed(chalk.green(`Hook ${hookName} created in module ${modulePath}`));
//     console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/hooks/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate module hook');
//     console.error(error);
//   }
// }


import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, toSnakeCase, toPascalCase, toCamelCase } from '../utils/helpers.js';
import { updateBarrelExport } from '../utils/barrel.js';
import { addToRouting } from '../utils/routing.js';

// DONE: Generate module-scoped view - changed to single path argument
export async function generateModuleView(fullPath: string) {
  const spinner = ora('Generating module view...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Parse path: welcome/splash → modulePath: welcome, viewName: splash
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/view-name (e.g., welcome/splash)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/'); // welcome or auth/social
    const viewName = parts[parts.length - 1]; // splash

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist. Create it first with: lunar g mod ${modulePath}`);
      return;
    }

    const viewDir = path.join(moduleFullPath, 'view');
    await fs.ensureDir(viewDir);

    const createViewName = toSnakeCase(viewName);
    const existingViewSuffix = ['_view', 'View', '-view'].find(suffix => createViewName.endsWith(suffix));
    const finalViewName = existingViewSuffix
      ? createViewName.slice(0, -existingViewSuffix.length)
      : createViewName;

    const fileName = `${toSnakeCase(finalViewName)}_view.tsx`;
    const componentName = toPascalCase(`${finalViewName}_view`);
    
    const viewContent = `import { View, Text } from 'react-native';

export default function ${componentName}() {
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
      `export { default as ${componentName} } from './view/${toSnakeCase(finalViewName)}_view';`
    );

    // Add to routing
    await addToRouting(config, `${modulePath}/${finalViewName}`, `${toSnakeCase(finalViewName)}_view`, 'view');

    spinner.succeed(chalk.green(`View ${viewName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/view/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate module view');
    console.error(error);
  }
}

// DONE: Generate module-scoped component - changed to single path argument
export async function generateModuleComponent(fullPath: string) {
  const spinner = ora('Generating module component...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Parse path: auth/login-button → modulePath: auth, componentName: login-button
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/component-name (e.g., auth/login-button)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const componentName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const componentDir = path.join(moduleFullPath, 'components');
    await fs.ensureDir(componentDir);

    const fileName = `${toSnakeCase(componentName)}.tsx`;
    const exportName = toPascalCase(componentName);
    
    const componentContent = `import { View, Text } from 'react-native';

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

// DONE: Generate module-scoped store - changed to single path argument
export async function generateModuleStore(fullPath: string) {
  const spinner = ora('Generating module store...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Parse path: auth/auth-store → modulePath: auth, storeName: auth-store
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/store-name (e.g., auth/auth-store)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const storeName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const storeDir = path.join(moduleFullPath, 'store');
    await fs.ensureDir(storeDir);

    const fileName = `${toSnakeCase(storeName)}.ts`;
    const hookName = `use${toPascalCase(storeName)}`;
    
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

// DONE: Generate module-scoped hook - changed to single path argument
export async function generateModuleHook(fullPath: string) {
  const spinner = ora('Generating module hook...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Parse path: auth/use-auth → modulePath: auth, hookName: use-auth
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/hook-name (e.g., auth/use-auth)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const hookName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const hookDir = path.join(moduleFullPath, 'hooks');
    await fs.ensureDir(hookDir);

    const fileName = toCamelCase(hookName.startsWith('use') ? hookName : `use-${hookName}`) + '.ts';
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