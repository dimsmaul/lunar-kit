'use client'

import Demonstration from '../components/demonstration'
import { Breadcrumb } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const BreadcrumbDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <Breadcrumb
          items={[
            { label: 'Home', onPress: () => { } },
            { label: 'Products', onPress: () => { } },
            { label: 'Electronics', onPress: () => { } },
            { label: 'Smartphones' },
          ]}
        />
      </View>
    } code={`import { Breadcrumb } from '@lunar-kit/core'breadcrumb'
import { View } from 'react-native'

export function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', onPress: () => {} },
        { label: 'Products', onPress: () => {} },
        { label: 'Electronics', onPress: () => {} },
        { label: 'Smartphones' },
      ]}
    />
  )
}`} />
  )
}

export default BreadcrumbDemo