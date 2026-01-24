import { DatePicker, DatePickerContent, DatePickerTrigger, DatePickerValue } from '@/components/ui/date-picker';
import React from 'react';
import { View, Text } from 'react-native';

export default function DatePickerView() {
  const [date, setDate] = React.useState<Date>();
  const [month, setMonth] = React.useState<Date>();
  const [year, setYear] = React.useState<Date>();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Date Picker</Text>

      <View className='p-3 flex flex-col gap-3 w-full'>
        <DatePicker value={date} onValueChange={setDate} variant="date">
          <DatePickerTrigger>
            <DatePickerValue placeholder="Select date" />
            <Text className="text-slate-500">📅</Text>
          </DatePickerTrigger>
          <DatePickerContent />
        </DatePicker>
        <DatePicker value={month} onValueChange={setMonth} variant="month">
          <DatePickerTrigger>
            <DatePickerValue placeholder="Select month" format='MMMM' />
            <Text className="text-slate-500">📅</Text>
          </DatePickerTrigger>
          <DatePickerContent />
        </DatePicker>
        <DatePicker value={year} onValueChange={setYear} variant="year">
          <DatePickerTrigger>
            <DatePickerValue placeholder="Select year" format='YYYY' />
            <Text className="text-slate-500">📅</Text>
          </DatePickerTrigger>
          <DatePickerContent />
        </DatePicker>
      </View>
    </View>
  );
}
