'use client'

import Demonstration from '@/components/demontration'
import { Tabs } from '@/lunar-kit/components/tabs'
import { View } from 'react-native'
import React from 'react'

const TabsDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Tabs variant="pill">Example</Tabs>
        <Tabs variant="underline">Example</Tabs>
      </View>
    } code={`import { Tabs } from '@/components/ui/tabs'

const TabsPreview = () => {
  return (
    <Tabs variant="underline">Example</Tabs>
  )
}

export default TabsPreview`}/>
  )
}

export default TabsDemo
