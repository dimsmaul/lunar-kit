import { Calendar } from '@/components/ui/calendar';
import React from 'react';
import { View, Text } from 'react-native';

export default function CalendarView() {
  const [date, setDate] = React.useState<Date>();
  return (
    <View className="flex-1 items-center justify-center bg-white">
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
