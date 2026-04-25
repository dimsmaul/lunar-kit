'use client'

import Demonstration from '../components/demonstration'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@lunar-kit/core'
import { Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const TabsDemo = () => {
  const [value, setValue] = React.useState('account')
  return (
    <Demonstration components={
      <View className='w-full max-w-sm'>
        <Tabs value={value} onValueChange={setValue} variant={'pill'}>
          <TabsList className="w-full flex-row">
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
            <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Text>Make changes to your account here.</Text>
          </TabsContent>
          <TabsContent value="password">
            <Text>Change your password here.</Text>
          </TabsContent>
        </Tabs>
      </View>
    } code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/lunar-kit/components/tabs"
import { Text } from "@/lunar-kit/components/text"
import React from "react"

export const TabsDemo = () => {
  const [value, setValue] = React.useState('account')
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className="w-full flex-row">
        <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
        <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Text>Make changes to your account here.</Text>
      </TabsContent>
      <TabsContent value="password">
        <Text>Change your password here.</Text>
      </TabsContent>
    </Tabs>
  )
}`} />
  )
}

export default TabsDemo
