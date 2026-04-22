// Hook
export {
  useBottomSheet,
  type UseBottomSheetProps,
  type BottomSheetAnimation,
} from './hooks/use-bottom-sheet';

// Root component + contexts
export {
  BottomSheet,
  BottomSheetContext,
  BottomSheetInternalContext,
  BottomSheetRenderModeContext,
  useBottomSheetContext,
  useBottomSheetInternal,
  useBottomSheetRenderMode,
  type BottomSheetProps,
  type BottomSheetContextValue,
  type BottomSheetInternalContextValue,
  type BottomSheetRenderMode,
} from './components/bottom-sheet';

// Composable parts
export {
  BottomSheetDragArea,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  type BottomSheetDragAreaProps,
  type BottomSheetTriggerProps,
  type BottomSheetCloseProps,
  type BottomSheetContentProps,
} from './components/bottom-sheet-parts';
