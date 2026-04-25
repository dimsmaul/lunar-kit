import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Progress, Button, Text, useToolbar } from '@lunar-kit/core';

export default function ProgressView() {
  const [value, setValue] = React.useState(33);

  useToolbar({
    title: 'Progress',
  })

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <Text variant="header" size="sm">Progress Bar</Text>

        <View className="gap-2">
          <Text variant="label">Current: {Math.round(value)}%</Text>
          <Progress value={value} />
        </View>

        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => setValue(Math.max(0, value - 10))}>Decrease</Button>
          <Button size="sm" onPress={() => setValue(Math.min(100, value + 10))}>Increase</Button>
          <Button size="sm" variant="outline" onPress={() => setValue(Math.random() * 100)}>Random</Button>
        </View>

        <Text variant="header" size="sm" className="mt-4">Custom Styles</Text>

        <View className="gap-4">
          <View className="gap-1">
            <Text >Height & Color</Text>
            <Progress value={75} className="h-1 bg-blue-100" indicatorClassName="bg-blue-600" />
          </View>

          <View className="gap-1">
            <Text >Variant: Success</Text>
            <Progress value={100} indicatorClassName="bg-green-500" />
          </View>

          <View className="gap-1">
            <Text >Variant: Destructive</Text>
            <Progress value={25} indicatorClassName="bg-destructive" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
