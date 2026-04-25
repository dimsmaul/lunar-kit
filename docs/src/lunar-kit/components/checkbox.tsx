// components/ui/checkbox.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Check, Minus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// Checkbox Variants
const checkboxVariants = cva(
    'flex-row items-center',
    {
        variants: {
            size: {
                sm: 'gap-2',
                md: 'gap-3',
                lg: 'gap-4',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

// Checkbox Box Variants
const checkboxBoxVariants = cva(
    'rounded border-2 items-center justify-center',
    {
        variants: {
            size: {
                sm: 'h-4 w-4 border',
                md: 'h-5 w-5 border-2',
                lg: 'h-6 w-6 border-2',
            },
            checked: {
                true: 'bg-primary border-primary',
                false: 'border-input',
            },
            disabled: {
                true: 'opacity-50',
                false: '',
            },
        },
        defaultVariants: {
            size: 'md',
            checked: false,
            disabled: false,
        },
    }
);

interface CheckboxProps extends VariantProps<typeof checkboxVariants> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
}

interface CheckboxLabelProps {
    children: React.ReactNode;
    className?: string;
}

interface CheckboxDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function Checkbox({
    checked = false,
    onCheckedChange,
    children,
    className,
    size = 'md',
    disabled = false,
    indeterminate = false,
}: CheckboxProps) {
    const { colors } = useThemeColors();

    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

    return (
        <Pressable
            onPress={() => !disabled && onCheckedChange?.(!checked)}
            className={cn(checkboxVariants({ size }), className)}
            disabled={disabled}
        >
            {/* Checkbox Square */}
            <View
                className={cn(
                    checkboxBoxVariants({
                        size,
                        checked: checked || indeterminate,
                        disabled
                    })
                )}
            >
                {indeterminate ? (
                    <Minus size={iconSize} color={colors.primaryForeground} strokeWidth={3} />
                ) : checked ? (
                    <Check size={iconSize} color={colors.primaryForeground} strokeWidth={3} />
                ) : null}
            </View>

            {/* Label */}
            {children}
        </Pressable>
    );
}

export function CheckboxLabel({ children, className }: CheckboxLabelProps) {
    return (
        <Text variant="body" size="sm" className={className}>
            {children}
        </Text>
    );
}

export function CheckboxDescription({ children, className }: CheckboxDescriptionProps) {
    return (
        <Text variant="muted" size="sm" className={cn('mt-0.5', className)}>
            {children}
        </Text>
    );
}
