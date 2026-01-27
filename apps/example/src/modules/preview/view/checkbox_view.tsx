import { Checkbox, CheckboxLabel } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@/components/ui/radio-group';
import { useToolbar } from '@/hooks/useToolbar';
import React from 'react';
import { View, Text } from 'react-native';

export default function CheckboxView() {
  const [radioValue, setRadioValue] = React.useState('option1');
  const [checked, setChecked] = React.useState(false);

  useToolbar({
    title: 'Checkbox View',
  })

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">CheckboxView</Text>

      <View>
        <Text className="font-semibold mb-2">Radio Group</Text>
        <RadioGroup value={radioValue} onValueChange={setRadioValue}>
          <RadioGroupItem value="option1">
            <RadioGroupLabel>Option 1</RadioGroupLabel>
          </RadioGroupItem>
          <RadioGroupItem value="option2">
            <RadioGroupLabel>Option 2</RadioGroupLabel>
          </RadioGroupItem>
          <RadioGroupItem value="option3">
            <RadioGroupLabel>Option 3</RadioGroupLabel>
          </RadioGroupItem>
        </RadioGroup>
      </View>

      {/* Checkbox */}
      <View>
        <Text className="font-semibold mb-2">Checkbox</Text>
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        </Checkbox>
      </View>


    </View>
  );
}
