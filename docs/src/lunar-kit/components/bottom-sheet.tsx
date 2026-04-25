import '@/lib/react-native-polyfill';
import * as React from 'react';
import {
  View,
  Pressable,
  Dimensions,
  FlatList,
  ListRenderItem,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
  clamp,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Text } from './text';
import { Checkbox } from './checkbox';
import { Radio } from './radio';
import { AdaptiveModal } from '../support/adaptive-modal';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const VELOCITY_THRESHOLD = 300;

const SPRING_CONFIG = {
  damping: 50,
  stiffness: 400,
  mass: 0.5,
  overshootClamping: false,
  restSpeedThreshold: 0.01,
  restDisplacementThreshold: 0.01,
};

const CLOSE_TIMING_CONFIG = {
  duration: 280,
  easing: Easing.out(Easing.ease),
};

const bottomSheetVariants = cva('rounded-t-3xl shadow-2xl h-full', {
  variants: {
    variant: {
      default: 'bg-card',
      filled: 'bg-muted',
    },
  },
  defaultVariants: { variant: 'default' },
});

const dragHandleVariants = cva('w-12 h-1.5 rounded-full', {
  variants: {
    variant: {
      default: 'bg-muted-foreground/30',
      filled: 'bg-muted-foreground/50',
    },
  },
  defaultVariants: { variant: 'default' },
});

const listItemVariants = cva(
  'flex-row items-center justify-between px-4 py-3 border-b border-border',
  {
    variants: {
      selected: {
        true: 'bg-accent',
        false: 'bg-transparent',
      },
    },
    defaultVariants: { selected: false },
  },
);

interface BottomSheetProps extends VariantProps<typeof bottomSheetVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: string[];
  defaultSnapPoint?: number;
}

interface BottomSheetContentProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetBodyProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

interface BottomSheetListProps<T> {
  data: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  variant?: 'list' | 'select' | 'multiple';
  onSelect?: (selected: T | T[] | null) => void;
  selectedValue?: any;
  selectedValues?: any[];
  getItemValue?: (item: T) => any;
  className?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?:
  | React.ComponentType<any>
  | React.ReactElement
  | null
  | undefined;
}

interface BottomSheetListItemProps {
  children: React.ReactNode;
  className?: string;
}

interface BottomSheetDragAreaProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: string[];
  currentSnapPoint: number;
  variant: 'default' | 'filled';
} | null>(null);

const BottomSheetInternalContext = React.createContext<{
  panGesture: ReturnType<typeof Gesture.Pan> | null;
  dismissTranslateY: SharedValue<number> | null;
  lowestSnapHeight: number;
  dragAreaHeight: SharedValue<number> | null;
}>({
  panGesture: null,
  dismissTranslateY: null,
  lowestSnapHeight: 0,
  dragAreaHeight: null,
});

function useBottomSheet() {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet components must be used within BottomSheet');
  }
  return context;
}

export function BottomSheet({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
  snapPoints = ['50%'],
  defaultSnapPoint = 0,
  variant = 'default',
}: BottomSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;
  const sheetVariant = variant ?? 'default';

  return (
    <BottomSheetContext.Provider
      value={{
        open,
        onOpenChange,
        snapPoints,
        currentSnapPoint: defaultSnapPoint,
        variant: sheetVariant,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
}

export function BottomSheetTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onOpenChange } = useBottomSheet();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(true),
    });
  }

  return <Pressable onPress={() => onOpenChange(true)}>{children}</Pressable>;
}

