'use client'

import Demonstration from '@/components/demontration'
import { DateRangePicker } from '@/lunar-kit/components/date-range-picker'
import { View } from 'react-native'
import React from 'react'

const DateRangePickerDemo = () => {
  return (
    <Demonstration components={
      <View className="gap-2">
        <DateRangePicker variant="default" />
        <DateRangePicker variant="outline" />
        <DateRangePicker variant="filled" />
      </View>
    } code={`import { DateRangePicker } from '@/components/ui/date-range-picker'

const DateRangePickerPreview = () => {
  return (
    <DateRangePicker variant="default" />
  )
}

export default DateRangePickerPreview`}/>
  )
}

export default DateRangePickerDemo
