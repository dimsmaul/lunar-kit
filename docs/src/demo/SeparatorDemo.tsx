'use client'

import Demonstration from '@/components/demontration'
import { Separator } from '@/lunar-kit/components/separator'
import { View } from 'react-native'
import React from 'react'

const SeparatorDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Separator />
      </View>
    } code={`import { Separator } from '@/components/ui/separator'

const SeparatorPreview = () => {
  return (
    <Separator />
  )
}

export default SeparatorPreview`}/>
  )
}

export default SeparatorDemo
