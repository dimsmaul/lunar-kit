import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { EmptyState, Text, useToolbar, toast } from '@lunar-kit/core';
import { Inbox, Search, WifiOff } from 'lucide-react-native';

export default function EmptyStateView() {
  useToolbar({ title: 'Empty State' });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-8">
        <View className="border border-border rounded-xl">
          <EmptyState
            title="No messages yet"
            description="Your inbox is empty. Start a conversation with someone!"
            illustration={<Inbox size={48} color="#94a3b8" />}
            actionLabel="Compose Message"
            onActionPress={() => toast.info('Action', 'Compose clicked')}
          />
        </View>

        <View className="border border-border rounded-xl">
          <EmptyState
            title="No results found"
            description="We couldn't find anything matching your search. Try different keywords."
            illustration={<Search size={48} color="#94a3b8" />}
          />
        </View>

        <EmptyState
            title="Connection Lost"
            description="Please check your internet connection and try again."
            illustration={<WifiOff size={48} color="#ef4444" />}
            actionLabel="Retry"
            onActionPress={() => toast.info('Retry', 'Retrying connection...')}
        />
      </View>
    </ScrollView>
  );
}
