'use client'

import Demonstration from '@/components/demontration'
import { Alert } from '@/lunar-kit/components/alert'
import { View } from 'react-native'
import React from 'react'

const AlertDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Alert variant="default">Example</Alert>
        <Alert variant="info">Example</Alert>
        <Alert variant="success">Example</Alert>
      </View>
    } code={`import { Alert } from '@/components/ui/alert'

const AlertPreview = () => {
  return (
    <Alert variant="default">Example</Alert>
  )
}

export default AlertPreview`}/>
  )
}

export default AlertDemo
