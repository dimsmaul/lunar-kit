import { Command } from 'commander';

const program = new Command();
const list = program.command('list').description('List');

list
  .command('components')
  .description('List components')
  .option('--json', 'JSON output')
  .action(function(firstArg) {
    console.log('firstArg:', firstArg);
    console.log('this.opts():', this.opts());
  });

program.parse();
