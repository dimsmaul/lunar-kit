'use client'

import Demonstration from '../components/demonstration'
import { Progress } from '@lunar-kit/core'
import { View, Text } from 'react-native'
import React from 'react'

const ProgressDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-6'>
        <View className="gap-2">
          <Text className="text-muted-foreground">25%</Text>
          <Progress value={25} />
        </View>
        <View className="gap-2">
          <Text className="text-muted-foreground">50%</Text>
          <Progress value={50} />
        </View>
        <View className="gap-2">
          <Text className="text-muted-foreground">75%</Text>
          <Progress value={75} />
        </View>
      </View>
    } code={`import { Progress } from '@lunar-kit/core'progress'
import { View, Text } from 'react-native'

export function ProgressDemo() {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text  className="text-muted-foreground">25%</Text>
        <Progress value={25} />
      </View>
      <View className="gap-2">
        <Text  className="text-muted-foreground">50%</Text>
        <Progress value={50} />
      </View>
      <View className="gap-2">
        <Text  className="text-muted-foreground">75%</Text>
        <Progress value={75} />
      </View>
    </View>
  )
}`} />
  )
}

export default ProgressDemo