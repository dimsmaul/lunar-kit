/**
 * Stack Navigator Template (React Navigation)
 * 
 * Usage: lunar g nav:stack
 * Generates: src/navigation/main_navigator.tsx
 */

export interface StackNavigatorTemplateOptions {
  stackName: string;
  screens: string[];
}

export function generateStackNavigatorTemplate(options: StackNavigatorTemplateOptions): string {
  const { stackName, screens } = options;
  const exportName = `${toPascalCase(stackName)}Navigator`;

  const screenImports = screens
    .map((screen) => {
      const screenName = toPascalCase(screen);
      return `import ${screenName}Screen from '@screens/${toSnakeCase(screen)}_screen';`;
    })
    .join('\n');

  const screenComponents = screens
    .map((screen) => {
      const screenName = toPascalCase(screen);
      return `      <Stack.Screen name="${screenName}" component={${screenName}Screen} options={{ title: '${screenName}' }} />`;
    })
    .join('\n');

  const paramList = screens
    .map((screen) => `  ${toPascalCase(screen)}: undefined;`)
    .join('\n');

  return `import { createStackNavigator } from '@react-navigation/stack';
${screenImports}

type ${toPascalCase(stackName)}ParamList = {
${paramList}
};

const Stack = createStackNavigator<${toPascalCase(stackName)}ParamList>();

export function ${exportName}() {
  return (
    <Stack.Navigator
      initialRouteName="${toPascalCase(screens[0] || 'Home')}"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
${screenComponents}
    </Stack.Navigator>
  );
}
`;
}

function toPascalCase(str: string): string {
  return str
    .replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

export default generateStackNavigatorTemplate;
