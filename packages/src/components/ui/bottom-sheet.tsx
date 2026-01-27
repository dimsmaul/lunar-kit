// components/ui/bottom-sheet.tsx
import * as React from 'react';
import {
  Modal,
  View,
  Text,
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
  runOnJS,
  clamp,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cn } from '@/lib/utils';

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

interface BottomSheetProps {
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
}

interface BottomSheetListItemProps {
  children: React.ReactNode;
  className?: string;
}

const BottomSheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: string[];
  currentSnapPoint: number;
} | null>(null);

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
}: BottomSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = controlledOnOpenChange || setInternalOpen;

  return (
    <BottomSheetContext.Provider
      value={{ open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
}

export function BottomSheetTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useBottomSheet();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(true),
    });
  }

  return <Pressable onPress={() => onOpenChange(true)}>{children}</Pressable>;
}

export function BottomSheetContent({ children, className }: BottomSheetContentProps) {
  const { open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint } = useBottomSheet();

  const [visible, setVisible] = React.useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = React.useState(defaultSnapPoint);

  const snapHeights = React.useMemo(() => {
    return snapPoints.map((point) => {
      const percentage = parseInt(point) / 100;
      return SCREEN_HEIGHT * percentage;
    });
  }, [snapPoints]);

  const animatedPosition = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSnapChange = React.useCallback((newIndex: number) => {
    setCurrentSnapIndex(newIndex);
  }, []);

  // Find closest snap point
  const findClosestSnapPoint = (position: number, velocity: number) => {
    'worklet';
    
    const currentHeight = snapHeights[currentSnapIndex];
    
    // Velocity-based prediction
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (velocity < 0 && currentSnapIndex < snapHeights.length - 1) {
        return currentSnapIndex + 1;
      } else if (velocity > 0 && currentSnapIndex > 0) {
        return currentSnapIndex - 1;
      }
    }
    
    // Position-based snapping
    const threshold = currentHeight * 0.3; // 30% threshold
    
    if (position < -threshold && currentSnapIndex < snapHeights.length - 1) {
      return currentSnapIndex + 1;
    } else if (position > threshold && currentSnapIndex > 0) {
      return currentSnapIndex - 1;
    }
    
    return currentSnapIndex;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const dy = event.translationY;
      
      // Clamp with rubberband effect
      const currentHeight = snapHeights[currentSnapIndex];
      const maxHeight = snapHeights[snapHeights.length - 1];
      
      if (dy < 0) {
        // Dragging up
        if (currentSnapIndex < snapHeights.length - 1) {
          // Allow smooth transition to next snap point
          const maxDrag = -(maxHeight - currentHeight);
          animatedPosition.value = clamp(dy, maxDrag, 0);
        } else {
          // Rubberband at top
          animatedPosition.value = dy * 0.15;
        }
      } else {
        // Dragging down
        if (currentSnapIndex > 0) {
          // Allow smooth transition
          animatedPosition.value = dy;
        } else {
          // Rubberband at bottom with progressive resistance
          const rubberband = Math.min(dy / (currentHeight * 0.5), 1);
          animatedPosition.value = dy * (1 - rubberband * 0.7);
        }
      }
    })
    .onEnd((event) => {
      const dy = event.translationY;
      const vy = event.velocityY;
      const currentHeight = snapHeights[currentSnapIndex];
      
      // Check if should close (only from lowest snap point)
      if (currentSnapIndex === 0 && (dy > currentHeight * 0.4 || vy > 1000)) {
        animatedPosition.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
        backdropOpacity.value = withSpring(0, SPRING_CONFIG);
        runOnJS(handleClose)();
        return;
      }
      
      // Find target snap point
      const targetIndex = findClosestSnapPoint(dy, vy);
      
      if (targetIndex !== currentSnapIndex) {
        runOnJS(handleSnapChange)(targetIndex);
      }
      
      // Spring back to position
      animatedPosition.value = withSpring(0, SPRING_CONFIG);
    });

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      setCurrentSnapIndex(defaultSnapPoint);

      animatedPosition.value = withSpring(0, SPRING_CONFIG);
      backdropOpacity.value = withSpring(1, SPRING_CONFIG);
    } else {
      animatedPosition.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
      backdropOpacity.value = withSpring(0, SPRING_CONFIG);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open, defaultSnapPoint]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => {
    const currentHeight = snapHeights[currentSnapIndex];
    const position = animatedPosition.value;
    
    let height = currentHeight;
    
    // Interpolate height smoothly when dragging between snap points
    if (position < 0 && currentSnapIndex < snapHeights.length - 1) {
      const nextHeight = snapHeights[currentSnapIndex + 1];
      const maxDrag = nextHeight - currentHeight;
      
      // Smooth interpolation
      const progress = clamp(Math.abs(position) / maxDrag, 0, 1);
      height = interpolate(
        progress,
        [0, 1],
        [currentHeight, nextHeight],
        Extrapolation.CLAMP
      );
    }
    
    return {
      height,
      transform: [
        {
          translateY: position > 0 ? position : position * 0.1, // Minimal movement when dragging up
        },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            backdropAnimatedStyle,
          ]}
        >
          <Pressable onPress={handleClose} style={{ flex: 1 }} />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
            sheetAnimatedStyle,
          ]}
        >
          <View className={cn('bg-white rounded-t-3xl shadow-2xl h-full', className)}>
            {/* Drag Handle */}
            <GestureDetector gesture={panGesture}>
              <Animated.View className="items-center py-3">
                <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
              </Animated.View>
            </GestureDetector>

            {/* Content with padding for footer */}
            <View className="flex-1 pb-20">
              {children}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function BottomSheetHeader({ children, className }: BottomSheetHeaderProps) {
  return <View className={cn('px-4 pb-2', className)}>{children}</View>;
}

