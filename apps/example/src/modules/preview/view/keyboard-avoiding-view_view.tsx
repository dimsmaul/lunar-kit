import { View, Text } from 'react-native';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import { Input } from '@/components/ui/input';
import { useToolbar } from '@/hooks/useToolbar';
import { Button } from '@/components/ui/button';

export default function KeyboardAvoidingViewView() {
  useToolbar({
    title: 'Keyboard Avoiding View',
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      extraScrollHeight={32}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      <View className="gap-2 mb-4">
        <Text className="text-2xl font-bold text-foreground">
          Keyboard Avoiding View
        </Text>
        <Text className="text-sm text-foreground/60">
          Custom ScrollView-based keyboard avoidance. Tap any input below
          — the view will automatically scroll so the keyboard never covers
          your input.
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Full Name</Text>
          <Input placeholder="Enter your full name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Email</Text>
          <Input
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Phone</Text>
          <Input
            placeholder="+62 xxx-xxxx-xxxx"
            keyboardType="phone-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 1</Text>
          <Input placeholder="Street address" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Address Line 2</Text>
          <Input placeholder="Apt, suite, etc." />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">City</Text>
          <Input placeholder="City name" />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Zip Code</Text>
          <Input
            placeholder="12345"
            keyboardType="number-pad"
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-medium text-foreground">Notes</Text>
          <Input
            placeholder="Any additional notes..."
            multiline
            // numberOfLines={4}
            // style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </View>

        <Button className="mt-4">
          Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
