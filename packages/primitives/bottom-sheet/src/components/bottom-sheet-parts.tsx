import * as React from 'react';
import { View, Pressable, type ViewStyle, type PressableProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useBottomSheetContext, useBottomSheetInternal } from './bottom-sheet';

export interface BottomSheetDragAreaProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function BottomSheetDragArea({
  children,
  style,
}: BottomSheetDragAreaProps) {
  const { panGesture } = useBottomSheetInternal();

  if (!panGesture) return <>{children}</>;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
}

export interface BottomSheetTriggerProps extends PressableProps {
  children: React.ReactNode;
}

export function BottomSheetTrigger({ children, ...props }: BottomSheetTriggerProps) {
  const { onOpenChange } = useBottomSheetContext();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(true),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(true)} {...props}>
      {children}
    </Pressable>
  );
}

export interface BottomSheetContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function BottomSheetContent({ children, style }: BottomSheetContentProps) {
  return (
    <View style={[{ flex: 1, paddingBottom: 80 }, style]}>
      {children}
    </View>
  );
}
