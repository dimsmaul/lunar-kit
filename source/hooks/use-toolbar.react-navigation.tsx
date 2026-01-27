// registry/hooks/use-toolbar.react-navigation.tsx
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UseToolbarOptions {
    title?: string;
    backHandle?: () => void;
    right?: React.ReactNode;
    left?: React.ReactNode;
}

export function useToolbar(options: UseToolbarOptions) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: options.title || '',

            ...(options.backHandle !== undefined && {
                headerLeft: () => (
                    <Pressable onPress={options.backHandle} style={{ marginLeft: 16 }}>
                        <Text style={{ fontSize: 18 }}>←</Text>
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
    }, [navigation, options.title, options.backHandle, options.right, options.left]);
}
