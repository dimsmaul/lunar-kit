'use client'

import Demonstration from '@/components/demontration'
import { Accordion } from '@/lunar-kit/components/accordion'
import { View } from 'react-native'
import React from 'react'

const AccordionDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <Accordion variant="default" />
        <Accordion variant="bordered" />
        <Accordion variant="separated" />
      </View>
    } code={`import { Accordion } from '@/components/ui/accordion'

const AccordionPreview = () => {
  return (
    <Accordion variant="default" />
  )
}

export default AccordionPreview`}/>
  )
}

export default AccordionDemo