export function BottomSheetTitle({ children, className }: BottomSheetTitleProps) {
  return (
    <Text className={cn('text-2xl font-semibold text-slate-900', className)}>{children}</Text>
  );
}

export function BottomSheetDescription({ children, className }: BottomSheetDescriptionProps) {
  return <Text className={cn('text-sm text-slate-500 mt-2', className)}>{children}</Text>;
}

export function BottomSheetBody({ children, className, scrollable }: BottomSheetBodyProps) {
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
      let newSelected: any[];

      if (isSelected) {
        newSelected = internalSelectedValues.filter((v) => v !== itemValue);
      } else {
        newSelected = [...internalSelectedValues, itemValue];
      }

      setInternalSelectedValues(newSelected);

      const selectedItems = data.filter((d) => newSelected.includes(finalGetItemValue(d)));
      onSelect?.(selectedItems as T[]);
    } else {
      onSelect?.(item);
    }
  };

  const isItemSelected = (item: T) => {
    const itemValue = finalGetItemValue(item);

    if (variant === 'select') {
      return selectedValue === itemValue;
    } else if (variant === 'multiple') {
      return internalSelectedValues.includes(itemValue);
    }
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
        className={cn(
          'flex-row items-center justify-between px-4 py-3 border-b border-slate-100',
          isSelected && 'bg-blue-50'
        )}
      >
        <View className="flex-row items-center gap-3 flex-1">
          {variant === 'select' && (
            <View
              className={cn(
                'h-5 w-5 rounded-full border-2 items-center justify-center',
                isSelected ? 'border-blue-600' : 'border-slate-300'
              )}
            >
              {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
            </View>
          )}

          {variant === 'multiple' && (
            <View
              className={cn(
                'h-5 w-5 rounded border-2 items-center justify-center',
                isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
              )}
            >
              {isSelected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
          )}

          <Text
            className={cn(
              'text-base flex-1',
              isSelected ? 'text-blue-600 font-semibold' : 'text-slate-900'
            )}
          >
            {itemLabel}
          </Text>
        </View>

        {variant === 'select' && isSelected && (
          <Text className="text-blue-600 font-bold">✓</Text>
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
    />
  );
}

export function BottomSheetListItem({ children, className }: BottomSheetListItemProps) {
  return <View className={cn('px-4 py-3 border-b border-slate-100', className)}>{children}</View>;
}

export function BottomSheetFooter({ children, className }: BottomSheetFooterProps) {
  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-slate-200',
        className
      )}
    >
      {children}
    </View>
  );
}

