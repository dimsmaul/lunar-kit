'use client'

import Demonstration from '@/components/demontration'
import { Dialog } from '@/lunar-kit/components/dialog'
import { View } from 'react-native'
import React from 'react'

const DialogDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Dialog />
      </View>
    } code={`import { Dialog } from '@/components/ui/dialog'

const DialogPreview = () => {
  return (
    <Dialog />
  )
}

export default DialogPreview`}/>
  )
}

export default DialogDemo
