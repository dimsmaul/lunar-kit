import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { execSync } from 'node:child_process';
import { loadConfig } from '../utils/helpers.js';

const REGISTRY_URL = 'https://raw.githubusercontent.com/yourusername/lunar-kit/main/registry';
const LOCAL_REGISTRY = path.join(__dirname, '../../..', 'registry');
const COMPONENTS_SOURCE = path.join(__dirname, '../../..', 'components');

interface ComponentRegistry {
  name: string;
  type: string;
  description?: string;
  files: Array<{
    path: string;
    type: string;
  }>;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
}

// Track installed components to avoid circular dependencies
const installedComponents = new Set<string>();

async function installRegistryDependencies(
  dependencies: string[],
  componentsDir: string,
  spinner: Ora
): Promise<void> {
  for (const dep of dependencies) {
    if (installedComponents.has(dep)) {
      spinner.text = chalk.dim(`Skipping ${dep} (already installed)`);
      continue;
    }

    spinner.text = `Installing registry dependency: ${chalk.cyan(dep)}`;
    
    const depRegistryPath = path.join(LOCAL_REGISTRY, 'ui', `${dep}.json`);
    
    if (!fs.existsSync(depRegistryPath)) {
      spinner.warn(`Registry dependency "${dep}" not found. Skipping...`);
      continue;
    }

    const depRegistry: ComponentRegistry = await fs.readJson(depRegistryPath);
    
    // Recursively install dependencies first
    if (depRegistry.registryDependencies?.length > 0) {
      await installRegistryDependencies(
        depRegistry.registryDependencies,
        componentsDir,
        spinner
      );
    }

    // Copy component files
    for (const file of depRegistry.files) {
      const relativePath = file.path.replace('/src/components/', '');
      const sourcePath = path.join(COMPONENTS_SOURCE, relativePath);
      const fileName = path.basename(file.path);
      const targetPath = path.join(componentsDir, fileName);

      // Skip if already exists
      if (fs.existsSync(targetPath)) {
        spinner.text = chalk.dim(`Skipping ${fileName} (already exists)`);
        continue;
      }

      if (!fs.existsSync(sourcePath)) {
        spinner.warn(`Source file not found: ${sourcePath}`);
        continue;
      }

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(sourcePath, targetPath);
      spinner.text = `Copied ${chalk.green(fileName)} (from ${dep})`;
    }

    installedComponents.add(dep);
  }
}

function getPackageManager(config: any): string {
  // First, check config
  if (config.packageManager) {
    return config.packageManager;
  }

  // Fallback: detect from lock files
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
    return 'npm';
  }
  
  return 'npm';
}

// DONE: Check which dependencies are already installed
function getInstalledDependencies(): { dependencies: Set<string>; devDependencies: Set<string> } {
  const pkgPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    return { dependencies: new Set(), devDependencies: new Set() };
  }

  const pkg = fs.readJsonSync(pkgPath);
  
  return {
    dependencies: new Set(Object.keys(pkg.dependencies || {})),
    devDependencies: new Set(Object.keys(pkg.devDependencies || {})),
  };
}

// DONE: Filter out already installed dependencies
function filterUninstalledDeps(
  deps: string[],
  installed: Set<string>
): string[] {
  return deps.filter(dep => {
    // Handle version specifiers (e.g., "react@18.0.0" -> "react")
    const pkgName = dep.split('@')[0];
    return !installed.has(pkgName);
  });
}

function installDependencies(
  deps: string[],
  config: any,
  isDev: boolean = false
): void {
  if (deps.length === 0) return;

  const packageManager = getPackageManager(config);
  
  // Check what's already installed
  const { dependencies, devDependencies } = getInstalledDependencies();
  const installed = isDev ? devDependencies : dependencies;
  
  // Filter out already installed
  const toInstall = filterUninstalledDeps(deps, installed);
  
  if (toInstall.length === 0) {
    console.log(chalk.dim(`\n✓ All ${isDev ? 'dev ' : ''}dependencies already installed`));
    return;
  }

  // Show which deps are being installed
  const alreadyInstalled = deps.filter(d => !toInstall.includes(d));
  if (alreadyInstalled.length > 0) {
    console.log(chalk.dim(`\n✓ Already installed: ${alreadyInstalled.join(', ')}`));
  }

  const devFlag = isDev ? (packageManager === 'npm' ? '--save-dev' : '-D') : '';
  const command = `${packageManager} add ${devFlag} ${toInstall.join(' ')}`;

  console.log(chalk.cyan(`\nInstalling ${isDev ? 'dev ' : ''}dependencies with ${packageManager}...`));
  console.log(chalk.white(`Installing: ${chalk.green(toInstall.join(', '))}`));
  console.log(chalk.dim(command));

  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error(chalk.red(`Failed to install dependencies`));
    throw error;
  }
}

