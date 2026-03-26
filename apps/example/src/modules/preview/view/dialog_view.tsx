import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Text, useToolbar } from '@lunar-kit/core';
import React from 'react';
import { View } from 'react-native';

export default function DialogView() {
  const [open, setOpen] = React.useState(false);

  useToolbar({
    title: 'Dialog',
  })
  return (
    <View className="flex-1 items-center justify-center ">
      <Text className="text-2xl font-bold">DialogView</Text>

      <Text className='mt-10'>dengan state manual</Text>

      <Button onPress={() => setOpen(true)}>Click me</Button>
      <Dialog open={open} onOpenChange={setOpen}>
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

      <Text className='mt-10'>dengan Trigger</Text>
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
  );
}
