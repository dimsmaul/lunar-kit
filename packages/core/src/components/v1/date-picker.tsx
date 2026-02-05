// components/ui/date-picker.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from './dialog';
import { Calendar } from './calendar';
import dayjs from 'dayjs';

type DatePickerVariant = 'date' | 'month' | 'year';

interface DatePickerProps {
    value?: Date;
    onValueChange?: (date: Date) => void;
    children: React.ReactNode;
    variant?: DatePickerVariant;
    minDate?: Date;
    maxDate?: Date;
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
            }}
        >
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </DatePickerContext.Provider>
    );
}

export function DatePickerTrigger({ className, children }: DatePickerTriggerProps) {
    const { setOpen } = useDatePicker();

    return (
        <Pressable
            onPress={() => setOpen(true)}
            className={cn(
                'flex-row items-center justify-between px-4 py-3 border border-slate-300 rounded-lg bg-white',
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
        <DialogContent className={cn('p-4', className)}>
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
}: {
    placeholder?: string;
    format?: string;
    className?: string;
}) {
    const { value } = useDatePicker();

    return (
        <Text
            className={cn(
                'flex-1 text-sm',
                value ? 'text-slate-900' : 'text-slate-400',
                className
            )}
        >
            {value ? dayjs(value).format(format) : placeholder}
        </Text>
    );
}
