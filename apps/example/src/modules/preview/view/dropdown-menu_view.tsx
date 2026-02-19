import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import React from 'react';
import { View } from 'react-native';

export default function DropdownMenuView() {
  useToolbar({
    title: 'Dropdown View',
  })
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Dropdown</Text>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Actions
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side='top'>
          <DropdownMenuLabel>General</DropdownMenuLabel>
          <DropdownMenuItem onPress={() => console.log('Edit')}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem destructive onPress={() => console.log('Delete')}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


    </View>
  );
}