export function BottomSheetClose({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = useBottomSheet();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(false),
    });
  }

  return <Pressable onPress={() => onOpenChange(false)}>{children}</Pressable>;
}


// /**
//  * FIXME: BottomSheet component with snap points and drag-to-resize functionality.
//  */


// /**
//  * BottomSheet component with snap points and drag-to-resize functionality.
//  * Features:
//  * - Multiple snap points support
//  * - Smooth drag gestures
//  * - Scrollable content area only (header & footer fixed)
//  * - Footer stays at bottom when content is short
//  */

// import * as React from 'react';
// import { Modal, View, Text, Pressable, Animated, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, ScrollView, ListRenderItem, FlatList } from 'react-native';
// import { cn } from '../../lib/utils';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// const SNAP_THRESHOLD = 80;
// const VELOCITY_THRESHOLD = 0.5;
// const CLOSE_THRESHOLD = 0.4;

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// interface BottomSheetProps {
//     open?: boolean;
//     onOpenChange?: (open: boolean) => void;
//     children: React.ReactNode;
//     snapPoints?: string[];
//     defaultSnapPoint?: number;
// }

// interface BottomSheetContentProps {
//     children: React.ReactNode;
//     className?: string;
// }

// interface BottomSheetHeaderProps {
//     children: React.ReactNode;
//     className?: string;
// }

// interface BottomSheetTitleProps {
//     children: React.ReactNode;
//     className?: string;
// }

// interface BottomSheetDescriptionProps {
//     children: React.ReactNode;
//     className?: string;
// }

// interface BottomSheetFooterProps {
//     children: React.ReactNode;
//     className?: string;
// }

// // DONE: Add BottomSheetBody for scrollable content
// interface BottomSheetBodyProps {
//     children: React.ReactNode;
//     className?: string;
//     scrollable?: boolean;
// }

// interface BottomSheetListProps<T> {
//     data: T[];
//     renderItem?: ListRenderItem<T>;
//     keyExtractor?: (item: T, index: number) => string;
//     variant?: 'list' | 'select' | 'multiple';
//     onSelect?: (selected: T | T[] | null) => void;
//     selectedValue?: any; // for single select
//     selectedValues?: any[]; // for multiple select
//     getItemValue?: (item: T) => any; // to extract value from item
//     className?: string;
// }

// interface BottomSheetListItemProps {
//     children: React.ReactNode;
//     className?: string;
// }


// const BottomSheetContext = React.createContext<{
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     snapPoints: string[];
//     currentSnapPoint: number;
// } | null>(null);

// function useBottomSheet() {
//     const context = React.useContext(BottomSheetContext);
//     if (!context) {
//         throw new Error('BottomSheet components must be used within BottomSheet');
//     }
//     return context;
// }

// export function BottomSheet({
//     open: controlledOpen,
//     onOpenChange: controlledOnOpenChange,
//     children,
//     snapPoints = ['50%'],
//     defaultSnapPoint = 0,
// }: BottomSheetProps) {
//     const [internalOpen, setInternalOpen] = React.useState(false);

//     const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
//     const onOpenChange = controlledOnOpenChange || setInternalOpen;

//     return (
//         <BottomSheetContext.Provider value={{ open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint }}>
//             {children}
//         </BottomSheetContext.Provider>
//     );
// }

// export function BottomSheetTrigger({ children }: { children: React.ReactNode }) {
//     const { onOpenChange } = useBottomSheet();

//     if (React.isValidElement(children)) {
//         return React.cloneElement(children as React.ReactElement<any>, {
//             onPress: () => onOpenChange(true),
//         });
//     }