export function BottomSheetContent({
  children,
  className,
}: BottomSheetContentProps) {
  const {
    open,
    onOpenChange,
    snapPoints,
    currentSnapPoint: defaultSnapPoint,
    variant,
  } = useBottomSheet();

  const [visible, setVisible] = React.useState(false);

  const currentSnapIndex = useSharedValue(defaultSnapPoint);

  const snapHeights = React.useMemo(() => {
    return snapPoints.map((point) => {
      const percentage = Number.parseInt(point) / 100;
      return SCREEN_HEIGHT * percentage;
    });
  }, [snapPoints]);

  const animatedHeight = useSharedValue(snapHeights[defaultSnapPoint]);
  const dismissTranslateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const dragAreaHeight = useSharedValue(0);

  const dragContext = useSharedValue({
    startHeight: 0,
    startTranslateY: 0,
    isAtLowest: false,
  });

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .activateAfterLongPress(0)
    .onBegin(() => {
      dragContext.value = {
        startHeight: animatedHeight.value,
        startTranslateY: dismissTranslateY.value,
        isAtLowest: currentSnapIndex.value === 0,
      };
    })
    .onUpdate((event) => {
      const dy = event.translationY;
      const { startHeight, isAtLowest } = dragContext.value;
      const idx = currentSnapIndex.value;

      if (dy < 0) {
        if (idx < snapHeights.length - 1) {
          const nextHeight = snapHeights[idx + 1];
          animatedHeight.value = clamp(startHeight - dy, startHeight, nextHeight);
        } else {
          animatedHeight.value = startHeight + Math.abs(dy) * 0.12;
        }
      } else {
        if (isAtLowest) {
          dismissTranslateY.value = clamp(dy, 0, SCREEN_HEIGHT);
          const progress = clamp(dy / snapHeights[0], 0, 1);
          backdropOpacity.value = 1 - progress * 0.6;
        } else {
          const lowestHeight = snapHeights[0];
          const newHeight = clamp(startHeight - dy, lowestHeight, startHeight);
          animatedHeight.value = newHeight;

          if (newHeight <= lowestHeight + 2) {
            const overDrag = startHeight - dy - lowestHeight;
            const excessDrag = clamp(-overDrag, 0, SCREEN_HEIGHT);
            dismissTranslateY.value = excessDrag;
            const progress = clamp(excessDrag / lowestHeight, 0, 1);
            backdropOpacity.value = 1 - progress * 0.6;
          }
        }
      }
    })
    .onEnd((event) => {
      const vy = event.velocityY;

      let targetIndex = 0;
      let closestDist = Math.abs(snapHeights[0] - animatedHeight.value);
      for (let i = 1; i < snapHeights.length; i++) {
        const dist = Math.abs(snapHeights[i] - animatedHeight.value);
        if (dist < closestDist) {
          closestDist = dist;
          targetIndex = i;
        }
      }

      if (vy > VELOCITY_THRESHOLD && targetIndex > 0) {
        targetIndex -= 1;
      } else if (vy < -VELOCITY_THRESHOLD && targetIndex < snapHeights.length - 1) {
        targetIndex += 1;
      }

      const shouldDismiss =
        dismissTranslateY.value > snapHeights[0] * 0.35 ||
        (vy > 800 && targetIndex === 0);

      if (shouldDismiss) {
        currentSnapIndex.value = 0;
        animatedHeight.value = withTiming(snapHeights[0], { duration: 150 });
        dismissTranslateY.value = withTiming(
          SCREEN_HEIGHT,
          CLOSE_TIMING_CONFIG,
          () => { runOnJS(handleClose)(); },
        );
        backdropOpacity.value = withTiming(0, { duration: 250 });
        return;
      }

      currentSnapIndex.value = targetIndex;
      animatedHeight.value = withSpring(snapHeights[targetIndex], {
        ...SPRING_CONFIG,
        velocity: Math.abs(vy),
      });
      dismissTranslateY.value = withSpring(0, { ...SPRING_CONFIG });
      backdropOpacity.value = withSpring(1, SPRING_CONFIG);
    });

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      currentSnapIndex.value = defaultSnapPoint;
      animatedHeight.value = snapHeights[defaultSnapPoint];
      dismissTranslateY.value = SCREEN_HEIGHT;
      dismissTranslateY.value = withSpring(0, SPRING_CONFIG);
      backdropOpacity.value = withSpring(1, SPRING_CONFIG);
    } else {
      dismissTranslateY.value = withTiming(SCREEN_HEIGHT, CLOSE_TIMING_CONFIG);
      backdropOpacity.value = withTiming(0, { duration: 250 });
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, defaultSnapPoint]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    transform: [{ translateY: dismissTranslateY.value }],
  }));

  if (!visible) return null;

  return (
    <BottomSheetInternalContext.Provider
      value={{ panGesture, dismissTranslateY, lowestSnapHeight: snapHeights[0], dragAreaHeight }}
    >
      <AdaptiveModal
        visible={visible}
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* Backdrop */}
            <Animated.View
              style={[
                { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                backdropAnimatedStyle,
              ]}
            >
              <Pressable onPress={handleClose} style={{ flex: 1 }} />
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
              style={[
                { position: 'absolute', bottom: 0, left: 0, right: 0 },
                sheetAnimatedStyle,
              ]}
            >
              <View className={cn(bottomSheetVariants({ variant }), className)}>
                {/* Default drag handle */}
                <GestureDetector gesture={panGesture}>
                  <Animated.View
                    className="items-center py-3"
                    onLayout={(e) => {
                      dragAreaHeight.value = e.nativeEvent.layout.height;
                    }}
                  >
                    <View className='items-center py-3'>
                      <View className={cn(dragHandleVariants({ variant }))} />
                    </View>
                  </Animated.View>
                </GestureDetector>

                <View className="flex-1 pb-20">{children}</View>
              </View>
            </Animated.View>
          </View>
        </GestureHandlerRootView>
      </AdaptiveModal>
    </BottomSheetInternalContext.Provider>
  );
}

