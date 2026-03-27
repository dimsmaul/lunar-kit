import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Breadcrumb, Text, useToolbar, toast } from '@lunar-kit/core';
import { Slash, MoreHorizontal } from 'lucide-react-native';

export default function BreadcrumbView() {
  useToolbar({ title: 'Breadcrumb' });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-8">
        <View className="gap-2">
          <Text variant="header" size="sm">Simple Hierarchy</Text>
          <Breadcrumb 
            items={[
              { label: 'Home', onPress: () => toast.info('Home') },
              { label: 'Products', onPress: () => toast.info('Products') },
              { label: 'Details' }
            ]}
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">Custom Separator</Text>
          <Breadcrumb 
            separator={<Slash size={12} color="#94a3b8" />}
            items={[
              { label: 'Dashboard', onPress: () => toast.info('Dashboard') },
              { label: 'Settings', onPress: () => toast.info('Settings') },
              { label: 'General' }
            ]}
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">With Ellipsis</Text>
          <Breadcrumb 
            items={[
              { label: 'Home', onPress: () => toast.info('Home') },
              { label: <MoreHorizontal size={16} color="#94a3b8" />, onPress: () => {} },
              { label: 'Category', onPress: () => toast.info('Category') },
              { label: 'Current Item' }
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}
