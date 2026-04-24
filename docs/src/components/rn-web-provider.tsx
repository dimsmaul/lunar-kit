'use client';

import React, { ReactNode } from 'react';

/**
 * RN Web Provider Component
 * 
 * Sets up React Native Web for client-side rendering in Next.js/Fumadocs.
 * Enables Platform detection and Portal rendering for adaptive components.
 * 
 * Note: Relies on react-native-web being available globally (loaded via webpack alias)
 */
export function RNWebProvider({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    // Initialize React Native Web Platform detection at runtime
    if (typeof window !== 'undefined') {
      try {
        // Platform.OS should already be set by react-native or react-native-web
        // We just need to ensure it's 'web'
        const RN = (global as any)['@react-native'] || 
                   (global as any)['react-native'] ||
                   (window as any).ReactNative;
        
        if (RN?.Platform) {
          try {
            Object.defineProperty(RN.Platform, 'OS', {
              value: 'web',
              writable: false,
              configurable: true,
            });
          } catch {
            // Property might be read-only or already defined
            if (RN.Platform.OS !== 'web') {
              (RN.Platform as any).OS = 'web';
            }
          }
        }
      } catch (e) {
        // React Native not available - that's okay
        // Components will still render using standard DOM
      }
    }
  }, []);

  return <>{children}</>;
}

/**
 * Component Preview Provider
 * 
 * For individual component previews in MDX.
 * Wraps components in a flex container for proper layout.
 */
export function ComponentPreviewProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}
