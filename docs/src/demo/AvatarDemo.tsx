'use client'

import Demonstration from '@/components/demontration'
import { Avatar } from '@/lunar-kit/components/avatar'
import { View } from 'react-native'
import React from 'react'

const AvatarDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Avatar variant="default" />
        <Avatar variant="primary" />
        <Avatar variant="secondary" />
      </View>
    } code={`import { Avatar } from '@/components/ui/avatar'

const AvatarPreview = () => {
  return (
    <Avatar variant="default" />
  )
}

export default AvatarPreview`}/>
  )
}

export default AvatarDemo
