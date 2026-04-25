'use client'

import Demonstration from '@/components/demontration'
import { KeyboardAvoidingView } from '@/lunar-kit/components/keyboard-avoiding-view'
import { View } from 'react-native'
import React from 'react'

const KeyboardAvoidingViewDemo = () => {
  return (
    <Demonstration components={
      <View>
        <KeyboardAvoidingView />
      </View>
    } code={`import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view'

const KeyboardAvoidingViewPreview = () => {
  return (
    <KeyboardAvoidingView />
  )
}

export default KeyboardAvoidingViewPreview`}/>
  )
}

export default KeyboardAvoidingViewDemo
