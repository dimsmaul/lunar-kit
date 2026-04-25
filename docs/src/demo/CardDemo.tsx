'use client'

import Demonstration from '@/components/demontration'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lunar-kit/components/card'
import { Button } from '@/lunar-kit/components/button'
import { Text } from '@/lunar-kit/components/text'
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
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

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
