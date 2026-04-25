'use client'

import Demonstration from '@/components/demontration'
import { Breadcrumb } from '@/lunar-kit/components/breadcrumb'
import { View } from 'react-native'
import React from 'react'

const BreadcrumbDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Breadcrumb />
      </View>
    } code={`import { Breadcrumb } from '@/components/ui/breadcrumb'

const BreadcrumbPreview = () => {
  return (
    <Breadcrumb />
  )
}

export default BreadcrumbPreview`}/>
  )
}

export default BreadcrumbDemo
