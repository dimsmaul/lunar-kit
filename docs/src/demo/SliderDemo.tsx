'use client'

import Demonstration from '../components/demonstration'
import { Slider, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const SliderDemo = () => {
  const [value, setValue] = React.useState(50)
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-6'>
        <View className="gap-2">
          <Text className="text-muted-foreground">Value: {value}</Text>
          <Slider value={value} onValueChange={setValue} />
        </View>
        <View className="gap-2">
          <Text className="text-muted-foreground">Disabled</Text>
          <Slider value={30} disabled />
        </View>
      </View>
    } code={`import { Slider, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

export function SliderDemo() {
  const [value, setValue] = React.useState(50)
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text  className="text-muted-foreground">Value: {value}</Text>
        <Slider value={value} onValueChange={setValue} />
      </View>
    </View>
  )
}`} />
  )
}

export default SliderDemo