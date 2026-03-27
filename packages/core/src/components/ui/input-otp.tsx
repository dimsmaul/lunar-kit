// components/ui/input-otp.tsx
import * as React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

export interface InputOTPProps {
    value?: string;
    defaultValue?: string;
    maxLength?: number;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    inputType?: 'numeric' | 'default' | 'password';
}

export function InputOTP({
    value: controlledValue,
    defaultValue = '',
    maxLength = 4,
    onValueChange,
    disabled = false,
    className,
    containerClassName,
    inputType = 'numeric',
}: InputOTPProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = controlledValue ?? internalValue;
    
    const inputRef = React.useRef<TextInput>(null);

    const handleChange = (text: string) => {
        const cleaned = text.replace(/[^0-9a-zA-Z]/g, '').slice(0, maxLength);
        if (controlledValue === undefined) {
            setInternalValue(cleaned);
        }
        onValueChange?.(cleaned);
    };

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const cells = Array.from({ length: maxLength }, (_, i) => {
        const char = currentValue[i] || '';
        const isFocused = currentValue.length === i;
        const isFilled = char.length > 0;

        return (
            <View 
                key={i}
                className={cn(
                    "w-12 h-14 border-2 rounded-lg items-center justify-center bg-background",
                    isFocused ? "border-primary" : "border-input",
                    isFilled && !isFocused && "border-input/60",
                    disabled && "opacity-50",
                    className
                )}
            >
                <Text variant="title" size="lg" className={cn(isFilled ? "text-foreground" : "text-muted-foreground")}>
                    {inputType === 'password' && isFilled ? '●' : char}
                </Text>
                {isFocused && !disabled && (
                    <AnimatedCursor />
                )}
            </View>
        );
    });

    return (
        <Pressable onPress={handlePress} className={cn("flex-row justify-center gap-2", containerClassName)}>
            <TextInput
                ref={inputRef}
                value={currentValue}
                onChangeText={handleChange}
                maxLength={maxLength}
                keyboardType={inputType === 'numeric' ? 'number-pad' : 'default'}
                secureTextEntry={inputType === 'password'}
                style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                autoFocus={false}
                editable={!disabled}
            />
            {cells}
        </Pressable>
    );
}

// Subtle cursor animation
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

function AnimatedCursor() {
    const opacity = useSharedValue(1);
    
    React.useEffect(() => {
        opacity.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return <Animated.View style={style} className="absolute bottom-2 w-6 h-0.5 bg-primary" />;
}
