import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolbar } from '@/hooks/useToolbar';
import { InfoIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function TooltipView() {

  useToolbar({
    title: 'Tooltip View',
  })
  return (
    <View className="flex-1 items-center justify-center flex gap-3">
      <Text className="text-2xl font-bold">Tooltip</Text>
      <Tooltip>
        <TooltipTrigger>
          <Text>Hover me</Text>
        </TooltipTrigger>
        <TooltipContent>
          This is a tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Actions</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Klik untuk aksi
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Info</Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Informasi tambahan
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">?</Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-48">
          <Text size="sm" className="text-foreground">
            Deskripsi panjang bisa masuk sini
          </Text>
        </TooltipContent>
      </Tooltip>

    </View>
  );
}
