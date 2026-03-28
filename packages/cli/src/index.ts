#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { initProject } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { generateModule, generateTabs } from './commands/module.js';
import {
  generateModuleView,
  generateModuleComponent,
  generateModuleStore,
  generateModuleHook,
} from './commands/generate-scoped.js';
import {
  generateModuleApi,
  generateModuleType,
} from './commands/generate-scoped-extra.js';
import {
  generateGlobalComponent,
  generateGlobalHook,
  generateGlobalStore,
} from './commands/generate-global.js';
import {
  generateGlobalService,
  generateGlobalType,
  generateGlobalConfig,
} from './commands/generate-global-extra.js';
import { generateLocale } from './commands/localization.js';
import { upgradePackages, migrateBreakingChanges } from './commands/migration.js';
import {
  generateStackNavigator,
  generateTabNavigator,
  generateDrawerNavigator,
} from './commands/navigation.js';
import {
  generateModuleTest,
  generateGlobalTest,
} from './commands/test.js';
import { runDoctor } from './commands/doctor.js';
import { runInstall } from './commands/install.js';

// ============================================
// Help Display Functions
// ============================================

function showGenerateHelp() {
  console.log(`
${chalk.bold('Usage:')} lunar generate|g <schematic> [path]

${chalk.bold('Schematics available:')}
  ┌─────────────────┬─────────────┬────────────────────────────────────────────┐
  │ ${chalk.bold('name')}            │ ${chalk.bold('alias')}       │ ${chalk.bold('description')}                                │
  ├─────────────────┼─────────────┼────────────────────────────────────────────┤
  │ ${chalk.cyan('Module')}          │             │                                            │
  │ mod             │ mod         │ Generate a module                          │
  │ tabs            │ tabs        │ Generate a tabs module                     │
  ├─────────────────┼─────────────┼────────────────────────────────────────────┤
  │ ${chalk.cyan('Module-Scoped')}   │             │                                            │
  │ mod:view        │ mod:vi      │ Generate a view in module                  │
  │ mod:component   │ mod:co      │ Generate a component in module             │
  │ mod:store       │ mod:st      │ Generate a store in module                 │
  │ mod:hook        │ mod:ho      │ Generate a hook in module                  │
  │ mod:api         │ mod:ap      │ Generate API layer in module               │
  │ mod:type        │ mod:tp      │ Generate TypeScript types in module        │
  │ mod:test        │ mod:ts      │ Generate test file in module               │
  ├─────────────────┼─────────────┼────────────────────────────────────────────┤
  │ ${chalk.cyan('Global')}          │             │                                            │
  │ component       │ co          │ Generate a global component                │
  │ hook            │ ho          │ Generate a global hook                     │
  │ store           │ st          │ Generate a global store                    │
  │ service         │ sv          │ Generate global service                    │
  │ type            │ ty          │ Generate global TypeScript types           │
  │ config          │ cf          │ Generate config file                       │
  │ test            │ te          │ Generate global test helper/setup          │
  ├─────────────────┼─────────────┼────────────────────────────────────────────┤
  │ ${chalk.cyan('Navigation')}      │             │                                            │
  │ nav:stack       │ n:stack     │ Generate stack navigator                   │
  │ nav:tab         │ n:tab       │ Generate tab navigator                     │
  │ nav:drawer      │ n:drawer    │ Generate drawer navigator                  │
  ├─────────────────┼─────────────┼────────────────────────────────────────────┤
  │ ${chalk.cyan('Localization')}    │             │                                            │
  │ locale          │ lo          │ Generate a new locale file                 │
  └─────────────────┴─────────────┴────────────────────────────────────────────┘

${chalk.bold('Examples:')}
  ${chalk.dim('$ lunar g mod auth/login')}
  ${chalk.dim('$ lunar g mod:vi auth/login-screen')}
  ${chalk.dim('$ lunar g mod:api auth/auth-api')}
  ${chalk.dim('$ lunar g mod:type auth/user')}
  ${chalk.dim('$ lunar g service auth')}
  ${chalk.dim('$ lunar g nav stack')}
  ${chalk.dim('$ lunar g locale zh')}
`);
}

