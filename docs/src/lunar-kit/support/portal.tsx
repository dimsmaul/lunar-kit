import * as React from 'react';
import { Platform } from 'react-native';
import { createPortal } from 'react-dom';

export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (Platform.OS === 'web') {
    if (!mounted) return null;
    if (typeof document === 'undefined') return null;
    
    return createPortal(
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>,
      document.body
    );
  }

  // On Native, we don't need a Portal if we are using Modal. 
  // But if this is used to wrap Modal content, we just return children.
  // However, the intention is to use this INSTEAD of Modal on web, 
  // and use Modal on native in the parent component.
  // OR, we can make this component Render the Modal on native.
  
  // For now, adhering to the plan where we replace Modal logic in the components.
  // If this Portal is used, it assumes "Escape the hierarchy".
  return <>{children}</>;
}
