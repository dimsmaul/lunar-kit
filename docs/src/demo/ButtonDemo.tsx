'use client'

import Demonstration from '@/components/demontration'
import { Button } from '@/lunar-kit/components/button'
import { View } from 'react-native'
import React from 'react'

const ButtonDemo = () => {

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4 w-full">
        <Button variant='default'>Default</Button>
      </View>
    } code={`import { Button } from '@/components/ui/button'

const ButtonPreview = () => {
  return (
    <Button variant='default'>Default</Button>
  )
}

export default ButtonPreview`}/>
  )
}

export default ButtonDemo
