// components/ui/date-range-picker.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from './dialog';
import { Calendar } from './calendar';
import dayjs from 'dayjs';

interface DateRangePickerProps {
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
            }}
        >
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </DateRangePickerContext.Provider>
    );
}

export function DateRangePickerTrigger({ className, children }: DateRangePickerTriggerProps) {
    const { setOpen } = useDateRangePicker();

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
        <DialogContent className={cn('p-4', className)}>
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
                    <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Text className="text-sm font-medium text-blue-900">
                            {tempEndDate
                                ? `${dayjs(tempStartDate).format('MMM DD, YYYY')} - ${dayjs(tempEndDate).format('MMM DD, YYYY')}`
                                : `Start: ${dayjs(tempStartDate).format('MMM DD, YYYY')} (Select end date)`}
                        </Text>
                        {tempStartDate && tempEndDate && (
                            <Text className="text-xs text-blue-700 mt-1">
                                {dayjs(tempEndDate).diff(dayjs(tempStartDate), 'day') + 1} days
                            </Text>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2 mt-4">
                    <Pressable
                        onPress={handleClear}
                        className="flex-1 py-2.5 rounded-lg border border-slate-300 items-center"
                    >
                        <Text className="text-sm font-medium text-slate-700">Clear</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleCancel}
                        className="flex-1 py-2.5 rounded-lg border border-slate-300 items-center"
                    >
                        <Text className="text-sm font-medium text-slate-700">Cancel</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleApply}
                        disabled={!tempStartDate || !tempEndDate}
                        className={cn(
                            'flex-1 py-2.5 rounded-lg items-center',
                            tempStartDate && tempEndDate ? 'bg-blue-600' : 'bg-slate-200'
                        )}
                    >
                        <Text
                            className={cn(
                                'text-sm font-medium',
                                tempStartDate && tempEndDate ? 'text-white' : 'text-slate-400'
                            )}
                        >
                            Apply
                        </Text>
                    </Pressable>
                </View>
            </View>
        </DialogContent>
    );
}

export function DateRangePickerValue({
    placeholder = 'Select date range',
    format = 'MMM DD, YYYY',
    className,
}: {
    placeholder?: string;
    format?: string;
    className?: string;
}) {
    const { startDate, endDate } = useDateRangePicker();

    return (
        <Text
            className={cn(
                'flex-1 text-sm',
                startDate && endDate ? 'text-slate-900' : 'text-slate-400',
                className
            )}
        >
            {startDate && endDate
                ? `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(format)}`
                : placeholder}
        </Text>
    );
}
