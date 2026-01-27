// // hooks/use-theme-colors.ts
// import { useMemo } from 'react';
// import { useColorScheme as useDeviceColorScheme } from 'react-native';
// import { useColorScheme } from 'nativewind'; // PENTING: Tambahin ini
// import { useThemeStore } from '@/stores';
// import { lightThemeColors, darkThemeColors } from '@/lib/theme';

// export function useThemeColors() {
//   const deviceTheme = useDeviceColorScheme();
//   const theme = useThemeStore((state) => state.theme);
//   const { colorScheme } = useColorScheme(); // Subscribe ke NativeWind color scheme

//   const activeColorScheme = useMemo(() => {
//     return theme === 'system' ? deviceTheme ?? 'light' : theme;
//   }, [theme, deviceTheme]);

//   const colors = useMemo(() => {
//     // Pakai colorScheme dari NativeWind sebagai source of truth
//     return colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
//   }, [colorScheme]); // Dependency ke colorScheme dari NativeWind

//   return { colors, colorScheme: activeColorScheme };
// }
// hooks/use-theme-colors.ts
import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';
import { lightThemeColors, darkThemeColors } from '@/lib/theme';

export function useThemeColors() {
  const { colorScheme } = useColorScheme();

  const colors = useMemo(() => {
    const result = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
    console.log('🎨 useThemeColors - colorScheme:', colorScheme, 'background:', result.background);
    return result;
  }, [colorScheme]);

  return { colors, colorScheme: colorScheme ?? 'light' };
}
