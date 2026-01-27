// components/ui/banner.tsx
import * as React from 'react';
import { View, Pressable, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { X, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const bannerVariants = cva(
    'flex-row items-start p-4 rounded-lg border',
    {
        variants: {
            variant: {
                default: 'bg-muted border-border',
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

type BannerVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

const iconColorMap: Record<BannerVariant, string> = {
    default: 'mutedForeground',
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#eab308',
    destructive: '#ef4444',
};

const textColorMap: Record<BannerVariant, string> = {
    default: 'text-foreground',
    info: 'text-blue-900 dark:text-blue-100',
    success: 'text-green-900 dark:text-green-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    destructive: 'text-red-900 dark:text-red-100',
};

export interface BannerProps
    extends ViewProps,
    VariantProps<typeof bannerVariants> {
    title?: string;
    description?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    showIcon?: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
}

export function Banner({
    className,
    variant = 'default',
    title,
    description,
    children,
    icon,
    showIcon = true,
    dismissible = false,
    onDismiss,
    ...props
}: BannerProps) {
    const { colors } = useThemeColors();
    const [dismissed, setDismissed] = React.useState(false);

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    if (dismissed) return null;

    const currentVariant: BannerVariant = variant || 'default';

    const getDefaultIcon = () => {
        const iconColor =
            currentVariant === 'default'
                ? colors.mutedForeground
                : iconColorMap[currentVariant];

        switch (currentVariant) {
            case 'info':
                return <Info size={20} color={iconColor} />;
            case 'success':
                return <CheckCircle size={20} color={iconColor} />;
            case 'warning':
                return <AlertTriangle size={20} color={iconColor} />;
            case 'destructive':
                return <AlertCircle size={20} color={iconColor} />;
            default:
                return <Info size={20} color={iconColor} />;
        }
    };

    const textColor = textColorMap[currentVariant];

    return (
        <View
            className={cn(bannerVariants({ variant }), className)}
            {...props}
        >
            {showIcon && (
                <View className="mr-3 mt-0.5">
                    {icon || getDefaultIcon()}
                </View>
            )}

            <View className="flex-1">
                {title && (
                    <Text
                        size="sm"
                        variant='label'
                        className={cn('mb-1', textColor)}
                    >
                        {title}
                    </Text>
                )}
                {description && (
                    <Text size="sm" className={cn(textColor)}>
                        {description}
                    </Text>
                )}
                {children}
            </View>

            {dismissible && (
                <Pressable
                    onPress={handleDismiss}
                    className="ml-2 p-1"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <X
                        size={16}
                        color={
                            currentVariant === 'default'
                                ? colors.mutedForeground
                                : iconColorMap[currentVariant]
                        }
                    />
                </Pressable>
            )}
        </View>
    );
}
