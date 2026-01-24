import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function IndexScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-slate-900 mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="text-slate-600 mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => router.push('/preview')}>
        Get Started
      </Button>
    </View>
  );
}