// components/ui/calendar.tsx
import * as React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from './dialog';
import dayjs, { Dayjs } from 'dayjs';


type CalendarMode = 'date' | 'month' | 'year';
type CalendarVariant = 'date' | 'month' | 'year';

interface CalendarProps {
    value?: Date;
    onValueChange?: (date: Date) => void;
    children: React.ReactNode;
    variant?: CalendarVariant;
    minDate?: Date;
    maxDate?: Date;
}

interface CalendarTriggerProps {
    className?: string;
    children: React.ReactNode;
}

interface CalendarContentProps {
    className?: string;
}

const CalendarContext = React.createContext<{
    value?: Date;
    onValueChange?: (date: Date) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    variant: CalendarVariant;
    minDate?: Date;
    maxDate?: Date;
} | null>(null);

function useCalendar() {
    const context = React.useContext(CalendarContext);
    if (!context) {
        throw new Error('Calendar components must be used within Calendar');
    }
    return context;
}

export function Calendar({
    value,
    onValueChange,
    children,
    variant = 'date',
    minDate,
    maxDate,
}: CalendarProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <CalendarContext.Provider value={{
            value,
            onValueChange,
            open,
            setOpen,
            variant,
            minDate,
            maxDate,
        }}>
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
            </Dialog>
        </CalendarContext.Provider>
    );
}

