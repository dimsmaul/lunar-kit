import * as React from 'react';
import {
  View,
  Pressable,
  Modal,
  LayoutRectangle,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

const dropdownContentVariants = cva(
  'rounded-lg border border-border bg-background p-1',
  {
    variants: {
      size: {
        sm: 'min-w-32',
        md: 'min-w-40',
        lg: 'min-w-56',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      shadow: 'md',
    },
  },
);

const dropdownItemVariants = cva(
  'flex-row items-center gap-2 rounded-md px-3 py-2.5',
  {
    variants: {
      variant: {
        default: 'active:bg-foreground/10',
        destructive: 'active:bg-destructive/10',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  },
);

const dropdownItemTextVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const dropdownLabelVariants = cva('px-3 py-2', {
  variants: {
    // bisa tambah variant nanti, e.g. inset
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps
  extends VariantProps<typeof dropdownContentVariants> {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  sideOffset?: number;
}

interface DropdownMenuItemProps
  extends Omit<VariantProps<typeof dropdownItemVariants>, 'disabled'> {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface DropdownMenuLabelProps
  extends VariantProps<typeof dropdownLabelVariants> {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}

interface DropdownMenuGroupProps {
  children: React.ReactNode;
}

type Ctx = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLayout: LayoutRectangle | null;
  setTriggerLayout: (layout: LayoutRectangle) => void;
};

const DropdownMenuContext = React.createContext<Ctx | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
}

export function DropdownMenu({
  children,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] =
    React.useState<LayoutRectangle | null>(null);

  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChangeProp?.(next);
  };

  const value = React.useMemo(
    () => ({ open, onOpenChange: handleOpenChange, triggerLayout, setTriggerLayout }),
    [open, triggerLayout],
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { open, onOpenChange, setTriggerLayout } = useDropdownMenu();
  const triggerRef = React.useRef<View>(null);

  const handlePress = () => {
    if (!triggerRef.current) {
      onOpenChange(!open);
      return;
    }
    triggerRef.current.measureInWindow((x, y, width, height) => {
      const adjustedY =
        Platform.OS === 'android' && StatusBar.currentHeight
          ? y - StatusBar.currentHeight
          : y;
      setTriggerLayout({ x, y: adjustedY, width, height });
      onOpenChange(!open);
    });
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: (node: any) => {
        const { ref } = child as any;
        if (typeof ref === 'function') ref(node);
        else if (ref && typeof ref === 'object') (ref as any).current = node;
        (triggerRef as any).current = node;
      },
      onPress: (...args: any[]) => {
        child.props.onPress?.(...args);
        handlePress();
      },
    });
  }

  return (
    <Pressable ref={triggerRef} onPress={handlePress}>
      {children}
    </Pressable>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  size,
  shadow,
}: DropdownMenuContentProps) {
  const { open, onOpenChange, triggerLayout } = useDropdownMenu();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const [visible, setVisible] = React.useState(false);
  const [contentSize, setContentSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      opacity.value = withTiming(1, { duration: 120 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 120 });
      scale.value = withTiming(0.98, { duration: 120 }, (finished) => {
        if (finished) runOnJS(setVisible)(false);
      });
    }
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !triggerLayout) return null;

  const getPositionStyle = () => {
    const { x, y, width, height } = triggerLayout;
    const style: Record<string, number> = {};

    const spaceBelow = windowHeight - (y + height + sideOffset);
    const spaceAbove = y - sideOffset;

    if (side === 'top') {
      style.top = Math.max(8, y - contentSize.height - sideOffset);
    } else if (spaceBelow >= contentSize.height || spaceBelow >= spaceAbove) {
      style.top = y + height + sideOffset;
    } else {
      style.top = Math.max(8, y - contentSize.height - sideOffset);
    }

    switch (align) {
      case 'start':
        style.left = Math.max(8, Math.min(x, windowWidth - contentSize.width - 8));
        break;
      case 'center':
        style.left = Math.max(
          8,
          Math.min(x + width / 2 - contentSize.width / 2, windowWidth - contentSize.width - 8),
        );
        break;
      case 'end':
        style.left = Math.max(
          8,
          Math.min(x + width - contentSize.width, windowWidth - contentSize.width - 8),
        );
        break;
    }

    return style;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {/* Backdrop */}
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => onOpenChange(false)}
          android_disableSound
        />

        {/* Content — sibling dari backdrop */}
        <Animated.View
          style={[
            { position: 'absolute', elevation: 8, zIndex: 999, minWidth: 160 },
            animatedStyle,
            getPositionStyle(),
          ]}
          onLayout={(e) =>
            setContentSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={cn(dropdownContentVariants({ size, shadow }), className)}
          >
            <ScrollView
              bounces={false}
              style={{ maxHeight: windowHeight * 0.4 }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function DropdownMenuItem({
  children,
  className,
  textClassName,
  onPress,
  disabled = false,
  destructive = false,
  leftIcon,
  rightIcon,
}: DropdownMenuItemProps) {
  const { onOpenChange } = useDropdownMenu();

  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    onOpenChange(false);
  };

  const variant = destructive ? 'destructive' : 'default';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        dropdownItemVariants({ variant, disabled }),
        className,
      )}
    >
      {leftIcon && <View className="w-5 items-center">{leftIcon}</View>}

      <View className="flex-1">
        {typeof children === 'string' ? (
          <Text
            size="sm"
            className={cn(dropdownItemTextVariants({ variant }), textClassName)}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>

      {rightIcon && <View className="w-5 items-center">{rightIcon}</View>}
    </Pressable>
  );
}

export function DropdownMenuLabel({
  children,
  className,
  textClassName,
  inset,
}: DropdownMenuLabelProps) {
  return (
    <View className={cn(dropdownLabelVariants({ inset }), className)}>
      {typeof children === 'string' ? (
        <Text size="sm" variant="title" className={cn('text-foreground', textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export function DropdownMenuSeparator() {
  return <View className="my-1 h-px bg-border" />;
}

export function DropdownMenuGroup({ children }: DropdownMenuGroupProps) {
  return <View>{children}</View>;
}