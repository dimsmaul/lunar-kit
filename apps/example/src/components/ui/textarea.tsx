// components/ui/textarea.tsx
import * as React from 'react';
import { TextInput, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
    label?: string;
    error?: string;
    containerClassName?: string;
    rows?: number;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
    (
        {
            className,
            containerClassName,
            label,
            error,
            editable = true,
            rows = 4,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <View className={cn('w-full', containerClassName)}>
                {label && (
                    <Text
                        className={cn(
                            'text-sm font-medium text-slate-900 mb-2',
                            error && 'text-red-600'
                        )}
                    >
                        {label}
                    </Text>
                )}

                <View
                    className={cn(
                        'border rounded-lg bg-white',
                        isFocused ? 'border-blue-600' : 'border-slate-300',
                        error && 'border-red-600',
                        !editable && 'bg-slate-50 opacity-60'
                    )}
                >
                    <TextInput
                        ref={ref}
                        className={cn(
                            'px-3 py-3 text-base text-slate-900',
                            className
                        )}
                        placeholderTextColor="#94a3b8"
                        multiline
                        numberOfLines={rows}
                        textAlignVertical="top"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        editable={editable}
                        style={{ minHeight: rows * 24 }}
                        {...props}
                    />
                </View>

                {error && (
                    <Text className="text-sm text-red-600 mt-2">{error}</Text>
                )}
            </View>
        );
    }
);
Textarea.displayName = 'Textarea';