export function BottomSheetDragArea({
  children,
  className,
}: BottomSheetDragAreaProps) {
  const { panGesture, dragAreaHeight } = React.useContext(BottomSheetInternalContext);

  if (!panGesture) return <>{children}</>;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className={className}
        onLayout={(e) => {
          if (dragAreaHeight) dragAreaHeight.value = e.nativeEvent.layout.height;
        }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export function BottomSheetHeader({
  children,
  className,
}: BottomSheetHeaderProps) {
  return <View className={cn('px-4 pb-2', className)}>{children}</View>;
}

export function BottomSheetTitle({
  children,
  className,
}: BottomSheetTitleProps) {
  return (
    <Text variant="header" size="md" className={className}>
      {children}
    </Text>
  );
}

export function BottomSheetDescription({
  children,
  className,
}: BottomSheetDescriptionProps) {
  return (
    <Text variant="muted" size="sm" className={cn('mt-2', className)}>
      {children}
    </Text>
  );
}

export function BottomSheetBody({
  children,
  className,
  scrollable,
}: BottomSheetBodyProps) {
  if (!scrollable) {
    return <View className={cn('flex-1 px-4', className)}>{children}</View>;
  }

  return (
    <ScrollView
      className={cn('flex-1 px-4', className)}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {children}
    </ScrollView>
  );
}

export function BottomSheetList<T>({
  data,
  renderItem,
  keyExtractor,
  variant = 'list',
  onSelect,
  selectedValue,
  selectedValues = [],
  getItemValue,
  className,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
}: BottomSheetListProps<T>) {
  const [internalSelectedValues, setInternalSelectedValues] =
    React.useState<any[]>(selectedValues);

  const defaultKeyExtractor = (item: T, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return String((item as any).id);
    }
    return String(index);
  };

  const defaultGetItemValue = (item: T) => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return (item as any).value;
    }
    return item;
  };

  const finalKeyExtractor = keyExtractor || defaultKeyExtractor;
  const finalGetItemValue = getItemValue || defaultGetItemValue;

  const handleSelect = (item: T) => {
    const itemValue = finalGetItemValue(item);

    if (variant === 'select') {
      onSelect?.(item);
    } else if (variant === 'multiple') {
      const isSelected = internalSelectedValues.includes(itemValue);
      const newSelected = isSelected
        ? internalSelectedValues.filter((v) => v !== itemValue)
        : [...internalSelectedValues, itemValue];

      setInternalSelectedValues(newSelected);

      const selectedItems = data.filter((d) =>
        newSelected.includes(finalGetItemValue(d)),
      );
      onSelect?.(selectedItems as T[]);
    } else {
      onSelect?.(item);
    }
  };

  const isItemSelected = (item: T) => {
    const itemValue = finalGetItemValue(item);
    if (variant === 'select') return selectedValue === itemValue;
    if (variant === 'multiple') return internalSelectedValues.includes(itemValue);
    return false;
  };

  const defaultRenderItem: ListRenderItem<T> = ({ item }) => {
    const isSelected = isItemSelected(item);
    const itemLabel =
      typeof item === 'object' && item !== null && 'label' in item
        ? (item as any).label
        : String(item);

    return (
      <Pressable
        onPress={() => handleSelect(item)}
        className={cn(listItemVariants({ selected: isSelected }))}
      >
        <View className="flex-row items-center gap-3 flex-1">
          {variant === 'select' && <Radio checked={isSelected} />}
          {variant === 'multiple' && <Checkbox checked={isSelected} />}
          <Text
            variant="default"
            size="md"
            className={cn('flex-1', isSelected && 'text-primary font-semibold')}
          >
            {itemLabel}
          </Text>
        </View>

        {variant === 'select' && isSelected && (
          <Text className="text-primary font-bold">✓</Text>
        )}
      </Pressable>
    );
  };

  const finalRenderItem = renderItem || defaultRenderItem;

  return (
    <FlatList
      data={data}
      renderItem={finalRenderItem}
      keyExtractor={finalKeyExtractor}
      className={cn('flex-1 px-0', className)}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

export function BottomSheetListItem({
  children,
  className,
}: BottomSheetListItemProps) {
  return (
    <View className={cn('px-4 py-3 border-b border-border', className)}>
      {children}
    </View>
  );
}

export function BottomSheetFooter({
  children,
  className,
}: BottomSheetFooterProps) {
  const { dismissTranslateY, lowestSnapHeight, dragAreaHeight } = React.useContext(BottomSheetInternalContext);
  const footerHeight = useSharedValue(0);

  const footerStyle = useAnimatedStyle(() => {
    if (!dismissTranslateY) return {};
    const dragH = dragAreaHeight ? dragAreaHeight.value : 0;
    const threshold = Math.max(0, lowestSnapHeight - dragH - footerHeight.value);
    const counter = clamp(dismissTranslateY.value, 0, threshold);
    return { transform: [{ translateY: -counter }] };
  });

  return (
    <Animated.View
      onLayout={(e) => {
        footerHeight.value = e.nativeEvent.layout.height;
      }}
      style={[
        { position: 'absolute', bottom: 0, left: 0, right: 0 },
        footerStyle,
      ]}
      className={cn('bg-card px-4 py-4 border-t border-border', className)}
    >
      <View className={cn('bg-card px-4 py-4 border-t border-border', className)}>
        {children}
      </View>
    </Animated.View>
  );
}

export function BottomSheetClose({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onOpenChange } = useBottomSheet();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(false),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(false)}>{children}</Pressable>
  );
}

