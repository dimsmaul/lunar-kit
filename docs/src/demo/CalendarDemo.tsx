'use client'

import Demonstration from '@/components/demontration'
import { Calendar } from '@/lunar-kit/components/calendar'
import { View } from 'react-native'
import React from 'react'

const CalendarDemo = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center'>
                <Calendar
                    mode="single"
                    value={date}
                    onValueChange={setDate}
                    className="rounded-md"
                />
            </View>
        } code={`import { Calendar } from "@/components/ui/calendar"
import React from "react"
    
export function CalendarDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
    <Calendar
        mode="single"
        value={date}
        onValueChange={setDate}
        className="rounded-md border"
    />
    )
}`} />
    )
}

export default CalendarDemo
