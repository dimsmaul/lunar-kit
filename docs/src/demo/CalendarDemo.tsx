'use client'

import Demonstration from '@/components/demontration'
import { Calendar } from '@/lunar-kit/components/calendar'
import { View } from 'react-native'
import React from 'react'

const CalendarDemo = () => {
  return (
    <Demonstration components={
      <View>
        <Calendar />
      </View>
    } code={`import { Calendar } from '@/components/ui/calendar'

const CalendarPreview = () => {
  return (
    <Calendar />
  )
}

export default CalendarPreview`}/>
  )
}

export default CalendarDemo
