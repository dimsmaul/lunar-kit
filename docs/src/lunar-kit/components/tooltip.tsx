// components/ui/tooltip.tsx
import '@/lib/react-native-polyfill';
import * as React from 'react';
import {
  View,
  Pressable,
  Modal,
  LayoutRectangle,
  StyleSheet,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Text } from './text';
import { AdaptiveModal } from '../support/adaptive-modal';

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

interface TooltipContentProps
  extends VariantProps<typeof tooltipContentVariants> {
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
  if (!context)
    throw new Error('Tooltip components must be used within Tooltip');
  return context;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [triggerLayout, setTriggerLayout] =
    React.useState<LayoutRectangle | null>(null);

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

// ─── TooltipTrigger ───────────────────────────────────────────────────────────

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { open, onOpenChange, setTriggerLayout } = useTooltip();
  const triggerRef = React.useRef<View>(null);
  // ✅ Web: pakai ref ke DOM element langsung
  const webRef = React.useRef<any>(null);

  const measure = (cb: (layout: LayoutRectangle) => void) => {
    // ✅ Web: pakai getBoundingClientRect — jauh lebih reliable
    if (Platform.OS === 'web' && webRef.current) {
      const rect = webRef.current.getBoundingClientRect();
      cb({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
      return;
    }

    // Native
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const adjustedY =
        Platform.OS === 'android' && StatusBar.currentHeight
          ? y + StatusBar.currentHeight
          : y;
      cb({ x, y: adjustedY, width, height });
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
        // ✅ Web: simpan ref DOM node
        if (Platform.OS === 'web') webRef.current = node;
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
    <Pressable
      ref={(node: any) => {
        (triggerRef as any).current = node;
        // ✅ Web: simpan ref DOM node
        if (Platform.OS === 'web') webRef.current = node;
      }}
      onPress={handlePress}
      onLayout={handleLayout}
    >
      {children}
    </Pressable>
  );
}


// ─── TooltipContent ───────────────────────────────────────────────────────────

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

  // Web: CSS transition state
  const [animateIn, setAnimateIn] = React.useState(false);

  const ANIM_OFFSET = 6;

  React.useEffect(() => {
    if (open) {
      if (Platform.OS === 'web') {
        setVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnimateIn(true));
        });
      } else {
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
      }
    } else {
      if (Platform.OS === 'web') {
        setAnimateIn(false);
        const timer = setTimeout(() => setVisible(false), 150);
        return () => clearTimeout(timer);
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

  // const getPositionStyle = () => {
  //   const { x, y, width, height } = triggerLayout;
  //   const style: Record<string, number> = {};

  //   switch (side) {
  //     case 'top':
  //       style.top = Math.max(8, y - contentSize.height - sideOffset);
  //       style.left = Math.max(
  //         8,
  //         Math.min(
  //           x + width / 2 - contentSize.width / 2,
  //           windowWidth - contentSize.width - 8,
  //         ),
  //       );
  //       break;
  //     case 'bottom':
  //       style.top = Math.min(
  //         y + height + sideOffset,
  //         windowHeight - contentSize.height - 8,
  //       );
  //       style.left = Math.max(
  //         8,
  //         Math.min(
  //           x + width / 2 - contentSize.width / 2,
  //           windowWidth - contentSize.width - 8,
  //         ),
  //       );
  //       break;
  //     case 'left':
  //       style.top = Math.max(
  //         8,
  //         Math.min(
  //           y + height / 2 - contentSize.height / 2,
  //           windowHeight - contentSize.height - 8,
  //         ),
  //       );
  //       style.left =
  //         x - contentSize.width - sideOffset >= 8
  //           ? x - contentSize.width - sideOffset
  //           : x + width + sideOffset;
  //       break;
  //     case 'right':
  //       style.top = Math.max(
  //         8,
  //         Math.min(
  //           y + height / 2 - contentSize.height / 2,
  //           windowHeight - contentSize.height - 8,
  //         ),
  //       );
  //       style.left =
  //         x + width + sideOffset + contentSize.width <= windowWidth - 8
  //           ? x + width + sideOffset
  //           : x - contentSize.width - sideOffset;
  //       break;
  //   }

  //   return style;
  // };
  const getPositionStyle = () => {
    const { x, y, width, height } = triggerLayout;
    const style: Record<string, number> = {};

    // ✅ Gunakan estimasi maxWidth jika contentSize belum diketahui
    const contentW = contentSize.width || 280;
    const contentH = contentSize.height || 40;

    switch (side) {
      case 'top':
        style.top = Math.max(8, y - contentH - sideOffset);
        style.left = Math.max(
          8,
          Math.min(
            x + width / 2 - contentW / 2,
            windowWidth - contentW - 8,
          ),
        );
        break;
      case 'bottom':
        style.top = Math.min(
          y + height + sideOffset,
          windowHeight - contentH - 8,
        );
        style.left = Math.max(
          8,
          Math.min(
            x + width / 2 - contentW / 2,
            windowWidth - contentW - 8,
          ),
        );
        break;
      case 'left':
        style.top = Math.max(
          8,
          Math.min(
            y + height / 2 - contentH / 2,
            windowHeight - contentH - 8,
          ),
        );
        // ✅ Cek ruang kiri, kalau tidak cukup fallback ke kanan
        style.left =
          x - contentW - sideOffset >= 8
            ? x - contentW - sideOffset
            : x + width + sideOffset;
        break;
      case 'right':
        style.top = Math.max(
          8,
          Math.min(
            y + height / 2 - contentH / 2,
            windowHeight - contentH - 8,
          ),
        );
        // ✅ Cek ruang kanan, kalau tidak cukup fallback ke kiri
        style.left =
          x + width + sideOffset + contentW <= windowWidth - 8
            ? x + width + sideOffset
            : x - contentW - sideOffset;
        break;
    }

    return style;
  };

  const positionStyle = getPositionStyle();

  // ── Web offset awal untuk CSS transition ──────────────────────────────────
  const getWebInitialOffset = () => {
    switch (side) {
      case 'top': return { x: 0, y: ANIM_OFFSET };
      case 'bottom': return { x: 0, y: -ANIM_OFFSET };
      case 'left': return { x: ANIM_OFFSET, y: 0 };
      case 'right': return { x: -ANIM_OFFSET, y: 0 };
    }
  };

  const webOffset = getWebInitialOffset();

  // ✅ Web
  if (Platform.OS === 'web') {
    return (
      <AdaptiveModal visible={visible} onDismiss={() => onOpenChange(false)}>
        {/* Backdrop transparan */}
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => onOpenChange(false)}
        />

        {/* Content */}
        <View
          style={{
            position: 'absolute',
            zIndex: 99999,
            opacity: animateIn ? 1 : 0,
            transform: [
              {
                translateX: animateIn ? 0 : webOffset.x,
              },
              {
                translateY: animateIn ? 0 : webOffset.y,
              },
            ],
            transition: 'opacity 150ms ease, transform 150ms ease',
            ...positionStyle,
          } as any}
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
                <Text size="sm" className="text-foreground">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          </Pressable>
        </View>
      </AdaptiveModal>
    );
  }

  // ✅ Native
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => onOpenChange(false)}
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
            positionStyle,
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
                <Text size="sm" className="text-foreground">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