// import * as React from 'react';
// import {
//   View,
//   Pressable,
//   Dimensions,
//   FlatList,
//   ListRenderItem,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
//   Easing,
//   runOnJS,
//   clamp,
// } from 'react-native-reanimated';
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '../lib/utils';
// import { Text } from './text';
// import { Checkbox } from './checkbox';
// import { Radio } from './radio';
// import { AdaptiveModal } from '../support/adaptive-modal';

// const SCREEN_HEIGHT = Dimensions.get('window').height;
// const VELOCITY_THRESHOLD = 300;

// const SPRING_CONFIG = {
//   damping: 50,
//   stiffness: 400,
//   mass: 0.5,
//   overshootClamping: false,
//   restSpeedThreshold: 0.01,
//   restDisplacementThreshold: 0.01,
// };

// const CLOSE_TIMING_CONFIG = {
//   duration: 280,
//   easing: Easing.out(Easing.ease),
// };

// // ─── Variants ─────────────────────────────────────────────────────────────────

// const bottomSheetVariants = cva('rounded-t-3xl shadow-2xl h-full', {
//   variants: {
//     variant: {
//       default: 'bg-card',
//       filled: 'bg-muted',
//     },
//   },
//   defaultVariants: { variant: 'default' },
// });

// const dragHandleVariants = cva('w-12 h-1.5 rounded-full', {
//   variants: {
//     variant: {
//       default: 'bg-muted-foreground/30',
//       filled: 'bg-muted-foreground/50',
//     },
//   },
//   defaultVariants: { variant: 'default' },
// });

