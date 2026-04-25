'use client'

import Demonstration from '../components/demonstration'
import { Switch, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const SwitchDemo = () => {
  const [checked, setChecked] = React.useState(false)
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <View className="flex-row items-center justify-between">
          <Text >Toggle switch</Text>
          <Switch checked={checked} onCheckedChange={setChecked} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text >Default on</Text>
          <Switch defaultChecked />
        </View>
        <View className="flex-row items-center justify-between">
          <Text >Disabled</Text>
          <Switch disabled />
        </View>
      </View>
    } code={`import { Switch, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

export function SwitchDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text >Toggle switch</Text>
        <Switch checked={checked} onCheckedChange={setChecked} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text >Default on</Text>
        <Switch defaultChecked />
      </View>
      <View className="flex-row items-center justify-between">
        <Text >Disabled</Text>
        <Switch disabled />
      </View>
    </View>
  )
}`} />
  )
}

export default SwitchDemo