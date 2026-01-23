#!/usr/bin/env node
import { Command } from 'commander';
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
  .description('Generate a new module')
  .action(async (path) => {
    await generateModule(path);
  });

// Tabs
generate
  .command('tabs <name>')
  .description('Generate a tabs module with bottom navigation')
  .action(async (name) => {
    await generateTabs(name);
  });

// Module-scoped (mod:view, mod:vi)
generate
  .command('mod:view <path>')
  .alias('mod:vi')
  .description('Generate a view inside a module')
  .action(async (path) => {
    await generateModuleView(path);
  });

generate
  .command('mod:component <path>')
  .alias('mod:co')
  .description('Generate a component inside a module')
  .action(async (path) => {
    await generateModuleComponent(path);
  });

generate
  .command('mod:store <path>')
  .alias('mod:st')
  .description('Generate a store inside a module')
  .action(async (path) => {
    await generateModuleStore(path);
  });

generate
  .command('mod:hook <path>')
  .alias('mod:ho')
  .description('Generate a hook inside a module')
  .action(async (path) => {
    await generateModuleHook(path);
  });

// Global (component, co)
generate
  .command('component <name>')
  .alias('co')
  .description('Generate a global component')
  .action(async (name) => {
    await generateGlobalComponent(name);
  });

generate
  .command('hook <name>')
  .alias('ho')
  .description('Generate a global hook')
  .action(async (name) => {
    await generateGlobalHook(name);
  });

generate
  .command('store <name>')
  .alias('st')
  .description('Generate a global store')
  .action(async (name) => {
    await generateGlobalStore(name);
  });

program.parse();
