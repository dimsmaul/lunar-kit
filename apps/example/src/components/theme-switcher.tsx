// components/theme-switcher.tsx
import { View, Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <View className="flex-row gap-2 p-4 bg-card rounded-lg">
            {(['light', 'dark', 'system'] as const).map((mode) => (
                <Pressable
                    key={mode}
                    onPress={() => setTheme(mode)}
                    className={cn(
                        'flex-1 py-2 px-4 rounded-md border',
                        theme === mode
                            ? 'bg-primary border-primary'
                            : 'bg-transparent border-input'
                    )}
                >
                    <Text
                        className={cn(
                            'text-center capitalize',
                            theme === mode ? 'text-primary-foreground' : 'text-foreground'
                        )}
                    >
                        {mode}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
