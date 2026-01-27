// hooks/use-toolbar.tsx
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useThemeColors } from './useThemeColors';

interface HeaderOptions {
  headerShown?: boolean;
  title?: string;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  headerStyle?: {
    backgroundColor?: string;
  };
  headerTintColor?: string;
  headerTitleStyle?: {
    fontWeight?: string;
    fontSize?: number;
  };
  headerShadowVisible?: boolean;
}

interface UseToolbarOptions {
  title?: string;
  backHandle?: () => void;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export function useToolbar(options: UseToolbarOptions) {
  const navigation = useNavigation();
  const { colors } = useThemeColors();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: options.title || '',
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.foreground,
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
      },
      headerShadowVisible: false,
      ...(options.backHandle !== undefined && {
        headerLeft: () => (
          <Pressable onPress={options.backHandle} className="ml-4">
            <Text style={{ fontSize: 18, color: colors.foreground }}>←</Text>
          </Pressable>
        ),
      }),
      ...(options.right && {
        headerRight: () => <>{options.right}</>,
      }),
      ...(options.left && {
        headerLeft: () => <>{options.left}</>,
      }),
    });
  }, [navigation, colors.background, colors.foreground, options.title, options.backHandle, options.right, options.left]);
}
