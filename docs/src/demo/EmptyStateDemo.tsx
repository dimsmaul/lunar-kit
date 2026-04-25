'use client'

import Demonstration from '@/components/demontration'
import { EmptyState } from '@/lunar-kit/components/empty-state'
import { View } from 'react-native'
import React from 'react'

const EmptyStateDemo = () => {
  return (
    <Demonstration components={
      <View>
        <EmptyState />
      </View>
    } code={`import { EmptyState } from '@/components/ui/empty-state'

const EmptyStatePreview = () => {
  return (
    <EmptyState />
  )
}

export default EmptyStatePreview`}/>
  )
}

export default EmptyStateDemo
