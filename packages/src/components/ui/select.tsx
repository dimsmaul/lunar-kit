// components/ui/select.tsx
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Dialog, DialogContent } from './dialog';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ChevronDown, Check } from 'lucide-react-native';

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
    const { colors } = useThemeColors();
    const isOutline = variant === 'outline';

    const sizeStyles = {
        sm: 'web:h-9 h-10',
        md: 'web:h-10 h-11',
        lg: 'web:h-12 h-13',
    };

    const displayValue = value ? options.get(value) : null;

    return (
        <View className={cn('w-full', containerClassName)}>
            <Pressable
                onPress={() => setOpen(true)}
                disabled={disabled}
                className={cn(
                    'flex-row items-center bg-background',
                    isOutline && `${sizeStyles[size]} border rounded-lg px-3`,
                    !isOutline && `${sizeStyles[size]} border-b`,
                    error ? 'border-destructive' : 'border-input',
                    'focus:border-ring',
                    disabled && 'opacity-50',
                    className
                )}
            >
                {prefix && <View className="mr-3">{prefix}</View>}

                <View className="flex-1 flex-row items-center justify-between gap-2">
                    <Text
                        size="md"
                        className={cn(
                            'flex-1',
                            displayValue ? 'text-foreground' : 'text-muted-foreground'
                        )}
                    >
                        {displayValue || children}
                    </Text>

                    <ChevronDown size={16} color={colors.mutedForeground} />
                </View>

                {suffix && <View className="ml-3">{suffix}</View>}
            </Pressable>

            {error && (
                <Text size="sm" className="text-destructive mt-2">
                    {error}
                </Text>
            )}
        </View>
    );
}

export function SelectValue({ placeholder = 'Select...', className }: SelectValueProps) {
    const { value, options } = useSelect();
    const displayValue = value ? options.get(value) : null;

    return (
        <Text
            size="sm"
            className={cn(
                'flex-1',
                displayValue ? 'text-foreground' : 'text-muted-foreground',
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
    const { colors } = useThemeColors();
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
                'flex-row items-center justify-between px-4 py-3 border-b border-border active:bg-accent',
                isSelected && 'bg-accent',
                disabled && 'opacity-50',
                className
            )}
        >
            <Text
                size="sm"
                variant={'body'}
                className={cn(
                    'flex-1',
                    isSelected ? 'text-accent-foreground' : 'text-foreground'
                )}
            >
                {label}
            </Text>

            {isSelected && (
                <Check size={16} color={colors.primary} className="ml-2" />
            )}
        </Pressable>
    );
}

export function SelectGroup({ className, children }: SelectGroupProps) {
    return <View className={cn('py-1', className)}>{children}</View>;
}

export function SelectLabel({ className, children }: SelectLabelProps) {
    return (
        <View className={cn('px-4 py-2', className)}>
            <Text size="sm" variant="body" className="uppercase tracking-wide text-muted-foreground">
                {children}
            </Text>
        </View>
    );
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
    return <View className={cn('h-px bg-border my-1 mx-2', className)} />;
}

export type { SelectOption };

// // components/ui/select.tsx
// import * as React from 'react';
// import { Pressable, ScrollView, View } from 'react-native';
// import { cn } from '@/lib/utils';
// import { Text } from './text';
// import { Dialog, DialogContent } from './dialog';
// import { useThemeColors } from '@/hooks/useThemeColors';
// import { ChevronDown, Check } from 'lucide-react-native';

// interface SelectOption {
//     label: string;
//     value: string;
// }

// interface SelectProps {
//     value?: string;
//     onValueChange?: (value: string) => void;
//     children: React.ReactNode;
//     disabled?: boolean;
// }

// interface SelectTriggerProps {
//     className?: string;
//     containerClassName?: string;
//     children?: React.ReactNode;
//     size?: 'sm' | 'md' | 'lg';
//     variant?: 'outline' | 'underline';
//     prefix?: React.ReactNode;
//     suffix?: React.ReactNode;
//     error?: boolean;
// }

// interface SelectValueProps {
//     placeholder?: string;
//     className?: string;
// }

// interface SelectContentProps {
//     className?: string;
//     children: React.ReactNode;
// }

// interface SelectItemProps {
//     value: string;
//     label: string;
//     className?: string;
//     disabled?: boolean;
// }

// interface SelectGroupProps {
//     className?: string;
//     children: React.ReactNode;
// }

// interface SelectLabelProps {
//     className?: string;
//     children: React.ReactNode;
// }

// interface SelectSeparatorProps {
//     className?: string;
// }

// const SelectContext = React.createContext<{
//     value?: string;
//     onValueChange?: (value: string) => void;
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     disabled?: boolean;
//     options: Map<string, string>;
//     registerOption: (value: string, label: string) => void;
// } | null>(null);

// function useSelect() {
//     const context = React.useContext(SelectContext);
//     if (!context) {
//         throw new Error('Select components must be used within Select');
//     }
//     return context;
// }

// export function Select({ value, onValueChange, children, disabled = false }: SelectProps) {
//     const [open, setOpen] = React.useState(false);
//     const [options] = React.useState(() => new Map<string, string>());

//     const registerOption = React.useCallback((val: string, label: string) => {
//         options.set(val, label);
//     }, [options]);

