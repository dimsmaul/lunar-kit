'use client';

import React from 'react';

export interface ComponentPreviewProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  background?: string;
}

/**
 * Component Preview Wrapper
 * 
 * Displays React Native components in a contained preview area with optional documentation
 */
export function ComponentPreview({
  title,
  description,
  children,
  className = '',
  height = 400,
  background = '#f5f5f5',
}: ComponentPreviewProps) {
  return (
    <div
      className={`my-8 rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}
    >
      {/* Header */}
      {(title || description) && (
        <div className="bg-white border-b border-gray-200 p-4">
          {title && <h4 className="font-semibold text-lg mb-1">{title}</h4>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      )}

      {/* Preview Container */}
      <div
        style={{
          background,
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflow: 'auto',
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple React Native Component Preview
 * 
 * Use this for quick component previews in MDX
 */
export function PreviewBox({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
