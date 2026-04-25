'use client'

import Demonstration from '../components/demonstration'
import { Button } from '@lunar-kit/core'
import { Alert, View } from 'react-native'
import React from 'react'

const ButtonDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Button variant={'default'} onPress={() => Alert.alert('tes')}>Button</Button>
      </View>
    } code={`import { Button } from '@lunar-kit/core'button'

const ButtonPreview = () => {
  return (
    <Button>
      Button
    </Button>
  )
}

export default ButtonPreview`} />
  )
}

export default ButtonDemo


