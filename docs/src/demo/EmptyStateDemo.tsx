'use client'

import Demonstration from '../components/demonstration'
import { EmptyState } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const EmptyStateDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm'>
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filter to find what you're looking for."
          actionLabel="Clear filters"
          onActionPress={() => { }}
        />
      </View>
    } code={`import { EmptyState } from '@lunar-kit/core'empty-state'

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
      actionLabel="Clear filters"
      onActionPress={() => {}}
    />
  )
}`} />
  )
}

export default EmptyStateDemo