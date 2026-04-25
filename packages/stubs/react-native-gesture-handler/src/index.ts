export {};

export const GestureHandlerRootView = (props: any) => props.children || null;
export const GestureDetector = (props: any) => props.children || null;
export const Gesture = { 
  Pan: () => ({ onStart: () => {}, onUpdate: () => {}, onEnd: () => {} }),
  Tap: () => ({}),
  LongPress: () => ({}),
};
export const State = { UNDETERMINED: 0, BEGAN: 1, CANCELLED: 2, FAILED: 3, ACTIVE: 4, END: 5 };
export const Directions = { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 };

// Native component spec placeholders (required by gesture handler)
const NoopComponent = () => null;
export const RNGestureHandlerButtonNativeComponent = NoopComponent;
export const RNGestureHandlerNativeViewComponent = NoopComponent;
export const RNGestureHandlerTapInteraction = NoopComponent;

export default { GestureHandlerRootView, Gesture, State, Directions };