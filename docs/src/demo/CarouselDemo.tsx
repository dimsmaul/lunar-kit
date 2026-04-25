'use client'

import Demonstration from '../components/demonstration'
import { Carousel, Card, Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const CarouselDemo = () => {
  const data = [
    { id: '1', title: 'Card 1', color: 'bg-blue-500' },
    { id: '2', title: 'Card 2', color: 'bg-green-500' },
    { id: '3', title: 'Card 3', color: 'bg-purple-500' },
    { id: '4', title: 'Card 4', color: 'bg-orange-500' },
  ]

  return (
    <Demonstration components={
      <View className='w-full max-w-sm'>
        <Carousel
          data={data}
          renderItem={({ item }) => (
            <View className={`${item.color} rounded-xl p-6 items-center justify-center h-40`}>
              <Text className="text-white font-bold text-lg">{item.title}</Text>
            </View>
          )}
          showDots
        />
      </View>
    } code={`import { Carousel } from '@lunar-kit/core'carousel'
import { View, Text } from 'react-native'

export function CarouselDemo() {
  const data = [
    { id: '1', title: 'Card 1', color: 'bg-blue-500' },
    { id: '2', title: 'Card 2', color: 'bg-green-500' },
    { id: '3', title: 'Card 3', color: 'bg-purple-500' },
    { id: '4', title: 'Card 4', color: 'bg-orange-500' },
  ]

  return (
    <Carousel
      data={data}
      renderItem={({ item }) => (
        <View className={\`\${item.color} rounded-xl p-6 items-center justify-center h-40\`}>
          <Text className="text-white font-bold text-lg">{item.title}</Text>
        </View>
      )}
      showDots
    />
  )
}`} />
  )
}

export default CarouselDemo