import React from 'react';
import { View, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function IndexScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => Alert.alert('Hello Lunar Kit!')}>
        Get Started
      </Button>
    </View>
  );
}
