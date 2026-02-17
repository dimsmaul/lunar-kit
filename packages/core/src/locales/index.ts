import { useCallback } from 'react';
import { useLocaleStore } from '../stores/locale';

/**
 * Translation dictionary type
 * Each locale file exports this shape
 */
export interface TranslationDictionary {
  [category: string]: {
    [key: string]: string;
  };
}

/**
 * Available locale modules
 * This is auto-managed by the Lunar Kit CLI
 */
const localeModules: Record<string, () => Promise<{ default: TranslationDictionary }>> = {};

// Auto-register locale files from this directory
// CLI will add entries here like:
// localeModules['en'] = () => import('./en');
// localeModules['id'] = () => import('./id');

let loadedLocales: Record<string, TranslationDictionary> = {};

/**
 * Load a locale module
 */
export async function loadLocale(lang: string): Promise<TranslationDictionary | null> {
  if (loadedLocales[lang]) return loadedLocales[lang];

  const loader = localeModules[lang];
  if (!loader) return null;

  const mod = await loader();
  loadedLocales[lang] = mod.default;
  return mod.default;
}

/**
 * Synchronous translation lookup
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
  if (parts.length !== 2) return key;

  const [category, translationKey] = parts;
  const value = dict[category]?.[translationKey];
  if (!value) return key;

  if (!params) return value;

  // Replace {{param}} placeholders
  return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
    return String(params[paramKey] ?? `{{${paramKey}}}`);
  });
}

/**
 * React hook for translations
 *
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 *
 * return <Text>{t('common.greeting')}</Text>;
 * ```
 */
export function useTranslation() {
  const { locale, setLocale: _setLocale } = useLocaleStore();

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return t(locale, key, params);
    },
    [locale],
  );

  const setLocale = useCallback(
    async (lang: string) => {
      await loadLocale(lang);
      _setLocale(lang);
    },
    [_setLocale],
  );

  return {
    t: translate,
    locale,
    setLocale,
    availableLocales: Object.keys(localeModules),
  };
}

/**
 * Register a locale module
 * Called by generated locale files
 */
export function registerLocale(lang: string, loader: () => Promise<{ default: TranslationDictionary }>) {
  localeModules[lang] = loader;
}

/**
 * Pre-load a locale (call during app init)
 */
export async function initLocalization(defaultLocale: string) {
  await loadLocale(defaultLocale);
}
