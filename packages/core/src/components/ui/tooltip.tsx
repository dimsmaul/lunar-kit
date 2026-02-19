import * as React from 'react';
import {
  View,
  Pressable,
  Modal,
  LayoutRectangle,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { Text } from './text';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: TooltipPlacement;
  sideOffset?: number;
}

const TooltipContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLayout: LayoutRectangle | null;
  setTriggerLayout: (layout: LayoutRectangle) => void;
} | null>(null);

function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip');
  }
  return context;
}

export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] =
    React.useState<LayoutRectangle | null>(null);

  return (
    <TooltipContext.Provider
      value={{ open, onOpenChange: setOpen, triggerLayout, setTriggerLayout }}
    >
      <View>{children}</View>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { open, onOpenChange, setTriggerLayout } = useTooltip();
  const triggerRef = React.useRef<View>(null);

  const handlePress = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      onOpenChange(!open);
    });
  };

  const handleLayout = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
    });
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onPress: handlePress,
      onLayout: handleLayout,
    });
  }

  return (
    <Pressable ref={triggerRef} onPress={handlePress} onLayout={handleLayout}>
      {children}
    </Pressable>
  );
}

export function TooltipContent({
  children,
  className,
  side = 'top',
  sideOffset = 8,
}: TooltipContentProps) {
  const { open, onOpenChange, triggerLayout } = useTooltip();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const opacity = useSharedValue(0);
  const offset = useSharedValue(4);
  const [visible, setVisible] = React.useState(false);
  const [contentSize, setContentSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      opacity.value = withTiming(1, { duration: 150 });
      offset.value = withTiming(0, { duration: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 100 });
      offset.value = withTiming(4, { duration: 100 }, (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    }
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => {
    const transform = [];
    switch (side) {
      case 'top':
        transform.push({ translateY: offset.value });
        break;
      case 'bottom':
        transform.push({ translateY: -offset.value });
        break;
      case 'left':
        transform.push({ translateX: offset.value });
        break;
      case 'right':
        transform.push({ translateX: -offset.value });
        break;
    }
    return {
      opacity: opacity.value,
      transform,
    };
  });

  if (!visible || !triggerLayout) return null;

  // Calculate position
  const getPositionStyle = () => {
    const { x, y, width, height } = triggerLayout;
    const baseStyle: Record<string, number> = {};

    switch (side) {
      case 'top':
        baseStyle.bottom = windowHeight - y + sideOffset;
        baseStyle.top = y - contentSize.height - sideOffset;
        baseStyle.left = Math.max(
          4,
          Math.min(
            x + width / 2 - contentSize.width / 2,
            windowWidth - contentSize.width - 4,
          ),
        );
        break;
      case 'bottom':
        baseStyle.top = y + height + sideOffset;
        baseStyle.left = Math.max(
          4,
          Math.min(
            x + width / 2 - contentSize.width / 2,
            windowWidth - contentSize.width - 4,
          ),
        );
        break;
      case 'left':
        baseStyle.top = y + height / 2 - contentSize.height / 2;
        baseStyle.left = x - contentSize.width - sideOffset;
        break;
      case 'right':
        baseStyle.top = y + height / 2 - contentSize.height / 2;
        baseStyle.left = x + width + sideOffset;
        break;
    }

    return baseStyle;
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable className="flex-1" onPress={() => onOpenChange(false)}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              zIndex: 50,
            },
            animatedStyle,
            getPositionStyle(),
          ]}
          onLayout={(e) => {
            setContentSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className={cn(
                'rounded-md bg-popover px-3 py-1.5 shadow-md border border-border',
                className,
              )}
            >
              {typeof children === 'string' ? (
                <Text size="sm" className="text-popover-foreground">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
