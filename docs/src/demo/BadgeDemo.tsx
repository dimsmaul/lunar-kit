'use client'

import Demonstration from '@/components/demontration'
import { Badge } from '@/lunar-kit/components/badge'
import { View } from 'react-native'
import React from 'react'

const BadgeDemo = () => {
  return (
    <Demonstration components={
      <View className='flex-row gap-2 flex-wrap'>
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </View>
    } code={`import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return <Badge>Badge</Badge>
}`}/>
  )
}

export default BadgeDemo
