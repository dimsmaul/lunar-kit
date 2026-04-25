'use client'

import Demonstration from '../components/demonstration'
import { Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const TextDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full flex items-center justify-center p-4'>
        <Text variant="title">Typography</Text>
        <Text variant="body" className="mt-2">The quick brown fox jumps over the lazy dog.</Text>
      </View>
    } code={`import { Text } from "@/lunar-kit/components/text"
import { View } from "react-native"
import React from "react"

export function TextDemo() {
  return (
    <View className='w-full flex items-center justify-center'>
      <Text variant="h3">Typography</Text>
      <Text variant="body" className="mt-2">
        The quick brown fox jumps over the lazy dog.
      </Text>
    </View>
  )
}`} />
  )
}

export default TextDemo