function showAddHelp() {
  console.log(`
${chalk.bold('Usage:')} lunar add <subcommand> [options]

${chalk.bold('Subcommands:')}
  ┌─────────────────┬──────────────────────────────────────────────────────────┐
  │ ${chalk.bold('subcommand')}      │ ${chalk.bold('description')}                                                   │
  ├─────────────────┼──────────────────────────────────────────────────────────┤
  │ locale          │ Add a translation entry to all locale files              │
  │ locale update   │ Bulk-add translations for a specific locale              │
  │ <component>     │ Add a UI component (e.g., button, dialog, card)          │
  └─────────────────┴──────────────────────────────────────────────────────────┘

${chalk.bold('Examples:')}
  ${chalk.dim('$ lunar add locale')}
  ${chalk.dim('$ lunar add locale update')}
  ${chalk.dim('$ lunar add button')}
  ${chalk.dim('$ lunar add dialog')}
  ${chalk.dim('$ lunar add card')}
`);
}

const program = new Command();

program
  .name('lunar')
  .description('CLI for Lunar Kit - Universal React Native UI components')
  .version('0.1.0');

// Init
program
  .command('init')
  .description('Initialize Lunar Kit in your project')
  .action(async () => {
    await initProject();
  });

// Add command with subcommands
program
  .command('add [subcommand...]')
  .description('Add a component or feature to your project')
  .action(async (subcommand: string[]) => {
    if (!subcommand || subcommand.length === 0 || subcommand[0] === 'help') {
      showAddHelp();
      return;
    }
    
    // Handle 'locale update' subcommand
    if (subcommand[0] === 'locale' && subcommand[1] === 'update') {
      const { addCommand } = await import('./commands/add.js');
      await addCommand(['locale', 'update']);
      return;
    }
    
    // Handle 'locale' subcommand
    if (subcommand[0] === 'locale') {
      const { addCommand } = await import('./commands/add.js');
      await addCommand(['locale']);
      return;
    }
    
    // Treat as component name (legacy behavior)
    const { addCommand } = await import('./commands/add.js');
    await addCommand(subcommand);
  });

// Generate commands with help handling
const generate = program
  .command('generate')
  .alias('g')
  .description('Generate modules, screens, components, stores, or hooks');

// Help subcommand
generate
  .command('help')
  .description('Show generate schematic table')
  .action(() => {
    showGenerateHelp();
  });

// Module
generate
  .command('mod <path>')
  .description('Generate a new module (e.g., auth/login)')
  .action(async (path) => {
    await generateModule(path);
  });

// Tabs
generate
  .command('tabs <path>')
  .description('Generate a tabs module (e.g., shop/main)')
  .action(async (path) => {
    await generateTabs(path);
  });

// Module-scoped
generate
  .command('mod:view <path>')
  .alias('mod:vi')
  .description('Generate view in module (e.g., auth/login-screen)')
  .action(async (path) => {
    await generateModuleView(path);
  });

generate
  .command('mod:component <path>')
  .alias('mod:co')
  .description('Generate component in module (e.g., auth/login-button)')
  .action(async (path) => {
    await generateModuleComponent(path);
  });

generate
  .command('mod:store <path>')
  .alias('mod:st')
  .description('Generate store in module (e.g., auth/auth-store)')
  .action(async (path) => {
    await generateModuleStore(path);
  });

generate
  .command('mod:hook <path>')
  .alias('mod:ho')
  .description('Generate hook in module (e.g., auth/use-auth)')
  .action(async (path) => {
    await generateModuleHook(path);
  });

// Global
generate
  .command('component <name>')
  .alias('co')
  .description('Generate global component')
  .action(async (name) => {
    await generateGlobalComponent(name);
  });

generate
  .command('hook <name>')
  .alias('ho')
  .description('Generate global hook')
  .action(async (name) => {
    await generateGlobalHook(name);
  });

generate
  .command('store <name>')
  .alias('st')
  .description('Generate global store')
  .action(async (name) => {
    await generateGlobalStore(name);
  });

// Locale
generate
  .command('locale <lang>')
  .alias('lo')
  .description('Generate a new locale file (e.g., zh, ja, ko)')
  .action(async (lang) => {
    await generateLocale(lang);
  });

// Migration & Upgrade
program
  .command('upgrade')
  .description('Upgrade Lunar Kit packages to latest version')
  .action(async () => {
    await upgradePackages();
  });

program
  .command('migrate')
  .description('Migrate breaking changes between versions')
  .action(async () => {
    await migrateBreakingChanges();
  });

// Module-scoped API & Types
generate
  .command('mod:api <path>')
  .alias('mod:ap')
  .description('Generate API layer in module (e.g., auth/auth-api)')
  .action(async (path) => {
    await generateModuleApi(path);
  });

