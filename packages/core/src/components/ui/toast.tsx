import * as React from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    runOnJS,
    withSpring
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { useToastStore, type Toast as ToastType } from '../../stores/toast';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export function Toast({ 
    id, 
    title, 
    description, 
    variant = 'default', 
    duration = 3000,
    position = 'top',
    direction = 'top'
}: ToastType) {
    const { colors } = useThemeColors();
    const removeToast = useToastStore((state) => state.removeToast);
    
    // Initial values based on direction (now more subtle)
    const getInitialTranslate = () => {
        const offset = 20;
        switch (direction) {
            case 'left': return { x: -offset, y: 0 };
            case 'right': return { x: offset, y: 0 };
            case 'bottom': return { x: 0, y: offset };
            case 'top': 
            default: return { x: 0, y: -offset };
        }
    };

    const initial = getInitialTranslate();
    const translateX = useSharedValue(initial.x);
    const translateY = useSharedValue(initial.y);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        // Entry animation - Simple withTiming
        opacity.value = withTiming(1, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });

        const timer = setTimeout(() => {
            dismiss();
        }, duration);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dismiss = () => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(removeToast)(id);
        });
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            const shouldDismiss = 
                Math.abs(event.translationX) > SWIPE_THRESHOLD || 
                Math.abs(event.translationY) > SWIPE_THRESHOLD;

            if (shouldDismiss) {
                const destX = event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
                const destY = event.translationY > 0 ? 100 : -100;
                
                // If horizontal swipe is stronger, exit horizontally
                if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
                    translateX.value = withTiming(destX, { duration: 300 }, () => runOnJS(removeToast)(id));
                } else {
                    translateY.value = withTiming(destY, { duration: 300 }, () => runOnJS(removeToast)(id));
                }
            } else {
                translateX.value = withTiming(0, { duration: 200 });
                translateY.value = withTiming(0, { duration: 200 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
        opacity: opacity.value,
    }));

    const variantStyles = {
        default: 'bg-background/80 border-border',
        success: 'bg-green-100/80 border-green-300 dark:bg-green-900/80 dark:border-green-800',
        error: 'bg-red-100/80 border-red-300 dark:bg-red-900/80 dark:border-red-800',
        warning: 'bg-yellow-100/80 border-yellow-300 dark:bg-yellow-900/80 dark:border-yellow-800',
        info: 'bg-blue-100/80 border-blue-300 dark:bg-blue-900/80 dark:border-blue-800',
    };

    const textStyles = {
        default: 'text-foreground',
        success: 'text-green-900 dark:text-green-50',
        error: 'text-red-900 dark:text-red-50',
        warning: 'text-yellow-900 dark:text-yellow-50',
        info: 'text-blue-900 dark:text-blue-50',
    };

    const iconColorMap = {
        default: colors.mutedForeground,
        success: '#22c55e',
        error: '#ef4444',
        warning: '#eab308',
        info: '#3b82f6',
    };

    const getIcon = () => {
        const color = iconColorMap[variant];
        switch (variant) {
            case 'success': return <CheckCircle size={20} color={color} />;
            case 'error': return <AlertCircle size={20} color={color} />;
            case 'warning': return <AlertTriangle size={20} color={color} />;
            case 'info': return <Info size={20} color={color} />;
            default: return null;
        }
    };

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View 
                style={animatedStyle}
                className={cn(
                    "m-2 p-4 rounded-xl border flex-row items-center gap-3 shadow-lg",
                    variantStyles[variant]
                )}
            >
                <View>{getIcon()}</View>
                <View className="flex-1">
                    {title && <Text variant="title" size="sm" className={textStyles[variant]}>{title}</Text>}
                    {description && <Text size="sm" className={cn("opacity-90", textStyles[variant])}>{description}</Text>}
                </View>
            </Animated.View>
        </GestureDetector>
    );
}
