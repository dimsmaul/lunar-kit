import * as React from 'react';
import { View, Pressable, type ViewStyle, type PressableProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  useBottomSheetContext,
  useBottomSheetInternal,
  useBottomSheetRenderMode,
} from './bottom-sheet';

// ─── DragArea ────────────────────────────────────────────────────────────────

export interface BottomSheetDragAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Wraps children in a pan-gesture detector for dragging the sheet.
 * Tracks its own height for the sticky footer counter-animation.
 */
export function BottomSheetDragArea({ children, style }: BottomSheetDragAreaProps) {
  const { panGesture, dragAreaHeight } = useBottomSheetInternal();

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={style}
        onLayout={(e) => {
          dragAreaHeight.value = e.nativeEvent.layout.height;
        }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export interface BottomSheetTriggerProps extends PressableProps {
  children: React.ReactNode;
}

/**
 * Opens the bottom sheet when pressed.
 * Only renders in 'inline' mode (not duplicated inside the modal).
 */
export function BottomSheetTrigger({ children, ...props }: BottomSheetTriggerProps) {
  const mode = useBottomSheetRenderMode();
  const { onOpenChange } = useBottomSheetContext();

  // Do not render inside the modal — triggers live in the page only
  if (mode === 'modal') return null;

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

// ─── Close ───────────────────────────────────────────────────────────────────

export interface BottomSheetCloseProps extends PressableProps {
  children: React.ReactNode;
}

/**
 * Closes the bottom sheet when pressed.
 * Only renders in 'modal' mode.
 */
export function BottomSheetClose({ children, ...props }: BottomSheetCloseProps) {
  const mode = useBottomSheetRenderMode();
  const { onOpenChange } = useBottomSheetContext();

  // Only meaningful inside the sheet panel
  if (mode === 'inline') return null;

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => onOpenChange(false),
    });
  }

  return (
    <Pressable onPress={() => onOpenChange(false)} {...props}>
      {children}
    </Pressable>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

export interface BottomSheetContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

/**
 * Sheet panel content. Only renders inside the modal (render mode = 'modal').
 * In inline mode it returns null so nothing leaks into the page flow.
 */
export function BottomSheetContent({ children, style }: BottomSheetContentProps) {
  const mode = useBottomSheetRenderMode();

  // Hide in inline pass — only show inside the modal
  if (mode === 'inline') return null;

  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
}
