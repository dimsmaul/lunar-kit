'use client'

import Demonstration from '@/components/demontration'
import { SelectSheet } from '@/lunar-kit/components/select-sheet'
import { View } from 'react-native'
import React from 'react'

const SelectSheetDemo = () => {
  return (
    <Demonstration components={
      <View>
        <SelectSheet />
      </View>
    } code={`import { SelectSheet } from '@/components/ui/select-sheet'

const SelectSheetPreview = () => {
  return (
    <SelectSheet />
  )
}

export default SelectSheetPreview`}/>
  )
}

export default SelectSheetDemo
