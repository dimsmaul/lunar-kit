import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import { loadConfig } from '../utils/helpers.js';
import { renderProgressBar } from '../assets/logo.js';

interface InstallOptions {
  packages: string[];
  dev?: boolean;
  silent?: boolean;
}

/**
 * Install packages using the project's package manager
 */
export async function installPackages(options: InstallOptions) {
  const config = await loadConfig();
  
  if (!config) {
    console.log(chalk.yellow('kit.config.json not found. Using default package manager.'));
  }

  const packageManager = config?.packageManager || 'pnpm';
  const { packages, dev = false } = options;

  if (packages.length === 0) {
    console.log(chalk.yellow('No packages specified'));
    return;
  }

  const spinner = ora({
    text: 'Installing packages...',
    color: 'cyan',
  }).start();

  try {
    const installCmd = packageManager === 'npm' 
      ? (dev ? 'install --save-dev' : 'install')
      : (dev ? 'add --dev' : 'add');

    // Simulate progress for better UX
    const totalSteps = packages.length + 2; // +2 for resolve and link
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep = Math.min(currentStep + 1, totalSteps - 1);
      const progress = renderProgressBar(currentStep, totalSteps);
      spinner.text = `Installing packages... ${chalk.dim(`[${progress}]`)}`;
    }, 200);

    await execa(packageManager, [...installCmd.split(' '), ...packages], {
      cwd: process.cwd(),
      stdio: options.silent ? 'ignore' : 'inherit',
    });

    clearInterval(progressInterval);
    spinner.stop();

    console.log(chalk.green('✓') + ` Packages installed successfully`);
    console.log(chalk.dim(`  ${packages.join(', ')}`));

  } catch (error) {
    spinner.stop();
    console.log(chalk.red('✗') + ' Failed to install packages');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Main install command
 */
export async function runInstall(packages: string[], options: { dev?: boolean }) {
  if (packages.length === 0) {
    console.log(chalk.yellow('Please specify packages to install'));
    console.log(chalk.dim('Usage: lunar install <package> [packages...]'));
    console.log(chalk.dim('Example: lunar install dayjs axios'));
    return;
  }

  await installPackages({
    packages,
    dev: options.dev,
  });
}
