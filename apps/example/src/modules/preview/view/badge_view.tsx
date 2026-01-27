import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import { View } from 'react-native';

export default function BadgeView() {

  useToolbar({
    title: 'Badge',
  })

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">BadgeView</Text>
      <Text>
        Basic
      </Text>
      <Badge>New</Badge>

      <Text>
        Variants
      </Text>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>

      <Text>
        Sizes
      </Text>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>

      <Text>
        Custom styling
      </Text>
      <Badge variant="success" className="rounded-md">
        Custom
      </Badge>

    </View>
  );
}
