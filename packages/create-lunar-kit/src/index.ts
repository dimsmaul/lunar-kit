#!/usr/bin/env node
import { Command } from 'commander';
import { intro, outro, text, select, multiselect, isCancel, cancel, spinner as clackSpinner } from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderLogo } from './assets/logo';
import { createConfig, createSrcStructure, setupAppEntry, setupAuthSrc, setupDarkModeSrc, setupExpoRouterSrc, setupFormsSrc, setupNativeWind, setupReactNavigationSrc, setupStateSrc, updatePackageJson, setupLocalizationSrc, setupEnvConfig, setupApiClient, setupAppConfig } from './commands/init';
import { closeInitProject } from './res/close';
import pkg from '../package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);

async function getLatestVersion(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch('https://registry.npmjs.org/create-lunar-kit/latest', {
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) return pkg.version;
    const data = await response.json() as { version: string };
    return data.version || pkg.version;
  } catch {
    return pkg.version;
  }
}

const program = new Command();

program
  .name('create-lunar-kit')
  .description('Create a new React Native app with Lunar Kit')
  .argument('[project-name]', 'Name of your project')
  .action(async (projectName?: string) => {
    renderLogo();
    const latestVersion = await getLatestVersion();
    intro(chalk.bold.cyan(`🌙 Create Lunar Kit App (v${pkg.version})`));

    if (latestVersion !== pkg.version && process.env.NODE_ENV !== 'development') {
      // console.log(chalk.dim(`  (Note: local version is ${pkg.version})\n`));
      console.log(chalk.dim(`New version available: ${latestVersion} (you have ${pkg.version})`));
      console.log(chalk.dim('Please update to the latest version for the best experience.\n'));
    }

    const name = projectName || (await text({
      message: 'What is your project named?',
      placeholder: 'my-lunar-app',
      // initialValue: 'my-lunar-app',
      defaultValue: 'my-lunar-app',
      validate: (value?: string) => {
        if (value && !/^[a-z0-9-]+$/.test(value)) return 'Project name must be lowercase and use hyphens';
      },
    }));

    if (isCancel(name)) {
      cancel('Project creation cancelled');
      process.exit(1);
    }

    const navigation = await select({
      message: 'Which navigation library?',
      options: [
        { label: 'Expo Router (File-based routing)', value: 'expo-router' },
        { label: 'React Navigation (Stack-based)', value: 'react-navigation' },
        { label: 'None (I\'ll add it later)', value: 'none' },
      ],
    });

    if (isCancel(navigation)) {
      cancel('Project creation cancelled');
      process.exit(1);
    }

    const features = await multiselect({
      message: 'Select features to include:',
      options: [
        { label: 'Localization (i18n)', value: 'localization' },
        { label: 'Environment config (.env)', value: 'env' },
        { label: 'API client (axios)', value: 'api' },
        { label: 'Authentication screens', value: 'auth' },
        { label: 'Form validation (react-hook-form)', value: 'forms' },
      ],
      required: false,
    });

    if (isCancel(features)) {
      cancel('Project creation cancelled');
      process.exit(1);
    }

    const packageManager = await select({
      message: 'Which package manager?',
      options: [
        { label: 'bun', value: 'bun' },
        { label: 'pnpm', value: 'pnpm' },
        { label: 'npm', value: 'npm' },
        { label: 'yarn', value: 'yarn' },
      ],
    });

    if (isCancel(packageManager)) {
      cancel('Project creation cancelled');
      process.exit(1);
    }

    if (!name) {
      console.log(chalk.red('Project name is required'));
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), name as string);

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

      // 2. Setup app config (app.json)
      await setupAppConfig(projectPath, name as string);

      // 3. Create src/ structure
      spinner.text = 'Setting up project structure...';
      await createSrcStructure(projectPath, navigation);

      // 4. Move App.tsx to src/ and create new App.tsx as entry
      await setupAppEntry(projectPath, navigation);

      // 5. Setup navigation-specific files
      if (navigation === 'expo-router') {
        spinner.text = 'Setting up Expo Router...';
        await setupExpoRouterSrc(projectPath);
      } else if (navigation === 'react-navigation') {
        spinner.text = 'Setting up React Navigation...';
        await setupReactNavigationSrc(projectPath);
      }

      // 6. Setup features
      if (features.includes('auth')) {
        spinner.text = 'Setting up authentication...';
        await setupAuthSrc(projectPath, navigation);
      }

      await setupDarkModeSrc(projectPath, navigation);

      if (features.includes('forms')) {
        spinner.text = 'Setting up forms...';
        await setupFormsSrc(projectPath);
      }

      if (features.includes('localization')) {
        spinner.text = 'Setting up localization...';
        await setupLocalizationSrc(projectPath);
      }

      if (features.includes('env')) {
        spinner.text = 'Setting up environment config...';
        await setupEnvConfig(projectPath);
      }

      if (features.includes('api')) {
        spinner.text = 'Setting up API client...';
        await setupApiClient(projectPath);
      }

      // 7. Setup NativeWind configs
      await setupNativeWind(projectPath);

      // 8. Update package.json
      spinner.text = 'Updating dependencies...';
      await updatePackageJson(projectPath, navigation, features);

      // 9. Create lunar-kit.config.json
      await createConfig(projectPath, navigation, features, packageManager);

      // 10. Install dependencies
      spinner.stop();
      console.log(`\n${chalk.cyan('📦 Installing dependencies...')}`);

      const installCmd = packageManager === 'yarn' ? 'yarn' : packageManager === 'bun' ? 'bun' : packageManager;
      const installArgs = packageManager === 'yarn' ? [] : ['install'];

      try {
        await execa(installCmd, installArgs, {
          cwd: projectPath,
          stdio: 'inherit',
        });
        console.log(chalk.green('✅ Dependencies installed\n'));
      } catch (error) {
        console.error(chalk.red('❌ Failed to install dependencies'));
        throw error;
      }

      // 11. Fix dependency versions for Expo compatibility
      const fixSpinner = ora('Aligning dependency versions...').start();
      try {
        await execa('npx expo install --fix', {
          cwd: projectPath,
          stdio: 'ignore',
          shell: true,
        });
        fixSpinner.succeed(chalk.green('Dependencies aligned'));
      } catch {
        fixSpinner.warn(chalk.yellow('Could not auto-fix dependencies'));
      }

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
