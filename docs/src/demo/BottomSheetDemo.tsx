'use client'

import Demonstration from '../components/demonstration'
import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetBody, BottomSheetFooter, BottomSheetClose, BottomSheetDragArea, BottomSheetDescription } from '@lunar-kit/core'
import { Button } from '@lunar-kit/core'
import { Text } from '@lunar-kit/core'
import { View } from 'react-native'

const BottomSheetDemo = () => {
    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center'>
                <BottomSheet snapPoints={['45%', '75%']} defaultSnapPoint={0}>
                    <BottomSheetTrigger>
                        <Button>Open Sheet</Button>
                    </BottomSheetTrigger>

                    <BottomSheetContent>
                        <BottomSheetDragArea>
                            <BottomSheetHeader>
                                <BottomSheetTitle>Filter Options</BottomSheetTitle>
                                <BottomSheetDescription>
                                    Select your preferences below
                                </BottomSheetDescription>
                            </BottomSheetHeader>
                        </BottomSheetDragArea>

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
            </View>
        } code={`import {
    BottomSheet,
    BottomSheetTrigger,
    BottomSheetContent,
    BottomSheetHeader,
    BottomSheetTitle,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetClose
} from '@lunar-kit/core'bottom-sheet'
import { Button } from '@lunar-kit/core'button'
import { Text } from '@lunar-kit/core'text'
import { View } from 'react-native'

export function BottomSheetDemo() {
    return (
        <BottomSheet>
            <BottomSheetTrigger>
                <Button>Open Bottom Sheet</Button>
            </BottomSheetTrigger>
            <BottomSheetContent>
                <BottomSheetHeader>
                    <BottomSheetTitle>Bottom Sheet Title</BottomSheetTitle>
                </BottomSheetHeader>
                <BottomSheetBody>
                    <Text>
                        This is the content of the bottom sheet. You can put anything here.
                    </Text>
                </BottomSheetBody>
                <BottomSheetFooter>
                    <BottomSheetClose>
                        <Button className='w-full'>Close</Button>
                    </BottomSheetClose>
                </BottomSheetFooter>
            </BottomSheetContent>
        </BottomSheet>
    )
}`} />
    )
}

export default BottomSheetDemo
