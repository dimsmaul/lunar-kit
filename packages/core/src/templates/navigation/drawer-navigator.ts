/**
 * Drawer Navigator Template (React Navigation)
 * 
 * Usage: lunar g nav:drawer
 * Generates: src/navigation/main_drawer.tsx
 */

export interface DrawerNavigatorTemplateOptions {
  drawerName: string;
  screens: string[];
}

export function generateDrawerNavigatorTemplate(options: DrawerNavigatorTemplateOptions): string {
  const { drawerName, screens } = options;
  const exportName = `${toPascalCase(drawerName)}Drawer`;

  const screenImports = screens
    .map((screen) => {
      const screenName = toPascalCase(screen);
      return `import ${screenName}Screen from '@screens/${toSnakeCase(screen)}_screen';`;
    })
    .join('\n');

  const screenComponents = screens
    .map((screen) => {
      const screenName = toPascalCase(screen);
      const iconName = getIconForScreen(screen.toLowerCase());
      return `      <Drawer.Screen
        name="${screenName}"
        component={${screenName}Screen}
        options={{
          title: '${screenName}',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="${iconName}" size={size} color={color} />
          ),
        }}
      />`;
    })
    .join('\n');

  const paramList = screens
    .map((screen) => `  ${toPascalCase(screen)}: undefined;`)
    .join('\n');

  return `import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
${screenImports}

type ${toPascalCase(drawerName)}ParamList = {
${paramList}
};

const Drawer = createDrawerNavigator<${toPascalCase(drawerName)}ParamList>();

export function ${exportName}() {
  return (
    <Drawer.Navigator
      initialRouteName="${toPascalCase(screens[0] || 'Home')}"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#999',
      }}
    >
${screenComponents}
    </Drawer.Navigator>
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

function getIconForScreen(screenName: string): string {
  const iconMap: Record<string, string> = {
    home: 'home-outline',
    search: 'search-outline',
    profile: 'person-outline',
    settings: 'settings-outline',
    favorites: 'heart-outline',
    notifications: 'notifications-outline',
    messages: 'chatbubble-outline',
    default: 'square-outline',
  };
  return iconMap[screenName] || iconMap.default;
}

export default generateDrawerNavigatorTemplate;
