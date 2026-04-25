'use client'

import Demonstration from '../components/demonstration'
import { StepIndicator } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const StepIndicatorDemo = () => {
  const steps = [
    { title: 'Account', description: 'Create your account' },
    { title: 'Profile', description: 'Set up your profile' },
    { title: 'Review', description: 'Review your information' },
    { title: 'Confirm', description: 'Confirm and submit' },
  ]

  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-8'>
        <StepIndicator steps={steps} currentStep={1} orientation="horizontal" />
        <StepIndicator steps={steps} currentStep={2} orientation="vertical" />
      </View>
    } code={`import { StepIndicator } from '@lunar-kit/core'step-indicator'

const steps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Set up your profile' },
  { title: 'Review', description: 'Review your information' },
  { title: 'Confirm', description: 'Confirm and submit' },
]

export function StepIndicatorDemo() {
  return (
    <StepIndicator steps={steps} currentStep={1} orientation="horizontal" />
  )
}`} />
  )
}

export default StepIndicatorDemo