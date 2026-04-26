import { useEffect, useState } from 'react';

// Default fallback colors in case CSS variables aren't available
const defaultColors = {
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  primary: '#0f172a',
  primaryForeground: '#f8fafc',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#ef4444',
  destructiveForeground: '#f8fafc',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#0f172a',
};

type ThemeColors = typeof defaultColors;

function getThemeColors(): ThemeColors {
  if (typeof window === 'undefined') return defaultColors;

  const styles = getComputedStyle(document.documentElement);
  
  function getVal(variable: string) {
    const value = styles.getPropertyValue(variable).trim();
    if (!value) return '';
    // If it's HSL (e.g. "222.2 84% 4.9%"), wrap it in hsl()
    if (value.includes(' ') && !value.startsWith('#') && !value.startsWith('rgb') && !value.startsWith('hsl')) {
        return `hsl(${value})`;
    }
    return value;
  }

  return {
    background: getVal('--background') || defaultColors.background,
    foreground: getVal('--foreground') || defaultColors.foreground,
    card: getVal('--card') || defaultColors.card,
    cardForeground: getVal('--card-foreground') || defaultColors.cardForeground,
    primary: getVal('--primary') || defaultColors.primary,
    primaryForeground: getVal('--primary-foreground') || defaultColors.primaryForeground,
    secondary: getVal('--secondary') || defaultColors.secondary,
    secondaryForeground: getVal('--secondary-foreground') || defaultColors.secondaryForeground,
    muted: getVal('--muted') || defaultColors.muted,
    mutedForeground: getVal('--muted-foreground') || defaultColors.mutedForeground,
    accent: getVal('--accent') || defaultColors.accent,
    accentForeground: getVal('--accent-foreground') || defaultColors.accentForeground,
    destructive: getVal('--destructive') || defaultColors.destructive,
    destructiveForeground: getVal('--destructive-foreground') || defaultColors.destructiveForeground,
    border: getVal('--border') || defaultColors.border,
    input: getVal('--input') || defaultColors.input,
    ring: getVal('--ring') || defaultColors.ring,
  };
}

export function useThemeColors() {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    // Initial fetch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColors(getThemeColors());

    // Observer for class changes on html element (for dark mode toggle)
    const observer = new MutationObserver(() => {
      setColors(getThemeColors());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => observer.disconnect();
  }, []);

  return { colors };
}
