'use client'

import Demonstration from '../components/demonstration'
import { Button, toast } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const ToastDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-2'>
        <Button variant="outline" onPress={() => toast({ title: 'This is a default toast' })}>
          Default Toast
        </Button>
        <Button variant="outline" onPress={() => toast.success('Success!', 'Your changes have been saved.')}>
          Success Toast
        </Button>
        <Button variant="outline" onPress={() => toast.error('Error', 'Something went wrong.')}>
          Error Toast
        </Button>
        <Button variant="outline" onPress={() => toast.warning('Warning', 'Please review your information.')}>
          Warning Toast
        </Button>
        <Button variant="outline" onPress={() => toast.info('Info', 'Here is some useful information.')}>
          Info Toast
        </Button>
      </View>
    } code={`import { Button, toast, Toaster } from '@lunar-kit/core'

export function ToastDemo() {
  return (
    <View className="gap-2">
      <Button variant="outline" onPress={() => toast({ title: 'This is a default toast' })}>
        Default Toast
      </Button>
      <Button variant="outline" onPress={() => toast.success('Success!', 'Your changes have been saved.')}>
        Success Toast
      </Button>
      <Button variant="outline" onPress={() => toast.error('Error', 'Something went wrong.')}>
        Error Toast
      </Button>
    </View>
  )
}

// Add <Toaster /> to your root layout
// <Toaster />`} />
  )
}

export default ToastDemo