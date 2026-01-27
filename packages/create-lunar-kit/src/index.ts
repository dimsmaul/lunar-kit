#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderLogo } from './assets/logo';
import { createConfig, createSrcStructure, setupAppEntry, setupAuthSrc, setupDarkModeSrc, setupExpoRouterSrc, setupFormsSrc, setupNativeWind, setupReactNavigationSrc, setupStateSrc, updatePackageJson } from './commands/init';
import { closeInitProject } from './res/close';

const __filename = fileURLToPath(import.meta.url);

const program = new Command();

program
  .name('create-lunar-kit')
  .description('Create a new React Native app with Lunar Kit')
  .argument('[project-name]', 'Name of your project')
  .action(async (projectName?: string) => {
    renderLogo();
    console.log(chalk.bold.cyan('\n🌙 Create Lunar Kit App\n'));

    const response = await prompts([
      {
        type: projectName ? null : 'text',
        name: 'projectName',
        message: 'What is your project named?',
        initial: 'my-lunar-app',
        validate: (value: string) =>
          /^[a-z0-9-]+$/.test(value) || 'Project name must be lowercase and use hyphens',
      },
      {
        type: 'select',
        name: 'navigation',
        message: 'Which navigation library?',
        choices: [
          { title: 'Expo Router (File-based routing)', value: 'expo-router' },
          { title: 'React Navigation (Stack-based)', value: 'react-navigation' },
          { title: 'None (I\'ll add it later)', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          // TODO: need to add these features
          { title: 'Authentication screens', value: 'auth', selected: false },
          // { title: 'Dark mode support', value: 'dark-mode', selected: true },
          { title: 'Form validation (react-hook-form)', value: 'forms', selected: false },
          // { title: 'State management (Zustand)', value: 'state', selected: false },
        ],
      },
      {
        type: 'select',
        name: 'packageManager',
        message: 'Which package manager?',
        choices: [
          { title: 'pnpm', value: 'pnpm' },
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
        ],
        initial: 0,
      },
    ]);

    const name = projectName || response.projectName;
    const { navigation, features, packageManager } = response;

    if (!name) {
      console.log(chalk.red('Project name is required'));
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), name);

    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory ${name} already exists`));
      process.exit(1);
    }

    const spinner = ora('Creating project...').start();

    try {
      // 1. Create Expo app
      spinner.text = 'Creating Expo app...';
      const template = navigation === 'expo-router' ? 'blank-typescript' : 'blank-typescript';
      
      await execa('npx', [
        'create-expo-app@latest',
        name,
        '--template',
        template,
        '--no-install',
      ]);

      // 2. Create src/ structure
      spinner.text = 'Setting up project structure...';
      await createSrcStructure(projectPath, navigation);

      // 3. Move App.tsx to src/ and create new App.tsx as entry
      await setupAppEntry(projectPath, navigation);

      // 4. Setup navigation-specific files
      if (navigation === 'expo-router') {
        spinner.text = 'Setting up Expo Router...';
        await setupExpoRouterSrc(projectPath);
      } else if (navigation === 'react-navigation') {
        spinner.text = 'Setting up React Navigation...';
        await setupReactNavigationSrc(projectPath);
      }

      // 5. Setup features
      if (features.includes('auth')) {
        spinner.text = 'Setting up authentication...';
        await setupAuthSrc(projectPath, navigation);
      }

      // if (features.includes('dark-mode')) {
      //   spinner.text = 'Setting up dark mode...';
      // }
      await setupDarkModeSrc(projectPath, navigation);

      // TODO: enable when dark mode feature is added
      if (features.includes('forms')) {
        spinner.text = 'Setting up forms...';
        await setupFormsSrc(projectPath);
      }

      // TODO: enable when state management feature is added
      // if (features.includes('state')) {
      //   spinner.text = 'Setting up state management...';
        // await setupStateSrc(projectPath);
      // }

      // 6. Setup NativeWind configs
      await setupNativeWind(projectPath);

      // 7. Update package.json
      spinner.text = 'Updating dependencies...';
      await updatePackageJson(projectPath, navigation, features);

      // 8. Create lunar-kit.config.json
      await createConfig(projectPath, navigation, features, packageManager); 

      // 9. Install dependencies
      spinner.text = `Installing dependencies with ${packageManager}...`;
      
      const installCmd = packageManager === 'yarn' ? 'yarn' : packageManager;
      const installArgs = packageManager === 'npm' ? ['install'] : packageManager === 'yarn' ? [] : ['install'];
      
      await execa(installCmd, installArgs, { cwd: projectPath });

      spinner.succeed(chalk.green('Project created successfully! 🎉'));

      // Show project structure and next steps
      closeInitProject(packageManager, name);

    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
