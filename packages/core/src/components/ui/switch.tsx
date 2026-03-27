// components/ui/switch.tsx
import * as React from 'react';
import { Pressable, type ViewProps } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    interpolateColor,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SwitchProps extends Omit<ViewProps, 'children'> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    thumbClassName?: string;
}

export function Switch({
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    className,
    thumbClassName,
    ...props
}: SwitchProps) {
    const { colors } = useThemeColors();
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const progress = useSharedValue(isChecked ? 1 : 0);

    React.useEffect(() => {
        progress.value = withSpring(isChecked ? 1 : 0, {
            damping: 30,
            stiffness: 200,
            overshootClamping: true,
        });
    }, [isChecked]);

    const handlePress = () => {
        if (disabled) return;
        const nextChecked = !isChecked;
        if (controlledChecked === undefined) {
            setInternalChecked(nextChecked);
        }
        onCheckedChange?.(nextChecked);
    };

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * 20 }],
    }));

    const trackStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                [colors.input, colors.primary]
            ),
        };
    });

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            className={cn(
                'h-6 w-11 rounded-full p-1 relative justify-center bg-input',
                disabled && 'opacity-50',
                className
            )}
            {...props}
        >
            <Animated.View
                style={[trackStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999 }]}
            />
            <Animated.View
                className={cn(
                    'h-4 w-4 rounded-full bg-white shadow-sm',
                    thumbClassName
                )}
                style={thumbStyle}
            />
        </Pressable>
    );
}
