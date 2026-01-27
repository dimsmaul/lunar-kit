import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useToolbar } from '@/hooks/useToolbar';
import { Star } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function BannerView() {
  useToolbar({
    title: 'Banner',
  })
  return (
    <View className="flex-1 items-center justify-center">
      <ScrollView className='w-full flex flex-col gap-2 p-4'>
        <Text className="text-2xl font-bold">BannerView</Text>
        <Text>
          Basic
        </Text>
        <Banner
          title="Information"
          description="This is an informational message."
        />

        <Text>
          Variants
        </Text>
        <Banner
          variant="info"
          title="Info"
          description="Something you should know."
        />

        <Banner
          variant="success"
          title="Success!"
          description="Operation completed successfully."
        />

        <Banner
          variant="warning"
          title="Warning"
          description="Please review before continuing."
        />

        <Banner
          variant="destructive"
          title="Error"
          description="Something went wrong."
        />

        <Text>
          Dismissible
        </Text>
        <Banner
          variant="info"
          title="New Feature"
          description="Check out our latest update!"
          dismissible
          onDismiss={() => console.log('Banner dismissed')}
        />

        <Text>
          Custom icon
        </Text>
        <Banner
          variant="success"
          title="Custom Icon"
          description="With a custom icon."
          icon={<Star size={20} color="#22c55e" />}
        />

        <Text>
          Without icon
        </Text>
        <Banner
          variant="warning"
          title="No Icon"
          description="Banner without an icon."
          showIcon={false}
        />

        <Text>
          Custom children
        </Text>
        <View>
          <Banner variant="info" title="Custom Content">
            <Text size="sm" className="text-blue-900 dark:text-blue-100 mt-2">
              You can add any custom content here.
            </Text>
            <Button variant="link" size="sm" className="mt-2 self-start p-0">
              Learn More
            </Button>

          </Banner>
        </View>

      </ScrollView>
    </View>
  );
}
