// components/ui/textarea.tsx
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { useThemeColors } from '@/hooks/useThemeColors';

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
        const { colors } = useThemeColors();

        return (
            <View className={cn('w-full', containerClassName)}>
                {label && (
                    <Text
                        size="sm"
                        variant="label"
                        className={cn(
                            'mb-2',
                            error && 'text-destructive'
                        )}
                    >
                        {label}
                    </Text>
                )}

                <TextInput
                    ref={ref}
                    className={cn(
                        'border rounded-lg bg-background px-3 py-3 text-base text-foreground',
                        error ? 'border-destructive' : 'border-input',
                        'focus:border-ring',
                        !editable && 'bg-muted opacity-60',
                        className
                    )}
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    numberOfLines={rows}
                    textAlignVertical="top"
                    editable={editable}
                    style={[
                        {
                            minHeight: rows * 24,
                            color: colors.foreground,
                        }
                    ]}
                    {...props}
                />

                {error && (
                    <Text size="sm" className="text-destructive mt-2">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);
Textarea.displayName = 'Textarea';
