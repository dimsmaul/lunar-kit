'use client'

import Demonstration from '@/components/demontration'
import { SearchBar } from '@/lunar-kit/components/search-bar'
import { View } from 'react-native'
import React from 'react'

const SearchBarDemo = () => {
  return (
    <Demonstration components={
      <View>
        <SearchBar />
      </View>
    } code={`import { SearchBar } from '@/components/ui/search-bar'

const SearchBarPreview = () => {
  return (
    <SearchBar />
  )
}

export default SearchBarPreview`}/>
  )
}

export default SearchBarDemo
