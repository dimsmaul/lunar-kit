import fs from 'fs-extra';
import path from 'node:path';


const REGISTRY_URL = 'https://raw.githubusercontent.com/yourusername/lunar-kit/main/registry';
const LOCAL_REGISTRY = path.join(__dirname, '../..', 'src', 'registry');
const COMPONENTS_SOURCE = path.join(__dirname, '../..', 'src', 'components');

const SOURCE = path.join(__dirname, '../..', 'src');

/**
 * @Create src/ structure
 */
export async function createSrcStructure(projectPath: string, navigation: string) {
  const dirs = [
    'src/modules',
    'src/components/ui',
    'src/lib',
    'src/hooks',
    'src/providers',
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


/**
 * @Setup app entry point
 */
export async function createBarrelExport(dir: string, filename: string) {
  const content = `// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\n`;
  await fs.writeFile(path.join(dir, filename), content);
}

/**
 * @Setup app entry point
 */

export async function setupAppEntry(projectPath: string, navigation: string) {
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
    // TODO: need to fix
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

/**
 * @Setup NativeWind
 */
export async function setupExpoRouterSrc(projectPath: string) {
  // Create app/ folder for expo-router
  const appDir = path.join(projectPath, 'app');
  await fs.ensureDir(appDir);

  // Create _layout.tsx
  const layoutContent = `import React from 'react';
import '../src/global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/providers/theme-provider';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useThemeColors()
  return (<GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
            
          },
        }} key={colorScheme} />
      </ThemeProvider>
    </GestureHandlerRootView>
);
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

export async function setupReactNavigationSrc(projectPath: string) {
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

export async function setupAuthSrc(projectPath: string, navigation: string) {
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

export async function setupDarkModeSrc(projectPath: string, navigation: string) {
// export const useTheme = () => useContext(ThemeContext);`;
  const themeProvider = fs.readFileSync(
    path.join(SOURCE, 'providers', 'theme-provider.tsx'),
  );

  // Store
  const themeStore = fs.readFileSync(
    path.join(SOURCE, 'stores', 'theme.ts'),
  );
  // update export theme.ts on stores/index.ts
  const storesIndexPath = path.join(projectPath, 'src', 'stores', 'index.ts');
  let storesIndexContent = `// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\n`;
  storesIndexContent += `export * from './theme';\n`;
  await fs.writeFile(storesIndexPath, storesIndexContent);

  // Hooks
  // expo-router, react-navigation
  let toolbarContent: Buffer;
  if (navigation === 'expo-router') {
    toolbarContent = fs.readFileSync(
      path.join(SOURCE, 'hooks', 'useToolbar.tsx'),
    )
  } else {
    toolbarContent = fs.readFileSync(
      path.join(SOURCE, 'hooks', 'useToolbar.react-navigation.tsx'),
    )
  }

  // theme
  const themeContent = fs.readFileSync(
    path.join(SOURCE, 'hooks', 'useTheme.ts'),
  );

  const themeColor = fs.readFileSync(
    path.join(SOURCE, 'hooks', 'useThemeColors.ts'),
  );

  const libTheme = fs.readFileSync(
    path.join(SOURCE, 'lib', 'theme.ts'),
  );

  await fs.ensureDir(path.join(projectPath, 'src', 'providers'));
  await fs.writeFile(path.join(projectPath, 'src', 'providers', 'theme-provider.tsx'), themeProvider);

  await fs.ensureDir(path.join(projectPath, 'src', 'stores'));
  await fs.writeFile(path.join(projectPath, 'src', 'stores', 'theme.ts'), themeStore);

  // Hooks
  await fs.ensureDir(path.join(projectPath, 'src', 'hooks'));
  await fs.writeFile(path.join(projectPath, 'src', 'hooks', 'useToolbar.tsx'), toolbarContent);
  await fs.writeFile(path.join(projectPath, 'src', 'hooks', 'useTheme.ts'), themeContent);
  await fs.writeFile(path.join(projectPath, 'src', 'hooks', 'useThemeColors.ts'), themeColor);

  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'theme.ts'), libTheme);
}

export async function setupFormsSrc(projectPath: string) {
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

/**
 * TODO: need to adjust
 * @param projectPath 
 */
export async function setupStateSrc(projectPath: string) {
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

export async function setupNativeWind(projectPath: string) {
  // Create global.css in src/
  const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

  await fs.writeFile(path.join(projectPath, 'src', 'global.css'), globalCss);

  // Create tailwind.config.js
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
  const tailwindConfig = fs.readFileSync(
      path.join(SOURCE, 'tailwind.config.js'),
  )

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
//   const utilsContent = `import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }`;

  // read ./lib/theme.ts
  const utilsContent =  fs.readFileSync(
    path.join(SOURCE, 'lib', 'utils.ts'),
  )
  const colorsContent =  fs.readFileSync(
    path.join(SOURCE, 'lib', 'theme.ts'),
  )

  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'utils.ts'), utilsContent);
  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'theme.ts'), colorsContent);

  // Create Button component
  // components/ui/button.tsx
  const buttonContent = fs.readFileSync(
    path.join(COMPONENTS_SOURCE, 'ui', 'button.tsx'),
  )
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

/**
 * Feature setup: update package.json
 */
export async function updatePackageJson(projectPath: string, navigation: string, features: string[]) {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  
  pkg.dependencies = {
    ...pkg.dependencies,
    'nativewind': '^4.2.1',
    'clsx': '^2.1.1',
    'tailwind-merge': '^3.4.0',
    'class-variance-authority': '^0.7.1',
    '@react-native-async-storage/async-storage': '^2.2.0',
    'lucide-react-native': '^0.562.0',
    'react-native-gesture-handler': '^2.28.0',
    'react-native-reanimated': '^4.1.6',
    'react-native-safe-area-context': '^5.6.2',
    'react-native-worklets': '^0.5.1',
    'zustand': '^5.0.3',
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
    pkg.dependencies['@hookform/resolvers'] = '^5.2.2';
    pkg.dependencies['zod'] = '^4.3.6';

  }

  // if (features.includes('state')) {
  //   pkg.dependencies['zustand'] = '^5.0.3';
  // }
  
  pkg.devDependencies = {
    ...pkg.devDependencies,
    'tailwindcss': '3.4.17',
    '@expo/metro-config': '^0.20.3',
    'react-native-css-interop': '^0.2.1',
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

/**
 * Create kit.config.json
 */
export async function createConfig(projectPath: string, navigation: string, features: string[], packageManager: string) {
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
    packageManager, // DONE: Add this
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
