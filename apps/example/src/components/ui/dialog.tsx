// components/ui/dialog.tsx
import * as React from 'react';
import { Modal, View, Pressable, Animated } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './text';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog');
  }
  return context;
}

export function Dialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useDialog();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(true),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(true)}>
      {children}
    </Pressable>
  );
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { open, onOpenChange } = useDialog();

  const [visible, setVisible] = React.useState(false);

  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      setVisible(true);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [open]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        onPress={() => onOpenChange(false)}
        className="flex-1 bg-black/50 dark:bg-black/70 items-center justify-center p-4"
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          className="w-full max-w-md"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={cn(
              'bg-background rounded-lg p-6 shadow-lg web:min-w-[400px] border border-border',
              className
            )}
          >
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <View className={cn('mb-4', className)}>
      {children}
    </View>
  );
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <Text size="xl" variant="title" className={cn(className)}>
      {children}
    </Text>
  );
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <Text size="sm" className={cn('text-muted-foreground mt-2', className)}>
      {children}
    </Text>
  );
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <View className={cn('flex-row justify-end gap-2 mt-6', className)}>
      {children}
    </View>
  );
}

export function DialogClose({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useDialog();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(false),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(false)}>
      {children}
    </Pressable>
  );
}