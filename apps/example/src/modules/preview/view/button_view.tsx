import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react-native';
import { View, Text } from 'react-native';

export default function ButtonView() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Button</Text>
      <View className='flex flex-col gap-2'>
        <Text className="text-base font-bold">Variant</Text>
        <Button variant='default'>Default</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='ghost'>Ghost</Button>
      </View>
      <View className='flex flex-col gap-2'>
        <Text className="text-base font-bold">Size</Text>
        <Button size='default'>Default</Button>
        <Button size='lg'>Large</Button>
        <Button size='sm'>Small</Button>
        <Button size='icon' variant='outline'><Moon /></Button>
      </View>
    </View>
  );
}
