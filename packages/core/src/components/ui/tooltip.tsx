import * as React from 'react';
import {
  View,
  Pressable,
  LayoutRectangle,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { AdaptiveModal } from '@lunar-primitive/adaptive-modal';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

const tooltipContentVariants = cva(
  'rounded-md border border-border bg-background px-3 py-1.5',
  {
    variants: {
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
    },
    defaultVariants: {
      shadow: 'sm',
    },
  },
);

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps extends VariantProps<typeof tooltipContentVariants> {
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
  if (!context) throw new Error('Tooltip components must be used within Tooltip');
  return context;
}

export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] = React.useState<LayoutRectangle | null>(null);

  const value = React.useMemo(
    () => ({ open, onOpenChange: setOpen, triggerLayout, setTriggerLayout }),
    [open, triggerLayout],
  );

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { open, onOpenChange, setTriggerLayout } = useTooltip();
  const triggerRef = React.useRef<View>(null);

  const measure = (cb: (layout: LayoutRectangle) => void) => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      cb({ x, y, width, height });
    });
  };

  const handlePress = () => {
    measure((layout) => {
      setTriggerLayout(layout);
      onOpenChange(!open);
    });
  };

  const handleLayout = () => {
    measure((layout) => setTriggerLayout(layout));
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
      onLayout: (...args: any[]) => {
        child.props.onLayout?.(...args);
        handleLayout();
      },
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
  side = 'bottom',
  sideOffset = 8,
  shadow,
}: TooltipContentProps) {
  const { open, onOpenChange, triggerLayout } = useTooltip();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [visible, setVisible] = React.useState(false);
  const [contentSize, setContentSize] = React.useState({ width: 0, height: 0 });

  const ANIM_OFFSET = 6;

  React.useEffect(() => {
    if (open) {
      switch (side) {
        case 'top': translateY.value = ANIM_OFFSET; translateX.value = 0; break;
        case 'bottom': translateY.value = -ANIM_OFFSET; translateX.value = 0; break;
        case 'left': translateX.value = ANIM_OFFSET; translateY.value = 0; break;
        case 'right': translateX.value = -ANIM_OFFSET; translateY.value = 0; break;
      }
      setVisible(true);
      opacity.value = withTiming(1, { duration: 150 });
      translateX.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(0, { duration: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 100 }, (finished) => {
        if (finished) runOnJS(setVisible)(false);
      });
      switch (side) {
        case 'top': translateY.value = withTiming(ANIM_OFFSET, { duration: 100 }); break;
        case 'bottom': translateY.value = withTiming(-ANIM_OFFSET, { duration: 100 }); break;
        case 'left': translateX.value = withTiming(ANIM_OFFSET, { duration: 100 }); break;
        case 'right': translateX.value = withTiming(-ANIM_OFFSET, { duration: 100 }); break;
      }
    }
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  if (!visible || !triggerLayout) return null;

  const getPositionStyle = () => {
    const { x, y, width, height } = triggerLayout;
    const style: Record<string, number> = {};

    switch (side) {
      case 'top':
        style.top = Math.max(8, y - contentSize.height - sideOffset);
        style.left = Math.max(
          8,
          Math.min(x + width / 2 - contentSize.width / 2, windowWidth - contentSize.width - 8),
        );
        break;
      case 'bottom':
        style.top = Math.min(y + height + sideOffset, windowHeight - contentSize.height - 8);
        style.left = Math.max(
          8,
          Math.min(x + width / 2 - contentSize.width / 2, windowWidth - contentSize.width - 8),
        );
        break;
      case 'left':
        style.top = Math.max(
          8,
          Math.min(y + height / 2 - contentSize.height / 2, windowHeight - contentSize.height - 8),
        );
        style.left =
          x - contentSize.width - sideOffset >= 8
            ? x - contentSize.width - sideOffset
            : x + width + sideOffset;
        break;
      case 'right':
        style.top = Math.max(
          8,
          Math.min(y + height / 2 - contentSize.height / 2, windowHeight - contentSize.height - 8),
        );
        style.left =
          x + width + sideOffset + contentSize.width <= windowWidth - 8
            ? x + width + sideOffset
            : x - contentSize.width - sideOffset;
        break;
    }

    return style;
  };

  return (
    <AdaptiveModal
      visible={visible}
      onDismiss={() => onOpenChange(false)}
      backdropColor="transparent"
      closeOnBackdropPress={false}
      animationType="none"
      statusBarTranslucent
    >
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => onOpenChange(false)}
          android_disableSound
        />

        <Animated.View
          style={[
            { position: 'absolute', zIndex: 999, elevation: 8 },
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
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className={cn(tooltipContentVariants({ shadow }), className)}>
              {typeof children === 'string' ? (
                <Text className="text-foreground">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </AdaptiveModal>
  );
}