generate
  .command('mod:type <path>')
  .alias('mod:tp')
  .description('Generate TypeScript types in module (e.g., auth/user)')
  .action(async (path) => {
    await generateModuleType(path);
  });

// Global generators
generate
  .command('service <name>')
  .alias('sv')
  .description('Generate global service')
  .action(async (name) => {
    await generateGlobalService(name);
  });

generate
  .command('type <name>')
  .alias('ty')
  .description('Generate global TypeScript types/interfaces')
  .action(async (name) => {
    await generateGlobalType(name);
  });

generate
  .command('config <name>')
  .alias('cf')
  .description('Generate config file')
  .action(async (name) => {
    await generateGlobalConfig(name);
  });

// Navigation generators
const nav = generate
  .command('nav')
  .alias('n')
  .description('Generate navigation components');

nav
  .command('stack')
  .description('Generate stack navigator')
  .action(async () => {
    await generateStackNavigator();
  });

nav
  .command('tab')
  .description('Generate tab navigator')
  .action(async () => {
    await generateTabNavigator();
  });

nav
  .command('drawer')
  .description('Generate drawer navigator')
  .action(async () => {
    await generateDrawerNavigator();
  });

// Test generators
generate
  .command('mod:test <path>')
  .alias('mod:ts')
  .description('Generate test file in module (e.g., auth/auth-screen.test)')
  .action(async (path) => {
    await generateModuleTest(path);
  });

generate
  .command('test [type]')
  .alias('te')
  .description('Generate global test helper/setup')
  .action(async (type) => {
    await generateGlobalTest(type);
  });

// Doctor command
program
  .command('doctor')
  .description('Check your Lunar Kit setup')
  .action(async () => {
    await runDoctor();
  });

// Install command
program
  .command('install [packages...]')
  .alias('i')
  .description('Install packages using project package manager')
  .option('-D, --dev', 'Install as dev dependency')
  .action(async (packages, options) => {
    await runInstall(packages, options);
  });

  program.configureHelp({
  formatHelp: () => {
    return `
${chalk.bold('Usage:')} lunar <command> [options]

${chalk.bold('Commands:')}
  ${chalk.green('init')}                                          Initialize Lunar Kit in your project
  ${chalk.green('add')} [subcommand]                              Add a component or feature
  ${chalk.green('add help')}                                      Show add subcommand table
  ${chalk.green('doctor')}                                        Check your Lunar Kit setup
  ${chalk.green('install| i')} [packages]                         Install packages
  ${chalk.green('upgrade')}                                       Upgrade Lunar Kit packages to latest version
  ${chalk.green('migrate')}                                       Migrate breaking changes between versions
  ${chalk.green('generate|g')} [subcommand]                       Generate a Lunar Kit element
  ${chalk.green('generate help')}                                 Show generate schematic table

  ${chalk.dim('Use "lunar add help" or "lunar g help" to see available subcommands')}

${chalk.bold('Quick Reference:')}
  ┌─────────────────┬──────────────────────────────────────────────────────────┐
  │ ${chalk.bold('command')}         │ ${chalk.bold('description')}                                                   │
  ├─────────────────┼──────────────────────────────────────────────────────────┤
  │ doctor          │ Check Lunar Kit setup and configuration                  │
  │ install (i)     │ Install packages with progress bar                       │
  │ add             │ Add components or features (button, dialog, locale)      │
  │ generate (g)    │ Generate code (modules, services, types, tests)          │
  │ upgrade         │ Update Lunar Kit packages                                │
  │ migrate         │ Run breaking change migrations                           │
  └─────────────────┴──────────────────────────────────────────────────────────┘

${chalk.bold('Examples:')}
  ${chalk.dim('$ lunar init')}
  ${chalk.dim('$ lunar doctor')}
  ${chalk.dim('$ lunar install dayjs axios')}
  ${chalk.dim('$ lunar i -D @types/node')}
  ${chalk.dim('$ lunar add button')}
  ${chalk.dim('$ lunar add locale')}
  ${chalk.dim('$ lunar add help')}
  ${chalk.dim('$ lunar g mod auth/login')}
  ${chalk.dim('$ lunar g help')}
  ${chalk.dim('$ lunar upgrade')}
  ${chalk.dim('$ lunar migrate')}
`;
  }
});


program.parse();
