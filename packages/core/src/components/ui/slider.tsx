// components/ui/slider.tsx
import * as React from 'react';
import { View } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cn } from '@/lib/utils';

export interface SliderProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number) => void;
    className?: string;
    disabled?: boolean;
}

export function Slider({
    value: controlledValue,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    className,
    disabled = false,
}: SliderProps) {
    const [internalValue, setInternalValue] = React.useState(controlledValue ?? defaultValue);
    const currentValue = controlledValue ?? internalValue;

    const trackWidth = useSharedValue(0);
    const thumbProgress = useSharedValue((currentValue - min) / (max - min));
    const startProgress = useSharedValue(0);

    React.useEffect(() => {
        if (controlledValue !== undefined) {
            thumbProgress.value = withSpring((controlledValue - min) / (max - min));
        }
    }, [controlledValue, min, max]);

    const updateValue = (progress: number) => {
        const rawValue = progress * (max - min) + min;
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.min(max, Math.max(min, steppedValue));
        
        if (controlledValue === undefined) {
            setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
    };

    const panGesture = Gesture.Pan()
        .enabled(!disabled)
        .onBegin(() => {
            startProgress.value = thumbProgress.value;
        })
        .onUpdate((event) => {
            if (trackWidth.value === 0) return;
            const deltaProgress = event.translationX / trackWidth.value;
            const newProgress = Math.min(1, Math.max(0, startProgress.value + deltaProgress));
            thumbProgress.value = newProgress;
            runOnJS(updateValue)(newProgress);
        });

    const tapGesture = Gesture.Tap()
        .enabled(!disabled)
        .onEnd((event) => {
            if (trackWidth.value === 0) return;
            const progress = Math.min(1, Math.max(0, event.x / trackWidth.value));
            thumbProgress.value = withSpring(progress);
            runOnJS(updateValue)(progress);
        });

    const thumbStyle = useAnimatedStyle(() => ({
        left: `${thumbProgress.value * 100}%`,
        transform: [{ translateX: -10 }], // Half of thumb width (w-5 = 20px)
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${thumbProgress.value * 100}%`,
    }));

    return (
        <GestureDetector gesture={Gesture.Exclusive(panGesture, tapGesture)}>
            <View 
                className={cn("h-10 justify-center", disabled && "opacity-50", className)}
                onLayout={(e) => (trackWidth.value = e.nativeEvent.layout.width)}
            >
                <View className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <Animated.View 
                        className="h-full bg-primary" 
                        style={progressStyle} 
                    />
                </View>
                <Animated.View 
                    className="absolute h-5 w-5 rounded-full bg-background border-2 border-primary shadow-sm"
                    style={thumbStyle}
                />
            </View>
        </GestureDetector>
    );
}
