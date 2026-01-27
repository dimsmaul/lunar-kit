import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { usePreview } from '../hooks/usePreview';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useToolbar } from '@/hooks/useToolbar';

export default function PreviewView() {
  const { filteredData, search, setSearch } = usePreview()

  useToolbar({
    title: "Preview"
  })

  return (
    <>
      <View className="bg-background flex-1">
        <ScrollView>
          <View className='gap-5 !w-full flex-1 p-5 flex flex-col'>
            <ThemeSwitcher />
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder='Search'
              suffix={<Search size={20} className='text-foreground/40' />}
              className='w-screen'
            />
            <View className='border-foreground/40 border bg-background shadow-sm rounded-lg'>
              {
                filteredData.map((item, i) => (
                  <Link href={item.path} className='' key={i}>
                    <View className='w-full p-3 border-b border-foreground/40'>
                      <Text className='text-foreground'>
                        {item.name}
                      </Text>
                    </View>
                  </Link>
                ))
              }
            </View>
          </View>
        </ScrollView>
      </View></>
  );
}
