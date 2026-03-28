import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Login</Text>
      <Button className="w-full">Sign In</Button>
    </View>
  );
}
