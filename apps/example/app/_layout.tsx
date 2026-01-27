import React from 'react';
import '../src/global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/providers/theme-provider';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useThemeColors()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
}