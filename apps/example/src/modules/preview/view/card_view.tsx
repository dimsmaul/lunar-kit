import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import { View } from 'react-native';

export default function CardView() {

  useToolbar({
    title: 'Card View',
  })
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">CardView</Text>

      <View className='p-5'>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              This is a description of the card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam exercitationem repudiandae nesciunt placeat. Unde molestias adipisci natus vitae saepe fugit ad accusantium vero eligendi, enim amet! Nihil corrupti neque eos!
            </Text>
          </CardContent>
          <CardFooter>
            <Text>
              Card Footer
            </Text>
          </CardFooter>
        </Card>
      </View>

    </View>
  );
}
