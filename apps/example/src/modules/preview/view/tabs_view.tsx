import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToolbar } from '@/hooks/useToolbar';
import React from 'react';
import { View, Text } from 'react-native';

export default function TabsView() {
  const [activeTab, setActiveTab] = React.useState('overview');

  useToolbar({
    title: 'Tabs',
  })
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Tabs</Text>

      <View className="p-4 w-full flex flex-col gap-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Text>Overview content</Text>
          </TabsContent>

          <TabsContent value="analytics">
            <Text>Analytics content</Text>
          </TabsContent>

          <TabsContent value="reports">
            <Text>Reports content</Text>
          </TabsContent>
        </Tabs>
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="pill">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Text>Overview content</Text>
          </TabsContent>

          <TabsContent value="analytics">
            <Text>Analytics content</Text>
          </TabsContent>

          <TabsContent value="reports">
            <Text>Reports content</Text>
          </TabsContent>
        </Tabs>
      </View>
    </View>
  );
}
