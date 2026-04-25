'use client'

import Demonstration from '@/components/demontration'
import { Progress } from '@/lunar-kit/components/progress'
import { View } from 'react-native'
import React from 'react'

const ProgressDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Progress />
      </View>
    } code={`import { Progress } from '@/components/ui/progress'

const ProgressPreview = () => {
  return (
    <Progress />
  )
}

export default ProgressPreview`}/>
  )
}

export default ProgressDemo
