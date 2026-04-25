'use client'

import Demonstration from '../components/demonstration'
import { Skeleton } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const SkeletonDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <View className="flex-row gap-4 items-center">
          <Skeleton variant="circle" className="w-12 h-12" />
          <View className="flex-1 gap-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </View>
        </View>
        <Skeleton className="h-24 w-full" />
        <View className="flex-row gap-2">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </View>
      </View>
    } code={`import { Skeleton } from '@lunar-kit/core'skeleton'
import { View } from 'react-native'

export function SkeletonDemo() {
  return (
    <View className="gap-4">
      <View className="flex-row gap-4 items-center">
        <Skeleton variant="circle" className="w-12 h-12" />
        <View className="flex-1 gap-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </View>
      </View>
      <Skeleton className="h-24 w-full" />
      <View className="flex-row gap-2">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
      </View>
    </View>
  )
}`} />
  )
}

export default SkeletonDemo