//     return (
//         <Pressable onPress={() => onOpenChange(true)}>
//             {children}
//         </Pressable>
//     );
// }

// export function BottomSheetContent({ children, className }: BottomSheetContentProps) {
//     const { open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint } = useBottomSheet();

//     const [visible, setVisible] = React.useState(false);
//     const [currentSnapIndex, setCurrentSnapIndex] = React.useState(defaultSnapPoint);

//     const snapHeights = React.useMemo(() => {
//         return snapPoints.map(point => {
//             const percentage = parseInt(point) / 100;
//             return SCREEN_HEIGHT * percentage;
//         });
//     }, [snapPoints]);

//     const currentHeight = snapHeights[currentSnapIndex];

//     const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
//     const backdropOpacity = React.useRef(new Animated.Value(0)).current;

//     const panResponder = React.useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, gestureState) => {
//                 return Math.abs(gestureState.dy) > 5;
//             },
//             onPanResponderMove: (_, gestureState) => {
//                 const { dy } = gestureState;

//                 if (dy > 0) {
//                     translateY.setValue(dy);
//                 } else {
//                     const clampedDy = Math.max(dy, -50);
//                     translateY.setValue(clampedDy);
//                 }
//             },
//             onPanResponderRelease: (_, gestureState) => {
//                 const { dy, vy } = gestureState;

//                 if (currentSnapIndex === 0 && (dy > currentHeight * CLOSE_THRESHOLD || vy > VELOCITY_THRESHOLD)) {
//                     onOpenChange(false);
//                     return;
//                 }

//                 if (dy < -30 || vy < -VELOCITY_THRESHOLD) {
//                     if (currentSnapIndex < snapHeights.length - 1) {
//                         LayoutAnimation.configureNext(
//                             LayoutAnimation.create(
//                                 300,
//                                 LayoutAnimation.Types.easeInEaseOut,
//                                 LayoutAnimation.Properties.scaleXY
//                             )
//                         );
//                         setCurrentSnapIndex(currentSnapIndex + 1);
//                     }

//                     Animated.spring(translateY, {
//                         toValue: 0,
//                         useNativeDriver: true,
//                         tension: 80,
//                         friction: 10,
//                     }).start();
//                 }
//                 else if (dy > SNAP_THRESHOLD || vy > VELOCITY_THRESHOLD) {
//                     if (currentSnapIndex > 0) {
//                         LayoutAnimation.configureNext(
//                             LayoutAnimation.create(
//                                 300,
//                                 LayoutAnimation.Types.easeInEaseOut,
//                                 LayoutAnimation.Properties.scaleXY
//                             )
//                         );
//                         setCurrentSnapIndex(currentSnapIndex - 1);

//                         Animated.spring(translateY, {
//                             toValue: 0,
//                             useNativeDriver: true,
//                             tension: 80,
//                             friction: 10,
//                         }).start();
//                     } else {
//                         onOpenChange(false);
//                     }
//                 }
//                 else {
//                     Animated.spring(translateY, {
//                         toValue: 0,
//                         useNativeDriver: true,
//                         tension: 80,
//                         friction: 10,
//                     }).start();
//                 }
//             },
//         })
//     ).current;

//     React.useEffect(() => {
//         if (open) {
//             setVisible(true);
//             setCurrentSnapIndex(defaultSnapPoint);

//             Animated.parallel([
//                 Animated.spring(translateY, {
//                     toValue: 0,
//                     useNativeDriver: true,
//                     tension: 80,
//                     friction: 10,
//                 }),
//                 Animated.timing(backdropOpacity, {
//                     toValue: 1,
//                     duration: 250,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         } else {
//             Animated.parallel([
//                 Animated.timing(translateY, {
//                     toValue: SCREEN_HEIGHT,
//                     duration: 250,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(backdropOpacity, {
//                     toValue: 0,
//                     duration: 250,
//                     useNativeDriver: true,
//                 }),
//             ]).start(() => {
//                 setVisible(false);
//             });
//         }
//     }, [open]);

