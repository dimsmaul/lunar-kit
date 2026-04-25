'use client'

import Demonstration from '@/components/demontration'
import { Checkbox } from '@/lunar-kit/components/checkbox'
import { View } from 'react-native'
import React from 'react'

const CheckboxDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Checkbox />
      </View>
    } code={`import { Checkbox } from '@/components/ui/checkbox'

const CheckboxPreview = () => {
  return (
    <Checkbox />
  )
}

export default CheckboxPreview`}/>
  )
}

export default CheckboxDemo
