// components/ui/input.tsx
import React, { forwardRef, useState } from 'react';
import { View, TextInput, Platform, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
    variant?: 'outline' | 'underline';
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
        const isOutline = variant === 'outline';

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
                    'flex-row items-center',
                    isOutline && 'h-12 border rounded-lg px-3',
                    !isOutline && 'h-12 border-b',
                    isOutline && !error && !isFocused && 'border-slate-300',
                    isOutline && !error && isFocused && 'border-blue-600',
                    isOutline && error && 'border-red-600',
                    !isOutline && !error && !isFocused && 'border-slate-300',
                    !isOutline && !error && isFocused && 'border-blue-600',
                    !isOutline && error && 'border-red-600',
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
                            color: '#0f172a',
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
                    className={cn('text-slate-900', inputClassName)}
                    placeholderTextColor="#cbd5e1"
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
