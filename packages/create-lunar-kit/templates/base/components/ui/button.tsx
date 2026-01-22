import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onPress?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'items-center justify-center rounded-md',
        {
          'bg-slate-900': variant === 'default',
          'border border-slate-200': variant === 'outline',
          'bg-transparent': variant === 'ghost',
        },
        {
          'h-10 px-4': size === 'default',
          'h-9 px-3': size === 'sm',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
    >
      <Text
        className={cn(
          'font-medium',
          {
            'text-slate-50': variant === 'default',
            'text-slate-900': variant === 'outline' || variant === 'ghost',
          },
          {
            'text-sm': size === 'default' || size === 'sm',
            'text-base': size === 'lg',
          }
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
