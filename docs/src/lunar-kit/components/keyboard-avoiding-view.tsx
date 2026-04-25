import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

export interface KeyboardAvoidingViewProps extends ScrollViewProps {
  /**
   * Extra height to add above the keyboard.
   * @default 24
   */
  extraScrollHeight?: number;

  /**
   * Whether keyboard avoiding behavior is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Additional offset from the keyboard top.
   * @default 0
   */
  keyboardVerticalOffset?: number;
}

/**
 * A custom KeyboardAvoidingView built on top of ScrollView.
 *
 * - iOS: Uses `automaticallyAdjustKeyboardInsets` for native keyboard handling
 * - Android: Uses animated bottom padding to avoid the keyboard
 *
 * @example
 * ```tsx
 * <KeyboardAvoidingView className="flex-1 p-4">
 *   <Input label="Name" />
 *   <Input label="Email" />
 *   <Input label="Message" />
 * </KeyboardAvoidingView>
 * ```
 */
export function KeyboardAvoidingView({
  children,
  extraScrollHeight = 24,
  enabled = true,
  keyboardVerticalOffset = 0,
  contentContainerStyle,
  ...scrollViewProps
}: KeyboardAvoidingViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedPadding = useRef(new Animated.Value(0)).current;

  // Android: manual keyboard handling with animated padding
  useEffect(() => {
    if (!enabled || Platform.OS === 'ios') return;

    const showListener = Keyboard.addListener('keyboardDidShow', (event) => {
      Animated.timing(animatedPadding, {
        toValue: event.endCoordinates.height + keyboardVerticalOffset + extraScrollHeight,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(animatedPadding, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [enabled, animatedPadding, keyboardVerticalOffset, extraScrollHeight]);

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios' && enabled}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        { flexGrow: 1 },
        contentContainerStyle,
      ]}
      {...scrollViewProps}
    >
      {children}
      {Platform.OS !== 'ios' && (
        <Animated.View style={{ height: animatedPadding }} />
      )}
    </ScrollView>
  );
}

/**
 * A simpler variant that just adds keyboard-aware bottom padding
 * without ScrollView wrapping — useful when you already have a ScrollView.
 *
 * @example
 * ```tsx
 * <ScrollView>
 *   <Input label="Name" />
 *   <KeyboardSpacer />
 * </ScrollView>
 * ```
 */
export function KeyboardSpacer({
  extraHeight = 0,
  enabled = true,
}: {
  extraHeight?: number;
  enabled?: boolean;
}) {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(animatedHeight, {
        toValue: event.endCoordinates.height + extraHeight,
        duration: Platform.OS === 'ios' ? event.duration ?? 250 : 250,
        useNativeDriver: false,
      }).start();
    });

    const hideListener = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? event.duration ?? 250 : 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [enabled, animatedHeight, extraHeight]);

  return <Animated.View style={{ height: animatedHeight }} />;
}