export async function addComponent(componentName: string) {
  const spinner = ora(`Adding ${componentName}...`).start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found. Run `lunar init` first.');
      return;
    }

    const componentsDir = path.join(process.cwd(), config.uiComponentsDir || 'src/components/ui');
    
    // Auto create folder if not exists
    if (!fs.existsSync(componentsDir)) {
      spinner.text = `Creating directory: ${config.uiComponentsDir}`;
      await fs.ensureDir(componentsDir);
      spinner.succeed(`Created ${chalk.green(config.uiComponentsDir)}`);
      spinner.start(`Adding ${componentName}...`);
    }

    const registryPath = path.join(LOCAL_REGISTRY, 'ui', `${componentName}.json`);
    
    if (!fs.existsSync(registryPath)) {
      spinner.fail(`Component "${componentName}" not found in registry.`);
      return;
    }

    const registry: ComponentRegistry = await fs.readJson(registryPath);

    // Clear installed components tracker
    installedComponents.clear();

    // Install registry dependencies first (recursive)
    if (registry.registryDependencies?.length > 0) {
      spinner.text = 'Installing registry dependencies...';
      await installRegistryDependencies(
        registry.registryDependencies,
        componentsDir,
        spinner
      );
    }

    // Copy main component files
    for (const file of registry.files) {
      const relativePath = file.path.replace('/src/components/', '');
      const sourcePath = path.join(COMPONENTS_SOURCE, relativePath);
      const fileName = path.basename(file.path);
      const targetPath = path.join(componentsDir, fileName);

      if (!fs.existsSync(sourcePath)) {
        spinner.warn(`Source file not found: ${sourcePath}`);
        continue;
      }

      await fs.ensureDir(path.dirname(targetPath));
      await fs.copy(sourcePath, targetPath);
      spinner.text = `Copied ${chalk.green(fileName)}`;
    }

    spinner.succeed(`Successfully added ${chalk.green(componentName)}!`);
    console.log(chalk.dim(`\nLocation: ${config.uiComponentsDir}/${componentName}.tsx`));

    // Install npm dependencies
    if (registry.dependencies?.length > 0) {
      spinner.stop();
      installDependencies(registry.dependencies, config, false);
    }

    // Install dev dependencies
    if (registry.devDependencies && registry.devDependencies.length > 0) {
      installDependencies(registry.devDependencies, config, true);
    }

    console.log(chalk.green('\n✓ All done!'));

  } catch (error) {
    spinner.fail(`Failed to add ${componentName}`);
    console.error(error);
  }
}

// import fs from 'fs-extra';
// import path from 'node:path';
// import chalk from 'chalk';
// import ora, { Ora } from 'ora';
// import { execSync } from 'node:child_process';
// import { loadConfig } from '../utils/helpers.js';

// const REGISTRY_URL = 'https://raw.githubusercontent.com/yourusername/lunar-kit/main/registry';
// const LOCAL_REGISTRY = path.join(__dirname, '../../..', 'registry');
// const COMPONENTS_SOURCE = path.join(__dirname, '../../..', 'components');

// interface ComponentRegistry {
//   name: string;
//   type: string;
//   description?: string;
//   files: Array<{
//     path: string;
//     type: string;
//   }>;
//   dependencies: string[];
//   devDependencies?: string[];
//   registryDependencies: string[];
// }

// // Track installed components to avoid circular dependencies
// const installedComponents = new Set<string>();

// async function installRegistryDependencies(
//   dependencies: string[],
//   componentsDir: string,
//   spinner: Ora
// ): Promise<void> {
//   for (const dep of dependencies) {
//     if (installedComponents.has(dep)) {
//       spinner.text = `${chalk.dim(`Skipping ${dep} (already installed)`)}`;
//       continue;
//     }

//     spinner.text = `Installing registry dependency: ${chalk.cyan(dep)}`;
    
//     const depRegistryPath = path.join(LOCAL_REGISTRY, 'ui', `${dep}.json`);
    
//     if (!fs.existsSync(depRegistryPath)) {
//       spinner.warn(`Registry dependency "${dep}" not found. Skipping...`);
//       continue;
//     }

//     const depRegistry: ComponentRegistry = await fs.readJson(depRegistryPath);
    
//     // Recursively install dependencies first
//     if (depRegistry.registryDependencies?.length > 0) {
//       await installRegistryDependencies(
//         depRegistry.registryDependencies,
//         componentsDir,
//         spinner
//       );
//     }

