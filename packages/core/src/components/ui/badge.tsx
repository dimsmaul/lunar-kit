// components/ui/badge.tsx
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

const badgeVariants = cva(
    'flex-row items-center justify-center rounded-full',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                secondary: 'bg-secondary',
                success: 'bg-green-500',
                warning: 'bg-yellow-500',
                destructive: 'bg-destructive',
                outline: 'border border-input bg-transparent',
                muted: 'bg-muted',
            },
            size: {
                sm: 'px-2 py-0.5',
                md: 'px-2.5 py-1',
                lg: 'px-3 py-1.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

const badgeTextVariants = cva('font-medium', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            secondary: 'text-secondary-foreground',
            success: 'text-white',
            warning: 'text-white',
            destructive: 'text-destructive-foreground',
            outline: 'text-foreground',
            muted: 'text-muted-foreground',
        },
        size: {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

export interface BadgeProps
    extends ViewProps,
    VariantProps<typeof badgeVariants> {
    children: string;
    textClassName?: string;
}

export function Badge({
    className,
    textClassName,
    variant,
    size,
    children,
    ...props
}: BadgeProps) {
    return (
        <View
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        >
            <Text
                className={cn(badgeTextVariants({ variant, size }), textClassName)}
            >
                {children}
            </Text>
        </View>
    );
}
