import { Card, CardHeader } from '@/components/ui/card';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function PreviewView() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Preview</Text>

      <View className='flex flex-row flex-wrap gap-2 justify-center items-center'>
        <Link href={'/preview/button'}>
          <Card>
            <CardHeader>
              <Text>
                Button
              </Text>
            </CardHeader>
          </Card>
        </Link>

        <Link href={'/preview/dialog'}>
          <Card>
            <CardHeader>
              <Text>
                Dialog
              </Text>
            </CardHeader>
          </Card>
        </Link>

        <Link href={'/preview/card'}>
          <Card>
            <CardHeader>
              <Text>
                Card
              </Text>
            </CardHeader>
          </Card>
        </Link>

        <Link href={'/preview/bottom'}>
          <Card>
            <CardHeader>
              <Text>
                Bottom Sheet
              </Text>
            </CardHeader>
          </Card>
        </Link>
        <Link href={'/preview/checkbox'}>
          <Card>
            <CardHeader>
              <Text>
                Checkbox
              </Text>
            </CardHeader>
          </Card>
        </Link>
        <Link href={'/preview/avatar'}>
          <Card>
            <CardHeader>
              <Text>
                Avatar
              </Text>
            </CardHeader>
          </Card>
        </Link>
        <Link href={'/preview/select'}>
          <Card>
            <CardHeader>
              <Text>
                Select
              </Text>
            </CardHeader>
          </Card>
        </Link>
        <Link href={'/preview/calendar'}>
          <Card>
            <CardHeader>
              <Text>
                Calendar
              </Text>
            </CardHeader>
          </Card>
        </Link>
      </View>
    </View>
  );
}
