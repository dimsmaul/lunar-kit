'use client'

import Demonstration from '@/components/demontration'
import { Tooltip } from '@/lunar-kit/components/tooltip'
import { View } from 'react-native'
import React from 'react'

const TooltipDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Tooltip />
      </View>
    } code={`import { Tooltip } from '@/components/ui/tooltip'

const TooltipPreview = () => {
  return (
    <Tooltip />
  )
}

export default TooltipPreview`}/>
  )
}

export default TooltipDemo
