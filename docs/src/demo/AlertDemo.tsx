'use client'

import Demonstration from '../components/demonstration'
import { Alert } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const AlertDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <Alert variant="default">Default alert message</Alert>
        <Alert variant="info">Info alert message</Alert>
        <Alert variant="success">Success alert message</Alert>
        <Alert variant="warning">Warning alert message</Alert>
        <Alert variant="destructive">Destructive alert message</Alert>
      </View>
    } code={`import { Alert } from '@lunar-kit/core'alert'
import { View } from 'react-native'

export function AlertDemo() {
  return (
    <View className="gap-4">
      <Alert variant="default">Default alert message</Alert>
      <Alert variant="info">Info alert message</Alert>
      <Alert variant="success">Success alert message</Alert>
      <Alert variant="warning">Warning alert message</Alert>
      <Alert variant="destructive">Destructive alert message</Alert>
    </View>
  )
}`} />
  )
}

export default AlertDemo