//     // Copy component files
//     for (const file of depRegistry.files) {
//       const relativePath = file.path.replace('/src/components/', '');
//       const sourcePath = path.join(COMPONENTS_SOURCE, relativePath);
//       const fileName = path.basename(file.path);
//       const targetPath = path.join(componentsDir, fileName);

//       // Skip if already exists
//       if (fs.existsSync(targetPath)) {
//         spinner.text = chalk.dim(`Skipping ${fileName} (already exists)`);
//         continue;
//       }

//       if (!fs.existsSync(sourcePath)) {
//         spinner.warn(`Source file not found: ${sourcePath}`);
//         continue;
//       }

//       await fs.ensureDir(path.dirname(targetPath));
//       await fs.copy(sourcePath, targetPath);
//       spinner.text = `Copied ${chalk.green(fileName)} (from ${dep})`;
//     }

//     installedComponents.add(dep);
//   }
// }

// function detectPackageManager(): string {
//   // Check if pnpm-lock.yaml exists
//   if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
//     return 'pnpm';
//   }
//   // Check if yarn.lock exists
//   if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
//     return 'yarn';
//   }
//   // Check if package-lock.json exists
//   if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
//     return 'npm';
//   }
//   // Default to npm
//   return 'npm';
// }

// function installDependencies(
//   deps: string[],
//   isDev: boolean = false
// ): void {
//   if (deps.length === 0) return;

//   const packageManager = detectPackageManager();
//   const devFlag = isDev ? (packageManager === 'npm' ? '--save-dev' : '-D') : '';
//   const command = `${packageManager} add ${devFlag} ${deps.join(' ')}`;

//   console.log(chalk.cyan(`\nInstalling ${isDev ? 'dev ' : ''}dependencies...`));
//   console.log(chalk.dim(command));

//   try {
//     execSync(command, { 
//       stdio: 'inherit',
//       cwd: process.cwd(),
//     });
//   } catch (error) {
//     console.error(chalk.red(`Failed to install dependencies`));
//     throw error;
//   }
// }

// export async function addComponent(componentName: string) {
//   const spinner = ora(`Adding ${componentName}...`).start();

//   try {
//     const config = await loadConfig();
//     if (!config) {
//       spinner.fail('kit.config.json not found. Run `lunar init` first.');
//       return;
//     }

//     const componentsDir = path.join(process.cwd(), config.uiComponentsDir || 'src/components/ui');
    
//     // Auto create folder if not exists
//     if (!fs.existsSync(componentsDir)) {
//       spinner.text = `Creating directory: ${config.uiComponentsDir}`;
//       await fs.ensureDir(componentsDir);
//       spinner.succeed(`Created ${chalk.green(config.uiComponentsDir)}`);
//       spinner.start(`Adding ${componentName}...`);
//     }

//     const registryPath = path.join(LOCAL_REGISTRY, 'ui', `${componentName}.json`);
    
//     if (!fs.existsSync(registryPath)) {
//       spinner.fail(`Component "${componentName}" not found in registry.`);
//       return;
//     }

//     const registry: ComponentRegistry = await fs.readJson(registryPath);

//     // Clear installed components tracker
//     installedComponents.clear();

//     // Install registry dependencies first (recursive)
//     if (registry.registryDependencies?.length > 0) {
//       spinner.text = 'Installing registry dependencies...';
//       await installRegistryDependencies(
//         registry.registryDependencies,
//         componentsDir,
//         spinner
//       );
//     }

//     // Copy main component files
//     for (const file of registry.files) {
//       const relativePath = file.path.replace('/src/components/', '');
//       const sourcePath = path.join(COMPONENTS_SOURCE, relativePath);
//       const fileName = path.basename(file.path);
//       const targetPath = path.join(componentsDir, fileName);

//       if (!fs.existsSync(sourcePath)) {
//         spinner.warn(`Source file not found: ${sourcePath}`);
//         continue;
//       }

//       await fs.ensureDir(path.dirname(targetPath));
//       await fs.copy(sourcePath, targetPath);
//       spinner.text = `Copied ${chalk.green(fileName)}`;
//     }

//     spinner.succeed(`Successfully added ${chalk.green(componentName)}!`);
//     console.log(chalk.dim(`\nLocation: ${config.uiComponentsDir}/${componentName}.tsx`));

//     // Install npm dependencies
//     if (registry.dependencies?.length > 0) {
//       spinner.stop();
//       installDependencies(registry.dependencies, false);
//     }

//     // Install dev dependencies
//     if (registry.devDependencies && registry.devDependencies.length > 0) {
//       installDependencies(registry.devDependencies, true);
//     }

//     console.log(chalk.green('\n✓ All done!'));

//   } catch (error) {
//     spinner.fail(`Failed to add ${componentName}`);
//     console.error(error);
//   }
// }
