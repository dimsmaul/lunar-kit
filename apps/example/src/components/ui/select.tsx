// components/ui/select.tsx
import * as React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from './dialog';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    disabled?: boolean;
}

interface SelectTriggerProps {
    className?: string;
    containerClassName?: string;
    children?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'underline';
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    error?: boolean;
}

interface SelectValueProps {
    placeholder?: string;
    className?: string;
}

interface SelectContentProps {
    className?: string;
    children: React.ReactNode;
}

interface SelectItemProps {
    value: string;
    label: string;
    className?: string;
    disabled?: boolean;
}

interface SelectGroupProps {
    className?: string;
    children: React.ReactNode;
}

interface SelectLabelProps {
    className?: string;
    children: React.ReactNode;
}

interface SelectSeparatorProps {
    className?: string;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    disabled?: boolean;
    options: Map<string, string>;
    registerOption: (value: string, label: string) => void;
} | null>(null);

function useSelect() {
    const context = React.useContext(SelectContext);
    if (!context) {
        throw new Error('Select components must be used within Select');
    }
    return context;
}

export function Select({ value, onValueChange, children, disabled = false }: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const [options] = React.useState(() => new Map<string, string>());

    const registerOption = React.useCallback((val: string, label: string) => {
        options.set(val, label);
    }, [options]);

    return (
        <SelectContext.Provider
            value={{
                value,
                onValueChange,
                open,
                setOpen: (val) => !disabled && setOpen(val),
                disabled,
                options,
                registerOption,
            }}
        >
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({
    className,
    containerClassName,
    children,
    size = 'md',
    variant = 'outline',
    prefix,
    suffix,
    error = false,
}: SelectTriggerProps) {
    const { setOpen, disabled, value, options } = useSelect();
    const [isFocused, setIsFocused] = React.useState(false);
    const isOutline = variant === 'outline';

    const sizeStyles = {
        sm: 'web:h-9 h-10',
        md: 'web:h-10 h-11',
        lg: 'web:h-12 h-13',
    };

    const displayValue = value ? options.get(value) : null;

    return (
        <View className={cn('w-full', containerClassName)}>
            <View
                className={cn(
                    'flex-row items-center',
                    isOutline && `${sizeStyles[size]} border rounded-lg px-3`,
                    !isOutline && `${sizeStyles[size]} border-b`,
                    isOutline && !error && !isFocused && 'border-slate-300',
                    isOutline && !error && isFocused && 'border-blue-600',
                    isOutline && error && 'border-red-600',
                    !isOutline && !error && !isFocused && 'border-slate-300',
                    !isOutline && !error && isFocused && 'border-blue-600',
                    !isOutline && error && 'border-red-600',
                    disabled && 'opacity-50',
                    className
                )}
            >
                {prefix && <View className="mr-3">{prefix}</View>}

                <Pressable
                    onPress={() => {
                        setIsFocused(true);
                        setOpen(true);
                    }}
                    disabled={disabled}
                    className="flex-1 flex-row items-center justify-between gap-2"
                >
                    <Text
                        className={cn(
                            'flex-1 text-base',
                            displayValue ? 'text-slate-900' : 'text-slate-400'
                        )}
                    >
                        {displayValue || children}
                    </Text>

                    <Text className="text-slate-500 text-sm ml-2">▼</Text>
                </Pressable>

                {suffix && <View className="ml-3">{suffix}</View>}
            </View>

            {error && (
                <Text className="text-sm text-red-600 mt-2">{error}</Text>
            )}
        </View>
    );
}

export function SelectValue({ placeholder = 'Select...', className }: SelectValueProps) {
    const { value, options } = useSelect();
    const displayValue = value ? options.get(value) : null;

    return (
        <Text
            className={cn(
                'flex-1 text-sm',
                displayValue ? 'text-slate-900' : 'text-slate-400',
                className
            )}
        >
            {displayValue || placeholder}
        </Text>
    );
}

export function SelectContent({ className, children }: SelectContentProps) {
    return (
        <DialogContent className={cn('p-0 max-h-96', className)}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                className="max-h-96"
            >
                <View className="py-1">{children}</View>
            </ScrollView>
        </DialogContent>
    );
}

export function SelectItem({ value, label, className, disabled = false }: SelectItemProps) {
    const { value: selectedValue, onValueChange, setOpen, registerOption } = useSelect();
    const isSelected = selectedValue === value;

    React.useEffect(() => {
        registerOption(value, label);
    }, [value, label, registerOption]);

    const handleSelect = () => {
        if (disabled) return;
        onValueChange?.(value);
        setOpen(false);
    };

    return (
        <Pressable
            onPress={handleSelect}
            disabled={disabled}
            className={cn(
                'flex-row items-center justify-between px-4 py-3 border-b border-slate-100 active:bg-blue-50',
                isSelected && 'bg-blue-50',
                disabled && 'opacity-50',
                className
            )}
        >
            <Text
                className={cn(
                    'flex-1 text-sm',
                    isSelected ? 'text-blue-600 font-semibold' : 'text-slate-900'
                )}
            >
                {label}
            </Text>

            {isSelected && <Text className="text-blue-600 font-bold text-sm ml-2">✓</Text>}
        </Pressable>
    );
}

export function SelectGroup({ className, children }: SelectGroupProps) {
    return <View className={cn('py-1', className)}>{children}</View>;
}

export function SelectLabel({ className, children }: SelectLabelProps) {
    return (
        <View className={cn('px-4 py-2', className)}>
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {children}
            </Text>
        </View>
    );
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
    return <View className={cn('h-px bg-slate-200 my-1 mx-2', className)} />;
}

export type { SelectOption };
