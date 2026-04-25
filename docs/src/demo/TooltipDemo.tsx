'use client'

import Demonstration from '@/components/demontration'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/lunar-kit/components/tooltip'
import { Text } from '@/lunar-kit/components/text'
import { View } from 'react-native'

const TooltipDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full flex items-center justify-center p-10'>
        <Tooltip>
          <TooltipTrigger>
            <Text>Hover me</Text>
          </TooltipTrigger>
          <TooltipContent className='w-52' >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus exercitationem obcaecati voluptatem commodi dolores dolore nesciunt cum in quo optio ducimus rerum blanditiis aliquid qui, recusandae temporibus minima id cupiditate.
          </TooltipContent>
        </Tooltip>
      </View>
    } code={`import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import React from "react"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <Text className="text-white">Add to library</Text>
      </TooltipContent>
    </Tooltip>
  )
}`} />
  )
}

export default TooltipDemo
