import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
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

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-lg border border-slate-200 bg-white shadow-sm p-6',
        className
      )}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <View className={cn('flex flex-col gap-1.5', className)}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <Text className={cn('text-2xl font-semibold leading-none tracking-tight text-slate-900', className)}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <Text className={cn('text-sm text-slate-500', className)}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <View className={cn('p-0 pt-4', className)}>
      {children}
    </View>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <View className={cn('flex flex-row items-center p-0 pt-4', className)}>
      {children}
    </View>
  );
}