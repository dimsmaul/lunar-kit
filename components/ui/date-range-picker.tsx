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

// // components/ui/date-range-picker.tsx
// import * as React from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { cn } from '@/lib/utils';
// import { Dialog, DialogContent } from './dialog';
// import dayjs, { Dayjs } from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';

// dayjs.extend(isBetween);

// interface DateRangePickerProps {
//     startDate?: Date;
//     endDate?: Date;
//     onRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
//     children: React.ReactNode;
//     minDate?: Date;
//     maxDate?: Date;
//     maxDays?: number; // Max days between start and end
// }

// interface DateRangePickerTriggerProps {
//     className?: string;
//     children: React.ReactNode;
// }

// interface DateRangePickerContentProps {
//     className?: string;
// }

// const DateRangePickerContext = React.createContext<{
//     startDate?: Date;
//     endDate?: Date;
//     onRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     minDate?: Date;
//     maxDate?: Date;
//     maxDays?: number;
// } | null>(null);

// function useDateRangePicker() {
//     const context = React.useContext(DateRangePickerContext);
//     if (!context) {
//         throw new Error('DateRangePicker components must be used within DateRangePicker');
//     }
//     return context;
// }

// export function DateRangePicker({
//     startDate,
//     endDate,
//     onRangeChange,
//     children,
//     minDate,
//     maxDate,
//     maxDays,
// }: DateRangePickerProps) {
//     const [open, setOpen] = React.useState(false);

//     return (
//         <DateRangePickerContext.Provider value={{
//             startDate,
//             endDate,
//             onRangeChange,
//             open,
//             setOpen,
//             minDate,
//             maxDate,
//             maxDays,
//         }}>
//             <Dialog open={open} onOpenChange={setOpen}>
//                 {children}
//             </Dialog>
//         </DateRangePickerContext.Provider>
//     );
// }

// export function DateRangePickerTrigger({ className, children }: DateRangePickerTriggerProps) {
//     const { setOpen } = useDateRangePicker();

//     return (
//         <Pressable
//             onPress={() => setOpen(true)}
//             className={cn(
//                 'flex-row items-center justify-between px-4 py-3 border border-slate-300 rounded-lg bg-white',
//                 className
//             )}
//         >
//             {children}
//         </Pressable>
//     );
// }

// export function DateRangePickerContent({ className }: DateRangePickerContentProps) {
//     const { startDate, endDate, onRangeChange, setOpen, minDate, maxDate, maxDays } = useDateRangePicker();

//     const [currentDate, setCurrentDate] = React.useState<Dayjs>(() =>
//         startDate ? dayjs(startDate) : dayjs()
//     );

//     const [tempStartDate, setTempStartDate] = React.useState<Dayjs | undefined>(
//         startDate ? dayjs(startDate) : undefined
//     );
//     const [tempEndDate, setTempEndDate] = React.useState<Dayjs | undefined>(
//         endDate ? dayjs(endDate) : undefined
//     );

//     const handleDateSelect = (date: Dayjs) => {
//         if (!tempStartDate || (tempStartDate && tempEndDate)) {
//             // Start new selection
//             setTempStartDate(date);
//             setTempEndDate(undefined);
//         } else {
//             // Select end date
//             if (date.isBefore(tempStartDate)) {
//                 // Swap if end is before start
//                 setTempStartDate(date);
//                 setTempEndDate(tempStartDate);
//             } else {
//                 // Check maxDays constraint
//                 if (maxDays) {
//                     const daysDiff = date.diff(tempStartDate, 'day');
//                     if (daysDiff > maxDays) {
//                         // Don't allow selection beyond maxDays
//                         return;
//                     }
//                 }
//                 setTempEndDate(date);
//             }
//         }
//     };

//     const handleApply = () => {
//         if (tempStartDate && tempEndDate) {
//             onRangeChange?.(tempStartDate.toDate(), tempEndDate.toDate());
//             setOpen(false);
//         }
//     };

//     const handleClear = () => {
//         setTempStartDate(undefined);
//         setTempEndDate(undefined);
//         onRangeChange?.(undefined, undefined);
//     };

//     const handleCancel = () => {
//         setTempStartDate(startDate ? dayjs(startDate) : undefined);
//         setTempEndDate(endDate ? dayjs(endDate) : undefined);
//         setOpen(false);
//     };

//     const handlePrevious = () => {
//         setCurrentDate(currentDate.subtract(1, 'month'));
//     };

//     const handleNext = () => {
//         setCurrentDate(currentDate.add(1, 'month'));
//     };

//     return (
//         <DialogContent className={cn('p-4', className)}>
//             <View>
//                 {/* Header */}
//                 <View className="flex-row items-center justify-between mb-4">
//                     <Pressable onPress={handlePrevious} className="p-2">
//                         <Text className="text-lg font-semibold text-slate-700">←</Text>
//                     </Pressable>

//                     <Text className="text-base font-semibold text-slate-900">
//                         {currentDate.format('MMMM YYYY')}
//                     </Text>

//                     <Pressable onPress={handleNext} className="p-2">
//                         <Text className="text-lg font-semibold text-slate-700">→</Text>
//                     </Pressable>
//                 </View>

//                 {/* Calendar Grid */}
//                 <DateRangePickerGrid
//                     currentDate={currentDate}
//                     startDate={tempStartDate}
//                     endDate={tempEndDate}
//                     onSelect={handleDateSelect}
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     maxDays={maxDays}
//                 />

