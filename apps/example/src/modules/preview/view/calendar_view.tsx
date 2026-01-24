import { Calendar, CalendarContent, CalendarTrigger, CalendarValue } from '@/components/ui/calendar';
import React from 'react';
import { View, Text } from 'react-native';

export default function CalendarView() {
  const [date, setDate] = React.useState<Date>();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">CalendarView</Text>

      <Calendar value={date} onValueChange={setDate} variant="date">
        <CalendarTrigger>
          <CalendarValue placeholder="Select date" />
          <Text className="text-slate-500">📅</Text>
        </CalendarTrigger>
        <CalendarContent />
      </Calendar>
    </View>
  );
}
