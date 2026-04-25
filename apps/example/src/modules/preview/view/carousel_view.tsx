import { View, ScrollView, Image, Dimensions } from 'react-native';
import { Carousel, Text, useToolbar, Card } from '@lunar-kit/core';

const SCREEN_WIDTH = Dimensions.get('window').width;

const IMAGES = [
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000',
];

export default function CarouselView() {
  useToolbar({ title: 'Carousel' });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="py-4 gap-8">
        <View className="gap-2">
          <Text variant="header" size="sm" className="px-4">Image Carousel</Text>
          <Carousel
            data={IMAGES}
            renderItem={({ item }) => (
              <View
                className="overflow-hidden rounded-2xl bg-muted"
                style={{ width: SCREEN_WIDTH - 64, height: 250 }}
              >
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>

        <View className="gap-2">
          <Text variant="header" size="sm" className="px-4">Card Carousel</Text>
          <Carousel
            data={[1, 2, 3, 4, 5]}
            itemWidth={200}
            renderItem={({ item }) => (
              <Card className="p-6 h-40 items-center justify-center bg-primary">
                <Text variant="title" className="text-white">Feature {item}</Text>
                <Text className="text-white/80 text-center mt-2">Experimental UI kit component</Text>
              </Card>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}