export function CalendarTrigger({ className, children }: CalendarTriggerProps) {
    const { setOpen } = useCalendar();

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

export function CalendarContent({ className }: CalendarContentProps) {
    const { value, onValueChange, setOpen, variant, minDate, maxDate } = useCalendar();

    const [currentDate, setCurrentDate] = React.useState<Dayjs>(() =>
        value ? dayjs(value) : dayjs()
    );
    const [mode, setMode] = React.useState<CalendarMode>(variant);

    // Reset mode when variant changes
    React.useEffect(() => {
        setMode(variant);
    }, [variant]);

    const handleDateSelect = (date: Dayjs) => {
        onValueChange?.(date.toDate());
        setOpen(false);
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = currentDate.month(monthIndex);
        setCurrentDate(newDate);

        if (variant === 'month') {
            // Month picker mode - select and close
            onValueChange?.(newDate.toDate());
            setOpen(false);
        } else {
            // Date picker mode - go back to date view
            setMode('date');
        }
    };

    const handleYearSelect = (year: number) => {
        const newDate = currentDate.year(year);
        setCurrentDate(newDate);

        if (variant === 'year') {
            // Year picker mode - select and close
            onValueChange?.(newDate.toDate());
            setOpen(false);
        } else if (variant === 'month') {
            // Month picker mode - go to month view
            setMode('month');
        } else {
            // Date picker mode - go to month view
            setMode('month');
        }
    };

    const handlePrevious = () => {
        if (mode === 'date') {
            setCurrentDate(currentDate.subtract(1, 'month'));
        } else if (mode === 'month') {
            setCurrentDate(currentDate.subtract(1, 'year'));
        } else {
            setCurrentDate(currentDate.subtract(12, 'year'));
        }
    };

    const handleNext = () => {
        if (mode === 'date') {
            setCurrentDate(currentDate.add(1, 'month'));
        } else if (mode === 'month') {
            setCurrentDate(currentDate.add(1, 'year'));
        } else {
            setCurrentDate(currentDate.add(12, 'year'));
        }
    };

    return (
        <DialogContent className={cn('p-4', className)}>
            <View>
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <Pressable
                        onPress={handlePrevious}
                        className="p-2"
                    >
                        <Text className="text-lg font-semibold text-slate-700">←</Text>
                    </Pressable>

                    <View className="flex-row items-center gap-2">
                        {mode === 'date' && (
                            <>
                                <Pressable onPress={() => setMode('month')}>
                                    <Text className="text-base font-semibold text-slate-900">
                                        {currentDate.format('MMMM')}
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => setMode('year')}>
                                    <Text className="text-base font-semibold text-slate-900">
                                        {currentDate.format('YYYY')}
                                    </Text>
                                </Pressable>
                            </>
                        )}

                        {mode === 'month' && (
                            <Pressable onPress={() => setMode('year')}>
                                <Text className="text-base font-semibold text-slate-900">
                                    {currentDate.format('YYYY')}
                                </Text>
                            </Pressable>
                        )}

                        {mode === 'year' && (
                            <Text className="text-base font-semibold text-slate-900">
                                {currentDate.year() - 6} - {currentDate.year() + 5}
                            </Text>
                        )}
                    </View>

                    <Pressable
                        onPress={handleNext}
                        className="p-2"
                    >
                        <Text className="text-lg font-semibold text-slate-700">→</Text>
                    </Pressable>
                </View>

                {/* Content */}
                {mode === 'date' && (
                    <DatePickerGrid
                        currentDate={currentDate}
                        selectedDate={value ? dayjs(value) : undefined}
                        onSelect={handleDateSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                )}

                {mode === 'month' && (
                    <MonthPickerGrid
                        currentDate={currentDate}
                        selectedDate={value ? dayjs(value) : undefined}
                        onSelect={handleMonthSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                )}

                {mode === 'year' && (
                    <YearPickerGrid
                        currentDate={currentDate}
                        selectedDate={value ? dayjs(value) : undefined}
                        onSelect={handleYearSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                )}
            </View>
        </DialogContent>
    );
}


// Date Picker Grid
function DatePickerGrid({
    currentDate,
    selectedDate,
    onSelect,
    minDate,
    maxDate,
}: {
    currentDate: Dayjs;
    selectedDate?: Dayjs;
    onSelect: (date: Dayjs) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    const generateCalendarDays = () => {
        // DONE: Full native Date approach
        const year = currentDate.year();
        const month = currentDate.month(); // 0-indexed

        // Create date at noon to avoid timezone issues
        const firstDay = new Date(year, month, 1, 12, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 12, 0, 0); // Day 0 of next month = last day of current month

        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
        const daysInMonth = lastDay.getDate();

        // Calculate start date (can be from previous month)
        const startDate = new Date(year, month, 1 - startDayOfWeek, 12, 0, 0);

        // Calculate total cells needed
        const totalDays = startDayOfWeek + daysInMonth;
        const weeksNeeded = Math.ceil(totalDays / 7);
        const totalCells = weeksNeeded * 7;

        // Generate all days
        const days: Dayjs[] = [];
        for (let i = 0; i < totalCells; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(dayjs(date));
        }

        return days;
    };

    const days = generateCalendarDays();

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isDisabled = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
        return false;
    };

    // Organize days by rows
    const rows: Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        rows.push(days.slice(i, i + 7));
    }

    return (
        <View>
            {/* Week days header */}
            <View className="flex-row">
                {weekDays.map((day, index) => (
                    <View key={index} className="flex-1 items-center py-2">
                        <Text className="text-xs font-semibold text-slate-500">{day}</Text>
                    </View>
                ))}
            </View>

            {/* Days grid - by rows */}
            {rows.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-row">
                    {week.map((day, dayIndex) => {
                        const isCurrentMonth = day.month() === currentDate.month();
                        const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                        const isToday = day.isSame(dayjs(), 'day');
                        const disabled = isDisabled(day);

                        return (
                            <View key={dayIndex} className="flex-1 p-1">
                                <Pressable
                                    onPress={() => !disabled && onSelect(day)}
                                    disabled={disabled}
                                    className={cn(
                                        'aspect-square items-center justify-center rounded-lg',
                                        isSelected && 'bg-blue-600',
                                        !isSelected && isToday && 'border border-blue-600',
                                        !isSelected && !isToday && isCurrentMonth && 'bg-slate-50',
                                        disabled && 'opacity-30'
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'text-sm',
                                            isSelected && 'text-white font-semibold',
                                            !isSelected && isCurrentMonth && 'text-slate-900',
                                            !isSelected && !isCurrentMonth && 'text-slate-400'
                                        )}
                                    >
                                        {day.format('D')}
                                    </Text>
                                </Pressable>
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}


// Month Picker Grid
function MonthPickerGrid({
    currentDate,
    selectedDate,
    onSelect,
    minDate,
    maxDate,
}: {
    currentDate: Dayjs;
    selectedDate?: Dayjs;
    onSelect: (monthIndex: number) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    const months = Array.from({ length: 12 }, (_, i) => i);

    const isDisabled = (monthIndex: number) => {
        const date = currentDate.month(monthIndex);
        if (minDate && date.isBefore(dayjs(minDate), 'month')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'month')) return true;
        return false;
    };

    return (
        <View className="flex-row flex-wrap">
            {months.map((monthIndex) => {
                const isSelected = selectedDate &&
                    monthIndex === selectedDate.month() &&
                    currentDate.year() === selectedDate.year();
                const disabled = isDisabled(monthIndex);

                return (
                    <View key={monthIndex} style={{ width: '33.33%' }} className="p-2">
                        <Pressable
                            onPress={() => !disabled && onSelect(monthIndex)}
                            disabled={disabled}
                            className={cn(
                                'py-4 items-center justify-center rounded-lg',
                                isSelected && 'bg-blue-600',
                                !isSelected && 'bg-slate-50',
                                disabled && 'opacity-30'
                            )}
                        >
                            <Text
                                className={cn(
                                    'text-sm font-medium',
                                    isSelected && 'text-white',
                                    !isSelected && 'text-slate-900'
                                )}
                            >
                                {dayjs().month(monthIndex).format('MMM')}
                            </Text>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

// Year Picker Grid
function YearPickerGrid({
    currentDate,
    selectedDate,
    onSelect,
    minDate,
    maxDate,
}: {
    currentDate: Dayjs;
    selectedDate?: Dayjs;
    onSelect: (year: number) => void;
    minDate?: Date;
    maxDate?: Date;
}) {
    const currentYear = currentDate.year();
    const startYear = currentYear - 6;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    const isDisabled = (year: number) => {
        const date = currentDate.year(year);
        if (minDate && date.isBefore(dayjs(minDate), 'year')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'year')) return true;
        return false;
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
            <View className="flex-row flex-wrap">
                {years.map((year) => {
                    const isSelected = selectedDate && year === selectedDate.year();
                    const disabled = isDisabled(year);

                    return (
                        <View key={year} style={{ width: '33.33%' }} className="p-2">
                            <Pressable
                                onPress={() => !disabled && onSelect(year)}
                                disabled={disabled}
                                className={cn(
                                    'py-4 items-center justify-center rounded-lg',
                                    isSelected && 'bg-blue-600',
                                    !isSelected && 'bg-slate-50',
                                    disabled && 'opacity-30'
                                )}
                            >
                                <Text
                                    className={cn(
                                        'text-sm font-medium',
                                        isSelected && 'text-white',
                                        !isSelected && 'text-slate-900'
                                    )}
                                >
                                    {year}
                                </Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

export function CalendarValue({
    placeholder = 'Select date',
    format = 'MMM DD, YYYY',
    className,
}: {
    placeholder?: string;
    format?: string;
    className?: string;
}) {
    const { value } = useCalendar();

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
