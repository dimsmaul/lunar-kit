'use client'

import Demonstration from '@/components/demontration'
import { RadioGroup } from '@/lunar-kit/components/radio-group'
import { View } from 'react-native'
import React from 'react'

const RadioGroupDemo = () => {
  return (
    <Demonstration components={
      <View>
        <RadioGroup />
      </View>
    } code={`import { RadioGroup } from '@/components/ui/radio-group'

const RadioGroupPreview = () => {
  return (
    <RadioGroup />
  )
}

export default RadioGroupPreview`}/>
  )
}

export default RadioGroupDemo
