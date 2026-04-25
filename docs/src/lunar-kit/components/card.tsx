// components/ui/card.tsx
import * as React from 'react';
import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

// Card Variants
const cardVariants = cva(
  'rounded-lg p-6',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-sm',
        elevated: 'bg-card shadow-lg',
        outline: 'bg-card border-2 border-border',
        ghost: 'bg-transparent',
        filled: 'bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Card Header Variants
const cardHeaderVariants = cva(
  'flex flex-col',
  {
    variants: {
      spacing: {
        default: 'gap-1.5',
        sm: 'gap-1',
        lg: 'gap-2',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  }
);

// Card Content Variants
const cardContentVariants = cva(
  'p-0',
  {
    variants: {
      spacing: {
        default: 'pt-4',
        sm: 'pt-2',
        lg: 'pt-6',
        none: '',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  }
);

// Card Footer Variants
const cardFooterVariants = cva(
  'flex flex-row items-center p-0',
  {
    variants: {
      spacing: {
        default: 'pt-4',
        sm: 'pt-2',
        lg: 'pt-6',
        none: '',
      },
      alignment: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      spacing: 'default',
      alignment: 'start',
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps extends VariantProps<typeof cardHeaderVariants> {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps extends VariantProps<typeof cardContentVariants> {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps extends VariantProps<typeof cardFooterVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, variant, className }: CardProps) {
  return (
    <View className={cn(cardVariants({ variant }), className)}>
      {children}
    </View>
  );
}

export function CardHeader({ children, spacing, className }: CardHeaderProps) {
  return (
    <View className={cn(cardHeaderVariants({ spacing }), className)}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <Text variant="header" size="md" className={cn('leading-none tracking-tight', className)}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Text variant="muted" size="sm" className={className}>
      {children}
    </Text>
  );
}

export function CardContent({ children, spacing, className }: CardContentProps) {
  return (
    <View className={cn(cardContentVariants({ spacing }), className)}>
      {children}
    </View>
  );
}

export function CardFooter({ children, spacing, alignment, className }: CardFooterProps) {
  return (
    <View className={cn(cardFooterVariants({ spacing, alignment }), className)}>
      {children}
    </View>
  );
}
