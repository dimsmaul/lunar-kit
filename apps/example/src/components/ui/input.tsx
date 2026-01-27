// components/ui/input.tsx
import React, { forwardRef, useState } from 'react';
import { View, TextInput, Platform, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface InputProps extends TextInputProps {
    variant?: 'outline' | 'underline';
    size?: 'sm' | 'md' | 'lg';
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    error?: boolean;
    containerClassName?: string;
    inputClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            variant = 'outline',
            size = 'md',
            prefix,
            suffix,
            error = false,
            containerClassName,
            inputClassName,
            style,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const { colors } = useThemeColors();
        const isOutline = variant === 'outline';

        const sizeStyles = {
            sm: 'web:h-9 h-10',
            md: 'web:h-10 h-11',
            lg: 'web:h-12 h-13',
        };

        const handleFocus = (e: any) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            props.onBlur?.(e);
        };

        return (
            <View
                className={cn(
                    'flex-row items-center bg-background',
                    sizeStyles[size],
                    isOutline && 'border rounded-lg px-3',
                    !isOutline && 'border-b',
                    isOutline && !error && !isFocused && 'border-input',
                    isOutline && !error && isFocused && 'border-ring',
                    isOutline && error && 'border-destructive',
                    !isOutline && !error && !isFocused && 'border-input',
                    !isOutline && !error && isFocused && 'border-ring',
                    !isOutline && error && 'border-destructive',
                    containerClassName
                )}
            >
                {prefix && <View className="mr-3">{prefix}</View>}

                <TextInput
                    ref={ref}
                    {...props}
                    style={[
                        {
                            flex: 1,
                            fontSize: 16,
                            color: colors.foreground,
                            padding: 0,
                            paddingVertical: 0,
                            paddingHorizontal: 0,
                            margin: 0,
                            height: '100%',
                            textAlignVertical: 'center',
                            outlineWidth: 0,
                            ...(Platform.OS === 'ios' && {
                                lineHeight: 20,
                            }),
                            ...(Platform.OS === 'android' && {
                                textAlignVertical: 'center',
                            }),
                        },
                        style,
                    ]}
                    className={cn('text-foreground outline-none', inputClassName)}
                    placeholderTextColor={colors.mutedForeground}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    underlineColorAndroid="transparent"
                />

                {suffix && <View className="ml-3">{suffix}</View>}
            </View>
        );
    }
);

Input.displayName = 'Input';
