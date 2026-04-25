// components/ui/radio.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Radio Circle Variants
const radioCircleVariants = cva(
    'rounded-full border-2 items-center justify-center',
    {
        variants: {
            size: {
                sm: 'h-4 w-4 border',
                md: 'h-5 w-5 border-2',
                lg: 'h-6 w-6 border-2',
            },
            checked: {
                true: 'border-primary',
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

// Radio Dot Variants
const radioDotVariants = cva(
    'rounded-full bg-primary',
    {
        variants: {
            size: {
                sm: 'h-1.5 w-1.5',
                md: 'h-2.5 w-2.5',
                lg: 'h-3 w-3',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

// Radio Container Variants
const radioContainerVariants = cva(
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

interface RadioProps extends VariantProps<typeof radioCircleVariants> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    value?: string;
}

export function Radio({
    checked = false,
    onCheckedChange,
    children,
    className,
    size = 'md',
    disabled = false,
    value,
}: RadioProps) {
    return (
        <Pressable
            onPress={() => !disabled && onCheckedChange?.(!checked)}
            disabled={disabled}
            className={cn(radioContainerVariants({ size }), className)}
        >
            {/* Radio Circle */}
            <View
                className={cn(
                    radioCircleVariants({
                        size,
                        checked,
                        disabled,
                    })
                )}
            >
                {checked && <View className={cn(radioDotVariants({ size }))} />}
            </View>

            {/* Label */}
            {children}
        </Pressable>
    );
}
