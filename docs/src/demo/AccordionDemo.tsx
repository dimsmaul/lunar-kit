'use client'

import Demonstration from '../components/demonstration'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@lunar-kit/core'
import { View } from 'react-native'
import React, { useState } from 'react'

const AccordionDemo = () => {
  const [value, setValue] = useState('')

  return (
    <Demonstration components={
      <View className='w-full max-w-sm'>
        <Accordion type="single" collapsible value={value} onValueChange={(v) => setValue(v as string)}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that match your theme.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    } code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@lunar-kit/core'accordion'

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`} />
  )
}

export default AccordionDemo
