import { View, ScrollView } from 'react-native';
import { Separator, Text, useToolbar } from '@lunar-kit/core';

export default function SeparatorView() {
  useToolbar({
    title: 'Separator',
  })
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <Text variant="header" size="sm">Horizontal Separator</Text>

        <View className="gap-2">
          <Text>Above the line</Text>
          <Separator />
          <Text>Below the line</Text>
        </View>

        <Text variant="header" size="sm" className="mt-4">Vertical Separator</Text>

        <View className="flex-row items-center h-10 gap-4">
          <Text>Option A</Text>
          <Separator orientation="vertical" />
          <Text>Option B</Text>
          <Separator orientation="vertical" />
          <Text>Option C</Text>
        </View>

        <Text variant="header" size="sm" className="mt-4">Custom Styles</Text>

        <View className="gap-4">
          <View className="gap-2">
            <Text >Thick & Colored</Text>
            <Separator className="h-1 bg-blue-500 rounded-full" />
          </View>

          <View className="gap-2">
            <Text >Custom Margins</Text>
            <View className="bg-muted p-4 rounded-lg">
              <Text>Part 1</Text>
              <Separator className="my-4 bg-primary/20" />
              <Text>Part 2</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
