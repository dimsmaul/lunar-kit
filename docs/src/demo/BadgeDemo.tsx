'use client'

import Demonstration from '@/components/demontration'
import { Badge } from '@/lunar-kit/components/badge'
import { View } from 'react-native'
import React from 'react'

const BadgeDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Badge variant="default">Example</Badge>
        <Badge variant="secondary">Example</Badge>
        <Badge variant="success">Example</Badge>
      </View>
    } code={`import { Badge } from '@/components/ui/badge'

const BadgePreview = () => {
  return (
    <Badge variant="default">Example</Badge>
  )
}

export default BadgePreview`}/>
  )
}

export default BadgeDemo
