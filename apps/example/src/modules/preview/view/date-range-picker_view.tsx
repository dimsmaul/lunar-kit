import { DateRangePicker, DateRangePickerContent, DateRangePickerTrigger, DateRangePickerValue } from '@/components/ui/date-range-picker';
import React from 'react';
import { View, Text } from 'react-native';

export default function DateRangePickerView() {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">DateRangePickerView</Text>
      <View className='w-full p-2'>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onRangeChange={handleRangeChange}
        >
          <DateRangePickerTrigger>
            <DateRangePickerValue placeholder="Select date range" />
            <Text className="text-slate-500">📅</Text>
          </DateRangePickerTrigger>
          <DateRangePickerContent />
        </DateRangePicker>
      </View>
    </View>
  );
}