// const listItemVariants = cva(
//   'flex-row items-center justify-between px-4 py-3 border-b border-border',
//   {
//     variants: {
//       selected: {
//         true: 'bg-accent',
//         false: 'bg-transparent',
//       },
//     },
//     defaultVariants: { selected: false },
//   },
// );

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface BottomSheetProps extends VariantProps<typeof bottomSheetVariants> {
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   children: React.ReactNode;
//   snapPoints?: string[];
//   defaultSnapPoint?: number;
// }

// interface BottomSheetContentProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetHeaderProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetTitleProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetDescriptionProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetFooterProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetBodyProps {
//   children: React.ReactNode;
//   className?: string;
//   scrollable?: boolean;
// }

// interface BottomSheetListProps<T> {
//   data: T[];
//   renderItem?: ListRenderItem<T>;
//   keyExtractor?: (item: T, index: number) => string;
//   variant?: 'list' | 'select' | 'multiple';
//   onSelect?: (selected: T | T[] | null) => void;
//   selectedValue?: any;
//   selectedValues?: any[];
//   getItemValue?: (item: T) => any;
//   className?: string;
//   onEndReached?: () => void;
//   onEndReachedThreshold?: number;
//   ListFooterComponent?:
//   | React.ComponentType<any>
//   | React.ReactElement
//   | null
//   | undefined;
// }

// interface BottomSheetListItemProps {
//   children: React.ReactNode;
//   className?: string;
// }

// interface BottomSheetDragAreaProps {
//   children: React.ReactNode;
//   className?: string;
// }

// // ─── Contexts ─────────────────────────────────────────────────────────────────

// const BottomSheetContext = React.createContext<{
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   snapPoints: string[];
//   currentSnapPoint: number;
//   variant: 'default' | 'filled';
// } | null>(null);

// const BottomSheetInternalContext = React.createContext<{
//   panGesture: ReturnType<typeof Gesture.Pan> | null;
// }>({ panGesture: null });

// function useBottomSheet() {
//   const context = React.useContext(BottomSheetContext);
//   if (!context) {
//     throw new Error('BottomSheet components must be used within BottomSheet');
//   }
//   return context;
// }

// // ─── MaybeGestureRoot ─────────────────────────────────────────────────────────

// function MaybeGestureRoot({ children }: { children: React.ReactNode }) {
//   if (Platform.OS === 'android') {
//     return (
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         {children}
//       </GestureHandlerRootView>
//     );
//   }
//   return <>{children}</>;
// }

// // ─── BottomSheet ──────────────────────────────────────────────────────────────

// export function BottomSheet({
//   open: controlledOpen,
//   onOpenChange: controlledOnOpenChange,
//   children,
//   snapPoints = ['50%'],
//   defaultSnapPoint = 0,
//   variant = 'default',
// }: BottomSheetProps) {
//   const [internalOpen, setInternalOpen] = React.useState(false);

//   const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const onOpenChange = controlledOnOpenChange || setInternalOpen;
//   const sheetVariant = variant ?? 'default';

//   return (
//     <BottomSheetContext.Provider
//       value={{
//         open,
//         onOpenChange,
//         snapPoints,
//         currentSnapPoint: defaultSnapPoint,
//         variant: sheetVariant,
//       }}
//     >
//       {children}
//     </BottomSheetContext.Provider>
//   );
// }

// // ─── BottomSheetTrigger ───────────────────────────────────────────────────────

// export function BottomSheetTrigger({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { onOpenChange } = useBottomSheet();

//   if (React.isValidElement(children)) {
//     return React.cloneElement(children as React.ReactElement<any>, {
//       onPress: () => onOpenChange(true),
//     });
//   }

//   return <Pressable onPress={() => onOpenChange(true)}>{children}</Pressable>;
// }

// // ─── BottomSheetContent ───────────────────────────────────────────────────────

// export function BottomSheetContent({
//   children,
//   className,
// }: BottomSheetContentProps) {
//   const {
//     open,
//     onOpenChange,
//     snapPoints,
//     currentSnapPoint: defaultSnapPoint,
//     variant,
//   } = useBottomSheet();

//   const [visible, setVisible] = React.useState(false);

//   const currentSnapIndex = useSharedValue(defaultSnapPoint);

//   const snapHeights = React.useMemo(() => {
//     return snapPoints.map((point) => {
//       const percentage = Number.parseInt(point) / 100;
//       return SCREEN_HEIGHT * percentage;
//     });
//   }, [snapPoints]);

//   const animatedHeight = useSharedValue(snapHeights[defaultSnapPoint]);
//   const dismissTranslateY = useSharedValue(SCREEN_HEIGHT);
//   const backdropOpacity = useSharedValue(0);

//   const dragContext = useSharedValue({
//     startHeight: 0,
//     startTranslateY: 0,
//     isAtLowest: false,
//   });

//   const handleClose = React.useCallback(() => {
//     onOpenChange(false);
//   }, [onOpenChange]);

//   const panGesture = Gesture.Pan()
//     .minDistance(1)
//     .activateAfterLongPress(0)
//     .onBegin(() => {
//       dragContext.value = {
//         startHeight: animatedHeight.value,
//         startTranslateY: dismissTranslateY.value,
//         isAtLowest: currentSnapIndex.value === 0,
//       };
//     })
//     .onUpdate((event) => {
//       const dy = event.translationY;
//       const { startHeight, isAtLowest } = dragContext.value;
//       const idx = currentSnapIndex.value;

//       if (dy < 0) {
//         if (idx < snapHeights.length - 1) {
//           const nextHeight = snapHeights[idx + 1];
//           animatedHeight.value = clamp(startHeight - dy, startHeight, nextHeight);
//         } else {
//           animatedHeight.value = startHeight + Math.abs(dy) * 0.12;
//         }
//       } else {
//         if (isAtLowest) {
//           dismissTranslateY.value = clamp(dy, 0, SCREEN_HEIGHT);
//           const progress = clamp(dy / snapHeights[0], 0, 1);
//           backdropOpacity.value = 1 - progress * 0.6;
//         } else {
//           const lowestHeight = snapHeights[0];
//           const newHeight = clamp(startHeight - dy, lowestHeight, startHeight);
//           animatedHeight.value = newHeight;

//           if (newHeight <= lowestHeight + 2) {
//             const overDrag = startHeight - dy - lowestHeight;
//             const excessDrag = clamp(-overDrag, 0, SCREEN_HEIGHT);
//             dismissTranslateY.value = excessDrag;
//             const progress = clamp(excessDrag / lowestHeight, 0, 1);
//             backdropOpacity.value = 1 - progress * 0.6;
//           }
//         }
//       }
//     })
//     .onEnd((event) => {
//       const vy = event.velocityY;

//       let targetIndex = 0;
//       let closestDist = Math.abs(snapHeights[0] - animatedHeight.value);
//       for (let i = 1; i < snapHeights.length; i++) {
//         const dist = Math.abs(snapHeights[i] - animatedHeight.value);
//         if (dist < closestDist) {
//           closestDist = dist;
//           targetIndex = i;
//         }
//       }

//       if (vy > VELOCITY_THRESHOLD && targetIndex > 0) targetIndex -= 1;
//       else if (vy < -VELOCITY_THRESHOLD && targetIndex < snapHeights.length - 1) targetIndex += 1;

//       const shouldDismiss =
//         dismissTranslateY.value > snapHeights[0] * 0.35 ||
//         (vy > 800 && targetIndex === 0);

//       if (shouldDismiss) {
//         currentSnapIndex.value = 0;
//         animatedHeight.value = withTiming(snapHeights[0], { duration: 150 });
//         dismissTranslateY.value = withTiming(
//           SCREEN_HEIGHT,
//           CLOSE_TIMING_CONFIG,
//           () => { runOnJS(handleClose)(); },
//         );
//         backdropOpacity.value = withTiming(0, { duration: 250 });
//         return;
//       }

//       currentSnapIndex.value = targetIndex;
//       animatedHeight.value = withSpring(snapHeights[targetIndex], {
//         ...SPRING_CONFIG,
//         velocity: Math.abs(vy),
//       });
//       dismissTranslateY.value = withSpring(0, { ...SPRING_CONFIG });
//       backdropOpacity.value = withSpring(1, SPRING_CONFIG);
//     });

//   React.useEffect(() => {
//     if (open) {
//       setVisible(true);
//       currentSnapIndex.value = defaultSnapPoint;
//       animatedHeight.value = snapHeights[defaultSnapPoint];
//       dismissTranslateY.value = SCREEN_HEIGHT;
//       dismissTranslateY.value = withSpring(0, SPRING_CONFIG);
//       backdropOpacity.value = withSpring(1, SPRING_CONFIG);
//     } else {
//       dismissTranslateY.value = withTiming(SCREEN_HEIGHT, CLOSE_TIMING_CONFIG);
//       backdropOpacity.value = withTiming(0, { duration: 250 });
//       const timer = setTimeout(() => setVisible(false), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [open, defaultSnapPoint]);

//   const backdropAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: backdropOpacity.value,
//   }));

//   const sheetAnimatedStyle = useAnimatedStyle(() => ({
//     height: animatedHeight.value,
//     transform: [{ translateY: dismissTranslateY.value }],
//   }));

//   if (!visible) return null;

//   const sheetJSX = (
//     <>
//       {/* Backdrop */}
//       <Animated.View
//         style={[
//           {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           },
//           backdropAnimatedStyle,
//         ]}
//       >
//         <Pressable onPress={handleClose} style={{ flex: 1 }} />
//       </Animated.View>

//       {/* Sheet */}
//       <Animated.View
//         style={[
//           { position: 'absolute', bottom: 0, left: 0, right: 0 },
//           sheetAnimatedStyle,
//         ]}
//       >
//         <View className={cn(bottomSheetVariants({ variant }), className)}>
//           {/* Default drag handle */}
//           <GestureDetector gesture={panGesture}>
//             <Animated.View className="items-center py-3">
//               <View className='items-center py-3'>
//                 <View className={cn(dragHandleVariants({ variant }))} />
//               </View>
//             </Animated.View>
//           </GestureDetector>

//           <View className="flex-1 pb-20">{children}</View>
//         </View>
//       </Animated.View>
//     </>
//   );

//   return (
//     <BottomSheetInternalContext.Provider value={{ panGesture }}>
//       <AdaptiveModal
//         visible={visible}
//         onRequestClose={handleClose}
//         statusBarTranslucent
//       >
//         <MaybeGestureRoot>
//           <View style={{ flex: 1 }}>{sheetJSX}</View>
//         </MaybeGestureRoot>
//       </AdaptiveModal>
//     </BottomSheetInternalContext.Provider>
//   );
// }

// // ─── BottomSheetDragArea ──────────────────────────────────────────────────────

// export function BottomSheetDragArea({
//   children,
//   className,
// }: BottomSheetDragAreaProps) {
//   const { panGesture } = React.useContext(BottomSheetInternalContext);

//   if (!panGesture) return <>{children}</>;

//   return (
//     <GestureDetector gesture={panGesture}>
//       <Animated.View className={className}>{children}</Animated.View>
//     </GestureDetector>
//   );
// }

// // ─── BottomSheetHeader ────────────────────────────────────────────────────────

// export function BottomSheetHeader({
//   children,
//   className,
// }: BottomSheetHeaderProps) {
//   return <View className={cn('px-4 pb-2', className)}>{children}</View>;
// }

// // ─── BottomSheetTitle ─────────────────────────────────────────────────────────

// export function BottomSheetTitle({
//   children,
//   className,
// }: BottomSheetTitleProps) {
//   return (
//     <Text variant="header" size="md" className={className}>
//       {children}
//     </Text>
//   );
// }

// // ─── BottomSheetDescription ───────────────────────────────────────────────────

// export function BottomSheetDescription({
//   children,
//   className,
// }: BottomSheetDescriptionProps) {
//   return (
//     <Text variant="muted" size="sm" className={cn('mt-2', className)}>
//       {children}
//     </Text>
//   );
// }

// // ─── BottomSheetBody ──────────────────────────────────────────────────────────

// export function BottomSheetBody({
//   children,
//   className,
//   scrollable,
// }: BottomSheetBodyProps) {
//   if (!scrollable) {
//     return <View className={cn('flex-1 px-4', className)}>{children}</View>;
//   }

//   return (
//     <ScrollView
//       className={cn('flex-1 px-4', className)}
//       showsVerticalScrollIndicator={false}
//       bounces={false}
//     >
//       {children}
//     </ScrollView>
//   );
// }

// // ─── BottomSheetList ──────────────────────────────────────────────────────────

// export function BottomSheetList<T>({
//   data,
//   renderItem,
//   keyExtractor,
//   variant = 'list',
//   onSelect,
//   selectedValue,
//   selectedValues = [],
//   getItemValue,
//   className,
//   onEndReached,
//   onEndReachedThreshold,
//   ListFooterComponent,
// }: BottomSheetListProps<T>) {
//   const [internalSelectedValues, setInternalSelectedValues] =
//     React.useState<any[]>(selectedValues);

//   const defaultKeyExtractor = (item: T, index: number) => {
//     if (typeof item === 'object' && item !== null && 'id' in item) {
//       return String((item as any).id);
//     }
//     return String(index);
//   };

//   const defaultGetItemValue = (item: T) => {
//     if (typeof item === 'object' && item !== null && 'value' in item) {
//       return (item as any).value;
//     }
//     return item;
//   };

//   const finalKeyExtractor = keyExtractor || defaultKeyExtractor;
//   const finalGetItemValue = getItemValue || defaultGetItemValue;

//   const handleSelect = (item: T) => {
//     const itemValue = finalGetItemValue(item);

//     if (variant === 'select') {
//       onSelect?.(item);
//     } else if (variant === 'multiple') {
//       const isSelected = internalSelectedValues.includes(itemValue);
//       const newSelected = isSelected
//         ? internalSelectedValues.filter((v) => v !== itemValue)
//         : [...internalSelectedValues, itemValue];

//       setInternalSelectedValues(newSelected);
//       const selectedItems = data.filter((d) =>
//         newSelected.includes(finalGetItemValue(d)),
//       );
//       onSelect?.(selectedItems as T[]);
//     } else {
//       onSelect?.(item);
//     }
//   };

//   const isItemSelected = (item: T) => {
//     const itemValue = finalGetItemValue(item);
//     if (variant === 'select') return selectedValue === itemValue;
//     if (variant === 'multiple') return internalSelectedValues.includes(itemValue);
//     return false;
//   };

//   const defaultRenderItem: ListRenderItem<T> = ({ item }) => {
//     const isSelected = isItemSelected(item);
//     const itemLabel =
//       typeof item === 'object' && item !== null && 'label' in item
//         ? (item as any).label
//         : String(item);

//     return (
//       <Pressable
//         onPress={() => handleSelect(item)}
//         className={cn(listItemVariants({ selected: isSelected }))}
//       >
//         <View className="flex-row items-center gap-3 flex-1">
//           {variant === 'select' && <Radio checked={isSelected} />}
//           {variant === 'multiple' && <Checkbox checked={isSelected} />}
//           <Text
//             variant="default"
//             size="md"
//             className={cn('flex-1', isSelected && 'text-primary font-semibold')}
//           >
//             {itemLabel}
//           </Text>
//         </View>

//         {variant === 'select' && isSelected && (
//           <Text className="text-primary font-bold">✓</Text>
//         )}
//       </Pressable>
//     );
//   };

//   const finalRenderItem = renderItem || defaultRenderItem;

//   return (
//     <FlatList
//       data={data}
//       renderItem={finalRenderItem}
//       keyExtractor={finalKeyExtractor}
//       className={cn('flex-1 px-0', className)}
//       showsVerticalScrollIndicator={false}
//       bounces={false}
//       onEndReached={onEndReached}
//       onEndReachedThreshold={onEndReachedThreshold}
//       ListFooterComponent={ListFooterComponent}
//     />
//   );
// }

// // ─── BottomSheetListItem ──────────────────────────────────────────────────────

// export function BottomSheetListItem({
//   children,
//   className,
// }: BottomSheetListItemProps) {
//   return (
//     <View className={cn('px-4 py-3 border-b border-border', className)}>
//       {children}
//     </View>
//   );
// }

// // ─── BottomSheetFooter ────────────────────────────────────────────────────────

// export function BottomSheetFooter({
//   children,
//   className,
// }: BottomSheetFooterProps) {
//   return (
//     <View
//       className={cn(
//         'absolute bottom-0 left-0 right-0 bg-card px-4 py-4 border-t border-border',
//         className,
//       )}
//     >
//       {children}
//     </View>
//   );
// }

// // ─── BottomSheetClose ─────────────────────────────────────────────────────────

// export function BottomSheetClose({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { onOpenChange } = useBottomSheet();

//   if (React.isValidElement(children)) {
//     return React.cloneElement(children as React.ReactElement<any>, {
//       onPress: () => onOpenChange(false),
//     });
//   }

//   return (
//     <Pressable onPress={() => onOpenChange(false)}>{children}</Pressable>
//   );
// }
