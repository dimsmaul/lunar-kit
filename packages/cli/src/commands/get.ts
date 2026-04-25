import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';

const CONFIG_FILE = path.join(process.cwd(), 'kit.config.json');

/**
 * Get current config
 */
export async function getConfig(options?: { json?: boolean }) {
  try {
    if (!await fs.pathExists(CONFIG_FILE)) {
      console.log(chalk.yellow('⚠️  kit.config.json not found'));
      console.log(chalk.dim('Run "lunar init" to create configuration'));
      process.exit(1);
    }

    const config = await fs.readJson(CONFIG_FILE);

    if (options?.json) {
      console.log(JSON.stringify(config, null, 2));
      return;
    }

    console.log(`\n${chalk.bold('Lunar Kit Configuration:\n')}`);

    Object.entries(config).forEach(([key, value]) => {
      const displayValue = typeof value === 'object'
        ? JSON.stringify(value, null, 2)
        : value;

      console.log(`${chalk.cyan(key)}: ${chalk.dim(String(displayValue))}`);
    });

    console.log();
  } catch (error) {
    console.error(chalk.red('Error reading config:'), error);
    process.exit(1);
  }
}
