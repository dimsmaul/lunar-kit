import { DateRangePicker, DateRangePickerContent, DateRangePickerTrigger, DateRangePickerValue, Text, useToolbar } from '@lunar-kit/core';
import React from 'react';
import { View } from 'react-native';

export default function DateRangePickerView() {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  useToolbar({
    title: 'Date Range Picker',
  })

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">DateRangePickerView</Text>
      <View className='w-full p-2'>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onRangeChange={handleRangeChange}
        >
          <DateRangePickerTrigger>
            <DateRangePickerValue placeholder="Select date range" />
          </DateRangePickerTrigger>
          <DateRangePickerContent />
        </DateRangePicker>
      </View>
    </View>
  );
}
