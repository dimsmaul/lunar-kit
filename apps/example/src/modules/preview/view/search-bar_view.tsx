import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar, Text, useToolbar, toast } from '@lunar-kit/core';

export default function SearchBarView() {
  useToolbar({ title: 'Search Bar' });
  const [value, setValue] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-8">
        <View className="gap-2">
          <Text variant="header" size="sm">Standard Search</Text>
          <SearchBar 
            value={value}
            onValueChange={setValue}
            placeholder="Search files..."
          />
          <Text className="text-muted-foreground mt-1">Current: {value}</Text>
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">With Debounce (500ms)</Text>
          <SearchBar 
            onDebouncedValueChange={setDebouncedValue}
            placeholder="Type to search..."
          />
          {debouncedValue ? (
            <Text className="text-primary mt-1 font-medium">Results for: "{debouncedValue}"</Text>
          ) : null}
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">Custom Style</Text>
          <SearchBar 
            className="bg-primary/10 border-primary/20"
            placeholder="Custom themed search"
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm">Disabled State</Text>
          <SearchBar 
            disabled
            placeholder="Cannot search right now"
          />
        </View>
      </View>
    </ScrollView>
  );
}
