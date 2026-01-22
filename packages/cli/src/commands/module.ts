import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig, toSnakeCase, toPascalCase, toCamelCase } from '../utils/helpers.js';
import { addToRouting } from '../utils/routing.js';

interface ModuleOptions {
  modulePath: string;
  isTabs?: boolean;
}

export async function generateModule(modulePath: string) {
  const spinner = ora('Generating module...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    const fullPath = path.join(process.cwd(), config.modulesDir, modulePath);
    
    // Check if module exists
    if (fs.existsSync(fullPath)) {
      spinner.fail(`Module ${modulePath} already exists`);
      return;
    }

    // Create module structure
    const moduleName = path.basename(modulePath);
    const dirs = ['view', 'components', 'hooks', 'store'];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(fullPath, dir));
    }

    // Generate default view
    const viewName = `${toSnakeCase(moduleName)}_view`;
    const viewContent = generateViewTemplate(toPascalCase(moduleName));
    await fs.writeFile(path.join(fullPath, 'view', `${viewName}.tsx`), viewContent);

    // Create barrel export
    const barrelContent = `// Auto-generated exports for ${moduleName} module
export { default as ${toPascalCase(moduleName)}View } from './view/${viewName}';
`;
    await fs.writeFile(path.join(fullPath, 'index.ts'), barrelContent);

    // Add to routing
    await addToRouting(config, modulePath, viewName);

    spinner.succeed(chalk.green(`Module ${modulePath} created successfully!`));
    
    console.log(chalk.dim('\nGenerated:'));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/view/${viewName}.tsx`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/index.ts`));

  } catch (error) {
    spinner.fail('Failed to generate module');
    console.error(error);
  }
}

export async function generateTabs(moduleName: string) {
  const spinner = ora('Generating tabs module...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    spinner.stop();

    const response = await prompts([
      {
        type: 'confirm',
        name: 'generateTabs',
        message: 'Do you want to generate initial tabs?',
        initial: true,
      },
      {
        type: (prev) => (prev ? 'number' : null),
        name: 'tabCount',
        message: 'How many tabs?',
        initial: 3,
        min: 1,
        max: 10,
      },
      {
        type: (prev, values) => (values.generateTabs ? 'list' : null),
        name: 'tabNames',
        message: 'Tab names (comma-separated):',
        initial: 'home,profile,settings',
        separator: ',',
      },
    ]);

    spinner.start('Creating tabs module...');

    const modulePath = path.join(process.cwd(), config.modulesDir, moduleName);
    await fs.ensureDir(path.join(modulePath, 'tabs'));

    // Generate tabs layout
    const layoutContent = generateTabsLayoutTemplate(moduleName, response.tabNames || []);
    await fs.writeFile(path.join(modulePath, 'tabs_layout.tsx'), layoutContent);

    // Generate individual tab modules
    if (response.generateTabs && response.tabNames) {
      for (const tabName of response.tabNames) {
        const tabPath = path.join(modulePath, 'tabs', tabName);
        await generateTabModule(tabPath, tabName, config);
        spinner.text = `Generated tab: ${tabName}`;
      }
    }

    // Create barrel export
    const exports = response.tabNames?.map((tab: string) => 
      `export { default as ${toPascalCase(tab)}Tab } from './tabs/${tab}/view/${toSnakeCase(tab)}_view';`
    ).join('\n') || '';

    const barrelContent = `// Auto-generated exports for ${moduleName} tabs module
export { default as TabsLayout } from './tabs_layout';
${exports}
`;
    await fs.writeFile(path.join(modulePath, 'index.ts'), barrelContent);

    // Add tabs layout to routing
    if (config.navigation === 'expo-router') {
      await createExpoRouterTabsLayout(config, moduleName, response.tabNames || []);
    }

    spinner.succeed(chalk.green(`Tabs module ${moduleName} created successfully!`));

    console.log(chalk.dim('\nGenerated:'));
    console.log(chalk.cyan(`  ${config.modulesDir}/${moduleName}/tabs_layout.tsx`));
    if (response.tabNames) {
      response.tabNames.forEach((tab: string) => {
        console.log(chalk.cyan(`  ${config.modulesDir}/${moduleName}/tabs/${tab}/`));
      });
    }

  } catch (error) {
    spinner.fail('Failed to generate tabs module');
    console.error(error);
  }
}

async function generateTabModule(tabPath: string, tabName: string, config: any) {
  const dirs = ['view', 'components', 'hooks', 'store'];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(tabPath, dir));
  }

  // Generate view
  const viewName = `${toSnakeCase(tabName)}_view`;
  const viewContent = generateViewTemplate(toPascalCase(tabName));
  await fs.writeFile(path.join(tabPath, 'view', `${viewName}.tsx`), viewContent);

  // Create barrel
  const barrelContent = `export { default as ${toPascalCase(tabName)}View } from './view/${viewName}';
`;
  await fs.writeFile(path.join(tabPath, 'index.ts'), barrelContent);
}

function generateViewTemplate(componentName: string): string {
  return `import { View, Text } from 'react-native';

export default function ${componentName}View() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">${componentName}</Text>
    </View>
  );
}
`;
}

function generateTabsLayoutTemplate(moduleName: string, tabs: string[]): string {
  const imports = tabs.map(tab => 
    `import ${toPascalCase(tab)}Tab from './tabs/${tab}/view/${toSnakeCase(tab)}_view';`
  ).join('\n');

  const screens = tabs.map(tab => 
    `      <Tabs.Screen 
        name="${tab}" 
        component={${toPascalCase(tab)}Tab}
        options={{ title: '${toPascalCase(tab)}' }}
      />`
  ).join('\n');

  return `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
${imports}

const Tabs = createBottomTabNavigator();

export default function ${toPascalCase(moduleName)}TabsLayout() {
  return (
    <Tabs.Navigator>
${screens}
    </Tabs.Navigator>
  );
}
`;
}

async function createExpoRouterTabsLayout(config: any, moduleName: string, tabs: string[]) {
  const appDir = path.join(process.cwd(), 'app', `(${moduleName})`);
  await fs.ensureDir(appDir);

  // Create _layout.tsx for tabs
  const layoutContent = `import { Tabs } from 'expo-router';

export default function ${toPascalCase(moduleName)}Layout() {
  return (
    <Tabs>
${tabs.map(tab => `      <Tabs.Screen name="${tab}" options={{ title: '${toPascalCase(tab)}' }} />`).join('\n')}
    </Tabs>
  );
}
`;

  await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);

  // Create individual tab files
  for (const tab of tabs) {
    const tabContent = `import ${toPascalCase(tab)}View from '@modules/${moduleName}/tabs/${tab}/view/${toSnakeCase(tab)}_view';

export default ${toPascalCase(tab)}View;
`;
    await fs.writeFile(path.join(appDir, `${tab}.tsx`), tabContent);
  }
}
