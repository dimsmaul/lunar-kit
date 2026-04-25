'use client'

import Demonstration from '../components/demonstration'
import { Input } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const InputDemo = () => {
    const [value, setValue] = React.useState('')
    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center p-4'>
                <Input placeholder="Type here..." value={value} onChangeText={setValue} />
            </View>
        } code={`import { Input } from "@/lunar-kit/components/input"
import React from "react"

export function InputDemo() {
  const [value, setValue] = React.useState('')
  return <Input placeholder="Type here..." value={value} onChangeText={setValue} />
}`} />
    )
}

export default InputDemo
