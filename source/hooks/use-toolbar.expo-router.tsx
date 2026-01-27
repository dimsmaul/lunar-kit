// registry/hooks/use-toolbar.expo-router.tsx
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Pressable, Text } from 'react-native';

interface UseToolbarOptions {
    title?: string;
    backHandle?: () => void;
    right?: React.ReactNode;
    left?: React.ReactNode;
}

export function useToolbar(options: UseToolbarOptions) {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        const navOptions: any = {
            headerShown: true,
            title: options.title || '',
        };

        if (options.backHandle !== undefined) {
            navOptions.headerLeft = () => (
                <Pressable onPress={options.backHandle} className="ml-4">
                    <Text className="text-lg">←</Text>
                </Pressable>
            );
        }

        if (options.right) {
            navOptions.headerRight = () => <>{options.right}</>;
        }

        if (options.left) {
            navOptions.headerLeft = () => <>{options.left}</>;
        }

        navigation.setOptions(navOptions);
    }, [navigation, options.title, options.backHandle, options.right, options.left]);
}
