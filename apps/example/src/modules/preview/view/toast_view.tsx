import { View, ScrollView } from 'react-native';
import { Button, Text, toast, useToolbar } from '@lunar-kit/core';

export default function ToastView() {
  useToolbar({
    title: 'Toast',
  })
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <Text variant="header" size="sm">Toast Positions</Text>
        
        <View className="flex-row gap-2">
            <Button 
                className="flex-1"
                onPress={() => toast({ title: 'Top Toast', description: 'Show at the top', position: 'top' })}
            >
                Top
            </Button>
            <Button 
                className="flex-1"
                onPress={() => toast({ title: 'Bottom Toast', description: 'Show at the bottom', position: 'bottom', direction: 'bottom' })}
            >
                Bottom
            </Button>
        </View>

        <Text variant="header" size="sm" className="mt-4">Entry Directions</Text>
        
        <View className="gap-2">
            <Button 
                variant="outline"
                onPress={() => toast.info('From Left', 'Sliding in from the left', { direction: 'left' })}
            >
                Slide from Left
            </Button>
            <Button 
                variant="outline"
                onPress={() => toast.info('From Right', 'Sliding in from the right', { direction: 'right' })}
            >
                Slide from Right
            </Button>
            <Button 
                variant="outline"
                onPress={() => toast.info('From Top', 'Sliding in from the top', { direction: 'top' })}
            >
                Slide from Top
            </Button>
            <Button 
                variant="outline"
                onPress={() => toast.info('From Bottom', 'Sliding in from the bottom', { direction: 'bottom', position: 'bottom' })}
            >
                Slide from Bottom
            </Button>
        </View>

        <Text variant="header" size="sm" className="mt-4">Variants</Text>
        
        <Button 
          variant="secondary"
          onPress={() => toast.success('Success!', 'Your changes have been saved.')}
        >
          Show Success Toast
        </Button>

        <Button 
          variant="destructive"
          onPress={() => toast.error('Error!', 'Something went wrong.')}
        >
          Show Error Toast
        </Button>

        <Button 
          className="bg-yellow-500"
          onPress={() => toast.warning('Warning!', 'Please check your input.')}
        >
          <Text className="text-white font-bold">Show Warning Toast</Text>
        </Button>

        <Text variant="body" className="mt-4 text-muted-foreground italic">
          Tip: You can swipe toasts in any direction to dismiss them!
        </Text>
      </View>
    </ScrollView>
  );
}
