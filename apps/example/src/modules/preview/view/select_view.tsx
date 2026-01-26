import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { View, Text } from 'react-native';

export default function SelectView() {
  // const [value, setValue] = React.useState<SelectOption | undefined>();
  const [value, setValue] = React.useState('');

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">SelectView</Text>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple" label="Apple" />
            <SelectItem value="banana" label="Banana" />
            <SelectItem value="orange" label="Orange" />
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot" label="Carrot" />
            <SelectItem value="potato" label="Potato" />
            <SelectItem value="tomato" label="Tomato" />
          </SelectGroup>
        </SelectContent>
      </Select>

      {value && <Text className="mt-4">Selected: {value}</Text>}


    </View>
  );
}
