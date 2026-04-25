'use client'

import Demonstration from '../components/demonstration'
import { InputOTP } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const InputOTPDemo = () => {
  const [value, setValue] = React.useState('')
  return (
    <Demonstration components={
      <View className='w-full max-w-sm items-center'>
        <InputOTP
          maxLength={6}
          value={value}
          onValueChange={setValue}
        />
      </View>
    } code={`import { InputOTP } from '@lunar-kit/core'input-otp'
import React from 'react'

export function InputOTPDemo() {
  const [value, setValue] = React.useState('')
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onValueChange={setValue}
    />
  )
}`} />
  )
}

export default InputOTPDemo