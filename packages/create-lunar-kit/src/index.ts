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
      // 1. Create Expo app
      spinner.text = 'Creating Expo app...';
      const template = navigation === 'expo-router' ? 'blank-typescript' : 'blank-typescript';
      
      await execa('npx', [
        'create-expo-app@latest',
        name,
        '--template',
        template,
        '--no-install',
      ]);

      // 2. Create src/ structure
      spinner.text = 'Setting up project structure...';
      await createSrcStructure(projectPath, navigation);

      // 3. Move App.tsx to src/ and create new App.tsx as entry
      await setupAppEntry(projectPath, navigation);

      // 4. Setup navigation-specific files
      if (navigation === 'expo-router') {
        spinner.text = 'Setting up Expo Router...';
        await setupExpoRouterSrc(projectPath);
      } else if (navigation === 'react-navigation') {
        spinner.text = 'Setting up React Navigation...';
        await setupReactNavigationSrc(projectPath);
      }

      // 5. Setup features
      if (features.includes('auth')) {
        spinner.text = 'Setting up authentication...';
        await setupAuthSrc(projectPath, navigation);
      }

      if (features.includes('dark-mode')) {
        spinner.text = 'Setting up dark mode...';
        await setupDarkModeSrc(projectPath);
      }

      if (features.includes('forms')) {
        spinner.text = 'Setting up forms...';
        await setupFormsSrc(projectPath);
      }

      if (features.includes('state')) {
        spinner.text = 'Setting up state management...';
        await setupStateSrc(projectPath);
      }

      // 6. Setup NativeWind configs
      await setupNativeWind(projectPath);

      // 7. Update package.json
      spinner.text = 'Updating dependencies...';
      await updatePackageJson(projectPath, navigation, features);

      // 8. Create lunar-kit.config.json
      await createConfig(projectPath, navigation, features);

      // 9. Install dependencies
      spinner.text = `Installing dependencies with ${packageManager}...`;
      
      const installCmd = packageManager === 'yarn' ? 'yarn' : packageManager;
      const installArgs = packageManager === 'npm' ? ['install'] : packageManager === 'yarn' ? [] : ['install'];
      
      await execa(installCmd, installArgs, { cwd: projectPath });

      spinner.succeed(chalk.green('Project created successfully! 🎉'));

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

    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(error);
      process.exit(1);
    }
  });

// Helper functions

