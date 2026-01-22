import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const REGISTRY_URL = 'https://raw.githubusercontent.com/yourusername/lunar-kit/main/registry';
// Untuk development, pakai local path
const LOCAL_REGISTRY = path.join(__dirname, '../../../registry');

interface ComponentRegistry {
  name: string;
  type: string;
  description: string;
  files: Array<{
    path: string;
    type: string;
  }>;
  dependencies: string[];
  registryDependencies: string[];
}

export async function addComponent(componentName: string) {
  const spinner = ora(`Adding ${componentName}...`).start();

  try {
    // 1. Check if components/ui folder exists
    const componentsDir = path.join(process.cwd(), 'components', 'ui');
    if (!fs.existsSync(componentsDir)) {
      spinner.fail('Components directory not found. Run `lk init` first.');
      return;
    }

    // 2. Load registry (for now, use local)
    const registryPath = path.join(LOCAL_REGISTRY, 'ui', `${componentName}.json`);
    
    if (!fs.existsSync(registryPath)) {
      spinner.fail(`Component "${componentName}" not found in registry.`);
      return;
    }

    const registry: ComponentRegistry = await fs.readJson(registryPath);

    // 3. Copy component files
    for (const file of registry.files) {
      const sourcePath = path.join(LOCAL_REGISTRY, '..', file.path);
      const targetPath = path.join(process.cwd(), file.path);

      if (!fs.existsSync(sourcePath)) {
        spinner.warn(`Source file not found: ${sourcePath}`);
        continue;
      }

      // Create directory if not exists
      await fs.ensureDir(path.dirname(targetPath));

      // Copy file
      await fs.copy(sourcePath, targetPath);
      spinner.succeed(`Added ${chalk.green(file.path)}`);
    }

    // 4. Show dependencies to install
    if (registry.dependencies.length > 0) {
      console.log('\n' + chalk.bold('Dependencies to install:'));
      console.log(chalk.cyan(`pnpm add ${registry.dependencies.join(' ')}`));
    }

    spinner.succeed(`Successfully added ${chalk.green(componentName)}!`);
  } catch (error) {
    spinner.fail(`Failed to add ${componentName}`);
    console.error(error);
  }
}
