'use client'

import Demonstration from '@/components/demontration'
import { StepIndicator } from '@/lunar-kit/components/step-indicator'
import { View } from 'react-native'
import React from 'react'

const StepIndicatorDemo = () => {
  return (
    <Demonstration components={
      <View>
        <StepIndicator />
      </View>
    } code={`import { StepIndicator } from '@/components/ui/step-indicator'

const StepIndicatorPreview = () => {
  return (
    <StepIndicator />
  )
}

export default StepIndicatorPreview`}/>
  )
}

export default StepIndicatorDemo
