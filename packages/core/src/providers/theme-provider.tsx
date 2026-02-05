// providers/theme-provider.tsx
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import { lightTheme, darkTheme } from '@/lib/theme';
import { useThemeStore } from '@/stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceTheme = useDeviceColorScheme();
    const { setColorScheme } = useColorScheme();
    const theme = useThemeStore((state) => state.theme);

    const activeColorScheme =
        theme === 'system'
            ? deviceTheme ?? 'light'
            : theme;

    useEffect(() => {
        setColorScheme(activeColorScheme);
    }, [activeColorScheme, setColorScheme]);

    const themeVars = activeColorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <>
            <StatusBar 
                barStyle={activeColorScheme === 'dark' ? 'light-content' : 'dark-content'} 
                animated
            />
            <View style={themeVars} className="flex-1 bg-background text-foreground">
                {children}
            </View>
        </>
    );
}
