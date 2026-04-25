import * as React from 'react';
import { Platform } from 'react-native';

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Portal component for rendering content outside the normal component tree.
 *
 * Web  → Uses React DOM `createPortal` to mount at `document.body`.
 * Native → Renders children inline (Modal handles portal-like elevation).
 */
export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (Platform.OS === 'web') {
    if (!mounted || typeof document === 'undefined') return null;

    try {
      const { createPortal } = require('react-dom') as typeof import('react-dom');
      return createPortal(<>{children}</>, document.body);
    } catch {
      // react-dom not available (e.g. SSR fallback)
      return <>{children}</>;
    }
  }

  return <>{children}</>;
}
