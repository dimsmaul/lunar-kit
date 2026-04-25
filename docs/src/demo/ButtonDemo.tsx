'use client'

import Demonstration from '@/components/demontration'
import { Button } from '@/lunar-kit/components/button'
import { View } from 'react-native'
import React from 'react'

const ButtonDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Button variant="default">Example</Button>
        <Button variant="destructive">Example</Button>
        <Button variant="outline">Example</Button>
      </View>
    } code={`import { Button } from '@/components/ui/button'

const ButtonPreview = () => {
  return (
    <Button variant="default">Example</Button>
  )
}

export default ButtonPreview`}/>
  )
}

export default ButtonDemo
