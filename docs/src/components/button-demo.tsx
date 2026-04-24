'use client';

import React from 'react';

export interface ButtonDemoProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  showAll?: boolean;
}

export function ButtonDemo({
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  children = 'Button',
  showAll = false,
}: ButtonDemoProps) {
  // Note: This is a placeholder component. In a real setup with proper workspace linking,
  // this would render actual @lunar-kit/core Button components.
  // For now, we show a simple HTML button demo to avoid build issues.
  if (showAll) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: '100%' }}>
        <button style={btnStyle()} onClick={() => console.log('pressed')}>Default</button>
        <button style={{ ...btnStyle(), background: '#dc2626', color: 'white' }}>Destructive</button>
        <button style={{ ...btnStyle(), border: '1px solid #d1d5db', background: 'white' }}>Outline</button>
        <button style={{ ...btnStyle(), background: '#8b5cf6', color: 'white' }}>Secondary</button>
        <button style={{ ...btnStyle(), background: 'transparent', border: 'none' }}>Ghost</button>
        <button style={{ ...btnStyle(), background: 'transparent', border: 'none', color: '#3b82f6', textDecoration: 'underline' }}>Link</button>
      </div>
    );
  }

  const styles = getButtonStyles(variant, size, disabled);
  return (
    <button
      style={styles}
      disabled={disabled || loading}
      onClick={() => console.log('Button pressed')}
    >
      {children}
    </button>
  );
}

function btnStyle() {
  return {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };
}

function getButtonStyles(variant: string, size: string, disabled: boolean) {
  const baseStyles: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '4px 12px', fontSize: '12px' },
    default: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: '#3b82f6', color: 'white' },
    destructive: { background: '#dc2626', color: 'white' },
    outline: { border: '1px solid #d1d5db', background: 'white', color: '#1f2937' },
    secondary: { background: '#8b5cf6', color: 'white' },
    ghost: { background: 'transparent', color: '#1f2937' },
    link: { background: 'transparent', color: '#3b82f6', textDecoration: 'underline' },
  };

  return {
    ...baseStyles,
    ...(sizeStyles[size] || sizeStyles.default),
    ...(variantStyles[variant] || variantStyles.default),
  };
}
