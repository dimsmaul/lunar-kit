import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

export async function initProject() {
  console.log(chalk.bold('🌙 Initializing Lunar Kit...\n'));

  const response = await prompts([
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      initial: true,
    },
  ]);

  const spinner = ora('Setting up project structure...').start();

  try {
    // 1. Create components/ui directory
    const componentsDir = path.join(process.cwd(), 'components', 'ui');
    await fs.ensureDir(componentsDir);
    spinner.text = 'Created components/ui directory';

    // 2. Create lib directory with utils
    const libDir = path.join(process.cwd(), 'lib');
    await fs.ensureDir(libDir);

    const utilsExt = response.typescript ? 'ts' : 'js';
    const utilsPath = path.join(libDir, `utils.${utilsExt}`);
    
    if (!fs.existsSync(utilsPath)) {
      const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
      await fs.writeFile(utilsPath, utilsContent);
      spinner.text = 'Created lib/utils';
    }

    // 3. Create components.json config
    const config = {
      $schema: 'https://lunar-kit.dev/schema.json',
      style: 'default',
      rsc: false,
      tsx: response.typescript,
      tailwind: {
        config: 'tailwind.config.js',
        css: 'global.css',
        baseColor: 'slate',
        cssVariables: true,
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils',
      },
    };

    await fs.writeJson(path.join(process.cwd(), 'components.json'), config, {
      spaces: 2,
    });

    spinner.succeed(chalk.green('Project initialized successfully!'));

    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.cyan('1. Make sure NativeWind is installed and configured'));
    console.log(chalk.cyan('2. Install required dependencies:'));
    console.log(chalk.white('   pnpm add clsx tailwind-merge'));
    console.log(chalk.cyan('3. Add components:'));
    console.log(chalk.white('   lk add button'));
  } catch (error) {
    spinner.fail('Failed to initialize project');
    console.error(error);
  }
}
