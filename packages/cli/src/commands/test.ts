import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig, toSnakeCase, toPascalCase } from '../utils/helpers.js';
import {
  generateModuleTestTemplate,
  generateTestSetupTemplate,
  generateTestUtilsTemplate,
  generateMocksTemplate,
} from '@lunar-kit/core/templates';

// Check if testing is setup in kit.config.json
async function isTestingConfigured(): Promise<{ configured: boolean; framework?: 'jest' | 'rntl' }> {
  const config = await loadConfig();
  if (!config) {
    return { configured: false };
  }

  // Check if testing is configured in kit.config.json
  const hasTestingConfig = config.testing?.enabled || config.testing?.framework;
  
  if (!hasTestingConfig) {
    return { configured: false };
  }

  return {
    configured: true,
    framework: config.testing?.framework || 'jest',
  };
}

// Check if test files exist
async function hasTestFiles(): Promise<boolean> {
  const testDir = path.join(process.cwd(), '__tests__');
  const jestConfig = path.join(process.cwd(), 'jest.config.js');
  
  const hasJestConfig = await fs.pathExists(jestConfig);
  const hasTestDir = await fs.pathExists(testDir);
  
  return hasJestConfig && hasTestDir;
}

// Setup testing framework
async function setupTestingFramework() {
  const spinner = ora('Setting up testing framework...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // Ask about testing framework
    const response = await prompts([
      {
        type: 'select',
        name: 'framework',
        message: 'Which testing framework do you want to use?',
        choices: [
          { title: 'Jest + React Native Testing Library (RNTL)', value: 'rntl' },
          { title: 'Jest only', value: 'jest' },
        ],
      },
    ]);

    spinner.start('Setting up testing framework...');

    const testDir = path.join(process.cwd(), '__tests__');
    await fs.ensureDir(testDir);

    // Generate jest.config.js
    const jestConfig = `module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|@lunar-kit)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};
`;

    await fs.writeFile(path.join(process.cwd(), 'jest.config.js'), jestConfig);

    // Generate jest.setup.ts
    const setupContent = `import '@testing-library/react-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    FlatList: View,
    ScrollView: View,
    Slider: View,
    Switch: View,
    DrawerLayout: View,
    GestureDetector: View,
    GestureHandlerRootView: View,
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: require('react-native').Text,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: (callback: any) => React.useEffect(callback, []),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
`;

    await fs.writeFile(path.join(testDir, 'jest.setup.ts'), setupContent);

    // Generate test-utils.tsx if using RNTL
    if (response.framework === 'rntl') {
      const utilsContent = `import { render as nativeRender, RenderOptions, RenderAPI } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withNavigation?: boolean;
  withSafeArea?: boolean;
}

interface AllProvidersProps {
  children: React.ReactNode;
  withNavigation?: boolean;
  withSafeArea?: boolean;
}

function AllProviders({
  children,
  withNavigation = false,
  withSafeArea = true,
}: AllProvidersProps) {
  let content = children;

  if (withNavigation) {
    content = <NavigationContainer>{content}</NavigationContainer>;
  }

  if (withSafeArea) {
    content = <SafeAreaProvider>{content}</SafeAreaProvider>;
  }

  return content;
}

function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderAPI {
  const { withNavigation = false, withSafeArea = true, ...renderOptions } = options || {};

  return nativeRender(ui, {
    wrapper: (props) => (
      <AllProviders withNavigation={withNavigation} withSafeArea={withSafeArea}>
        {props.children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

export * from '@testing-library/react-native';
export { customRender as render };
`;

      await fs.writeFile(path.join(testDir, 'test-utils.tsx'), utilsContent);
    }

    // Update kit.config.json
    config.testing = {
      enabled: true,
      framework: response.framework,
    };
    await fs.writeJson(path.join(process.cwd(), 'kit.config.json'), config, { spaces: 2 });

    // Update package.json with test script
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (!packageJson.scripts) packageJson.scripts = {};
    packageJson.scripts.test = 'jest';
    packageJson.scripts['test:watch'] = 'jest --watch';
    packageJson.scripts['test:coverage'] = 'jest --coverage';
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    spinner.succeed(chalk.green('Testing framework setup complete!'));
    console.log(chalk.cyan('  __tests__/jest.setup.ts'));
    if (response.framework === 'rntl') {
      console.log(chalk.cyan('  __tests__/test-utils.tsx'));
    }
    console.log(chalk.cyan('  jest.config.js'));
    console.log(chalk.dim('\nTesting configuration added to kit.config.json'));

  } catch (error) {
    spinner.fail('Failed to setup testing framework');
    console.error(error);
  }
}

