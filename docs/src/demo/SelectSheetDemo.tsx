'use client'

import React from 'react'
import { View, Switch } from 'react-native'
import Demonstration from '../components/demonstration'
import { SelectSheet, MultiSelectSheet, type SelectOption } from '@lunar-kit/core'
import { Text } from '@lunar-kit/core'

const OPTIONS: SelectOption[] = [
  { label: 'React Native', value: 'react-native' },
  { label: 'Expo', value: 'expo' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'NativeWind', value: 'nativewind' },
  { label: 'Figma', value: 'figma' },
]

const SelectSheetDemo = () => {
  const [singleValue, setSingleValue] = React.useState<string | number>('')
  const [multiValue, setMultiValue] = React.useState<(string | number)[]>([])

  return (
    <Demonstration components={
      <View className='w-full max-w-sm flex gap-6 min-h-[400px] justify-center'>
        <View>
          <Text variant="label" className="mb-2">Single Select</Text>
          <SelectSheet
            label="Favorite Framework"
            options={OPTIONS}
            value={singleValue}
            onValueChange={setSingleValue}
            placeholder="Select a framework"
            title="Choose Framework"
            description="Select your favorite framework for mobile development."
            searchable
          />
        </View>

        <View>
          <Text variant="label" className="mb-2">Multi Select (Max 3)</Text>
          <MultiSelectSheet
            label="Tech Stack"
            options={OPTIONS}
            value={multiValue}
            onValueChange={setMultiValue}
            placeholder="Select technologies"
            title="Choose Tech Stack"
            searchable
            maxSelection={3}
          />
        </View>
      </View>
    } code={`import { SelectSheet, MultiSelectSheet } from "@/lunar-kit/components/select-sheet"
import React from "react"

const OPTIONS = [
  { label: 'React Native', value: 'react-native' },
  { label: 'Expo', value: 'expo' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Tailwind CSS', value: 'tailwind' },
]

export function SelectSheetDemo() {
  const [singleValue, setSingleValue] = React.useState('')
  const [multiValue, setMultiValue] = React.useState([])

  return (
    <View className="gap-6">
      <SelectSheet 
        label="Favorite Framework"
        options={OPTIONS} 
        value={singleValue} 
        onValueChange={setSingleValue}
        placeholder="Select a framework"
        searchable
      />

      <MultiSelectSheet
        label="Tech Stack"
        options={OPTIONS}
        value={multiValue}
        onValueChange={setMultiValue}
        placeholder="Select technologies"
        searchable
        maxSelection={3}
      />
    </View>
  )
}`} />
  )
}

export default SelectSheetDemo
