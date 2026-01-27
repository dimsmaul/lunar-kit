// components/ui/date-picker.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Dialog, DialogContent } from './dialog';
import { Calendar } from './calendar';
import { CalendarDays } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import dayjs from 'dayjs';

type DatePickerVariant = 'date' | 'month' | 'year';

// Date Picker Trigger Variants
const datePickerTriggerVariants = cva(
    'flex-row items-center justify-between rounded-lg border',
    {
        variants: {
            variant: {
                default: 'border-input bg-background',
                outline: 'border-input bg-transparent',
                filled: 'border-transparent bg-muted',
            },
            size: {
                sm: 'px-3 py-2',
                md: 'px-4 py-3',
                lg: 'px-5 py-4',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

type TriggerVariant = 'default' | 'outline' | 'filled';
type TriggerSize = 'sm' | 'md' | 'lg';

interface DatePickerProps {
    value?: Date;
    onValueChange?: (date: Date) => void;
    children: React.ReactNode;
    variant?: DatePickerVariant;
    minDate?: Date;
    maxDate?: Date;
    triggerVariant?: TriggerVariant;
    triggerSize?: TriggerSize;
}

interface DatePickerTriggerProps {
    className?: string;
    children: React.ReactNode;
}

interface DatePickerContentProps {
    className?: string;
}

const DatePickerContext = React.createContext<{
    value?: Date;
    onValueChange?: (date: Date) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    variant: DatePickerVariant;
    minDate?: Date;
    maxDate?: Date;
    triggerVariant: TriggerVariant;
    triggerSize: TriggerSize;
} | null>(null);

function useDatePicker() {
    const context = React.useContext(DatePickerContext);
    if (!context) {
        throw new Error('DatePicker components must be used within DatePicker');
    }
    return context;
}

export function DatePicker({
    value,
    onValueChange,
    children,
    variant = 'date',
    minDate,
    maxDate,
    triggerVariant = 'default',
    triggerSize = 'md',
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <DatePickerContext.Provider
            value={{
                value,
                onValueChange,
                open,
                setOpen,
                variant,
                minDate,
                maxDate,
                triggerVariant,
                triggerSize,
            }}
        >
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </DatePickerContext.Provider>
    );
}

export function DatePickerTrigger({ className, children }: DatePickerTriggerProps) {
    const { setOpen, triggerVariant, triggerSize } = useDatePicker();

    return (
        <Pressable
            onPress={() => setOpen(true)}
            className={cn(
                datePickerTriggerVariants({
                    variant: triggerVariant,
                    size: triggerSize
                }),
                className
            )}
        >
            {children}
        </Pressable>
    );
}

export function DatePickerContent({ className }: DatePickerContentProps) {
    const { value, onValueChange, setOpen, variant, minDate, maxDate } = useDatePicker();

    const handleValueChange = (date: Date) => {
        onValueChange?.(date);
        setOpen(false);
    };

    return (
        <DialogContent className={cn('p-0', className)}>
            <Calendar
                value={value}
                onValueChange={handleValueChange}
                variant={variant}
                minDate={minDate}
                maxDate={maxDate}
            />
        </DialogContent>
    );
}

export function DatePickerValue({
    placeholder = 'Select date',
    format = 'MMM DD, YYYY',
    className,
    showIcon = true,
}: {
    placeholder?: string;
    format?: string;
    className?: string;
    showIcon?: boolean;
}) {
    const { value } = useDatePicker();
    const { colors } = useThemeColors();

    const hasValue = !!value;

    return (
        <>
            <Text
                size="sm"
                className={cn(
                    'flex-1',
                    hasValue ? 'text-foreground' : 'text-muted-foreground',
                    className
                )}
            >
                {value ? dayjs(value).format(format) : placeholder}
            </Text>
            {showIcon && (
                <CalendarDays
                    size={18}
                    color={hasValue ? colors.foreground : colors.mutedForeground}
                />
            )}
        </>
    );
}
