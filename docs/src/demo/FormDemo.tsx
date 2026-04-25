'use client'

import Demonstration from '@/components/demontration'
import { Form } from '@/lunar-kit/components/form'
import { View } from 'react-native'
import React from 'react'

const FormDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Form />
      </View>
    } code={`import { Form } from '@/components/ui/form'

const FormPreview = () => {
  return (
    <Form />
  )
}

export default FormPreview`}/>
  )
}

export default FormDemo
