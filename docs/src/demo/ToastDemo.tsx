'use client'

import Demonstration from '@/components/demontration'
import { Toast } from '@/lunar-kit/components/toast'
import { View } from 'react-native'
import React from 'react'

const ToastDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Toast />
      </View>
    } code={`import { Toast } from '@/components/ui/toast'

const ToastPreview = () => {
  return (
    <Toast />
  )
}

export default ToastPreview`}/>
  )
}

export default ToastDemo
