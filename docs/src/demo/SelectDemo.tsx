'use client'

import Demonstration from '@/components/demontration'
import { Select } from '@/lunar-kit/components/select'
import { View } from 'react-native'
import React from 'react'

const SelectDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Select />
      </View>
    } code={`import { Select } from '@/components/ui/select'

const SelectPreview = () => {
  return (
    <Select />
  )
}

export default SelectPreview`}/>
  )
}

export default SelectDemo
