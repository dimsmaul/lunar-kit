'use client'

import Demonstration from '../components/demonstration'
import { View } from 'react-native'
import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@lunar-kit/core'
import { Button } from '@lunar-kit/core'

const DialogDemo = () => {
  const [open, setOpen] = React.useState<boolean>()

  return (
    <Demonstration components={
      <View className='w-full max-w-sm flex items-center justify-center min-h-[300px]'>
        <Dialog>
          <DialogTrigger>
            <Button>Open Dialog</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    } code={`import { Button } from '@lunar-kit/core'button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@lunar-kit/core'dialog'
import { View } from 'react-native'
import React from 'react'

export function DialogDemo() {
  return (
    <View className='w-full max-w-sm flex items-center justify-center min-h-[300px]'>
      <Dialog>
        <DialogTrigger>
          <Button>Open Dialog</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}`} />
  )
}

export default DialogDemo
