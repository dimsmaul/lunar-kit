import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import { execFileNoThrow } from '../utils/execFileNoThrow.js';

interface DoctorCheck {
  name: string;
  check: () => Promise<CheckResult>;
}

interface CheckResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  fix?: string;
}

/**
 * Check Node.js version
 */
async function checkNodeVersion(): Promise<CheckResult> {
  const requiredVersion = 18;
  const currentVersion = process.version;
  const majorVersion = Number.parseInt(currentVersion.slice(1).split('.')[0]);

  if (majorVersion < requiredVersion) {
    return {
      status: 'error',
      message: `Node.js ${currentVersion} is installed. Required: Node.js ${requiredVersion}+`,
      fix: `Upgrade Node.js to version ${requiredVersion} or higher`,
    };
  }

  return {
    status: 'success',
    message: `Node.js ${currentVersion}`,
  };
}

/**
 * Check package manager
 */
async function checkPackageManager(): Promise<CheckResult> {
  const packageManagers = ['pnpm', 'bun', 'yarn', 'npm'];
  let detected: string | null = null;

  for (const pm of packageManagers) {
    const result = await execFileNoThrow(pm, ['--version']);
    if (result.success) {
      detected = pm;
      break;
    }
  }

  if (!detected) {
    return {
      status: 'error',
      message: 'No package manager found',
      fix: 'Install pnpm, bun, yarn, or npm',
    };
  }

  const versionResult = await execFileNoThrow(detected, ['--version']);
  if (versionResult.success) {
    const version = versionResult.stdout.trim();
    return {
      status: 'success',
      message: `${detected} ${version}`,
    };
  }

  return {
    status: 'success',
    message: detected,
  };
}

/**
 * Check if running in Lunar Kit project
 */
async function checkLunarKitProject(): Promise<CheckResult> {
  const configPath = path.join(process.cwd(), 'kit.config.json');
  
  if (!await fs.pathExists(configPath)) {
    return {
      status: 'warning',
      message: 'Not a Lunar Kit project (kit.config.json not found)',
      fix: 'Run "lunar init" to initialize Lunar Kit in this project',
    };
  }

  try {
    const config = await fs.readJson(configPath);
    return {
      status: 'success',
      message: 'Lunar Kit project detected',
    };
  } catch {
    return {
      status: 'error',
      message: 'kit.config.json is invalid',
      fix: 'Fix or regenerate kit.config.json',
    };
  }
}

/**
 * Check @lunar-kit/cli version
 */
async function checkCliVersion(): Promise<CheckResult> {
  try {
    // Try to find package.json relative to dist folder
    const cliPackagePath = path.resolve(__dirname, '../../package.json');
    
    if (!await fs.pathExists(cliPackagePath)) {
      return {
        status: 'warning',
        message: '@lunar-kit/cli version unknown',
        fix: 'Reinstall @lunar-kit/cli',
      };
    }
    
    const pkg = await fs.readJson(cliPackagePath);
    
    return {
      status: 'success',
      message: `@lunar-kit/cli v${pkg.version}`,
    };
  } catch {
    return {
      status: 'warning',
      message: '@lunar-kit/cli version unknown',
      fix: 'Reinstall @lunar-kit/cli',
    };
  }
}

/**
 * Check @lunar-kit/core availability
 */
async function checkCoreAvailability(): Promise<CheckResult> {
  try {
    // Check if core templates exist (relative to CLI dist folder)
    // CLI dist is at: packages/cli/dist/index.js
    // Core templates at: packages/core/src/templates/
    // Need to go up TWO levels: dist → cli → packages → core
    const corePath = path.resolve(__dirname, '../../core/src/templates');
    
    if (!await fs.pathExists(corePath)) {
      return {
        status: 'error',
        message: '@lunar-kit/core templates not found',
        fix: 'Run "bun install" to install workspace dependencies',
      };
    }

    // Check if templates directory has content
    const templates = await fs.readdir(corePath);
    if (templates.length === 0) {
      return {
        status: 'error',
        message: '@lunar-kit/core templates directory is empty',
        fix: 'Reinstall @lunar-kit/core',
      };
    }

    return {
      status: 'success',
      message: '@lunar-kit/core templates available',
    };
  } catch (error) {
    return {
      status: 'error',
      message: '@lunar-kit/core not accessible',
      fix: 'Run "bun install" or "npm install"',
    };
  }
}

/**
 * Check create-lunar-kit availability
 */
async function checkCreateLunarKit(): Promise<CheckResult> {
  try {
    const createPath = path.join(__dirname, '../../../create-lunar-kit/dist/index.js');
    
    if (!await fs.pathExists(createPath)) {
      return {
        status: 'warning',
        message: 'create-lunar-kit not built',
        fix: 'Run "bun run build" in create-lunar-kit package',
      };
    }

    const pkgPath = path.join(__dirname, '../../../create-lunar-kit/package.json');
    const pkg = await fs.readJson(pkgPath);
    
    return {
      status: 'success',
      message: `create-lunar-kit v${pkg.version} available`,
    };
  } catch {
    return {
      status: 'warning',
      message: 'create-lunar-kit not found',
      fix: 'Ensure create-lunar-kit package exists',
    };
  }
}

/**
 * Main doctor command
 */
export async function runDoctor() {
  console.log(chalk.bold('\n🔍 Lunar Kit Doctor\n'));
  console.log(chalk.dim('Checking your Lunar Kit setup...\n'));

  const checks: DoctorCheck[] = [
    { name: 'Node.js', check: checkNodeVersion },
    { name: 'Package Manager', check: checkPackageManager },
    { name: '@lunar-kit/cli', check: checkCliVersion },
    { name: '@lunar-kit/core', check: checkCoreAvailability },
    { name: 'create-lunar-kit', check: checkCreateLunarKit },
    { name: 'Lunar Kit Project', check: checkLunarKitProject },
  ];

  let hasErrors = false;
  let hasWarnings = false;

  for (const { name, check } of checks) {
    const spinner = ora(`Checking ${name}...`).start();
    
    try {
      const result = await check();
      spinner.stop();

      if (result.status === 'success') {
        console.log(chalk.green('✓') + ` ${chalk.bold(name)}: ${result.message}`);
      } else if (result.status === 'warning') {
        console.log(chalk.yellow('⚠') + ` ${chalk.bold(name)}: ${result.message}`);
        hasWarnings = true;
        if (result.fix) {
          console.log(chalk.dim(`  → ${result.fix}`));
        }
      } else if (result.status === 'error') {
        console.log(chalk.red('✗') + ` ${chalk.bold(name)}: ${result.message}`);
        hasErrors = true;
        if (result.fix) {
          console.log(chalk.dim(`  → ${result.fix}`));
        }
      }
    } catch (error) {
      spinner.stop();
      console.log(chalk.red('✗') + ` ${chalk.bold(name)}: Check failed`);
      hasErrors = true;
    }
  }

  console.log();

  if (hasErrors) {
    console.log(chalk.red.bold('❌ Found errors that need to be fixed'));
    console.log(chalk.dim('Run the suggested fixes above to resolve issues'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow.bold('⚠️  Found warnings'));
    console.log(chalk.dim('Your setup is working but could be improved'));
  } else {
    console.log(chalk.green.bold('✅ All checks passed!'));
    console.log(chalk.dim('Your Lunar Kit setup is healthy'));
  }

  console.log();
}