//     if (!visible) return null;

//     return (
//         <Modal
//             visible={visible}
//             transparent
//             animationType="none"
//             onRequestClose={() => onOpenChange(false)}
//         >
//             <View style={{ flex: 1 }}>
//                 <Animated.View
//                     style={{
//                         flex: 1,
//                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                         opacity: backdropOpacity,
//                     }}
//                 >
//                     <Pressable
//                         onPress={() => onOpenChange(false)}
//                         style={{ flex: 1 }}
//                     />
//                 </Animated.View>

//                 <Animated.View
//                     style={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         height: currentHeight,
//                         transform: [{ translateY }],
//                     }}
//                 >
//                     {/* DONE: Flexbox layout untuk fixed header/footer */}
//                     <View
//                         className={cn(
//                             'bg-white rounded-t-3xl shadow-2xl h-full flex-col',
//                             className
//                         )}
//                     >
//                         {/* Drag Handle - Fixed */}
//                         <View className="items-center py-3" {...panResponder.panHandlers}>
//                             <View className="w-12 h-1 bg-slate-300 rounded-full" />
//                         </View>

//                         {/* DONE: Children akan di-render langsung (header, body, footer) */}
//                         {children}
//                     </View>
//                 </Animated.View>
//             </View>
//         </Modal>
//     );
// }

// export function BottomSheetHeader({ children, className }: BottomSheetHeaderProps) {
//     return (
//         <View className={cn('px-4 pb-2', className)}>
//             {children}
//         </View>
//     );
// }

// export function BottomSheetTitle({ children, className }: BottomSheetTitleProps) {
//     return (
//         <Text className={cn('text-2xl font-semibold text-slate-900', className)}>
//             {children}
//         </Text>
//     );
// }

// export function BottomSheetDescription({ children, className }: BottomSheetDescriptionProps) {
//     return (
//         <Text className={cn('text-sm text-slate-500 mt-2', className)}>
//             {children}
//         </Text>
//     );
// }

// // DONE: New BottomSheetBody component for scrollable content
// export function BottomSheetBody({ children, className, scrollable }: BottomSheetBodyProps) {

//     if (!scrollable) {
//         return (
//             <View className={cn('flex-1 px-4', className)}>
//                 {children}
//             </View>
//         );
//     }

//     return (
//         <ScrollView
//             className={cn('flex-1 px-4', className)}
//             showsVerticalScrollIndicator={false}
//             bounces={false}
//         >
//             {children}
//         </ScrollView>
//     );
// }

// export function BottomSheetList<T>({
//     data,
//     renderItem,
//     keyExtractor,
//     variant = 'list',
//     onSelect,
//     selectedValue,
//     selectedValues = [],
//     getItemValue,
//     className,
// }: BottomSheetListProps<T>) {
//     const [internalSelectedValues, setInternalSelectedValues] = React.useState<any[]>(selectedValues);

//     // Default keyExtractor
//     const defaultKeyExtractor = (item: T, index: number) => {
//         if (typeof item === 'object' && item !== null && 'id' in item) {
//             return String((item as any).id);
//         }
//         return String(index);
//     };

//     // Default getItemValue
//     const defaultGetItemValue = (item: T) => {
//         if (typeof item === 'object' && item !== null && 'value' in item) {
//             return (item as any).value;
//         }
//         return item;
//     };

//     const finalKeyExtractor = keyExtractor || defaultKeyExtractor;
//     const finalGetItemValue = getItemValue || defaultGetItemValue;

//     // Handle selection
//     const handleSelect = (item: T) => {
//         const itemValue = finalGetItemValue(item);

//         if (variant === 'select') {
//             // Single select
//             onSelect?.(item);
//         } else if (variant === 'multiple') {
//             // Multiple select
//             const isSelected = internalSelectedValues.includes(itemValue);
//             let newSelected: any[];

