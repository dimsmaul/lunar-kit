'use client'

import Demonstration from '@/components/demontration'
import { DropdownMenu } from '@/lunar-kit/components/dropdown-menu'
import { View } from 'react-native'
import React from 'react'

const DropdownMenuDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <DropdownMenu variant="default" />
        <DropdownMenu variant="destructive" />
      </View>
    } code={`import { DropdownMenu } from '@/components/ui/dropdown-menu'

const DropdownMenuPreview = () => {
  return (
    <DropdownMenu variant="default" />
  )
}

export default DropdownMenuPreview`}/>
  )
}

export default DropdownMenuDemo
