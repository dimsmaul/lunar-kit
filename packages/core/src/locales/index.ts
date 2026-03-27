/**
 * Translation Dictionary Type
 * 
 * Each locale JSON file should match this structure
 */
export interface TranslationDictionary {
  [category: string]: {
    [key: string]: string;
  };
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
  // This is a placeholder - actual implementation uses Zustand store
  // See @/lib/i18n for the full implementation
  throw new Error('useTranslation should be imported from @/lib/i18n or @/hooks/use-translation');
}

/**
 * Translation function (synchronous)
 * 
 * @example
 * ```ts
 * import { t } from '@/locales';
 * 
 * const message = t('en', 'common.greeting');
 * ```
 */
export function t(
  locale: string,
  key: string,
  params?: Record<string, string | number>,
): string {
  // This is a placeholder - actual implementation uses loaded locales
  // See @/lib/i18n for the full implementation
  return key;
}
