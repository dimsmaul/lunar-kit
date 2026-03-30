import * as React from 'react';
import { Modal, View, Pressable, Dimensions, type ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useBottomSheet, type UseBottomSheetProps } from '../hooks/use-bottom-sheet';

export interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: string[];
  currentSnapPoint: number;
}

export interface BottomSheetInternalContextValue {
  animatedHeight: any;
  backdropOpacity: any;
  dismissTranslateY: any;
  dragAreaHeight: any;
  currentSnapIndex: any;
  panGesture: any;
  sheetAnimatedStyle: any;
  backdropAnimatedStyle: any;
  handleClose: () => void;
  lowestSnapHeight: number;
}

export const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(null);
export const BottomSheetInternalContext = React.createContext<BottomSheetInternalContextValue | null>(null);

export function useBottomSheetContext() {
  const context = React.useContext(BottomSheetContext);
  if (!context) {
    throw new Error('BottomSheet components must be used within BottomSheet');
  }
  return context;
}

export function useBottomSheetInternal() {
  const context = React.useContext(BottomSheetInternalContext);
  if (!context) {
    throw new Error('BottomSheet internal components must be used within BottomSheet');
  }
  return context;
}

export interface BottomSheetProps extends UseBottomSheetProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function BottomSheet({
  open,
  onOpenChange,
  snapPoints,
  defaultSnapPoint = 0,
  children,
  style,
}: BottomSheetProps) {
  const {
    animatedHeight,
    backdropOpacity,
    dismissTranslateY,
    dragAreaHeight,
    currentSnapIndex,
    panGesture,
    sheetAnimatedStyle,
    backdropAnimatedStyle,
    visible,
    handleClose,
  } = useBottomSheet({
    open,
    onOpenChange,
    snapPoints,
    defaultSnapPoint,
  });

  const snapHeights = React.useMemo(() => {
    return snapPoints.map((point) => {
      const percentage = parseInt(point) / 100;
      return Dimensions.get('window').height * percentage;
    });
  }, [snapPoints]);

  if (!visible) return null;

  return (
    <BottomSheetContext.Provider
      value={{
        open,
        onOpenChange,
        snapPoints,
        currentSnapPoint: defaultSnapPoint,
      }}
    >
      <BottomSheetInternalContext.Provider
        value={{
          animatedHeight,
          backdropOpacity,
          dismissTranslateY,
          dragAreaHeight,
          currentSnapIndex,
          panGesture,
          sheetAnimatedStyle,
          backdropAnimatedStyle,
          handleClose,
          lowestSnapHeight: snapHeights[0],
        }}
      >
        <Modal
          visible={visible}
          transparent
          animationType="none"
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
                  style,
                ]}
              >
                {children}
              </Animated.View>
            </View>
          </GestureHandlerRootView>
        </Modal>
      </BottomSheetInternalContext.Provider>
    </BottomSheetContext.Provider>
  );
}