async function createSrcStructure(projectPath: string, navigation: string) {
  const dirs = [
    'src/modules',
    'src/components/ui',
    'src/lib',
    'src/hooks',
    'src/stores',
    'src/types',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Create barrel exports
  await createBarrelExport(path.join(projectPath, 'src/components'), 'index.ts');
  await createBarrelExport(path.join(projectPath, 'src/hooks'), 'index.ts');
  await createBarrelExport(path.join(projectPath, 'src/stores'), 'index.ts');
}

async function createBarrelExport(dir: string, filename: string) {
  const content = `// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\n`;
  await fs.writeFile(path.join(dir, filename), content);
}

async function setupAppEntry(projectPath: string, navigation: string) {
  if (navigation === 'expo-router') {
    // ============================================
    // EXPO ROUTER SETUP
    // ============================================
    
    // 1. Delete App.tsx if exists (not needed for expo-router)
    const appTsxPath = path.join(projectPath, 'App.tsx');
    if (fs.existsSync(appTsxPath)) {
      await fs.remove(appTsxPath);
    }

    // 2. Delete index.ts if exists (conflicts with expo-router)
    const indexPath = path.join(projectPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      await fs.remove(indexPath);
    }

    const indexJsPath = path.join(projectPath, 'index.js');
    if (fs.existsSync(indexJsPath)) {
      await fs.remove(indexJsPath);
    }

    // 3. Update package.json to use expo-router entry
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.main = 'expo-router/entry';
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  } else {
    // ============================================
    // REACT NAVIGATION OR NO NAVIGATION SETUP
    // ============================================
    
    // 1. Delete index.ts if exists
    const indexPath = path.join(projectPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      await fs.remove(indexPath);
    }

    const indexJsPath = path.join(projectPath, 'index.js');
    if (fs.existsSync(indexJsPath)) {
      await fs.remove(indexJsPath);
    }

    // 2. Create App.tsx as entry point with proper export
    const appContent = `import Main from './src/Main';

export default function App() {
  return <Main />;
}`;

    await fs.writeFile(path.join(projectPath, 'App.tsx'), appContent);

    // 3. Update package.json to remove main field (use Expo default)
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    
    // Remove main field, let Expo find App.tsx automatically
    if (pkg.main) {
      delete pkg.main;
    }
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // 4. Update app.json to set entryPoint
    const appJsonPath = path.join(projectPath, 'app.json');
    if (fs.existsSync(appJsonPath)) {
      const appJson = await fs.readJson(appJsonPath);
      if (!appJson.expo) {
        appJson.expo = {};
      }
      appJson.expo.entryPoint = './App.tsx';
      await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
    }

    // 5. Create src/Main.tsx
    const mainContent = `import './global.css';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { Button } from './components/ui/button';

export default function Main() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => alert('Hello Lunar Kit!')}>
        Get Started
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}`;

    await fs.writeFile(path.join(projectPath, 'src', 'Main.tsx'), mainContent);
  }
}


// async function setupAppEntry(projectPath: string, navigation: string) {
//   // Create App.tsx as entry point
//   const appContent = navigation === 'expo-router' 
//     ? `import 'expo-router/entry';`
//     : `import Main from './src/Main';

// export default function App() {
//   return <Main />;
// }`;

//   await fs.writeFile(path.join(projectPath, 'App.tsx'), appContent);

//   // Create src/Main.tsx
//   if (navigation !== 'expo-router') {
//     const mainContent = `import './global.css';
// import { StatusBar } from 'expo-status-bar';
// import { View, Text } from 'react-native';
// import { Button } from './components/ui/button';

// export default function Main() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-3xl font-bold text-slate-900 mb-2">
//         🌙 Lunar Kit
//       </Text>
//       <Text className="text-slate-600 mb-8">
//         Your app is ready!
//       </Text>
//       <Button onPress={() => alert('Hello Lunar Kit!')}>
//         Get Started
//       </Button>
//       <StatusBar style="auto" />
//     </View>
//   );
// }`;

//     await fs.writeFile(path.join(projectPath, 'src', 'Main.tsx'), mainContent);
//   }
// }

// async function setupExpoRouterSrc(projectPath: string) {
//   // Create app/ folder for expo-router
//   const appDir = path.join(projectPath, 'app');
//   await fs.ensureDir(appDir);

//   // Create _layout.tsx
//   const layoutContent = `import '../src/global.css';
// import { Stack } from 'expo-router';

// export default function Layout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }`;

//   await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);

//   // Create index.tsx
//   const indexContent = `import { View, Text } from 'react-native';
// import { Button } from '@/src/components/ui/button';

// export default function Index() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-3xl font-bold text-slate-900 mb-2">
//         🌙 Lunar Kit
//       </Text>
//       <Text className="text-slate-600 mb-8">
//         Your app is ready!
//       </Text>
//       <Button onPress={() => alert('Hello Lunar Kit!')}>
//         Get Started
//       </Button>
//     </View>
//   );
// }`;

//   await fs.writeFile(path.join(appDir, 'index.tsx'), indexContent);
// }
async function setupExpoRouterSrc(projectPath: string) {
  // Create app/ folder for expo-router
  const appDir = path.join(projectPath, 'app');
  await fs.ensureDir(appDir);

  // Create _layout.tsx
  const layoutContent = `import React from 'react';
import '../src/global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}`;

  await fs.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);

  // Create index.tsx (home screen)
  const indexContent = `import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';

export default function IndexScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => alert('Hello Lunar Kit!')}>
        Get Started
      </Button>
    </View>
  );
}`;

  await fs.writeFile(path.join(appDir, 'index.tsx'), indexContent);
}

