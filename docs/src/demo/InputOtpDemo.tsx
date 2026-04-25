'use client'

import Demonstration from '@/components/demontration'
import { InputOtp } from '@/lunar-kit/components/input-otp'
import { View } from 'react-native'
import React from 'react'

const InputOtpDemo = () => {
  return (
    <Demonstration components={
      <View>
        <InputOtp />
      </View>
    } code={`import { InputOtp } from '@/components/ui/input-otp'

const InputOtpPreview = () => {
  return (
    <InputOtp />
  )
}

export default InputOtpPreview`}/>
  )
}

export default InputOtpDemo
