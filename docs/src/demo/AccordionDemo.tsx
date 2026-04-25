'use client'

import Demonstration from '@/components/demontration'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/lunar-kit/components/accordion'
import { View } from 'react-native'
import React, { useState } from 'react'
import { Text } from '@/lunar-kit/components/text'

const AccordionDemo = () => {
  const [value, setValue] = useState('')

  return (
    <Demonstration components={
      <View className='w-full max-w-sm'>
        <Accordion type="single" collapsible value={value} onValueChange={(v) => setValue(v as string)}>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text>
                Is it accessible?
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It adheres to the WAI-ARIA design pattern.
              </Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text>
                Is it styled?
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>
                Yes. It comes with default styles that match your theme.
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    } code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

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
