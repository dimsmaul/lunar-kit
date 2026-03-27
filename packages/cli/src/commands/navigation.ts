import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig, toPascalCase, toSnakeCase } from '../utils/helpers.js';
import {
  generateStackNavigatorTemplate,
  generateTabNavigatorTemplate,
  generateDrawerNavigatorTemplate,
} from '@lunar-kit/core/templates';

// Generate stack navigator
export async function generateStackNavigator() {
  const spinner = ora('Generating stack navigator...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    spinner.stop();

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of this stack?',
        initial: 'Main',
        validate: (value: string) => value.length > 0 || 'Name is required',
      },
      {
        type: 'list',
        name: 'screens',
        message: 'Enter initial screens (comma-separated):',
        initial: 'Home,Details',
        separator: ',',
      },
    ]);

    if (!response.name) {
      console.log(chalk.yellow('Stack navigator creation cancelled.'));
      return;
    }

    spinner.start('Creating stack navigator...');

    const stackName = toPascalCase(response.name);
    const navigationDir = path.join(process.cwd(), config.srcDir || 'src', 'navigation');
    await fs.ensureDir(navigationDir);

    const fileName = `${toSnakeCase(response.name)}_navigator.tsx`;
    const exportName = `${stackName}Navigator`;

    const navigatorContent = generateStackNavigatorTemplate({
      stackName: response.name,
      screens: response.screens || [],
    });

    const filePath = path.join(navigationDir, fileName);
    await fs.writeFile(filePath, navigatorContent);

    // Update barrel export
    const barrelPath = path.join(navigationDir, 'index.ts');
    let barrelContent = '';
    if (fs.existsSync(barrelPath)) {
      barrelContent = await fs.readFile(barrelPath, 'utf-8');
    }

    if (!barrelContent.includes(exportName)) {
      barrelContent += `export { ${exportName} } from './${toSnakeCase(response.name)}_navigator';\n`;
      await fs.writeFile(barrelPath, barrelContent);
    }

    spinner.succeed(chalk.green(`Stack navigator ${stackName} created`));
    console.log(chalk.cyan(`  ${config.srcDir || 'src'}/navigation/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate stack navigator');
    console.error(error);
  }
}

// Generate tab navigator (extends existing tabs functionality)
export async function generateTabNavigator() {
  const spinner = ora('Generating tab navigator...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    spinner.stop();

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of this tab navigator?',
        initial: 'Main',
        validate: (value: string) => value.length > 0 || 'Name is required',
      },
      {
        type: 'list',
        name: 'tabs',
        message: 'Enter tabs (comma-separated):',
        initial: 'Home,Search,Profile',
        separator: ',',
      },
    ]);

    if (!response.name) {
      console.log(chalk.yellow('Tab navigator creation cancelled.'));
      return;
    }

    spinner.start('Creating tab navigator...');

    const tabName = toPascalCase(response.name);
    const navigationDir = path.join(process.cwd(), config.srcDir || 'src', 'navigation');
    await fs.ensureDir(navigationDir);

    const fileName = `${toSnakeCase(response.name)}_tabs.tsx`;
    const exportName = `${tabName}Tabs`;

    // If using expo-router
    if (config.navigation === 'expo-router') {
      const appDir = path.join(process.cwd(), 'app', `(${toSnakeCase(response.name)})`);
      await fs.ensureDir(appDir);

      // Create _layout.tsx
      const layoutContent = `import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ${tabName}Tabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
      }}
    >
${(response.tabs || []).map((tab: string) => {
  const screenName = toPascalCase(tab);
  return `      <Tabs.Screen
        name="${screenName}"
        options={{
          title: '${screenName}',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="${tab.toLowerCase()}-outline" size={size} color={color} />
          ),
        }}
      />`;
}).join('\n')}
    </Tabs>
  );
}
`;

      await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);

      // Create individual tab screens
      for (const tab of response.tabs || []) {
        const screenName = toPascalCase(tab);
        const tabContent = `export { default } from '@screens/${toSnakeCase(tab)}_screen';`;
        await fs.writeFile(path.join(appDir, `${screenName}.tsx`), tabContent);
      }

      spinner.succeed(chalk.green(`Tab navigator ${tabName} created for expo-router`));
      console.log(chalk.cyan(`  app/(${toSnakeCase(response.name)})/_layout.tsx`));
    } else {
      // React Navigation
      const tabContent = generateTabNavigatorTemplate({
        tabName: response.name,
        tabs: response.tabs || [],
      });

      const filePath = path.join(navigationDir, fileName);
      await fs.writeFile(filePath, tabContent);

      // Update barrel export
      const barrelPath = path.join(navigationDir, 'index.ts');
      let barrelContent = '';
      if (fs.existsSync(barrelPath)) {
        barrelContent = await fs.readFile(barrelPath, 'utf-8');
      }

      if (!barrelContent.includes(exportName)) {
        barrelContent += `export { ${exportName} } from './${toSnakeCase(response.name)}_tabs';\n`;
        await fs.writeFile(barrelPath, barrelContent);
      }

      spinner.succeed(chalk.green(`Tab navigator ${tabName} created`));
      console.log(chalk.cyan(`  ${config.srcDir || 'src'}/navigation/${fileName}`));
    }

  } catch (error) {
    spinner.fail('Failed to generate tab navigator');
    console.error(error);
  }
}

// Generate drawer navigator
export async function generateDrawerNavigator() {
  const spinner = ora('Generating drawer navigator...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    spinner.stop();

    const response = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of this drawer navigator?',
        initial: 'Main',
        validate: (value: string) => value.length > 0 || 'Name is required',
      },
      {
        type: 'list',
        name: 'screens',
        message: 'Enter drawer screens (comma-separated):',
        initial: 'Home,Profile,Settings',
        separator: ',',
      },
    ]);

    if (!response.name) {
      console.log(chalk.yellow('Drawer navigator creation cancelled.'));
      return;
    }

    spinner.start('Creating drawer navigator...');

    const drawerName = toPascalCase(response.name);
    const navigationDir = path.join(process.cwd(), config.srcDir || 'src', 'navigation');
    await fs.ensureDir(navigationDir);

    const fileName = `${toSnakeCase(response.name)}_drawer.tsx`;
    const exportName = `${drawerName}Drawer`;

    const drawerContent = generateDrawerNavigatorTemplate({
      drawerName: response.name,
      screens: response.screens || [],
    });

    const filePath = path.join(navigationDir, fileName);
    await fs.writeFile(filePath, drawerContent);

    // Update barrel export
    const barrelPath = path.join(navigationDir, 'index.ts');
    let barrelContent = '';
    if (fs.existsSync(barrelPath)) {
      barrelContent = await fs.readFile(barrelPath, 'utf-8');
    }

    if (!barrelContent.includes(exportName)) {
      barrelContent += `export { ${exportName} } from './${toSnakeCase(response.name)}_drawer';\n`;
      await fs.writeFile(barrelPath, barrelContent);
    }

    spinner.succeed(chalk.green(`Drawer navigator ${drawerName} created`));
    console.log(chalk.cyan(`  ${config.srcDir || 'src'}/navigation/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate drawer navigator');
    console.error(error);
  }
}
