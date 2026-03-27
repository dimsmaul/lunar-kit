import React from 'react';
import { View } from 'react-native';
import { Button, Text } from '@lunar-kit/core';
import { router } from 'expo-router';

export default function IndexScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-bold mb-2">
        🌙 Lunar Kit
      </Text>
      <Text className="mb-8">
        Your app is ready!
      </Text>
      <Button onPress={() => router.push('/preview')}>
        Get Started
      </Button>
    </View>
  );
}