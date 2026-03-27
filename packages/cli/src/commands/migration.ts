import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import axios from 'axios';
import { loadConfig } from '../utils/helpers.js';

interface PackageVersion {
  name: string;
  currentVersion: string;
  latestVersion: string;
}

// Upgrade Lunar Kit packages to latest version
export async function upgradePackages() {
  const spinner = ora('Checking for Lunar Kit updates...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found. Run lunar init first.');
      return;
    }

    // Check package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      spinner.fail('package.json not found.');
      return;
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const lunarPackages = ['@lunar-kit/core', '@lunar-kit/cli', '@lunar-kit/primitive'];
    const updates: PackageVersion[] = [];

    for (const pkg of lunarPackages) {
      const currentVersion = packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg];
      if (currentVersion) {
        try {
          const response = await axios.get(`https://registry.npmjs.org/${pkg}/latest`);
          const latestVersion = response.data.version;
          
          if (currentVersion !== latestVersion) {
            updates.push({
              name: pkg,
              currentVersion: currentVersion.replace(/[^0-9.]/g, ''),
              latestVersion,
            });
          }
        } catch (error) {
          // Skip if can't fetch version
        }
      }
    }

    spinner.stop();

    if (updates.length === 0) {
      console.log(chalk.green('✓ All Lunar Kit packages are up to date!'));
      return;
    }

    console.log(chalk.bold('\nAvailable updates:'));
    updates.forEach((pkg) => {
      console.log(
        `  ${chalk.cyan(pkg.name)}  ${pkg.currentVersion}  →  ${chalk.green(pkg.latestVersion)}`
      );
    });

    const prompts = await import('prompts');
    const response = await prompts.default([
      {
        type: 'confirm',
        name: 'update',
        message: 'Do you want to update these packages?',
        initial: true,
      },
    ]);

    if (response.update) {
      const packageManager = config.packageManager || 'pnpm';
      const installCmd = packageManager === 'npm' ? 'npm install' : `${packageManager} add`;
      
      spinner.start('Updating packages...');
      
      const packagesToUpdate = updates.map((pkg) => `${pkg.name}@${pkg.latestVersion}`).join(' ');
      const { execa } = await import('execa');
      
      try {
        await execa(packageManager, ['add', ...updates.map(p => `${p.name}@${p.latestVersion}`)], {
          cwd: process.cwd(),
          stdio: 'ignore',
        });
        
        spinner.succeed(chalk.green('Packages updated successfully!'));
      } catch (error) {
        spinner.fail('Failed to update packages');
        throw error;
      }
    } else {
      console.log(chalk.yellow('Update cancelled.'));
    }

  } catch (error) {
    spinner.fail('Failed to check for updates');
    console.error(error);
  }
}

// Migrate breaking changes between versions
export async function migrateBreakingChanges() {
  const spinner = ora('Checking for migrations...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found. Run lunar init first.');
      return;
    }

    // Check for migration files
    const migrationDir = path.join(process.cwd(), '.lunar', 'migrations');
    await fs.ensureDir(migrationDir);

    // Read migration registry
    const migrationRegistryPath = path.join(migrationDir, 'registry.json');
    let completedMigrations: string[] = [];
    
    if (fs.existsSync(migrationRegistryPath)) {
      const registry = await fs.readJson(migrationRegistryPath);
      completedMigrations = registry.completed || [];
    }

    // Check for available migrations
    const availableMigrations = await getAvailableMigrations();
    const pendingMigrations = availableMigrations.filter(
      (m) => !completedMigrations.includes(m.id)
    );

    spinner.stop();

    if (pendingMigrations.length === 0) {
      console.log(chalk.green('✓ No pending migrations!'));
      return;
    }

    console.log(chalk.bold('\nPending migrations:'));
    pendingMigrations.forEach((migration) => {
      console.log(
        `  ${chalk.cyan(migration.id)}  -  ${migration.description}`
      );
    });

    const prompts = await import('prompts');
    const response = await prompts.default([
      {
        type: 'confirm',
        name: 'migrate',
        message: 'Do you want to run these migrations?',
        initial: true,
      },
    ]);

    if (response.migrate) {
      spinner.start('Running migrations...');

      for (const migration of pendingMigrations) {
        spinner.text = `Running migration: ${migration.id}`;
        await runMigration(migration);
        
        completedMigrations.push(migration.id);
        await fs.writeJson(migrationRegistryPath, { completed: completedMigrations }, { spaces: 2 });
      }

      spinner.succeed(chalk.green('All migrations completed successfully!'));
    } else {
      console.log(chalk.yellow('Migration cancelled.'));
    }

  } catch (error) {
    spinner.fail('Failed to run migrations');
    console.error(error);
  }
}

interface Migration {
  id: string;
  version: string;
  description: string;
  run: () => Promise<void>;
}

async function getAvailableMigrations(): Promise<Migration[]> {
  // Define migrations here - these would be version-specific
  const migrations: Migration[] = [
    {
      id: '001-update-config-structure',
      version: '0.2.0',
      description: 'Update kit.config.json structure',
      run: async () => {
        const configPath = path.join(process.cwd(), 'kit.config.json');
        if (!fs.existsSync(configPath)) return;

        const config = await fs.readJson(configPath);
        
        // Example migration: rename old keys to new keys
        if (config.uiComponentsDir) {
          config.componentsDir = config.uiComponentsDir;
          delete config.uiComponentsDir;
        }

        await fs.writeJson(configPath, config, { spaces: 2 });
      },
    },
    {
      id: '002-update-import-paths',
      version: '0.3.0',
      description: 'Update import paths to use new alias',
      run: async () => {
        // This would scan files and update imports
        // Placeholder for actual implementation
      },
    },
  ];

  return migrations;
}

async function runMigration(migration: Migration): Promise<void> {
  try {
    await migration.run();
  } catch (error) {
    throw new Error(`Migration ${migration.id} failed: ${error}`);
  }
}
