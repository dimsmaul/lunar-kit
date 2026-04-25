'use client'

import Demonstration from '@/components/demontration'
import { BottomSheet } from '@/lunar-kit/components/bottom-sheet'
import { View } from 'react-native'
import React from 'react'

const BottomSheetDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <BottomSheet variant="default">Example</BottomSheet>
        <BottomSheet variant="filled">Example</BottomSheet>
      </View>
    } code={`import { BottomSheet } from '@/components/ui/bottom-sheet'

const BottomSheetPreview = () => {
  return (
    <BottomSheet variant="default">Example</BottomSheet>
  )
}

export default BottomSheetPreview`}/>
  )
}

export default BottomSheetDemo
