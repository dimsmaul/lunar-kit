'use client'

import Demonstration from '../components/demonstration'
import { Separator, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const SeparatorDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <Text >Above separator</Text>
        <Separator />
        <Text >Below separator</Text>
        <View className="flex-row items-center h-10 gap-2">
          <Text >Left</Text>
          <Separator orientation="vertical" />
          <Text >Right</Text>
        </View>
      </View>
    } code={`import { Separator, Text } from '@lunar-kit/core'separator'
import { View } from 'react-native'

export function SeparatorDemo() {
  return (
    <View className="gap-4">
      <Text >Above separator</Text>
      <Separator />
      <Text >Below separator</Text>
      <View className="flex-row items-center h-10 gap-2">
        <Text >Left</Text>
        <Separator orientation="vertical" />
        <Text >Right</Text>
      </View>
    </View>
  )
}`} />
  )
}

export default SeparatorDemo