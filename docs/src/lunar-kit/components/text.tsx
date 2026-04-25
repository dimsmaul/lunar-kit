// components/ui/text.tsx
import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const textVariants = cva(
    'text-foreground', // base style
    {
        variants: {
            variant: {
                default: '',
                header: 'font-bold',
                title: 'font-semibold',
                label: 'font-medium',
                body: 'font-normal',
                caption: 'font-normal text-muted-foreground',
                muted: 'text-muted-foreground',
                error: 'text-destructive',
                success: 'text-green-600 dark:text-green-400',
            },
            size: {
                sm: '',   // akan di-override di compound variants
                md: '',   // akan di-override di compound variants
                lg: '',   // akan di-override di compound variants
                xl: '',   // akan di-override di compound variants
            },
            align: {
                left: 'text-left',
                center: 'text-center',
                right: 'text-right',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            align: 'left',
        },
        // Compound variants - setiap variant punya size mapping sendiri
        compoundVariants: [
            // HEADER sizes
            {
                variant: 'header',
                size: 'sm',
                class: 'text-2xl', // 24px
            },
            {
                variant: 'header',
                size: 'md',
                class: 'text-3xl', // 30px
            },
            {
                variant: 'header',
                size: 'lg',
                class: 'text-4xl', // 36px
            },
            {
                variant: 'header',
                size: 'xl',
                class: 'text-5xl', // 48px
            },

            // TITLE sizes
            {
                variant: 'title',
                size: 'sm',
                class: 'text-lg', // 18px
            },
            {
                variant: 'title',
                size: 'md',
                class: 'text-xl', // 20px
            },
            {
                variant: 'title',
                size: 'lg',
                class: 'text-2xl', // 24px
            },
            {
                variant: 'title',
                size: 'xl',
                class: 'text-3xl', // 30px
            },

            // LABEL sizes
            {
                variant: 'label',
                size: 'sm',
                class: 'text-xs uppercase tracking-wider', // 12px
            },
            {
                variant: 'label',
                size: 'md',
                class: 'text-sm uppercase tracking-wide', // 14px
            },
            {
                variant: 'label',
                size: 'lg',
                class: 'text-base uppercase tracking-wide', // 16px
            },

            // BODY sizes
            {
                variant: 'body',
                size: 'sm',
                class: 'text-sm', // 14px
            },
            {
                variant: 'body',
                size: 'md',
                class: 'text-base', // 16px
            },
            {
                variant: 'body',
                size: 'lg',
                class: 'text-lg', // 18px
            },

            // CAPTION sizes
            {
                variant: 'caption',
                size: 'sm',
                class: 'text-xs', // 12px
            },
            {
                variant: 'caption',
                size: 'md',
                class: 'text-sm', // 14px
            },
            {
                variant: 'caption',
                size: 'lg',
                class: 'text-base', // 16px
            },

            // MUTED sizes (sama dengan body)
            {
                variant: 'muted',
                size: 'sm',
                class: 'text-sm',
            },
            {
                variant: 'muted',
                size: 'md',
                class: 'text-base',
            },
            {
                variant: 'muted',
                size: 'lg',
                class: 'text-lg',
            },

            // ERROR sizes (sama dengan body)
            {
                variant: 'error',
                size: 'sm',
                class: 'text-sm',
            },
            {
                variant: 'error',
                size: 'md',
                class: 'text-base',
            },
            {
                variant: 'error',
                size: 'lg',
                class: 'text-lg',
            },

            // SUCCESS sizes (sama dengan body)
            {
                variant: 'success',
                size: 'sm',
                class: 'text-sm',
            },
            {
                variant: 'success',
                size: 'md',
                class: 'text-base',
            },
            {
                variant: 'success',
                size: 'lg',
                class: 'text-lg',
            },

            // DEFAULT sizes
            {
                variant: 'default',
                size: 'sm',
                class: 'text-sm',
            },
            {
                variant: 'default',
                size: 'md',
                class: 'text-base',
            },
            {
                variant: 'default',
                size: 'lg',
                class: 'text-lg',
            },
        ],
    }
);

export interface TextProps
    extends RNTextProps,
    VariantProps<typeof textVariants> {
    className?: string;
    variant?: 'default' | 'header' | 'title' | 'label' | 'body' | 'caption' | 'muted' | 'error' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    align?: 'left' | 'center' | 'right';
}

export function Text({
    variant,
    size,
    align,
    className,
    ...props
}: TextProps) {
    return (
        <RNText
            className={cn(textVariants({ variant, size, align }), className)}
            {...props}
        />
    );
}
