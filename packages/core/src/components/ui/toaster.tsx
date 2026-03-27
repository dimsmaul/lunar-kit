// components/ui/toaster.tsx
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '../../stores/toast';
import { Toast } from './toast';

export function Toaster() {
    const { top, bottom } = useSafeAreaInsets();
    const toasts = useToastStore((state) => state.toasts);

    const topToasts = toasts.filter((t) => t.position !== 'bottom');
    const bottomToasts = toasts.filter((t) => t.position === 'bottom');

    return (
        <>
            <View 
                pointerEvents="box-none"
                style={[styles.topContainer, { paddingTop: top + 10 }]}
            >
                {topToasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </View>
            <View 
                pointerEvents="box-none"
                style={[styles.bottomContainer, { paddingBottom: bottom + 10 }]}
            >
                {bottomToasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
});
