import { Command } from 'commander';

const program = new Command();
const list = program.command('list').description('List');

list
  .command('components')
  .description('List components')
  .option('--json', 'JSON output')
  // No positional arguments
  .action(function(param1, param2) {
    console.log('param1:', param1);
    console.log('param2:', param2);
    console.log('this.opts():', this.opts());
  });

program.parse();
