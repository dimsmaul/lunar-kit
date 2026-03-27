import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Slider, Text, useToolbar } from '@lunar-kit/core';

export default function SliderView() {
  useToolbar({ title: 'Slider' });
  const [value, setValue] = React.useState(50);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <View className="gap-2">
          <Text variant="header" size="sm">Value: {value}</Text>
          <Slider 
            value={value} 
            onValueChange={setValue} 
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">With Steps (Step: 10)</Text>
          <Slider 
            defaultValue={20} 
            step={10} 
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">Min/Max (0-10)</Text>
          <Slider 
            min={0} 
            max={10} 
            defaultValue={5} 
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">Disabled</Text>
          <Slider 
            defaultValue={30} 
            disabled 
          />
        </View>
      </View>
    </ScrollView>
  );
}
