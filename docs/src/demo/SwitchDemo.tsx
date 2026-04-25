'use client'

import Demonstration from '@/components/demontration'
import { Switch } from '@/lunar-kit/components/switch'
import { View } from 'react-native'
import React from 'react'

const SwitchDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Switch />
      </View>
    } code={`import { Switch } from '@/components/ui/switch'

const SwitchPreview = () => {
  return (
    <Switch />
  )
}

export default SwitchPreview`}/>
  )
}

export default SwitchDemo
