'use client'

import Demonstration from '../components/demonstration'
import { Banner } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const BannerDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <Banner
          title="Information"
          description="This is an informational message."
        />
        <Banner
          variant="success"
          title="Success"
          description="Your changes have been saved."
        />
        <Banner
          variant="warning"
          title="Warning"
          description="Please review your information carefully."
        />
        <Banner
          variant="destructive"
          title="Error"
          description="Something went wrong. Please try again."
        />
      </View>
    } code={`import { Banner } from '@lunar-kit/core'banner'
import { View } from 'react-native'

export function BannerDemo() {
  return (
    <View className="gap-4">
      <Banner
        title="Information"
        description="This is an informational message."
      />
      <Banner
        variant="success"
        title="Success"
        description="Your changes have been saved."
      />
      <Banner
          variant="warning"
          title="Warning"
          description="Please review your information carefully."
      />
      <Banner
          variant="destructive"
          title="Error"
          description="Something went wrong. Please try again."
      />
    </View>
  )
}`} />
  )
}

export default BannerDemo
