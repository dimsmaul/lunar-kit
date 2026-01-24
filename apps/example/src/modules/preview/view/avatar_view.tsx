import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { View, Text } from 'react-native';

export default function AvatarView() {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-10">
      <Text className="text-2xl font-bold">AvatarView</Text>
      <Avatar
        source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
        alt="John Doe"
        size="md"
      />
      <Avatar
        fallback="John Doe"
        size="lg"
      />
      <View className="flex-row gap-4 items-center">
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=3' }} size="sm" />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=4' }} size="md" />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=5' }} size="lg" />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=6' }} size="xl" />
      </View>


      <AvatarGroup max={3} size="md">
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=1' }} />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=2' }} />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=3' }} />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=4' }} />
        <Avatar source={{ uri: 'https://i.pravatar.cc/150?img=5' }} />
      </AvatarGroup>

      <AvatarGroup max={4} size="lg">
        <Avatar fallback="John Doe" />
        <Avatar fallback="Jane Smith" />
        <Avatar fallback="Bob Wilson" />
        <Avatar fallback="Alice Brown" />
        <Avatar fallback="Charlie Davis" />
        <Avatar fallback="Emma Wilson" />
      </AvatarGroup>


    </View>
  );
}
