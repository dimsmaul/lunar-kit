import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { usePreview } from '../hooks/usePreview';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import { useToolbar } from '@/hooks/useToolbar';
import { Toolbar } from '@/components/ui/toolbar';
import { ThemeButton } from '@/components/theme-button';

export default function PreviewView() {

  const { filteredData, search, setSearch } = usePreview()

  const toolbar = useToolbar({
    title: 'Preview',
    rightIcon: <ThemeButton />
  })

  return (
    <>
      <Toolbar {...toolbar} />
      <View className="bg-white flex-1">
        <ScrollView>
          <View className='gap-5 !w-full flex-1 p-5 flex flex-col'>
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder='Search'
              suffix={<Search size={20} className='text-slate-200' />}
              className='w-screen'
            />
            <View className='border-slate-200 border bg-white shadow-sm rounded-lg'>
              {
                filteredData.map((item, i) => (
                  <Link href={item.path} className='' key={i}>
                    <View className='w-full p-3 border-b border-slate-200'>
                      <Text className=''>
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
