// components/ui/button.tsx
import * as React from 'react';
import { Pressable, Text as RNText, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'items-center justify-center rounded-md flex-row gap-2',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary',
        ghost: 'bg-transparent',
        link: 'bg-transparent px-0 py-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 py-1.5',
        lg: 'h-11 px-8 py-3',
        icon: 'h-10 w-10',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);

const buttonTextVariants = cva(
  'font-semibold text-center',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground',
        link: 'text-primary underline',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
        icon: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Check if children is only icon (for icon button)
  const isIconOnly = size === 'icon' && typeof children !== 'string';

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        buttonVariants({
          variant,
          size,
          disabled: isDisabled
        }),
        className
      )}
      {...props}
    >
      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'destructive'
              ? '#ffffff'
              : variant === 'outline' || variant === 'ghost'
                ? '#0f172a'
                : '#0f172a'
          }
        />
      )}

      {/* Left Icon */}
      {!loading && leftIcon && leftIcon}

      {/* Text or Icon Content */}
      {!loading && (
        isIconOnly ? (
          children
        ) : (
          <RNText
            className={cn(
              buttonTextVariants({ variant, size }),
              textClassName
            )}
          >
            {children}
          </RNText>
        )
      )}

      {/* Right Icon */}
      {!loading && rightIcon && rightIcon}
    </Pressable>
  );
}
