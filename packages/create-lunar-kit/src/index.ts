#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('create-lunar-kit')
  .description('Create a new React Native app with Lunar Kit')
  .argument('[project-name]', 'Name of your project')
  .action(async (projectName?: string) => {
    console.log(chalk.bold.cyan('\n🌙 Create Lunar Kit App\n'));

    const response = await prompts([
      {
        type: projectName ? null : 'text',
        name: 'projectName',
        message: 'What is your project named?',
        initial: 'my-lunar-app',
        validate: (value: string) =>
          /^[a-z0-9-]+$/.test(value) || 'Project name must be lowercase and use hyphens',
      },
      {
        type: 'select',
        name: 'navigation',
        message: 'Which navigation library?',
        choices: [
          { title: 'Expo Router (File-based routing)', value: 'expo-router' },
          { title: 'React Navigation (Stack-based)', value: 'react-navigation' },
          { title: 'None (I\'ll add it later)', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          { title: 'Authentication screens', value: 'auth', selected: false },
          { title: 'Dark mode support', value: 'dark-mode', selected: true },
          { title: 'Form validation (react-hook-form)', value: 'forms', selected: false },
          { title: 'State management (Zustand)', value: 'state', selected: false },
        ],
      },
      {
        type: 'select',
        name: 'packageManager',
        message: 'Which package manager?',
        choices: [
          { title: 'pnpm', value: 'pnpm' },
          { title: 'npm', value: 'npm' },
          { title: 'yarn', value: 'yarn' },
        ],
        initial: 0,
      },
    ]);

    const name = projectName || response.projectName;
    const { navigation, features, packageManager } = response;

    if (!name) {
      console.log(chalk.red('Project name is required'));
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), name);

    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory ${name} already exists`));
      process.exit(1);
    }

    const spinner = ora('Creating project...').start();

    try {
      // 1. Create Expo app with appropriate template
      spinner.text = 'Creating Expo app...';
      const template = navigation === 'expo-router' ? 'tabs' : 'blank-typescript';
      
      await execa('npx', [
        'create-expo-app@latest',
        name,
        '--template',
        template,
        '--no-install',
      ]);

      // 2. Copy base template files
      spinner.text = 'Setting up Lunar Kit...';
      const templatePath = path.join(__dirname, '../templates/base');
      
      if (fs.existsSync(templatePath)) {
        await fs.copy(templatePath, projectPath, { 
          overwrite: false, // Don't overwrite expo-generated files
          filter: (src) => !src.includes('node_modules')
        });
      }

      // 3. Setup navigation-specific files
      if (navigation === 'expo-router') {
        spinner.text = 'Setting up Expo Router...';
        await setupExpoRouter(projectPath);
      } else if (navigation === 'react-navigation') {
        spinner.text = 'Setting up React Navigation...';
        await setupReactNavigation(projectPath);
      }

      // 4. Setup features
      if (features.includes('auth')) {
        spinner.text = 'Setting up authentication...';
        await setupAuth(projectPath, navigation);
      }

      if (features.includes('dark-mode')) {
        spinner.text = 'Setting up dark mode...';
        await setupDarkMode(projectPath);
      }

      if (features.includes('forms')) {
        spinner.text = 'Setting up forms...';
        await setupForms(projectPath);
      }

      if (features.includes('state')) {
        spinner.text = 'Setting up state management...';
        await setupState(projectPath);
      }

      // 5. Update package.json with dependencies
      spinner.text = 'Updating dependencies...';
      await updatePackageJson(projectPath, navigation, features);

      // 6. Create lunar-kit.config.json
      await createConfig(projectPath, navigation, features);

      // 7. Install dependencies
      spinner.text = `Installing dependencies with ${packageManager}...`;
      
      const installCmd = packageManager === 'yarn' ? 'yarn' : packageManager;
      const installArgs = packageManager === 'npm' ? ['install'] : packageManager === 'yarn' ? [] : ['install'];
      
      await execa(installCmd, installArgs, { cwd: projectPath });

      spinner.succeed(chalk.green('Project created successfully! 🎉'));

      // 8. Show next steps
      console.log('\n' + chalk.bold('Next steps:\n'));
      console.log(chalk.cyan(`  cd ${name}`));
      console.log(chalk.cyan(`  ${packageManager === 'npm' ? 'npm start' : `${packageManager} start`}`));
      console.log('\n' + chalk.bold('Available commands:\n'));
      console.log(chalk.white('  Generate components:'));
      console.log(chalk.cyan('    pnpm dlx lk generate screen Profile'));
      console.log(chalk.cyan('    pnpm dlx lk generate component UserCard'));
      console.log(chalk.white('\n  Add UI components:'));
      console.log(chalk.cyan('    pnpm dlx lk add card'));
      console.log(chalk.cyan('    pnpm dlx lk add input'));
      console.log(chalk.dim('\nHappy coding! 🌙\n'));

    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(error);
      process.exit(1);
    }
  });

// Helper functions

async function setupExpoRouter(projectPath: string) {
  // Expo router already setup by template
  // Just add some custom screens/layouts
  const appDir = path.join(projectPath, 'app');
  
  // Create example layout
  const layoutContent = `import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}`;
  
  await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);
}

async function setupReactNavigation(projectPath: string) {
  // Will be handled by updatePackageJson
  // Create navigation setup file
  const navContent = `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`;

  await fs.ensureDir(path.join(projectPath, 'navigation'));
  await fs.writeFile(path.join(projectPath, 'navigation', 'index.tsx'), navContent);
}

async function setupAuth(projectPath: string, navigation: string) {
  const authDir = path.join(projectPath, navigation === 'expo-router' ? 'app/(auth)' : 'screens/auth');
  await fs.ensureDir(authDir);
  
  const loginScreen = `import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      <Button className="w-full">Sign In</Button>
    </View>
  );
}`;

  await fs.writeFile(path.join(authDir, 'login.tsx'), loginScreen);
}

async function setupDarkMode(projectPath: string) {
  // Create theme context
  const themeContent = `import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');
  
  const isDark = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);`;

  await fs.ensureDir(path.join(projectPath, 'contexts'));
  await fs.writeFile(path.join(projectPath, 'contexts', 'ThemeContext.tsx'), themeContent);
}

async function setupForms(projectPath: string) {
  // Add example form with react-hook-form
}

async function setupState(projectPath: string) {
  // Add zustand store example
  const storeContent = `import { create } from 'zustand';

