import { Card, CardHeader } from '@/components/ui/card';
import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { usePreview } from '../hooks/usePreview';

export default function PreviewView() {

  const { sortedData } = usePreview()

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Preview</Text>

      <FlatList
        data={sortedData}
        contentContainerClassName='flex flex-row flex-wrap gap-2 justify-center items-center'
        renderItem={({ item }) => (
          <Link href={item.path}>
            <Card>
              <CardHeader>
                <Text>
                  {item.name}
                </Text>
              </CardHeader>
            </Card>
          </Link>
        )} />
    </View>
  );
}
