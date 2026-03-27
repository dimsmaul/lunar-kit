/**
 * i18n Configuration
 *
 * Internationalization setup with JSON locale files
 */

import type { TranslationDictionary } from '@/locales';

// Auto-loaded locales
let loadedLocales: Record<string, TranslationDictionary> = {};

/**
 * Load a locale from JSON file
 */
export async function loadLocale(lang: string): Promise<TranslationDictionary | null> {
  if (loadedLocales[lang]) return loadedLocales[lang];

  try {
    const locale = await import(`@/locales/${lang}.json`);
    loadedLocales[lang] = locale.default;
    return locale.default;
  } catch (error) {
    console.error(`Failed to load locale: ${lang}`, error);
    return null;
  }
}

/**
 * Translation lookup
 */
export function t(
  locale: string,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = loadedLocales[locale];
  if (!dict) return key;

  // Support dot notation: "common.greeting"
  const parts = key.split('.');
  let value: any = dict;

  for (const part of parts) {
    value = value?.[part];
  }

  if (!value || typeof value !== 'string') return key;

  if (!params) return value;

  // Replace {{param}} placeholders
  return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
    return String(params[paramKey] ?? `{{${paramKey}}}`);
  });
}

/**
 * Pre-load all configured locales
 */
export async function initLocalization(defaultLocale: string) {
  await loadLocale(defaultLocale);
}

/**
 * Get available locales
 */
export function getAvailableLocales(): string[] {
  return Object.keys(loadedLocales);
}

/**
 * React Hook for Translations
 * 
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 * 
 * return <Text>{t('common.greeting')}</Text>;
 * ```
 */
export function useTranslation() {
  // This should be imported from @/hooks/use-translation or implemented with Zustand
  // Placeholder implementation
  throw new Error('useTranslation should be implemented with Zustand store');
}
