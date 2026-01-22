#!/usr/bin/env node
import { Command } from 'commander';
import { initProject } from './commands/init';
import { addComponent } from './commands/add';
import { generateComponent, generateScreen } from './commands/generate';

const program = new Command();

program
  .name('lk')
  .description('CLI for Lunar Kit - Universal React Native UI components')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Lunar Kit in your project')
  .action(async () => {
    console.log('🌙 Initializing Lunar Kit...');
    await initProject();
  });

program
  .command('add <component>')
  .description('Add a component to your project')
  .action(async (component) => {
    console.log(`🌙 Adding ${component}...`);
     await addComponent(component);
  });

program
  .command('generate')
  .alias('g')
  .description('Generate screens or components')
  .argument('<type>', 'screen or component')
  .argument('<name>', 'name of the screen/component')
  .action(async (type, name) => {
    if (type === 'screen' || type === 's') {
      await generateScreen(name);
    } else if (type === 'component' || type === 'c') {
      await generateComponent(name);
    } else {
      console.log('Invalid type. Use "screen" or "component"');
    }
  });
program.parse();
