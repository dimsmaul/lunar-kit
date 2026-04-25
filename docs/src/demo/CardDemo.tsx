'use client'

import Demonstration from '../components/demonstration'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@lunar-kit/core'
import { Button } from '@lunar-kit/core'
import { Text } from '@lunar-kit/core'
import { View } from 'react-native'
import React from 'react'

const CardDemo = () => {
  return (
    <Demonstration components={
      <View className='w-full max-w-sm flex items-center justify-center'>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>
              Your project will be deployed to the edge.
            </Text>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </View>
    } code={`import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@lunar-kit/core'card'
import { Button } from '@lunar-kit/core'button'
import { Text } from '@lunar-kit/core'text'

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>
            Your project will be deployed to the edge.
        </Text>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}`} />
  )
}

export default CardDemo
