import { Dimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  clamp,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import * as React from 'react';

export interface UseBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: string[];
  defaultSnapPoint?: number;
}

export interface BottomSheetAnimation {
  animatedHeight: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  dismissTranslateY: SharedValue<number>;
  dragAreaHeight: SharedValue<number>;
  currentSnapIndex: SharedValue<number>;
  panGesture: ReturnType<typeof Gesture.Pan> | null;
  sheetAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  backdropAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  visible: boolean;
  handleClose: () => void;
}

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
};

export function useBottomSheet({
  open,
  onOpenChange,
  snapPoints,
  defaultSnapPoint = 0,
}: UseBottomSheetProps): BottomSheetAnimation {
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

  const panGesture = React.useMemo(() => {
    return Gesture.Pan()
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
            () => {
              runOnJS(handleClose)();
            }
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
  }, [snapHeights, animatedHeight, dismissTranslateY, backdropOpacity, currentSnapIndex, dragContext, handleClose]);

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
  }, [open, defaultSnapPoint, snapHeights, animatedHeight, dismissTranslateY, backdropOpacity, currentSnapIndex]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    transform: [{ translateY: dismissTranslateY.value }],
  }));

  return {
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
  };
}