//             if (isSelected) {
//                 newSelected = internalSelectedValues.filter(v => v !== itemValue);
//             } else {
//                 newSelected = [...internalSelectedValues, itemValue];
//             }

//             setInternalSelectedValues(newSelected);

//             // Return selected items
//             const selectedItems = data.filter(d => newSelected.includes(finalGetItemValue(d)));
//             onSelect?.(selectedItems as T[]);
//         } else {
//             // Plain list - just callback
//             onSelect?.(item);
//         }
//     };

//     // Check if item is selected
//     const isItemSelected = (item: T) => {
//         const itemValue = finalGetItemValue(item);

//         if (variant === 'select') {
//             return selectedValue === itemValue;
//         } else if (variant === 'multiple') {
//             return internalSelectedValues.includes(itemValue);
//         }
//         return false;
//     };

//     // Default render item
//     const defaultRenderItem: ListRenderItem<T> = ({ item }) => {
//         const isSelected = isItemSelected(item);
//         const itemValue = finalGetItemValue(item);
//         const itemLabel = typeof item === 'object' && item !== null && 'label' in item
//             ? (item as any).label
//             : String(item);

//         return (
//             <Pressable
//                 onPress={() => handleSelect(item)}
//                 className={cn(
//                     'flex-row items-center justify-between px-4 py-3 border-b border-slate-100',
//                     isSelected && 'bg-blue-50'
//                 )}
//             >
//                 <View className="flex-row items-center gap-3 flex-1">
//                     {/* Radio or Checkbox based on variant */}
//                     {variant === 'select' && (
//                         <View
//                             className={cn(
//                                 'h-5 w-5 rounded-full border-2 items-center justify-center',
//                                 isSelected ? 'border-blue-600' : 'border-slate-300'
//                             )}
//                         >
//                             {isSelected && (
//                                 <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />
//                             )}
//                         </View>
//                     )}

//                     {variant === 'multiple' && (
//                         <View
//                             className={cn(
//                                 'h-5 w-5 rounded border-2 items-center justify-center',
//                                 isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
//                             )}
//                         >
//                             {isSelected && (
//                                 <Text className="text-white text-xs font-bold">✓</Text>
//                             )}
//                         </View>
//                     )}

//                     {/* Label */}
//                     <Text
//                         className={cn(
//                             'text-base flex-1',
//                             isSelected ? 'text-blue-600 font-semibold' : 'text-slate-900'
//                         )}
//                     >
//                         {itemLabel}
//                     </Text>
//                 </View>

//                 {/* Checkmark for selected (except multiple, already has checkbox) */}
//                 {variant === 'select' && isSelected && (
//                     <Text className="text-blue-600 font-bold">✓</Text>
//                 )}
//             </Pressable>
//         );
//     };

//     const finalRenderItem = renderItem || defaultRenderItem;

//     return (
//         <FlatList
//             data={data}
//             renderItem={finalRenderItem}
//             keyExtractor={finalKeyExtractor}
//             className={cn('flex-1 px-0', className)}
//             showsVerticalScrollIndicator={false}
//             bounces={false}
//         />
//     );
// }

// // DONE: BottomSheetListItem for custom rendering
// export function BottomSheetListItem({ children, className }: BottomSheetListItemProps) {
//     return (
//         <View className={cn('px-4 py-3 border-b border-slate-100', className)}>
//             {children}
//         </View>
//     );
// }

// export function BottomSheetFooter({ children, className }: BottomSheetFooterProps) {
//     return (
//         <View className={cn('px-4 pt-4 pb-4', className)}>
//             {children}
//         </View>
//     );
// }

// export function BottomSheetClose({ children }: { children: React.ReactNode }) {
//     const { onOpenChange } = useBottomSheet();

//     if (React.isValidElement(children)) {
//         return React.cloneElement(children as React.ReactElement<any>, {
//             onPress: () => onOpenChange(false),
//         });
//     }

//     return (
//         <Pressable onPress={() => onOpenChange(false)}>
//             {children}
//         </Pressable>
//     );
// }
