import { BottomSheet, BottomSheetBody, BottomSheetClose, BottomSheetContent, BottomSheetDescription, BottomSheetFooter, BottomSheetHeader, BottomSheetList, BottomSheetTitle, BottomSheetTrigger } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { View, Text, FlatList } from 'react-native';


const data = Array.from({ length: 50 }, (_, i) => ({
  id: i.toString(),
  label: `Item ${i + 1}`,
}));
export default function BottomSheetView() {

  const items = [
    { id: '1', label: 'Item 1', value: 'item1' },
    { id: '2', label: 'Item 2', value: 'item2' },
    { id: '3', label: 'Item 3', value: 'item3' },
  ];

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">BottomSheetView</Text>
      <View className='flex flex-col gap-2'>
        <BottomSheet snapPoints={['45%', '75%']} defaultSnapPoint={0}>
          <BottomSheetTrigger>
            <Button>Open Sheet</Button>
          </BottomSheetTrigger>

          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Filter Options</BottomSheetTitle>
              <BottomSheetDescription>
                Select your preferences below
              </BottomSheetDescription>
            </BottomSheetHeader>

            <BottomSheetBody scrollable>
              <Text>Content here...</Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam vitae eligendi maxime veritatis reiciendis doloribus rerum quasi suscipit quidem, voluptatum tempora nihil officia molestiae, repudiandae dolores fugit veniam pariatur, laboriosam facere voluptas sapiente nisi sint aspernatur atque! Mollitia, amet. Doloribus, quasi. Aut hic libero nemo blanditiis totam omnis neque voluptatibus, eaque fugiat sequi aliquam, magni est in at impedit adipisci voluptatum, quam numquam pariatur perferendis? Eos repellat fugit, non impedit est libero beatae recusandae odit doloribus saepe neque repudiandae praesentium nam! Unde sapiente assumenda quae nihil dolorum asperiores qui voluptas minus laborum. Vitae illum facere autem totam dolore unde ut?
              </Text>
            </BottomSheetBody>

            <BottomSheetFooter className='flex flex-row gap-2'>
              <BottomSheetClose>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button>Apply</Button>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>

        <BottomSheet snapPoints={['50%', '75%']}>
          <BottomSheetTrigger>
            <Button>Bottom Sheet List</Button>
          </BottomSheetTrigger>

          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Select an Item</BottomSheetTitle>
            </BottomSheetHeader>

            <BottomSheetList
              data={data}
              variant="list"
              onSelect={(item) => {
                console.log('Selected:', item);
              }}
            />
            <BottomSheetFooter className='flex flex-row gap-2'>
              <BottomSheetClose>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button>Apply</Button>
            </BottomSheetFooter>
          </BottomSheetContent>

        </BottomSheet>
        <BottomSheet snapPoints={['50%', '75%']}>
          <BottomSheetTrigger>
            <Button>Select List</Button>
          </BottomSheetTrigger>

          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Select an Item</BottomSheetTitle>
            </BottomSheetHeader>

            <BottomSheetList
              data={data}
              variant="select"
              onSelect={(item) => {
                console.log('Selected:', item);
              }}
            />
            <BottomSheetFooter className='flex flex-row gap-2'>
              <BottomSheetClose>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button>Apply</Button>
            </BottomSheetFooter>
          </BottomSheetContent>

        </BottomSheet>
        <BottomSheet snapPoints={['50%', '75%']}>
          <BottomSheetTrigger>
            <Button>Multiple Select List</Button>
          </BottomSheetTrigger>

          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Select an Item</BottomSheetTitle>
            </BottomSheetHeader>

            <BottomSheetList
              data={data}
              variant="multiple"
              onSelect={(item) => {
                console.log('Selected:', item);
              }}
            />
            <BottomSheetFooter className='flex flex-row gap-2'>
              <BottomSheetClose>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button>Apply</Button>
            </BottomSheetFooter>
          </BottomSheetContent>

        </BottomSheet>
      </View>
    </View>
  );
}
