'use client'

import Demonstration from '@/components/demontration'
import { Radio } from '@/lunar-kit/components/radio'
import { View } from 'react-native'
import React from 'react'

const RadioDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Radio />
      </View>
    } code={`import { Radio } from '@/components/ui/radio'

const RadioPreview = () => {
  return (
    <Radio />
  )
}

export default RadioPreview`}/>
  )
}

export default RadioDemo
