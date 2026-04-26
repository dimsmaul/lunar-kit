// components/ui/breadcrumb.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from './text';
import { cn } from '../lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface BreadcrumbItem {
    label: string;
    onPress?: () => void;
    active?: boolean;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    className?: string;
}

export function Breadcrumb({
    items,
    separator,
    className,
}: BreadcrumbProps) {
    const { colors } = useThemeColors();
    const defaultSeparator = <ChevronRight size={14} color={colors.mutedForeground} />;

    return (
        <View className={cn("flex-row items-center gap-2 flex-wrap", className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.active || isLast;

                return (
                    <React.Fragment key={index}>
                        <Pressable 
                            onPress={item.onPress}
                            disabled={isActive || !item.onPress}
                            className="flex-row items-center"
                        >
                            <Text 
                                className={cn(
                                    "text-sm",
                                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                        {!isLast && (
                            <View className="mx-1">
                                {separator || defaultSeparator}
                            </View>
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}
