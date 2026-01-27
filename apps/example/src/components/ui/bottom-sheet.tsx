// components/ui/bottom-sheet.tsx
import * as React from 'react';
import {
  Modal,
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
  runOnJS,
  clamp,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Check } from 'lucide-react-native';
import { Checkbox } from './checkbox';
import { RadioGroupItem } from './radio-group';
import { Radio } from './radio';

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

// Bottom Sheet Variants
const bottomSheetVariants = cva(
  'rounded-t-3xl shadow-2xl h-full',
  {
    variants: {
      variant: {
        default: 'bg-card',
        filled: 'bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Drag Handle Variants
const dragHandleVariants = cva(
  'w-12 h-1.5 rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-muted-foreground/30',
        filled: 'bg-muted-foreground/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// List Item Variants
const listItemVariants = cva(
  'flex-row items-center justify-between px-4 py-3 border-b border-border',
  {
    variants: {
      selected: {
        true: 'bg-accent',
        false: 'bg-transparent',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
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
  variant: 'default' | 'filled';
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
        variant: sheetVariant
      }}
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
  const { open, onOpenChange, snapPoints, currentSnapPoint: defaultSnapPoint, variant } = useBottomSheet();

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

  const findClosestSnapPoint = (position: number, velocity: number) => {
    'worklet';

    const currentHeight = snapHeights[currentSnapIndex];

    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (velocity < 0 && currentSnapIndex < snapHeights.length - 1) {
        return currentSnapIndex + 1;
      } else if (velocity > 0 && currentSnapIndex > 0) {
        return currentSnapIndex - 1;
      }
    }

    const threshold = currentHeight * 0.3;

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
      const currentHeight = snapHeights[currentSnapIndex];
      const maxHeight = snapHeights[snapHeights.length - 1];

      if (dy < 0) {
        if (currentSnapIndex < snapHeights.length - 1) {
          const maxDrag = -(maxHeight - currentHeight);
          animatedPosition.value = clamp(dy, maxDrag, 0);
        } else {
          animatedPosition.value = dy * 0.15;
        }
      } else {
        if (currentSnapIndex > 0) {
          animatedPosition.value = dy;
        } else {
          const rubberband = Math.min(dy / (currentHeight * 0.5), 1);
          animatedPosition.value = dy * (1 - rubberband * 0.7);
        }
      }
    })
    .onEnd((event) => {
      const dy = event.translationY;
      const vy = event.velocityY;
      const currentHeight = snapHeights[currentSnapIndex];

      if (currentSnapIndex === 0 && (dy > currentHeight * 0.4 || vy > 1000)) {
        animatedPosition.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
        backdropOpacity.value = withSpring(0, SPRING_CONFIG);
        runOnJS(handleClose)();
        return;
      }

      const targetIndex = findClosestSnapPoint(dy, vy);

      if (targetIndex !== currentSnapIndex) {
        runOnJS(handleSnapChange)(targetIndex);
      }

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

    if (position < 0 && currentSnapIndex < snapHeights.length - 1) {
      const nextHeight = snapHeights[currentSnapIndex + 1];
      const maxDrag = nextHeight - currentHeight;

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
          translateY: position > 0 ? position : position * 0.1,
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
          <View className={cn(bottomSheetVariants({ variant }), className)}>
            {/* Drag Handle */}
            <GestureDetector gesture={panGesture}>
              <Animated.View className="items-center py-3">
                <View className={cn(dragHandleVariants({ variant }))} />
              </Animated.View>
            </GestureDetector>

            {/* Content */}
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
    <Text variant="header" size="md" className={className}>
      {children}
    </Text>
  );
}

export function BottomSheetDescription({ children, className }: BottomSheetDescriptionProps) {
  return (
    <Text variant="muted" size="sm" className={cn('mt-2', className)}>
      {children}
    </Text>
  );
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
        className={cn(listItemVariants({ selected: isSelected }))}
      >
        <View className="flex-row items-center gap-3 flex-1">
          {variant === 'select' && (
            <Radio checked={isSelected} />
          )}

          {variant === 'multiple' && (
            <Checkbox checked={isSelected} />
          )}

          <Text
            variant={isSelected ? 'default' : 'default'}
            size="md"
            className={cn(
              'flex-1',
              isSelected && 'text-primary font-semibold'
            )}
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
    />
  );
}

export function BottomSheetListItem({ children, className }: BottomSheetListItemProps) {
  return (
    <View className={cn('px-4 py-3 border-b border-border', className)}>
      {children}
    </View>
  );
}

export function BottomSheetFooter({ children, className }: BottomSheetFooterProps) {
  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-card px-4 py-4 border-t border-border',
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
