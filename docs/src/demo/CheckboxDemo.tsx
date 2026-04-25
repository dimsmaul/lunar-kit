'use client'

import Demonstration from '../components/demonstration'
import { Checkbox, CheckboxDescription, CheckboxLabel } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const CheckboxDemo = () => {
    const [checked, setChecked] = React.useState(false)

    return (
        <Demonstration components={
            <View className='w-full max-w-sm flex items-center justify-center'>
                <Checkbox
                    checked={checked}
                    onCheckedChange={setChecked}
                >
                    <View className="ml-3">
                        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
                        <CheckboxDescription>
                            You agree to our Terms of Service and Privacy Policy.
                        </CheckboxDescription>
                    </View>
                </Checkbox>
            </View>
        } code={`import { Checkbox, CheckboxDescription, CheckboxLabel } from '@lunar-kit/core'checkbox'
import { View } from 'react-native'
import React from 'react'

export function CheckboxDemo() {
    const [checked, setChecked] = React.useState(false)

    return (
        <Checkbox
            checked={checked}
            onCheckedChange={setChecked}
        >
            <View className="ml-3">
                <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
                <CheckboxDescription>
                    You agree to our Terms of Service and Privacy Policy.
                </CheckboxDescription>
            </View>
        </Checkbox>
    )
}`} />
    )
}

export default CheckboxDemo
