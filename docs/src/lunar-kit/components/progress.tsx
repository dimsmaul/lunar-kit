// components/ui/progress.tsx
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
} from 'react-native-reanimated';
import { cn } from '../lib/utils';

export interface ProgressProps extends ViewProps {
    value?: number; // 0 to 100
    className?: string;
    indicatorClassName?: string;
}

export function Progress({ 
    value = 0, 
    className, 
    indicatorClassName,
    ...props 
}: ProgressProps) {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withSpring(value, {
            damping: 20,
            stiffness: 90,
        });
    }, [value]);

    const indicatorStyle = useAnimatedStyle(() => ({
        width: `${Math.min(100, Math.max(0, progress.value))}%`,
    }));

    return (
        <View
            className={cn(
                'h-2 w-full overflow-hidden rounded-full bg-secondary',
                className
            )}
            {...props}
        >
            <Animated.View
                className={cn('h-full bg-primary', indicatorClassName)}
                style={indicatorStyle}
            />
        </View>
    );
}
