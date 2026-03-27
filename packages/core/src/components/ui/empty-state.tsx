// components/ui/empty-state.tsx
import * as React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
    title: string;
    description?: string;
    illustration?: React.ReactNode;
    actionLabel?: string;
    onActionPress?: () => void;
    className?: string;
}

export function EmptyState({
    title,
    description,
    illustration,
    actionLabel,
    onActionPress,
    className,
}: EmptyStateProps) {
    return (
        <View className={cn("items-center justify-center p-8 gap-4", className)}>
            {illustration && (
                <View className="mb-2 items-center justify-center">
                    {illustration}
                </View>
            )}
            <View className="items-center gap-1">
                <Text variant="title" size="lg" className="text-center font-bold">
                    {title}
                </Text>
                {description && (
                    <Text className="text-center text-muted-foreground max-w-[280px]">
                        {description}
                    </Text>
                )}
            </View>
            {actionLabel && (
                <Button onPress={onActionPress} className="mt-2">
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}
