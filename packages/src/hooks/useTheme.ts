// hooks/use-theme.ts
import { useThemeStore } from '@/stores';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export function useTheme() {
  const deviceTheme = useDeviceColorScheme();
  const { theme, setTheme } = useThemeStore();

  const activeColorScheme =
    theme === 'system'
      ? deviceTheme === 'dark'
        ? 'dark'
        : 'light'
      : theme === 'dark'
        ? 'dark'
        : 'light';

  return {
    theme,
    colorScheme: activeColorScheme,
    setTheme,
  };
}
