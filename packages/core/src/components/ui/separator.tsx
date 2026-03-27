// components/ui/separator.tsx
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends ViewProps {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
    className?: string;
}

export function Separator({
    orientation = 'horizontal',
    decorative = true,
    className,
    ...props
}: SeparatorProps) {
    return (
        <View
            aria-role={decorative ? undefined : 'separator'}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
                className
            )}
            {...props}
        />
    );
}
