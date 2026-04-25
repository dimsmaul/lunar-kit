'use client'

import Demonstration from '@/components/demontration'
import { Card } from '@/lunar-kit/components/card'
import { View } from 'react-native'
import React from 'react'

const CardDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Card variant="default" />
        <Card variant="elevated" />
        <Card variant="outline" />
      </View>
    } code={`import { Card } from '@/components/ui/card'

const CardPreview = () => {
  return (
    <Card variant="default" />
  )
}

export default CardPreview`}/>
  )
}

export default CardDemo
