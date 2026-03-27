/**
 * Test Setup Template (Jest)
 * 
 * Usage: lunar g test setup
 * Generates: __tests__/jest.setup.ts
 */

export function generateTestSetupTemplate(): string {
  return `import '@testing-library/react-native/extend-expect';

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
}

export default generateTestSetupTemplate;