async function setupReactNavigationSrc(projectPath: string) {
  // Create navigation setup in src/
  const navContent = `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';

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

  await fs.writeFile(path.join(projectPath, 'src', 'Navigation.tsx'), navContent);

  // Create HomeScreen
  const homeContent = `import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../components/ui/button';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => alert('Hello Lunar Kit!')}>
        Get Started
      </Button>
    </View>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'screens', 'HomeScreen.tsx'), homeContent);

  // Update Main.tsx to use Navigation
  const mainContent = `import React from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation';

export default function Main() {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'Main.tsx'), mainContent);
}

async function setupAuthSrc(projectPath: string, navigation: string) {
  const authDir = navigation === 'expo-router' 
    ? path.join(projectPath, 'app', '(auth)')
    : path.join(projectPath, 'src', 'screens', 'auth');
  
  await fs.ensureDir(authDir);
  
  const loginScreen = `import { View, Text } from 'react-native';
import { Button } from '@/src/components/ui/button';

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

async function setupDarkModeSrc(projectPath: string) {
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

  await fs.ensureDir(path.join(projectPath, 'src', 'contexts'));
  await fs.writeFile(path.join(projectPath, 'src', 'contexts', 'ThemeContext.tsx'), themeContent);
}

async function setupFormsSrc(projectPath: string) {
  // Add example form hook
  const hookContent = `import { useState } from 'react';

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = (validationRules: Partial<Record<keyof T, (value: any) => string | undefined>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key as keyof T]?.(values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'hooks', 'useForm.ts'), hookContent);
}

async function setupStateSrc(projectPath: string) {
  const storeContent = `import { create } from 'zustand';

interface AppState {
  user: null | { id: string; name: string };
  setUser: (user: AppState['user']) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));`;

  await fs.ensureDir(path.join(projectPath, 'src', 'stores'));
  await fs.writeFile(path.join(projectPath, 'src', 'stores', 'app.ts'), storeContent);
}

// async function setupNativeWind(projectPath: string) {
//   // Create global.css in src/
//   const globalCss = `@tailwind base;
// @tailwind components;
// @tailwind utilities;`;

//   await fs.writeFile(path.join(projectPath, 'src', 'global.css'), globalCss);

//   // Create tailwind.config.js
//   const tailwindConfig = `/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.{js,jsx,ts,tsx}",
//     "./app/**/*.{js,jsx,ts,tsx}",
//     "./src/**/*.{js,jsx,ts,tsx}"
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }`;

//   await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

//   // Create metro.config.js
//   const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, {
//   input: './src/global.css',
// });`;

//   await fs.writeFile(path.join(projectPath, 'metro.config.js'), metroConfig);

//   // Create babel.config.js
//   const babelConfig = `module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
//     ],
//     plugins: [
//       'nativewind/babel'
//     ]
//   };
// };`;

//   await fs.writeFile(path.join(projectPath, 'babel.config.js'), babelConfig);

//   // Create nativewind-env.d.ts
//   const nativewindEnv = `/// <reference types="nativewind/types" />`;
//   await fs.writeFile(path.join(projectPath, 'nativewind-env.d.ts'), nativewindEnv);

//   // Create utils
//   const utilsContent = `import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }`;

//   await fs.writeFile(path.join(projectPath, 'src', 'lib', 'utils.ts'), utilsContent);

//   // Create Button component
//   const buttonContent = `import * as React from 'react';
// import { Pressable, Text } from 'react-native';
// import { cn } from '../../lib/utils';

// interface ButtonProps {
//   children: React.ReactNode;
//   variant?: 'default' | 'outline' | 'ghost';
//   size?: 'default' | 'sm' | 'lg';
//   onPress?: () => void;
//   className?: string;
// }

