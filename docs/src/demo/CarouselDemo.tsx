'use client'

import Demonstration from '@/components/demontration'
import { Carousel } from '@/lunar-kit/components/carousel'
import { View } from 'react-native'
import React from 'react'

const CarouselDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Carousel />
      </View>
    } code={`import { Carousel } from '@/components/ui/carousel'

const CarouselPreview = () => {
  return (
    <Carousel />
  )
}

export default CarouselPreview`}/>
  )
}

export default CarouselDemo
