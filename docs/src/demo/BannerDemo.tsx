'use client'

import Demonstration from '@/components/demontration'
import { Banner } from '@/lunar-kit/components/banner'
import { View } from 'react-native'
import React from 'react'

const BannerDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Banner variant="default">Example</Banner>
        <Banner variant="info">Example</Banner>
        <Banner variant="success">Example</Banner>
      </View>
    } code={`import { Banner } from '@/components/ui/banner'

const BannerPreview = () => {
  return (
    <Banner variant="default">Example</Banner>
  )
}

export default BannerPreview`}/>
  )
}

export default BannerDemo
