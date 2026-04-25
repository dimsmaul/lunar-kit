// components/ui/alert.tsx
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const alertVariants = cva(
    'flex-row items-center p-3 rounded-lg border gap-3',
    {
        variants: {
            variant: {
                default: 'bg-background border-border',
                info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
                success: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
                warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900',
                destructive: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

const iconColorMap: Record<AlertVariant, string> = {
    default: 'mutedForeground',
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    destructive: '#ef4444',
};

const textColorMap: Record<AlertVariant, string> = {
    default: 'text-foreground',
    info: 'text-blue-900 dark:text-blue-100',
    success: 'text-green-900 dark:text-green-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    destructive: 'text-red-900 dark:text-red-100',
};

export interface AlertProps
    extends ViewProps,
    VariantProps<typeof alertVariants> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    showIcon?: boolean;
}

export function Alert({
    className,
    variant = 'default',
    children,
    icon,
    showIcon = true,
    ...props
}: AlertProps) {
    const { colors } = useThemeColors();
    const currentVariant: AlertVariant = variant || 'default';

    const getDefaultIcon = () => {
        const iconColor =
            currentVariant === 'default'
                ? colors.mutedForeground
                : iconColorMap[currentVariant];

        switch (currentVariant) {
            case 'info':
                return <Info size={18} color={iconColor} />;
            case 'success':
                return <CheckCircle size={18} color={iconColor} />;
            case 'warning':
                return <AlertTriangle size={18} color={iconColor} />;
            case 'destructive':
                return <AlertCircle size={18} color={iconColor} />;
            default:
                return null;
        }
    };

    const textColor = textColorMap[currentVariant];

    return (
        <View
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {showIcon && (
                <View>
                    {icon || getDefaultIcon()}
                </View>
            )}
            <View className="flex-1">
                {typeof children === 'string' ? (
                    <Text className={cn('font-medium', textColor)}>
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </View>
        </View>
    );
}
