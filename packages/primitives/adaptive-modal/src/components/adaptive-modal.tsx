import * as React from 'react';
import { Modal, Platform, View, StyleSheet } from 'react-native';

export interface ModalConfig {
  backdropOpacity?: number;
  animationType?: 'none' | 'fade' | 'slide';
  transparent?: boolean;
  statusBarTranslucent?: boolean;
}

export interface AdaptiveModalProps {
  /**
   * Controls whether the modal is visible
   */
  visible: boolean;
  /**
   * Callback when modal is dismissed
   */
  onDismiss?: () => void;
  /**
   * Content to render inside the modal
   */
  children: React.ReactNode;
  /**
   * Custom backdrop styles
   */
  backdropStyle?: any;
  /**
   * Custom content styles
   */
  contentStyle?: any;
  /**
   * Whether to close on backdrop press
   * @default true
   */
  closeOnBackdropPress?: boolean;
  /**
   * Modal configuration options
   */
  config?: ModalConfig;
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
      backdropStyle,
      contentStyle,
      closeOnBackdropPress = true,
      config = {},
    },
    ref
  ) => {
    const {
      backdropOpacity = 0.5,
      animationType = Platform.OS === 'ios' ? 'fade' : 'slide',
      transparent = true,
      statusBarTranslucent = true,
    } = config;

    React.useImperativeHandle(ref, () => ({
      dismiss: () => {
        onDismiss?.();
      },
      present: () => {
        // Present is controlled via `visible` prop
      },
    }));

    if (!visible) return null;

    // Web: Use fixed positioning overlay
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.webBackdrop, backdropStyle, { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }]}>
          <View style={[styles.webContent, contentStyle]}>
            {children}
          </View>
          {closeOnBackdropPress && (
            <View
              style={styles.webBackdropOverlay}
              onStartShouldSetResponder={() => {
                onDismiss?.();
                return true;
              }}
            />
          )}
        </View>
      );
    }

    // Native: Use React Native Modal
    return (
      <Modal
        visible={visible}
        transparent={transparent}
        animationType={animationType}
        statusBarTranslucent={statusBarTranslucent}
        onRequestClose={() => {
          if (closeOnBackdropPress) {
            onDismiss?.();
          }
        }}
      >
        <View style={[styles.nativeBackdrop, backdropStyle, { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }]}>
          <View style={[styles.nativeContent, contentStyle]}>
            {children}
          </View>
        </View>
      </Modal>
    );
  }
);

AdaptiveModal.displayName = 'AdaptiveModal';

const styles = StyleSheet.create({
  webBackdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    maxWidth: 448,
    padding: 16,
  },
  webBackdropOverlay: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  nativeBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    maxWidth: 448,
    padding: 16,
  },
});
