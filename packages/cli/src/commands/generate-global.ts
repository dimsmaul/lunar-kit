import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, toSnakeCase, toPascalCase, toCamelCase } from '../utils/helpers.js';
import { updateBarrelExport } from '../utils/barrel.js';

// Generate global hook
export async function generateGlobalHook(hookName: string) {
  const spinner = ora('Generating global hook...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Ensure hooks directory exists
    const hooksDir = path.join(process.cwd(), config.hooksDir);
    await fs.ensureDir(hooksDir);

    const fileName = toCamelCase(hookName.startsWith('use') ? hookName : `use${toPascalCase(hookName)}`) + '.ts';
    const exportName = fileName.replace('.ts', '');
    
    const hookContent = `import { useState, useEffect } from 'react';

export function ${exportName}() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Add side effects here
  }, []);

  return { value, setValue };
}
`;

    const filePath = path.join(hooksDir, fileName);
    await fs.writeFile(filePath, hookContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(hooksDir, 'index.ts'),
      `export { ${exportName} } from './${fileName.replace('.ts', '')}';`
    );

    spinner.succeed(chalk.green(`Hook ${hookName} created`));
    console.log(chalk.cyan(`  ${config.hooksDir}/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate hook');
    console.error(error);
  }
}

// Generate global store
export async function generateGlobalStore(storeName: string) {
  const spinner = ora('Generating global store...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Ensure stores directory exists
    const storesDir = path.join(process.cwd(), config.storesDir);
    await fs.ensureDir(storesDir);

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

    const filePath = path.join(storesDir, fileName);
    await fs.writeFile(filePath, storeContent);

    // Update barrel export
    await updateBarrelExport(
      path.join(storesDir, 'index.ts'),
      `export { ${hookName} } from './${fileName.replace('.ts', '')}';`
    );

    spinner.succeed(chalk.green(`Store ${storeName} created`));
    console.log(chalk.cyan(`  ${config.storesDir}/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate store');
    console.error(error);
  }
}

// Generate global component  
export async function generateGlobalComponent(componentName: string) {
  const spinner = ora('Generating global component...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // DONE: Ensure components directory exists
    const componentsBaseDir = path.join(process.cwd(), config.componentsDir);
    await fs.ensureDir(componentsBaseDir);

    const componentDir = path.join(componentsBaseDir, toSnakeCase(componentName));
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
      path.join(componentsBaseDir, 'index.ts'),
      `export { ${exportName} } from './${toSnakeCase(componentName)}/${toSnakeCase(componentName)}';`
    );

    spinner.succeed(chalk.green(`Component ${componentName} created`));
    console.log(chalk.cyan(`  ${config.componentsDir}/${toSnakeCase(componentName)}/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate component');
    console.error(error);
  }
}


// Generate global component
// export async function generateGlobalComponent(componentName: string) {
//   const spinner = ora('Generating global component...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const componentDir = path.join(process.cwd(), config.componentsDir, toSnakeCase(componentName));
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
//       path.join(process.cwd(), config.componentsDir, 'index.ts'),
//       `export { ${exportName} } from './${toSnakeCase(componentName)}/${toSnakeCase(componentName)}';`
//     );

//     spinner.succeed(chalk.green(`Component ${componentName} created`));
//     console.log(chalk.cyan(`  ${config.componentsDir}/${toSnakeCase(componentName)}/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate component');
//     console.error(error);
//   }
// }

// // Generate global hook
// export async function generateGlobalHook(hookName: string) {
//   const spinner = ora('Generating global hook...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

//     const fileName = toCamelCase(hookName.startsWith('use') ? hookName : `use${toPascalCase(hookName)}`) + '.ts';
//     const exportName = fileName.replace('.ts', '');
    
//     const hookContent = `import { useState, useEffect } from 'react';

// export function ${exportName}() {
//   const [value, setValue] = useState(null);

//   useEffect(() => {
//     // Add side effects here
//   }, []);

//   return { value, setValue };
// }
// `;

//     const filePath = path.join(process.cwd(), config.hooksDir, fileName);
//     await fs.writeFile(filePath, hookContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(process.cwd(), config.hooksDir, 'index.ts'),
//       `export { ${exportName} } from './${fileName.replace('.ts', '')}';`
//     );

//     spinner.succeed(chalk.green(`Hook ${hookName} created`));
//     console.log(chalk.cyan(`  ${config.hooksDir}/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate hook');
//     console.error(error);
//   }
// }

// // Generate global store
// export async function generateGlobalStore(storeName: string) {
//   const spinner = ora('Generating global store...').start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found.');
//       return;
//     }

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

//     const filePath = path.join(process.cwd(), config.storesDir, fileName);
//     await fs.writeFile(filePath, storeContent);

//     // Update barrel export
//     await updateBarrelExport(
//       path.join(process.cwd(), config.storesDir, 'index.ts'),
//       `export { ${hookName} } from './${fileName.replace('.ts', '')}';`
//     );

//     spinner.succeed(chalk.green(`Store ${storeName} created`));
//     console.log(chalk.cyan(`  ${config.storesDir}/${fileName}`));

//   } catch (error) {
//     spinner.fail('Failed to generate store');
//     console.error(error);
//   }
// }
