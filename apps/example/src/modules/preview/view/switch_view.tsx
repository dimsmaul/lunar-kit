import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Switch, Text, useToolbar } from '@lunar-kit/core';

export default function SwitchView() {
  useToolbar({
    title: 'Switch',
  })
  const [airplaneMode, setAirplaneMode] = React.useState(false);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <Text variant="header" size="sm">Switch Toggle</Text>

        <View className="flex-row items-center justify-between p-2 rounded-lg bg-muted/30">
          <Text variant="label">Airplane Mode</Text>
          <Switch
            checked={airplaneMode}
            onCheckedChange={setAirplaneMode}
          />
        </View>

        <View className="flex-row items-center justify-between p-2 rounded-lg bg-muted/30">
          <Text variant="label">Notifications</Text>
          <Switch defaultChecked />
        </View>

        <View className="flex-row items-center justify-between p-2 rounded-lg bg-muted/30">
          <Text variant="label">Disabled (Off)</Text>
          <Switch disabled />
        </View>

        <View className="flex-row items-center justify-between p-2 rounded-lg bg-muted/30">
          <Text variant="label">Disabled (On)</Text>
          <Switch disabled defaultChecked />
        </View>

        <Text variant="header" size="sm" className="mt-4">Custom Styles</Text>

        <View className="flex-row items-center justify-between p-2 rounded-lg bg-muted/30">
          <Text variant="label">Custom Color</Text>
          <Switch
            defaultChecked
            className="bg-green-200"
            thumbClassName="bg-green-600"
          />
        </View>
      </View>
    </ScrollView>
  );
}