interface AppState {
  user: null | { id: string; name: string };
  setUser: (user: AppState['user']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));`;

  await fs.ensureDir(path.join(projectPath, 'stores'));
  await fs.writeFile(path.join(projectPath, 'stores', 'app.ts'), storeContent);
}

async function updatePackageJson(projectPath: string, navigation: string, features: string[]) {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  
  pkg.dependencies = {
    ...pkg.dependencies,
    'nativewind': '^4.2.1',
    'clsx': '^2.1.1',
    'tailwind-merge': '^3.4.0',
  };

  if (navigation === 'react-navigation') {
    pkg.dependencies['@react-navigation/native'] = '^7.0.14';
    pkg.dependencies['@react-navigation/native-stack'] = '^7.1.10';
    pkg.dependencies['react-native-screens'] = '~4.4.0';
    pkg.dependencies['react-native-safe-area-context'] = '4.16.0';
  }

  if (features.includes('forms')) {
    pkg.dependencies['react-hook-form'] = '^7.54.2';
  }

  if (features.includes('state')) {
    pkg.dependencies['zustand'] = '^5.0.3';
  }
  
  pkg.devDependencies = {
    ...pkg.devDependencies,
    'tailwindcss': '3.4.17',
    'react-native-css-interop': '^0.2.1',
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

async function createConfig(projectPath: string, navigation: string, features: string[]) {
  const config = {
    navigation,
    features,
    componentsDir: navigation === 'expo-router' ? 'app' : 'screens',
    uiComponentsDir: 'components/ui',
  };

  await fs.writeJson(path.join(projectPath, 'lunar-kit.config.json'), config, { spaces: 2 });
}

program.parse();

// #!/usr/bin/env node
// import { Command } from 'commander';
// import prompts from 'prompts';
// import chalk from 'chalk';
// import ora from 'ora';
// import { execa } from 'execa';
// import fs from 'fs-extra';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const program = new Command();

// program
//   .name('create-lunar-kit')
//   .description('Create a new React Native app with Lunar Kit')
//   .argument('[project-name]', 'Name of your project')
//   .action(async (projectName?: string) => {
//     console.log(chalk.bold.cyan('\n🌙 Create Lunar Kit App\n'));

//     const response = await prompts([
//       {
//         type: projectName ? null : 'text',
//         name: 'projectName',
//         message: 'What is your project named?',
//         initial: 'my-lunar-app',
//         validate: (value: string) =>
//           /^[a-z0-9-]+$/.test(value) || 'Project name must be lowercase and use hyphens',
//       },
//       {
//         type: 'select',
//         name: 'packageManager',
//         message: 'Which package manager?',
//         choices: [
//           { title: 'pnpm', value: 'pnpm' },
//           { title: 'npm', value: 'npm' },
//           { title: 'yarn', value: 'yarn' },
//         ],
//         initial: 0,
//       },
//     ]);

//     const name = projectName || response.projectName;
//     const { packageManager } = response;

//     if (!name) {
//       console.log(chalk.red('Project name is required'));
//       process.exit(1);
//     }

//     const projectPath = path.join(process.cwd(), name);

//     if (fs.existsSync(projectPath)) {
//       console.log(chalk.red(`Directory ${name} already exists`));
//       process.exit(1);
//     }

//     const spinner = ora('Creating project...').start();

//     try {
//       // Create Expo app
//       spinner.text = 'Creating Expo app...';
//       await execa('npx', [
//         'create-expo-app@latest',
//         name,
//         '--template',
//         'blank-typescript',
//         '--no-install',
//       ]);

//       // Copy template files
//       spinner.text = 'Setting up Lunar Kit...';
//       const templatePath = path.join(__dirname, '../templates/base');
      
//       if (fs.existsSync(templatePath)) {
//         await fs.copy(templatePath, projectPath, { 
//           overwrite: true,
//           filter: (src) => !src.includes('node_modules')
//         });
//       }

//       // Update package.json with dependencies
//       const pkgPath = path.join(projectPath, 'package.json');
//       const pkg = await fs.readJson(pkgPath);
      
//       pkg.dependencies = {
//         ...pkg.dependencies,
//         'nativewind': '^4.2.1',
//         'clsx': '^2.1.1',
//         'tailwind-merge': '^3.4.0',
//       };
      
//       pkg.devDependencies = {
//         ...pkg.devDependencies,
//         'tailwindcss': '3.4.17',
//       };

//       await fs.writeJson(pkgPath, pkg, { spaces: 2 });

//       // Install dependencies
//       spinner.text = `Installing dependencies with ${packageManager}...`;
      
//       const installCmd = packageManager === 'yarn' ? 'yarn' : packageManager;
//       const installArgs = packageManager === 'npm' ? ['install'] : packageManager === 'yarn' ? [] : ['install'];
      
//       await execa(installCmd, installArgs, { cwd: projectPath });

//       spinner.succeed(chalk.green('Project created successfully! 🎉'));

//       console.log('\n' + chalk.bold('Next steps:\n'));
//       console.log(chalk.cyan(`  cd ${name}`));
//       console.log(chalk.cyan(`  ${packageManager === 'npm' ? 'npm start' : `${packageManager} start`}`));
//       console.log('\n' + chalk.bold('Add more components:\n'));
//       console.log(chalk.cyan('  pnpm dlx lk add card'));
//       console.log(chalk.dim('\nHappy coding! 🌙\n'));

//     } catch (error) {
//       spinner.fail('Failed to create project');
//       console.error(error);
//       process.exit(1);
//     }
//   });

// program.parse();
