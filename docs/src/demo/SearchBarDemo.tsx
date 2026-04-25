'use client'

import Demonstration from '../components/demonstration'
import { SearchBar } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const SearchBarDemo = () => {
  const [value, setValue] = React.useState('')
  return (
    <Demonstration components={
      <View className='w-full max-w-sm gap-4'>
        <SearchBar
          placeholder="Search..."
          value={value}
          onValueChange={setValue}
          onDebouncedValueChange={(val) => console.log('Debounced:', val)}
        />
      </View>
    } code={`import { SearchBar } from '@lunar-kit/core'search-bar'
import React from 'react'

export function SearchBarDemo() {
  const [value, setValue] = React.useState('')
  return (
    <SearchBar
      placeholder="Search..."
      value={value}
      onValueChange={setValue}
      onDebouncedValueChange={(val) => console.log('Debounced:', val)}
    />
  )
}`} />
  )
}

export default SearchBarDemo