//                 {/* Selected Range Info */}
//                 {tempStartDate && (
//                     <View className="mt-4 p-3 bg-blue-50 rounded-lg">
//                         <Text className="text-sm font-medium text-blue-900">
//                             {tempEndDate
//                                 ? `${tempStartDate.format('MMM DD, YYYY')} - ${tempEndDate.format('MMM DD, YYYY')}`
//                                 : `Start: ${tempStartDate.format('MMM DD, YYYY')} (Select end date)`
//                             }
//                         </Text>
//                         {tempStartDate && tempEndDate && (
//                             <Text className="text-xs text-blue-700 mt-1">
//                                 {tempEndDate.diff(tempStartDate, 'day') + 1} days
//                             </Text>
//                         )}
//                     </View>
//                 )}

//                 {/* Action Buttons */}
//                 <View className="flex-row gap-2 mt-4">
//                     <Pressable
//                         onPress={handleClear}
//                         className="flex-1 py-2.5 rounded-lg border border-slate-300 items-center"
//                     >
//                         <Text className="text-sm font-medium text-slate-700">Clear</Text>
//                     </Pressable>

//                     <Pressable
//                         onPress={handleCancel}
//                         className="flex-1 py-2.5 rounded-lg border border-slate-300 items-center"
//                     >
//                         <Text className="text-sm font-medium text-slate-700">Cancel</Text>
//                     </Pressable>

//                     <Pressable
//                         onPress={handleApply}
//                         disabled={!tempStartDate || !tempEndDate}
//                         className={cn(
//                             'flex-1 py-2.5 rounded-lg items-center',
//                             tempStartDate && tempEndDate ? 'bg-blue-600' : 'bg-slate-200'
//                         )}
//                     >
//                         <Text className={cn(
//                             'text-sm font-medium',
//                             tempStartDate && tempEndDate ? 'text-white' : 'text-slate-400'
//                         )}>
//                             Apply
//                         </Text>
//                     </Pressable>
//                 </View>
//             </View>
//         </DialogContent>
//     );
// }

// // Date Range Picker Grid
// function DateRangePickerGrid({
//     currentDate,
//     startDate,
//     endDate,
//     onSelect,
//     minDate,
//     maxDate,
//     maxDays,
// }: {
//     currentDate: Dayjs;
//     startDate?: Dayjs;
//     endDate?: Dayjs;
//     onSelect: (date: Dayjs) => void;
//     minDate?: Date;
//     maxDate?: Date;
//     maxDays?: number;
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

//         // If start date is selected and maxDays is set, disable dates beyond range
//         if (startDate && !endDate && maxDays) {
//             const daysDiff = Math.abs(date.diff(startDate, 'day'));
//             if (daysDiff > maxDays) return true;
//         }

//         return false;
//     };

//     const rows: Dayjs[][] = [];
//     for (let i = 0; i < days.length; i += 7) {
//         rows.push(days.slice(i, i + 7));
//     }

//     return (
//         <View>
//             {/* Week days header */}
//             <View className="flex-row">
//                 {weekDays.map((day, index) => (
//                     <View key={index} className="flex-1 items-center py-2">
//                         <Text className="text-xs font-semibold text-slate-500">{day}</Text>
//                     </View>
//                 ))}
//             </View>

//             {/* Days grid */}
//             {rows.map((week, weekIndex) => (
//                 <View key={weekIndex} className="flex-row">
//                     {week.map((day, dayIndex) => {
//                         const isCurrentMonth = day.month() === currentDate.month();
//                         const isStart = startDate && day.isSame(startDate, 'day');
//                         const isEnd = endDate && day.isSame(endDate, 'day');
//                         const isInRange = startDate && endDate && day.isBetween(startDate, endDate, 'day', '[]');
//                         const isToday = day.isSame(dayjs(), 'day');
//                         const disabled = isDisabled(day);

//                         return (
//                             <View key={dayIndex} className="flex-1 p-1">
//                                 <Pressable
//                                     onPress={() => !disabled && onSelect(day)}
//                                     disabled={disabled}
//                                     className={cn(
//                                         'aspect-square items-center justify-center rounded-lg',
//                                         isStart && 'bg-blue-600',
//                                         isEnd && 'bg-blue-600',
//                                         isInRange && !isStart && !isEnd && 'bg-blue-100',
//                                         !isStart && !isEnd && !isInRange && isToday && 'border border-blue-600',
//                                         !isStart && !isEnd && !isInRange && !isToday && isCurrentMonth && 'bg-slate-50',
//                                         disabled && 'opacity-30'
//                                     )}
//                                 >
//                                     <Text
//                                         className={cn(
//                                             'text-sm',
//                                             (isStart || isEnd) && 'text-white font-semibold',
//                                             !isStart && !isEnd && isInRange && 'text-blue-600 font-medium',
//                                             !isStart && !isEnd && !isInRange && isCurrentMonth && 'text-slate-900',
//                                             !isStart && !isEnd && !isInRange && !isCurrentMonth && 'text-slate-400'
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

// export function DateRangePickerValue({
//     placeholder = 'Select date range',
//     format = 'MMM DD, YYYY',
//     className,
// }: {
//     placeholder?: string;
//     format?: string;
//     className?: string;
// }) {
//     const { startDate, endDate } = useDateRangePicker();

//     return (
//         <Text
//             className={cn(
//                 'flex-1 text-sm',
//                 startDate && endDate ? 'text-slate-900' : 'text-slate-400',
//                 className
//             )}
//         >
//             {startDate && endDate
//                 ? `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(format)}`
//                 : placeholder
//             }
//         </Text>
//     );
// }
