import { View, ScrollView } from 'react-native';
import { Skeleton, Text, Card, useToolbar } from '@lunar-kit/core';

export default function SkeletonView() {
  useToolbar({
    title: 'Skeleton',
  })
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <Text variant="header" size="sm">Skeleton Shapes</Text>

        <View className="gap-2">
          <Text variant="label">Rectangle (Default)</Text>
          <Skeleton className="h-[100px] w-full" />
        </View>

        <View className="gap-2">
          <Text variant="label">Circle</Text>
          <Skeleton variant="circle" className="h-16 w-16" />
        </View>

        <View className="gap-2">
          <Text variant="label">Text</Text>
          <View className="gap-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-[80%]" />
            <Skeleton variant="text" className="w-[60%]" />
          </View>
        </View>

        <Text variant="header" size="sm" className="mt-4">Example Usage (Card Loading)</Text>

        <Card className="p-4 gap-4">
          <View className="flex-row gap-4 items-center">
            <Skeleton variant="circle" className="h-12 w-12" />
            <View className="flex-1 gap-2">
              <Skeleton variant="text" className="w-[40%]" />
              <Skeleton variant="text" className="w-[20%]" />
            </View>
          </View>
          <Skeleton className="h-32 w-full" />
          <View className="flex-row justify-between">
            <Skeleton variant="rect" className="h-8 w-24" />
            <Skeleton variant="rect" className="h-8 w-24" />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
