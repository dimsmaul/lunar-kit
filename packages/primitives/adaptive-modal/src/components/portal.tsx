import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Portal component for rendering content outside the normal component hierarchy.
 * 
 * On Web: Uses React DOM createPortal to render content at the document body level.
 * On Native: Renders children inline as Modal handles the portal-like behavior.
 */
export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Web: Use createPortal for true portal behavior
  if (Platform.OS === 'web') {
    if (!mounted) return null;
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return null;

    try {
      // Dynamically import createPortal to avoid SSR issues
      const { createPortal } = require('react-dom') as typeof import('react-dom');
      
      return createPortal(
        <div style={styles.portalContainer}>
          {children}
        </div>,
        document.body
      );
    } catch {
      // Fallback if react-dom is not available
      return <>{children}</>;
    }
  }

  // Native: Render inline - Modal component handles the portal behavior
  return <>{children}</>;
}

const styles: any = {
  portalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
  },
};
