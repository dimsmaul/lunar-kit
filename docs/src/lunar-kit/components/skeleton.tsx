// components/ui/skeleton.tsx
import * as React from 'react';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { ViewProps } from 'react-native';

export interface SkeletonProps extends ViewProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ 
    className, 
    variant = 'rect',
    ...props 
}: SkeletonProps) {
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.2, { duration: 800 }),
            -1,
            true
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const variantStyles = {
        rect: 'rounded-md',
        circle: 'rounded-full',
        text: 'rounded h-4 w-full',
    };

    return (
        <Animated.View
            className={cn(
                'bg-muted',
                variantStyles[variant],
                className
            )}
            style={animatedStyle}
            {...props}
        />
    );
}
