// components/ui/date-range-picker.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';
import { Calendar } from './calendar';
import { CalendarDays } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import dayjs from 'dayjs';

// Date Range Picker Trigger Variants
const dateRangePickerTriggerVariants = cva(
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

interface DateRangePickerProps extends VariantProps<typeof dateRangePickerTriggerVariants> {
    startDate?: Date;
    endDate?: Date;
    onRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
    children: React.ReactNode;
    minDate?: Date;
    maxDate?: Date;
    maxDays?: number;
}

interface DateRangePickerTriggerProps {
    className?: string;
    children: React.ReactNode;
}

interface DateRangePickerContentProps {
    className?: string;
}

const DateRangePickerContext = React.createContext<{
    startDate?: Date;
    endDate?: Date;
    onRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    minDate?: Date;
    maxDate?: Date;
    maxDays?: number;
    variant: 'default' | 'outline' | 'filled';
    size: 'sm' | 'md' | 'lg';
} | null>(null);

function useDateRangePicker() {
    const context = React.useContext(DateRangePickerContext);
    if (!context) {
        throw new Error('DateRangePicker components must be used within DateRangePicker');
    }
    return context;
}

export function DateRangePicker({
    startDate,
    endDate,
    onRangeChange,
    children,
    minDate,
    maxDate,
    maxDays,
    variant = 'default',
    size = 'md',
}: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <DateRangePickerContext.Provider
            value={{
                startDate,
                endDate,
                onRangeChange,
                open,
                setOpen,
                minDate,
                maxDate,
                maxDays,
                variant: variant ?? 'default',
                size: size ?? 'md',
            }}
        >
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </DateRangePickerContext.Provider>
    );
}

export function DateRangePickerTrigger({ className, children }: DateRangePickerTriggerProps) {
    const { setOpen, variant, size } = useDateRangePicker();

    return (
        <Pressable
            onPress={() => setOpen(true)}
            className={cn(
                dateRangePickerTriggerVariants({ variant, size }),
                className
            )}
        >
            {children}
        </Pressable>
    );
}

export function DateRangePickerContent({ className }: DateRangePickerContentProps) {
    const { startDate, endDate, onRangeChange, setOpen, minDate, maxDate, maxDays } =
        useDateRangePicker();

    const [tempStartDate, setTempStartDate] = React.useState<Date | undefined>(startDate);
    const [tempEndDate, setTempEndDate] = React.useState<Date | undefined>(endDate);

    const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
        setTempStartDate(start);
        setTempEndDate(end);
    };

    const handleApply = () => {
        if (tempStartDate && tempEndDate) {
            onRangeChange?.(tempStartDate, tempEndDate);
            setOpen(false);
        }
    };

    const handleClear = () => {
        setTempStartDate(undefined);
        setTempEndDate(undefined);
        onRangeChange?.(undefined, undefined);
    };

    const handleCancel = () => {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setOpen(false);
    };

    return (
        <DialogContent className={cn('p-0', className)}>
            <View>
                {/* Calendar with range mode */}
                <Calendar
                    mode="range"
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    onRangeChange={handleRangeChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    maxDays={maxDays}
                />

                {/* Selected Range Info */}
                {tempStartDate && (
                    <View className="mt-2 mx-4 p-3 bg-accent rounded-lg">
                        <Text variant="body" size="sm" className="font-medium">
                            {tempEndDate
                                ? `${dayjs(tempStartDate).format('MMM DD, YYYY')} - ${dayjs(tempEndDate).format('MMM DD, YYYY')}`
                                : `Start: ${dayjs(tempStartDate).format('MMM DD, YYYY')} (Select end date)`}
                        </Text>
                        {tempStartDate && tempEndDate && (
                            <Text variant="muted" size="sm" className="mt-1">
                                {dayjs(tempEndDate).diff(dayjs(tempStartDate), 'day') + 1} days
                            </Text>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2 m-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onPress={handleClear}
                        className="flex-1"
                    >
                        Clear
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onPress={handleCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onPress={handleApply}
                        disabled={!tempStartDate || !tempEndDate}
                        className="flex-1"
                    >
                        Apply
                    </Button>
                </View>
            </View>
        </DialogContent>
    );
}

export function DateRangePickerValue({
    placeholder = 'Select date range',
    format = 'MMM DD, YYYY',
    className,
    showIcon = true,
}: {
    placeholder?: string;
    format?: string;
    className?: string;
    showIcon?: boolean;
}) {
    const { startDate, endDate } = useDateRangePicker();
    const { colors } = useThemeColors();

    const hasValue = startDate && endDate;

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
                {hasValue
                    ? `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(format)}`
                    : placeholder}
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