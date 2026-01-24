// components/ui/calendar.tsx
import * as React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

type CalendarMode = 'date' | 'month' | 'year';
type CalendarVariant = 'date' | 'month' | 'year';

interface CalendarProps {
    value?: Date;
    onValueChange?: (date: Date) => void;
    variant?: CalendarVariant;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    // DONE: Range mode props
    mode?: 'single' | 'range';
    startDate?: Date;
    endDate?: Date;
    onRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
    maxDays?: number;
}

export function Calendar({
    value,
    onValueChange,
    variant = 'date',
    minDate,
    maxDate,
    className,
    mode = 'single',
    startDate,
    endDate,
    onRangeChange,
    maxDays,
}: CalendarProps) {
    const [currentDate, setCurrentDate] = React.useState<Dayjs>(() =>
        value || startDate ? dayjs(value || startDate) : dayjs()
    );
    const [calendarMode, setCalendarMode] = React.useState<CalendarMode>(variant);

    // DONE: Range selection state
    const [tempStartDate, setTempStartDate] = React.useState<Dayjs | undefined>(
        startDate ? dayjs(startDate) : undefined
    );
    const [tempEndDate, setTempEndDate] = React.useState<Dayjs | undefined>(
        endDate ? dayjs(endDate) : undefined
    );

    React.useEffect(() => {
        setCalendarMode(variant);
    }, [variant]);

    const handleDateSelect = (date: Dayjs) => {
        if (mode === 'range') {
            // Range selection logic
            if (!tempStartDate || (tempStartDate && tempEndDate)) {
                setTempStartDate(date);
                setTempEndDate(undefined);
            } else {
                if (date.isBefore(tempStartDate)) {
                    setTempStartDate(date);
                    setTempEndDate(tempStartDate);
                } else {
                    if (maxDays) {
                        const daysDiff = date.diff(tempStartDate, 'day');
                        if (daysDiff > maxDays) return;
                    }
                    setTempEndDate(date);
                }
                // Call range change callback
                const newStart = tempStartDate;
                const newEnd = date.isBefore(tempStartDate) ? tempStartDate : date;
                onRangeChange?.(newStart.toDate(), newEnd.toDate());
            }
        } else {
            // Single selection logic
            onValueChange?.(date.toDate());
        }
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = currentDate.month(monthIndex);
        setCurrentDate(newDate);

        if (variant === 'month') {
            if (mode === 'single') {
                onValueChange?.(newDate.toDate());
            }
        } else {
            setCalendarMode('date');
        }
    };

    const handleYearSelect = (year: number) => {
        const newDate = currentDate.year(year);
        setCurrentDate(newDate);

        if (variant === 'year') {
            if (mode === 'single') {
                onValueChange?.(newDate.toDate());
            }
        } else if (variant === 'month') {
            setCalendarMode('month');
        } else {
            setCalendarMode('month');
        }
    };

    const handlePrevious = () => {
        if (calendarMode === 'date') {
            setCurrentDate(currentDate.subtract(1, 'month'));
        } else if (calendarMode === 'month') {
            setCurrentDate(currentDate.subtract(1, 'year'));
        } else {
            setCurrentDate(currentDate.subtract(12, 'year'));
        }
    };

    const handleNext = () => {
        if (calendarMode === 'date') {
            setCurrentDate(currentDate.add(1, 'month'));
        } else if (calendarMode === 'month') {
            setCurrentDate(currentDate.add(1, 'year'));
        } else {
            setCurrentDate(currentDate.add(12, 'year'));
        }
    };

    return (
        <View className={className}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <Pressable onPress={handlePrevious} className="p-2">
                    <Text className="text-lg font-semibold text-slate-700">←</Text>
                </Pressable>

                <View className="flex-row items-center gap-2">
                    {calendarMode === 'date' && (
                        <>
                            <Pressable onPress={() => setCalendarMode('month')}>
                                <Text className="text-base font-semibold text-slate-900">
                                    {currentDate.format('MMMM')}
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => setCalendarMode('year')}>
                                <Text className="text-base font-semibold text-slate-900">
                                    {currentDate.format('YYYY')}
                                </Text>
                            </Pressable>
                        </>
                    )}

                    {calendarMode === 'month' && (
                        <Pressable onPress={() => setCalendarMode('year')}>
                            <Text className="text-base font-semibold text-slate-900">
                                {currentDate.format('YYYY')}
                            </Text>
                        </Pressable>
                    )}

                    {calendarMode === 'year' && (
                        <Text className="text-base font-semibold text-slate-900">
                            {currentDate.year() - 6} - {currentDate.year() + 5}
                        </Text>
                    )}
                </View>

                <Pressable onPress={handleNext} className="p-2">
                    <Text className="text-lg font-semibold text-slate-700">→</Text>
                </Pressable>
            </View>

            {/* Content */}
            {calendarMode === 'date' && (
                <DateGrid
                    currentDate={currentDate}
                    selectedDate={mode === 'single' && value ? dayjs(value) : undefined}
                    onSelect={handleDateSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                    // DONE: Pass range props
                    mode={mode}
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    maxDays={maxDays}
                />
            )}

            {calendarMode === 'month' && (
                <MonthGrid
                    currentDate={currentDate}
                    selectedDate={value ? dayjs(value) : undefined}
                    onSelect={handleMonthSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            )}

            {calendarMode === 'year' && (
                <YearGrid
                    currentDate={currentDate}
                    selectedDate={value ? dayjs(value) : undefined}
                    onSelect={handleYearSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            )}
        </View>
    );
}

// Date Grid (updated with range support)
function DateGrid({
    currentDate,
    selectedDate,
    onSelect,
    minDate,
    maxDate,
    mode = 'single',
    startDate,
    endDate,
    maxDays,
}: {
    currentDate: Dayjs;
    selectedDate?: Dayjs;
    onSelect: (date: Dayjs) => void;
    minDate?: Date;
    maxDate?: Date;
    mode?: 'single' | 'range';
    startDate?: Dayjs;
    endDate?: Dayjs;
    maxDays?: number;
}) {
    const generateCalendarDays = () => {
        const year = currentDate.year();
        const month = currentDate.month();

        const firstDay = new Date(year, month, 1, 12, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 12, 0, 0);

        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const startDateCalc = new Date(year, month, 1 - startDayOfWeek, 12, 0, 0);

        const totalDays = startDayOfWeek + daysInMonth;
        const weeksNeeded = Math.ceil(totalDays / 7);
        const totalCells = weeksNeeded * 7;

        const days: Dayjs[] = [];
        for (let i = 0; i < totalCells; i++) {
            const date = new Date(startDateCalc);
            date.setDate(startDateCalc.getDate() + i);
            days.push(dayjs(date));
        }

        return days;
    };

    const days = generateCalendarDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isDisabled = (date: Dayjs) => {
        if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;

        if (mode === 'range' && startDate && !endDate && maxDays) {
            const daysDiff = Math.abs(date.diff(startDate, 'day'));
            if (daysDiff > maxDays) return true;
        }

        return false;
    };

    const rows: Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        rows.push(days.slice(i, i + 7));
    }

    return (
        <View>
            <View className="flex-row">
                {weekDays.map((day, index) => (
                    <View key={index} className="flex-1 items-center py-2">
                        <Text className="text-xs font-semibold text-slate-500">{day}</Text>
                    </View>
                ))}
            </View>

            {rows.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-row">
                    {week.map((day, dayIndex) => {
                        const isCurrentMonth = day.month() === currentDate.month();
                        const isToday = day.isSame(dayjs(), 'day');
                        const disabled = isDisabled(day);

                        // Range mode checks
                        const isStart = mode === 'range' && startDate && day.isSame(startDate, 'day');
                        const isEnd = mode === 'range' && endDate && day.isSame(endDate, 'day');
                        const isInRange =
                            mode === 'range' &&
                            startDate &&
                            endDate &&
                            day.isBetween(startDate, endDate, 'day', '[]');

                        // Single mode checks
                        const isSelected = mode === 'single' && selectedDate && day.isSame(selectedDate, 'day');

                        return (
                            <View key={dayIndex} className="flex-1 p-1">
                                <Pressable
                                    onPress={() => !disabled && onSelect(day)}
                                    disabled={disabled}
                                    className={cn(
                                        'aspect-square items-center justify-center rounded-lg',
                                        isSelected && 'bg-blue-600',
                                        isStart && 'bg-blue-600',
                                        isEnd && 'bg-blue-600',
                                        isInRange && !isStart && !isEnd && 'bg-blue-100',
                                        !isSelected &&
                                        !isStart &&
                                        !isEnd &&
                                        !isInRange &&
                                        isToday &&
                                        'border border-blue-600',
                                        !isSelected &&
                                        !isStart &&
                                        !isEnd &&
                                        !isInRange &&
                                        !isToday &&
                                        isCurrentMonth &&
                                        'bg-slate-50',
                                        disabled && 'opacity-30'
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'text-sm',
                                            (isSelected || isStart || isEnd) && 'text-white font-semibold',
                                            !isSelected &&
                                            !isStart &&
                                            !isEnd &&
                                            isInRange &&
                                            'text-blue-600 font-medium',
                                            !isSelected &&
                                            !isStart &&
                                            !isEnd &&
                                            !isInRange &&
                                            isCurrentMonth &&
                                            'text-slate-900',
                                            !isSelected &&
                                            !isStart &&
                                            !isEnd &&
                                            !isInRange &&
                                            !isCurrentMonth &&
                                            'text-slate-400'
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

// MonthGrid & YearGrid stay the same...
function MonthGrid({
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
                const isSelected =
                    selectedDate &&
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

function YearGrid({
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

// // components/ui/calendar.tsx
// import * as React from 'react';
// import { View, Text, Pressable, ScrollView } from 'react-native';
// import { cn } from '@/lib/utils';
// import dayjs, { Dayjs } from 'dayjs';

// type CalendarMode = 'date' | 'month' | 'year';
// type CalendarVariant = 'date' | 'month' | 'year';

// interface CalendarProps {
//     value?: Date;
//     onValueChange?: (date: Date) => void;
//     variant?: CalendarVariant;
//     minDate?: Date;
//     maxDate?: Date;
//     className?: string;
// }

// export function Calendar({
//     value,
//     onValueChange,
//     variant = 'date',
//     minDate,
//     maxDate,
//     className,
// }: CalendarProps) {
//     const [currentDate, setCurrentDate] = React.useState<Dayjs>(() =>
//         value ? dayjs(value) : dayjs()
//     );
//     const [mode, setMode] = React.useState<CalendarMode>(variant);

//     // Reset mode when variant changes
//     React.useEffect(() => {
//         setMode(variant);
//     }, [variant]);

//     const handleDateSelect = (date: Dayjs) => {
//         onValueChange?.(date.toDate());
//     };

//     const handleMonthSelect = (monthIndex: number) => {
//         const newDate = currentDate.month(monthIndex);
//         setCurrentDate(newDate);

//         if (variant === 'month') {
//             onValueChange?.(newDate.toDate());
//         } else {
//             setMode('date');
//         }
//     };

//     const handleYearSelect = (year: number) => {
//         const newDate = currentDate.year(year);
//         setCurrentDate(newDate);

//         if (variant === 'year') {
//             onValueChange?.(newDate.toDate());
//         } else if (variant === 'month') {
//             setMode('month');
//         } else {
//             setMode('month');
//         }
//     };

//     const handlePrevious = () => {
//         if (mode === 'date') {
//             setCurrentDate(currentDate.subtract(1, 'month'));
//         } else if (mode === 'month') {
//             setCurrentDate(currentDate.subtract(1, 'year'));
//         } else {
//             setCurrentDate(currentDate.subtract(12, 'year'));
//         }
//     };

//     const handleNext = () => {
//         if (mode === 'date') {
//             setCurrentDate(currentDate.add(1, 'month'));
//         } else if (mode === 'month') {
//             setCurrentDate(currentDate.add(1, 'year'));
//         } else {
//             setCurrentDate(currentDate.add(12, 'year'));
//         }
//     };

//     return (
//         <View className={className}>
//             {/* Header */}
//             <View className="flex-row items-center justify-between mb-4">
//                 <Pressable onPress={handlePrevious} className="p-2">
//                     <Text className="text-lg font-semibold text-slate-700">←</Text>
//                 </Pressable>

//                 <View className="flex-row items-center gap-2">
//                     {mode === 'date' && (
//                         <>
//                             <Pressable onPress={() => setMode('month')}>
//                                 <Text className="text-base font-semibold text-slate-900">
//                                     {currentDate.format('MMMM')}
//                                 </Text>
//                             </Pressable>
//                             <Pressable onPress={() => setMode('year')}>
//                                 <Text className="text-base font-semibold text-slate-900">
//                                     {currentDate.format('YYYY')}
//                                 </Text>
//                             </Pressable>
//                         </>
//                     )}

//                     {mode === 'month' && (
//                         <Pressable onPress={() => setMode('year')}>
//                             <Text className="text-base font-semibold text-slate-900">
//                                 {currentDate.format('YYYY')}
//                             </Text>
//                         </Pressable>
//                     )}

//                     {mode === 'year' && (
//                         <Text className="text-base font-semibold text-slate-900">
//                             {currentDate.year() - 6} - {currentDate.year() + 5}
//                         </Text>
//                     )}
//                 </View>

//                 <Pressable onPress={handleNext} className="p-2">
//                     <Text className="text-lg font-semibold text-slate-700">→</Text>
//                 </Pressable>
//             </View>

//             {/* Content */}
//             {mode === 'date' && (
//                 <DateGrid
//                     currentDate={currentDate}
//                     selectedDate={value ? dayjs(value) : undefined}
//                     onSelect={handleDateSelect}
//                     minDate={minDate}
//                     maxDate={maxDate}
//                 />
//             )}

//             {mode === 'month' && (
//                 <MonthGrid
//                     currentDate={currentDate}
//                     selectedDate={value ? dayjs(value) : undefined}
//                     onSelect={handleMonthSelect}
//                     minDate={minDate}
//                     maxDate={maxDate}
//                 />
//             )}

//             {mode === 'year' && (
//                 <YearGrid
//                     currentDate={currentDate}
//                     selectedDate={value ? dayjs(value) : undefined}
//                     onSelect={handleYearSelect}
//                     minDate={minDate}
//                     maxDate={maxDate}
//                 />
//             )}
//         </View>
//     );
// }

// // Date Grid
// function DateGrid({
//     currentDate,
//     selectedDate,
//     onSelect,
//     minDate,
//     maxDate,
// }: {
//     currentDate: Dayjs;
//     selectedDate?: Dayjs;
//     onSelect: (date: Dayjs) => void;
//     minDate?: Date;
//     maxDate?: Date;
// }) {
//     const generateCalendarDays = () => {
//         const year = currentDate.year();
//         const month = currentDate.month();

//         const firstDay = new Date(year, month, 1, 12, 0, 0);
//         const lastDay = new Date(year, month + 1, 0, 12, 0, 0);

//         const startDayOfWeek = firstDay.getDay();
//         const daysInMonth = lastDay.getDate();

//         const startDate = new Date(year, month, 1 - startDayOfWeek, 12, 0, 0);

//         const totalDays = startDayOfWeek + daysInMonth;
//         const weeksNeeded = Math.ceil(totalDays / 7);
//         const totalCells = weeksNeeded * 7;

//         const days: Dayjs[] = [];
//         for (let i = 0; i < totalCells; i++) {
//             const date = new Date(startDate);
//             date.setDate(startDate.getDate() + i);
//             days.push(dayjs(date));
//         }

//         return days;
//     };

//     const days = generateCalendarDays();
//     const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     const isDisabled = (date: Dayjs) => {
//         if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
//         if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
//         return false;
//     };

//     const rows: Dayjs[][] = [];
//     for (let i = 0; i < days.length; i += 7) {
//         rows.push(days.slice(i, i + 7));
//     }

//     return (
//         <View>
//             <View className="flex-row">
//                 {weekDays.map((day, index) => (
//                     <View key={index} className="flex-1 items-center py-2">
//                         <Text className="text-xs font-semibold text-slate-500">{day}</Text>
//                     </View>
//                 ))}
//             </View>

//             {rows.map((week, weekIndex) => (
//                 <View key={weekIndex} className="flex-row">
//                     {week.map((day, dayIndex) => {
//                         const isCurrentMonth = day.month() === currentDate.month();
//                         const isSelected = selectedDate && day.isSame(selectedDate, 'day');
//                         const isToday = day.isSame(dayjs(), 'day');
//                         const disabled = isDisabled(day);

//                         return (
//                             <View key={dayIndex} className="flex-1 p-1">
//                                 <Pressable
//                                     onPress={() => !disabled && onSelect(day)}
//                                     disabled={disabled}
//                                     className={cn(
//                                         'aspect-square items-center justify-center rounded-lg',
//                                         isSelected && 'bg-blue-600',
//                                         !isSelected && isToday && 'border border-blue-600',
//                                         !isSelected && !isToday && isCurrentMonth && 'bg-slate-50',
//                                         disabled && 'opacity-30'
//                                     )}
//                                 >
//                                     <Text
//                                         className={cn(
//                                             'text-sm',
//                                             isSelected && 'text-white font-semibold',
//                                             !isSelected && isCurrentMonth && 'text-slate-900',
//                                             !isSelected && !isCurrentMonth && 'text-slate-400'
//                                         )}
//                                     >
//                                         {day.format('D')}
//                                     </Text>
//                                 </Pressable>
//                             </View>
//                         );
//                     })}
//                 </View>
//             ))}
//         </View>
//     );
// }

// // Month Grid
// function MonthGrid({
//     currentDate,
//     selectedDate,
//     onSelect,
//     minDate,
//     maxDate,
// }: {
//     currentDate: Dayjs;
//     selectedDate?: Dayjs;
//     onSelect: (monthIndex: number) => void;
//     minDate?: Date;
//     maxDate?: Date;
// }) {
//     const months = Array.from({ length: 12 }, (_, i) => i);

//     const isDisabled = (monthIndex: number) => {
//         const date = currentDate.month(monthIndex);
//         if (minDate && date.isBefore(dayjs(minDate), 'month')) return true;
//         if (maxDate && date.isAfter(dayjs(maxDate), 'month')) return true;
//         return false;
//     };

//     return (
//         <View className="flex-row flex-wrap">
//             {months.map((monthIndex) => {
//                 const isSelected =
//                     selectedDate &&
//                     monthIndex === selectedDate.month() &&
//                     currentDate.year() === selectedDate.year();
//                 const disabled = isDisabled(monthIndex);

//                 return (
//                     <View key={monthIndex} style={{ width: '33.33%' }} className="p-2">
//                         <Pressable
//                             onPress={() => !disabled && onSelect(monthIndex)}
//                             disabled={disabled}
//                             className={cn(
//                                 'py-4 items-center justify-center rounded-lg',
//                                 isSelected && 'bg-blue-600',
//                                 !isSelected && 'bg-slate-50',
//                                 disabled && 'opacity-30'
//                             )}
//                         >
//                             <Text
//                                 className={cn(
//                                     'text-sm font-medium',
//                                     isSelected && 'text-white',
//                                     !isSelected && 'text-slate-900'
//                                 )}
//                             >
//                                 {dayjs().month(monthIndex).format('MMM')}
//                             </Text>
//                         </Pressable>
//                     </View>
//                 );
//             })}
//         </View>
//     );
// }

// // Year Grid
// function YearGrid({
//     currentDate,
//     selectedDate,
//     onSelect,
//     minDate,
//     maxDate,
// }: {
//     currentDate: Dayjs;
//     selectedDate?: Dayjs;
//     onSelect: (year: number) => void;
//     minDate?: Date;
//     maxDate?: Date;
// }) {
//     const currentYear = currentDate.year();
//     const startYear = currentYear - 6;
//     const years = Array.from({ length: 12 }, (_, i) => startYear + i);

//     const isDisabled = (year: number) => {
//         const date = currentDate.year(year);
//         if (minDate && date.isBefore(dayjs(minDate), 'year')) return true;
//         if (maxDate && date.isAfter(dayjs(maxDate), 'year')) return true;
//         return false;
//     };

//     return (
//         <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
//             <View className="flex-row flex-wrap">
//                 {years.map((year) => {
//                     const isSelected = selectedDate && year === selectedDate.year();
//                     const disabled = isDisabled(year);

//                     return (
//                         <View key={year} style={{ width: '33.33%' }} className="p-2">
//                             <Pressable
//                                 onPress={() => !disabled && onSelect(year)}
//                                 disabled={disabled}
//                                 className={cn(
//                                     'py-4 items-center justify-center rounded-lg',
//                                     isSelected && 'bg-blue-600',
//                                     !isSelected && 'bg-slate-50',
//                                     disabled && 'opacity-30'
//                                 )}
//                             >
//                                 <Text
//                                     className={cn(
//                                         'text-sm font-medium',
//                                         isSelected && 'text-white',
//                                         !isSelected && 'text-slate-900'
//                                     )}
//                                 >
//                                     {year}
//                                 </Text>
//                             </Pressable>
//                         </View>
//                     );
//                 })}
//             </View>
//         </ScrollView>
//     );
// }
