'use client'

import Demonstration from '@/components/demontration'
import { Avatar, AvatarFallback, AvatarImage } from '@/lunar-kit/components/avatar'
import { View } from 'react-native'
import React from 'react'

const AvatarDemo = () => {
  return (
    <Demonstration components={
      <View className='flex-row gap-4 items-center'>
        <Avatar source={{ uri: 'https://github.com/shadcn.png' }} alt="@shadcn" fallback="CN" />
        <Avatar fallback="JD" />
      </View>
    } code={`import { Avatar } from "@/components/ui/avatar"

export function AvatarDemo() {
  return (
    <View className="flex-row gap-4">
      <Avatar 
        source={{ uri: "https://github.com/shadcn.png" }} 
        fallback="CN" 
      />
      <Avatar fallback="JD" />
    </View>
  )
}`}/>
  )
}

export default AvatarDemo