//     return (
//         <SelectContext.Provider
//             value={{
//                 value,
//                 onValueChange,
//                 open,
//                 setOpen: (val) => !disabled && setOpen(val),
//                 disabled,
//                 options,
//                 registerOption,
//             }}
//         >
//             <Dialog open={open} onOpenChange={setOpen}>
//                 {children}
//             </Dialog>
//         </SelectContext.Provider>
//     );
// }

// export function SelectTrigger({
//     className,
//     containerClassName,
//     children,
//     size = 'md',
//     variant = 'outline',
//     prefix,
//     suffix,
//     error = false,
// }: SelectTriggerProps) {
//     const { setOpen, disabled, value, options } = useSelect();
//     const { colors } = useThemeColors();
//     const [isFocused, setIsFocused] = React.useState(false);
//     const isOutline = variant === 'outline';

//     const sizeStyles = {
//         sm: 'web:h-9 h-10',
//         md: 'web:h-10 h-11',
//         lg: 'web:h-12 h-13',
//     };

//     const displayValue = value ? options.get(value) : null;

//     return (
//         <View className={cn('w-full', containerClassName)}>
//             <View
//                 className={cn(
//                     'flex-row items-center bg-background',
//                     isOutline && `${sizeStyles[size]} border rounded-lg px-3`,
//                     !isOutline && `${sizeStyles[size]} border-b`,
//                     isOutline && !error && !isFocused && 'border-input',
//                     isOutline && !error && isFocused && 'border-ring',
//                     isOutline && error && 'border-destructive',
//                     !isOutline && !error && !isFocused && 'border-input',
//                     !isOutline && !error && isFocused && 'border-ring',
//                     !isOutline && error && 'border-destructive',
//                     disabled && 'opacity-50',
//                     className
//                 )}
//             >
//                 {prefix && <View className="mr-3">{prefix}</View>}

//                 <Pressable
//                     onPress={() => {
//                         setIsFocused(true);
//                         setOpen(true);
//                     }}
//                     disabled={disabled}
//                     className="flex-1 flex-row items-center justify-between gap-2"
//                 >
//                     <Text
//                         size="md"
//                         className={cn(
//                             'flex-1',
//                             displayValue ? 'text-foreground' : 'text-muted-foreground'
//                         )}
//                     >
//                         {displayValue || children}
//                     </Text>

//                     <ChevronDown size={16} color={colors.mutedForeground} />
//                 </Pressable>

//                 {suffix && <View className="ml-3">{suffix}</View>}
//             </View>

//             {error && (
//                 <Text size="sm" className="text-destructive mt-2">
//                     {error}
//                 </Text>
//             )}
//         </View>
//     );
// }

// export function SelectValue({ placeholder = 'Select...', className }: SelectValueProps) {
//     const { value, options } = useSelect();
//     const displayValue = value ? options.get(value) : null;

//     return (
//         <Text
//             size="sm"
//             className={cn(
//                 'flex-1',
//                 displayValue ? 'text-foreground' : 'text-muted-foreground',
//                 className
//             )}
//         >
//             {displayValue || placeholder}
//         </Text>
//     );
// }

// export function SelectContent({ className, children }: SelectContentProps) {
//     return (
//         <DialogContent className={cn('p-0 max-h-96', className)}>
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 bounces={false}
//                 className="max-h-96"
//             >
//                 <View className="py-1">{children}</View>
//             </ScrollView>
//         </DialogContent>
//     );
// }

// export function SelectItem({ value, label, className, disabled = false }: SelectItemProps) {
//     const { value: selectedValue, onValueChange, setOpen, registerOption } = useSelect();
//     const { colors } = useThemeColors();
//     const isSelected = selectedValue === value;

//     React.useEffect(() => {
//         registerOption(value, label);
//     }, [value, label, registerOption]);

//     const handleSelect = () => {
//         if (disabled) return;
//         onValueChange?.(value);
//         setOpen(false);
//     };

//     return (
//         <Pressable
//             onPress={handleSelect}
//             disabled={disabled}
//             className={cn(
//                 'flex-row items-center justify-between px-4 py-3 border-b border-border active:bg-accent',
//                 isSelected && 'bg-accent',
//                 disabled && 'opacity-50',
//                 className
//             )}
//         >
//             <Text
//                 size="sm"
//                 variant={'body'}
//                 className={cn(
//                     'flex-1',
//                     isSelected ? 'text-accent-foreground' : 'text-foreground'
//                 )}
//             >
//                 {label}
//             </Text>

//             {isSelected && (
//                 <Check size={16} color={colors.primary} className="ml-2" />
//             )}
//         </Pressable>
//     );
// }

// export function SelectGroup({ className, children }: SelectGroupProps) {
//     return <View className={cn('py-1', className)}>{children}</View>;
// }

// export function SelectLabel({ className, children }: SelectLabelProps) {
//     return (
//         <View className={cn('px-4 py-2', className)}>
//             <Text size="sm" variant='title' className="uppercase tracking-wide text-muted-foreground">
//                 {children}
//             </Text>
//         </View>
//     );
// }

// export function SelectSeparator({ className }: SelectSeparatorProps) {
//     return <View className={cn('h-px bg-border my-1 mx-2', className)} />;
// }

// export type { SelectOption };
