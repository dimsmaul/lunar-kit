'use client'

import Demonstration from '@/components/demontration'
import { DatePicker } from '@/lunar-kit/components/date-picker'
import { View } from 'react-native'
import React from 'react'

const DatePickerDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <DatePicker variant="default" />
        <DatePicker variant="outline" />
        <DatePicker variant="filled" />
      </View>
    } code={`import { DatePicker } from '@/components/ui/date-picker'

const DatePickerPreview = () => {
  return (
    <DatePicker variant="default" />
  )
}

export default DatePickerPreview`}/>
  )
}

export default DatePickerDemo
