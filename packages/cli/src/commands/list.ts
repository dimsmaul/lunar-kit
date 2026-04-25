import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import { LOCAL_REGISTRY_PATH } from '@lunar-kit/core/cli-utils';

const PROJECT_REGISTRY_DIR = path.join(process.cwd(), 'src/registry/ui');
const REGISTRY_DIR = fs.existsSync(PROJECT_REGISTRY_DIR) ? PROJECT_REGISTRY_DIR : path.join(LOCAL_REGISTRY_PATH, 'ui');
const MODULES_DIR = path.join(process.cwd(), 'src/modules');

interface RegistryComponent {
  name: string;
  description: string;
  type: string;
}

/**
 * List available components from registry
 */
export async function listComponents(options?: { json?: boolean }) {
  try {
    if (!await fs.pathExists(REGISTRY_DIR)) {
      console.log(chalk.yellow('⚠️  No components registry found'));
      return;
    }

    const files = await fs.readdir(REGISTRY_DIR);
    const components: RegistryComponent[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(REGISTRY_DIR, file);
        const data = await fs.readJson(filePath);
        components.push({
          name: data.name,
          description: data.description,
          type: data.type,
        });
      }
    }

    if (options?.json) {
      console.log(JSON.stringify(components, null, 2));
      return;
    }

    if (components.length === 0) {
      console.log(chalk.dim('No components found'));
      return;
    }

    console.log(`\n${chalk.bold('Available Components:')} (${components.length})\n`);

    const maxNameLen = Math.max(...components.map(c => c.name.length));
    components.forEach(comp => {
      const padding = ' '.repeat(maxNameLen - comp.name.length + 2);
      console.log(`  ${chalk.cyan(comp.name)}${padding}${chalk.dim(comp.description)}`);
    });
    console.log();
  } catch (error) {
    console.error(chalk.red('Error listing components:'), error);
    process.exit(1);
  }
}

/**
 * List modules in project
 */
export async function listModules(options?: { json?: boolean }) {
  try {
    if (!await fs.pathExists(MODULES_DIR)) {
      console.log(chalk.yellow('⚠️  No modules directory found'));
      return;
    }

    const entries = await fs.readdir(MODULES_DIR, { withFileTypes: true });
    const modules = entries
      .filter(e => e.isDirectory())
      .map(e => e.name);

    if (options?.json) {
      console.log(JSON.stringify({ modules }, null, 2));
      return;
    }

    if (modules.length === 0) {
      console.log(chalk.dim('No modules found'));
      return;
    }

    console.log(`\n${chalk.bold('Project Modules:')} (${modules.length})\n`);
    modules.forEach(mod => {
      console.log(`  ${chalk.cyan(mod)}`);
    });
    console.log();
  } catch (error) {
    console.error(chalk.red('Error listing modules:'), error);
    process.exit(1);
  }
}