// Generate module-scoped test file
export async function generateModuleTest(fullPath: string) {
  const spinner = ora('Generating module test...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // Check if testing is configured
    const testingStatus = await isTestingConfigured();
    const hasTests = await hasTestFiles();
    
    if (!testingStatus.configured && !hasTests) {
      spinner.stop();
      console.log(chalk.yellow('⚠ Testing is not configured in your project.'));
      
      const response = await prompts([
        {
          type: 'confirm',
          name: 'setupNow',
          message: 'Do you want to setup testing now?',
          initial: true,
        },
      ]);

      if (response.setupNow) {
        await setupTestingFramework();
      } else {
        console.log(chalk.dim('Tip: Configure testing in kit.config.json manually.'));
        return;
      }
    }

    // Parse path: auth/login → modulePath: auth, testName: login
    const parts = fullPath.split('/');
    if (parts.length < 2) {
      spinner.fail('Invalid format. Use: module/test-name (e.g., auth/auth-screen.test)');
      return;
    }

    const modulePath = parts.slice(0, -1).join('/');
    const testName = parts[parts.length - 1];

    const moduleFullPath = path.join(process.cwd(), config.modulesDir, modulePath);

    if (!fs.existsSync(moduleFullPath)) {
      spinner.fail(`Module ${modulePath} does not exist.`);
      return;
    }

    const testDir = path.join(moduleFullPath, '__tests__');
    await fs.ensureDir(testDir);

    const fileName = `${toSnakeCase(testName)}.test.tsx`;

    const testContent = generateModuleTestTemplate({
      testName,
      moduleName: modulePath,
    });

    const filePath = path.join(testDir, fileName);
    await fs.writeFile(filePath, testContent);

    spinner.succeed(chalk.green(`Test ${testName} created in module ${modulePath}`));
    console.log(chalk.cyan(`  ${config.modulesDir}/${modulePath}/__tests__/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate test');
    console.error(error);
  }
}

// Generate global test helper/setup
export async function generateGlobalTest(testType: string) {
  const spinner = ora('Generating test helper...').start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found.');
      return;
    }

    // Check if testing is configured
    const testingStatus = await isTestingConfigured();
    const hasTests = await hasTestFiles();
    
    if (!testingStatus.configured && !hasTests) {
      spinner.stop();
      console.log(chalk.yellow('⚠ Testing is not configured in your project.'));
      
      const response = await prompts([
        {
          type: 'confirm',
          name: 'setupNow',
          message: 'Do you want to setup testing now?',
          initial: true,
        },
      ]);

      if (response.setupNow) {
        await setupTestingFramework();
        spinner.start('Generating test helper...');
      } else {
        console.log(chalk.dim('Tip: Configure testing in kit.config.json manually.'));
        return;
      }
    }

    const testDir = path.join(process.cwd(), '__tests__');
    await fs.ensureDir(testDir);

    // If no type specified, ask user
    if (!testType) {
      const response = await prompts([
        {
          type: 'select',
          name: 'type',
          message: 'What type of test helper do you want to create?',
          choices: [
            { title: 'Test Setup (jest.setup.ts)', value: 'setup' },
            { title: 'Test Utilities (test-utils.tsx)', value: 'utils' },
            { title: 'Mock Data (mocks.ts)', value: 'mocks' },
          ],
        },
      ]);
      testType = response.type;
    }

    let fileName: string;
    let fileContent: string;

    switch (testType) {
      case 'setup':
        fileName = 'jest.setup.ts';
        fileContent = generateTestSetupTemplate();
        break;

      case 'utils':
        fileName = 'test-utils.tsx';
        fileContent = generateTestUtilsTemplate();
        break;

      case 'mocks':
        fileName = 'mocks.ts';
        fileContent = generateMocksTemplate();
        break;

      default:
        spinner.fail(`Unknown test type: ${testType}`);
        return;
    }

    const filePath = path.join(testDir, fileName);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      spinner.warn(`File ${fileName} already exists`);
      const response = await prompts([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Do you want to overwrite it?',
          initial: false,
        },
      ]);
      if (!response.overwrite) {
        console.log(chalk.yellow('File creation cancelled.'));
        return;
      }
    }

    await fs.writeFile(filePath, fileContent);

    spinner.succeed(chalk.green(`Test ${testType} created`));
    console.log(chalk.cyan(`  __tests__/${fileName}`));

  } catch (error) {
    spinner.fail('Failed to generate test helper');
    console.error(error);
  }
}
