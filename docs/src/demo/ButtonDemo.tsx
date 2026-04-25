'use client'

import Demonstration from '@/components/demontration'
import { Button } from '@/lunar-kit/components/button'
import { Alert, View } from 'react-native'
import React from 'react'

const ButtonDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Button variant={'default'} onPress={()=> Alert.alert('tes')}>Button</Button>
      </View>
    } code={`import { Button } from '@/components/ui/button'

const ButtonPreview = () => {
  return (
    <Button>
      Button
    </Button>
  )
}

export default ButtonPreview`}/>
  )
}

export default ButtonDemo


