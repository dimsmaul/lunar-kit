import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';
import { lightThemeColors, darkThemeColors } from '@/lib/theme';

export function useThemeColors() {
  const { colorScheme } = useColorScheme();

  const colors = useMemo(() => {
    const result = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
    return result;
  }, [colorScheme]);

  return { colors, colorScheme: colorScheme ?? 'light' };
}
