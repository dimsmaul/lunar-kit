import * as React from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Portal } from './portal';

export interface AdaptiveModalProps {
  /**
   * Controls whether the modal is visible.
   */
  visible: boolean;
  /**
   * Called when the backdrop is pressed or the back button is triggered.
   */
  onDismiss?: () => void;
  /**
   * Content to render inside the modal.
   */
  children: React.ReactNode;
  /**
   * Color of the backdrop overlay.
   * @default 'rgba(0,0,0,0.5)'
   */
  backdropColor?: string;
  /**
   * Whether pressing the backdrop closes the modal.
   * @default true
   */
  closeOnBackdropPress?: boolean;
  /**
   * Animation type for native Modal.
   * @default 'none'
   */
  animationType?: 'none' | 'fade' | 'slide';
  /**
   * Whether to render under the status bar on Android.
   * @default true
   */
  statusBarTranslucent?: boolean;
}

export interface AdaptiveModalRef {
  dismiss: () => void;
  present: () => void;
}

export const AdaptiveModal = React.forwardRef<AdaptiveModalRef, AdaptiveModalProps>(
  (
    {
      visible,
      onDismiss,
      children,
      backdropColor = 'rgba(0,0,0,0.5)',
      closeOnBackdropPress = true,
      animationType = 'none',
      statusBarTranslucent = true,
    },
    ref
  ) => {
    React.useImperativeHandle(ref, () => ({
      dismiss: () => onDismiss?.(),
      present: () => {
        // Controlled via `visible` prop
      },
    }));

    if (!visible) return null;

    // ── Web ────────────────────────────────────────────────────────────────
    if (Platform.OS === 'web') {
      return (
        <Portal>
          {/* Full-screen backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: backdropColor,
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Backdrop press layer (behind content) */}
            {closeOnBackdropPress && (
              <div
                onClick={onDismiss}
                style={{ position: 'absolute', inset: 0, zIndex: 0 }}
              />
            )}

            {/* Content slot — no forced centering; callers style themselves */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </div>
        </Portal>
      );
    }

    // ── Native ─────────────────────────────────────────────────────────────
    // Render a transparent Modal. Children own ALL layout — no wrapper Views
    // that could interfere with flex/absolute positioning or gesture handling.
    // Callers must provide their own backdrop and positioning.
    return (
      <Modal
        visible={visible}
        transparent
        animationType={animationType}
        statusBarTranslucent={statusBarTranslucent}
        onRequestClose={() => {
          if (closeOnBackdropPress) onDismiss?.();
        }}
      >
        {children}
      </Modal>
    );
  }
);

AdaptiveModal.displayName = 'AdaptiveModal';
