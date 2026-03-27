/**
 * Tab Navigator Template (React Navigation)
 * 
 * Usage: lunar g nav:tab
 * Generates: src/navigation/main_tabs.tsx
 */

export interface TabNavigatorTemplateOptions {
  tabName: string;
  tabs: string[];
}

export function generateTabNavigatorTemplate(options: TabNavigatorTemplateOptions): string {
  const { tabName, tabs } = options;
  const exportName = `${toPascalCase(tabName)}Tabs`;

  const screenImports = tabs
    .map((tab) => {
      const screenName = toPascalCase(tab);
      return `import ${screenName}Screen from '@screens/${toSnakeCase(tab)}_screen';`;
    })
    .join('\n');

  const screenComponents = tabs
    .map((tab, index) => {
      const screenName = toPascalCase(tab);
      const iconName = getIconForTab(tab.toLowerCase());
      return `      <Tabs.Screen
        name="${screenName}"
        component={${screenName}Screen}
        options={{
          title: '${screenName}',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="${iconName}" size={size} color={color} />
          ),
        }}
      />`;
    })
    .join('\n');

  const paramList = tabs
    .map((tab) => `  ${toPascalCase(tab)}: undefined;`)
    .join('\n');

  return `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
${screenImports}

type ${toPascalCase(tabName)}ParamList = {
${paramList}
};

const Tabs = createBottomTabNavigator<${toPascalCase(tabName)}ParamList>();

export function ${exportName}() {
  return (
    <Tabs.Navigator
      initialRouteName="${toPascalCase(tabs[0] || 'Home')}"
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
      }}
    >
${screenComponents}
    </Tabs.Navigator>
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

function getIconForTab(tabName: string): string {
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
  return iconMap[tabName] || iconMap.default;
}

export default generateTabNavigatorTemplate;