// export function Button({
//   children,
//   variant = 'default',
//   size = 'default',
//   onPress,
//   className,
// }: ButtonProps) {
//   return (
//     <Pressable
//       onPress={onPress}
//       className={cn(
//         'items-center justify-center rounded-md',
//         {
//           'bg-slate-900': variant === 'default',
//           'border border-slate-200': variant === 'outline',
//           'bg-transparent': variant === 'ghost',
//         },
//         {
//           'h-10 px-4': size === 'default',
//           'h-9 px-3': size === 'sm',
//           'h-11 px-8': size === 'lg',
//         },
//         className
//       )}
//     >
//       <Text
//         className={cn(
//           'font-medium',
//           {
//             'text-slate-50': variant === 'default',
//             'text-slate-900': variant === 'outline' || variant === 'ghost',
//           },
//           {
//             'text-sm': size === 'default' || size === 'sm',
//             'text-base': size === 'lg',
//           }
//         )}
//       >
//         {children}
//       </Text>
//     </Pressable>
//   );
// }`;

//   await fs.writeFile(path.join(projectPath, 'src', 'components', 'ui', 'button.tsx'), buttonContent);

//   // Create tsconfig path aliases
//   const tsconfigContent = `{
//   "extends": "expo/tsconfig.base",
//   "compilerOptions": {
//     "strict": true,
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["./src/*"],
//       "@modules/*": ["./src/modules/*"],
//       "@components/*": ["./src/components/*"],
//       "@hooks/*": ["./src/hooks/*"],
//       "@stores/*": ["./src/stores/*"],
//       "@lib/*": ["./src/lib/*"]
//     }
//   }
// }`;

//   await fs.writeFile(path.join(projectPath, 'tsconfig.json'), tsconfigContent);
// }
async function setupNativeWind(projectPath: string) {
  // Create global.css in src/
  const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

  await fs.writeFile(path.join(projectPath, 'src', 'global.css'), globalCss);

  // Create tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

  // Create metro.config.js - CORRECT FORMAT
  const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './src/global.css',
});`;

  await fs.writeFile(path.join(projectPath, 'metro.config.js'), metroConfig);

  // Create babel.config.js - FIX: Correct plugin format
  const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
  };
};`;

  await fs.writeFile(path.join(projectPath, 'babel.config.js'), babelConfig);

  // Create nativewind-env.d.ts
  const nativewindEnv = `/// <reference types="nativewind/types" />`;
  await fs.writeFile(path.join(projectPath, 'nativewind-env.d.ts'), nativewindEnv);

  // Create utils
  const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'utils.ts'), utilsContent);

  // Create Button component
  const buttonContent = `import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onPress?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'items-center justify-center rounded-md',
        {
          'bg-slate-900': variant === 'default',
          'border border-slate-200': variant === 'outline',
          'bg-transparent': variant === 'ghost',
        },
        {
          'h-10 px-4': size === 'default',
          'h-9 px-3': size === 'sm',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
    >
      <Text
        className={cn(
          'font-medium',
          {
            'text-slate-50': variant === 'default',
            'text-slate-900': variant === 'outline' || variant === 'ghost',
          },
          {
            'text-sm': size === 'default' || size === 'sm',
            'text-base': size === 'lg',
          }
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'components', 'ui', 'button.tsx'), buttonContent);

  // Create tsconfig path aliases
  const tsconfigContent = `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@modules/*": ["./src/modules/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@stores/*": ["./src/stores/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}`;

  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), tsconfigContent);
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

  if (navigation === 'expo-router') {
    pkg.dependencies['expo-router'] = '^6.0.22';
    pkg.dependencies['react-native-screens'] = '~4.16.0';
    pkg.dependencies['react-native-safe-area-context'] = '^5.6.2';
  }

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
    '@expo/metro-config': '^0.20.3',
    'react-native-css-interop': '^0.2.1',
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

async function createConfig(projectPath: string, navigation: string, features: string[]) {
  const config = {
    navigation,
    features,
    architecture: 'modular',
    srcDir: 'src',
    modulesDir: 'src/modules',
    componentsDir: 'src/components',
    hooksDir: 'src/hooks',
    storesDir: 'src/stores',
    uiComponentsDir: 'src/components/ui',
    namingConvention: {
      files: 'snake_case',
      exports: 'PascalCase',
      hooks: 'camelCase',
    },
    autoRouting: true,
    autoImport: true,
    autoBarrelExport: true,
  };

  await fs.writeJson(path.join(projectPath, 'kit.config.json'), config, { spaces: 2 });
}


program.parse();
