#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { initProject } from './commands/init.js';
import { addComponent } from './commands/add.js';
import { generateModule, generateTabs } from './commands/module.js';
import {
  generateModuleView,
  generateModuleComponent,
  generateModuleStore,
  generateModuleHook,
} from './commands/generate-scoped.js';
import {
  generateGlobalComponent,
  generateGlobalHook,
  generateGlobalStore,
} from './commands/generate-global.js';

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

// Add UI components
program
  .command('add <component>')
  .description('Add a UI component to your project')
  .action(async (component) => {
    await addComponent(component);
  });

// Generate commands
const generate = program
  .command('generate')
  .alias('g')
  .description('Generate modules, screens, components, stores, or hooks');

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

  program.configureHelp({
  formatHelp: () => {
    return `
${chalk.bold('Usage:')} lunar <command> [options]

${chalk.bold('Commands:')}
  ${chalk.green('init')}                                          Initialize Lunar Kit in your project
  ${chalk.green('add')} <component>                               Add a UI component to your project
  ${chalk.green('generate|g')} [options] <schematic> [path]        Generate a Lunar Kit element.
    ${chalk.dim('Schematics available:')}
      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ ${chalk.bold('name')}          │ ${chalk.bold('alias')}       │ ${chalk.bold('description')}                                  │
      ├───────────────┼─────────────┼──────────────────────────────────────────────┤
      │ ${chalk.cyan('Module')}        │             │                                              │
      │ mod           │ mod         │ Generate a module                            │
      │ tabs          │ tabs        │ Generate a tabs module                       │
      ├───────────────┼─────────────┼──────────────────────────────────────────────┤
      │ ${chalk.cyan('Module-Scoped')} │             │                                              │
      │ mod:view      │ mod:vi      │ Generate a view in module                    │
      │ mod:component │ mod:co      │ Generate a component in module               │
      │ mod:store     │ mod:st      │ Generate a store in module                   │
      │ mod:hook      │ mod:ho      │ Generate a hook in module                    │
      ├───────────────┼─────────────┼──────────────────────────────────────────────┤
      │ ${chalk.cyan('Global')}        │             │                                              │
      │ component     │ co          │ Generate a global component                  │
      │ hook          │ ho          │ Generate a global hook                       │
      │ store         │ st          │ Generate a global store                      │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘

${chalk.bold('Examples:')}
  ${chalk.dim('$ lunar init')}
  ${chalk.dim('$ lunar add button')}
  ${chalk.dim('$ lunar g mod auth/login')}
  ${chalk.dim('$ lunar g mod:vi auth/login-screen')}
  ${chalk.dim('$ lunar g tabs shop')}
`;
  }
});


program.parse();
