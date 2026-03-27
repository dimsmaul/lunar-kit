import { Calendar, Text, useToolbar } from '@lunar-kit/core';
import React from 'react';
import { View } from 'react-native';

export default function CalendarView() {
  const [date, setDate] = React.useState<Date>();

  useToolbar({
    title: 'Calendar View',
  })
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Calendar</Text>

      <View className='p-3 flex flex-col gap-3 w-full'>
        <Calendar
          value={date}
          onValueChange={setDate}
          variant="date"
        />
      </View>
    </View>
  );
}
