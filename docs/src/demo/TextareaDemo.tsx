'use client'

import Demonstration from '../components/demonstration'
import { Textarea } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const TextareaDemo = () => {
    const [value, setValue] = React.useState('')
    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center p-4'>
                <Textarea placeholder="Type your message here." value={value} onChangeText={setValue} />
            </View>
        } code={`import { Textarea } from "@/lunar-kit/components/textarea"
import React from "react"

export function TextareaDemo() {
  const [value, setValue] = React.useState('')
  return <Textarea placeholder="Type your message here." value={value} onChangeText={setValue} />
}`} />
    )
}

export default TextareaDemo
