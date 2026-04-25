'use client'

import Demonstration from '@/components/demontration'
import { Skeleton } from '@/lunar-kit/components/skeleton'
import { View } from 'react-native'
import React from 'react'

const SkeletonDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Skeleton />
      </View>
    } code={`import { Skeleton } from '@/components/ui/skeleton'

const SkeletonPreview = () => {
  return (
    <Skeleton />
  )
}

export default SkeletonPreview`}/>
  )
}

export default SkeletonDemo
