import chalk from "chalk";

export function closeInitProject (packageManager: string, name: string) {
    console.log('\n' + chalk.bold('Project structure:\n'));
    console.log(chalk.dim(`${name}/`));
    console.log(chalk.cyan('  src/'));
    console.log(chalk.cyan('    components/ui/    # UI components'));
    console.log(chalk.cyan('    screens/          # App screens'));
    console.log(chalk.cyan('    lib/              # Utilities'));
    console.log(chalk.cyan('    stores/           # State management'));
    console.log(chalk.cyan('    hooks/            # Custom hooks'));
    
    console.log('\n' + chalk.bold('Next steps:\n'));
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan(`  ${packageManager === 'npm' ? 'npm start' : `${packageManager} start`}`));
    
    console.log('\n' + chalk.bold('Generate code:\n'));
    console.log(chalk.cyan('  pnpm dlx lk g screen Profile'));
    console.log(chalk.cyan('  pnpm dlx lk g component UserCard'));
    
    console.log('\n' + chalk.bold('Add UI components:\n'));
    console.log(chalk.cyan('  pnpm dlx lk add card'));
    console.log(chalk.cyan('  pnpm dlx lk add input'));
    
    console.log(chalk.dim('\nHappy coding! 🌙\n'));
}