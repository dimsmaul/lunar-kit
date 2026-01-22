#!/usr/bin/env node
import { Command } from 'commander';
import { initProject } from './commands/init.js';
import { addComponent } from './commands/add.js';
import { generateScreen, generateComponent, generateStore, generateHook } from './commands/generate.js';

const program = new Command();

program
  .name('lk')
  .description('CLI for Lunar Kit - Universal React Native UI components')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Lunar Kit in your project')
  .action(async () => {
    await initProject();
  });

program
  .command('add <component>')
  .description('Add a UI component to your project')
  .action(async (component) => {
    await addComponent(component);
  });

const generate = program
  .command('generate')
  .alias('g')
  .description('Generate screens, components, stores, or hooks');

generate
  .command('screen <name>')
  .alias('s')
  .description('Generate a screen')
  .action(async (name) => {
    await generateScreen(name);
  });

generate
  .command('component <name>')
  .alias('c')
  .description('Generate a component')
  .action(async (name) => {
    await generateComponent(name);
  });

generate
  .command('store <name>')
  .alias('st')
  .description('Generate a zustand store')
  .action(async (name) => {
    await generateStore(name);
  });

generate
  .command('hook <name>')
  .alias('h')
  .description('Generate a custom hook')
  .action(async (name) => {
    await generateHook(name);
  });

program.parse();
