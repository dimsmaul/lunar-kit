import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import { Pencil, Trash } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function DropdownMenuView() {
  useToolbar({
    title: 'Dropdown View',
  })
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <Text className="text-2xl font-bold">Dropdown</Text>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Actions
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side='bottom' align='center'>
          <DropdownMenuLabel>General</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem leftIcon={<Pencil />} onPress={() => console.log('Edit')}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem destructive leftIcon={<Trash />} onPress={() => console.log('Delete')}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem onPress={() => console.log('cut')}>
            Cut
          </DropdownMenuItem>

          <DropdownMenuSub trigger="More options">
            <DropdownMenuSubContent>
              <DropdownMenuItem onPress={() => console.log('rename')}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onPress={() => console.log('duplicate')}>
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem destructive onPress={() => console.log('delete')}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </View>
  );
}
