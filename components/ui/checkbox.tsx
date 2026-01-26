// components/ui/checkbox.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

interface CheckboxProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function Checkbox({ checked = false, onCheckedChange, children, className, disabled = false }: CheckboxProps) {
    return (
        <Pressable
            onPress={() => !disabled && onCheckedChange?.(!checked)}
            className={cn('flex-row items-center gap-3', disabled && 'opacity-50', className)}
            disabled={disabled}
        >
            {/* Checkbox Square */}
            <View
                className={cn(
                    'h-5 w-5 rounded border-2 items-center justify-center',
                    checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                )}
            >
                {checked && (
                    // Checkmark icon (simple)
                    <Text className="text-white text-xs font-bold">✓</Text>
                )}
            </View>

            {/* Label */}
            {children}
        </Pressable>
    );
}

export function CheckboxLabel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <Text className={cn('text-base text-slate-900', className)}>
            {children}
        </Text>
    );
}
