import { Card, CardHeader } from '@/components/ui/card';
import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { usePreview } from '../hooks/usePreview';

export default function PreviewView() {

  const { sortedData } = usePreview()

  return (
    <View className="flex-1 items-center justify-center bg-white ">
      <FlatList
        data={sortedData}
        contentContainerClassName='flex flex-flex text-start justify-center items-center w-full divide-y divide-gray-200'
        renderItem={({ item }) => (
          <Link href={item.path} className=''>
            <View className='w-full p-3 border-b border-gray-200'>
              <Text>
                {item.name}
              </Text>
            </View>
          </Link>
        )} />
    </View>
  );
}
