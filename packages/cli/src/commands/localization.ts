import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig } from '../utils/helpers.js';

/**
 * Generate a new locale file (JSON format)
 * Usage: lunar g locale <lang>
 */
export async function generateLocale(lang: string) {
  const spinner = ora(`Generating locale: ${lang}...`).start();

  try {
    const config = await loadConfig();
    if (!config) {
      spinner.fail('kit.config.json not found. Run `lunar init` first.');
      return;
    }

    const localesDir = path.join(process.cwd(), config.localization?.localesDir || 'src/locales');
    await fs.ensureDir(localesDir);

    const targetFile = path.join(localesDir, `${lang}.json`);

    if (fs.existsSync(targetFile)) {
      spinner.fail(`Locale "${lang}" already exists at ${targetFile}`);
      return;
    }

    // Find existing locale to clone structure from
    const existingLocales = (await fs.readdir(localesDir))
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));

    let template: any;

    if (existingLocales.length > 0) {
      // Read first existing locale and create empty-value clone
      const sourceFile = path.join(localesDir, `${existingLocales[0]}.json`);
      const sourceContent = await fs.readJson(sourceFile);

      // Create clone with empty values
      template = cloneWithEmptyValues(sourceContent);
    } else {
      // No existing locale — create minimal template
      template = {
        common: {
          ok: '',
          cancel: '',
        },
        button: {
          submit: '',
        },
        message: {
          welcome: '',
        },
        label: {},
        error: {},
      };
    }

    await fs.writeJson(targetFile, template, { spaces: 2 });

    // Update kit.config.json
    if (!config.localization) {
      config.localization = {
        localesDir: 'src/locales',
        locales: [],
        defaultLocale: 'en',
      };
    }

    if (!config.localization.locales.includes(lang)) {
      config.localization.locales.push(lang);
    }

    const configPath = path.join(process.cwd(), 'kit.config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });

    // Generate i18n setup if not exists
    await generateI18nSetup(config);

    spinner.succeed(chalk.green(`Locale "${lang}" generated`));
    console.log(chalk.cyan(`  ${localesDir}/${lang}.json`));
    console.log(chalk.dim(`  → Fill in the translations in the JSON file`));
    console.log(chalk.yellow(`  → Run "lunar add locale update" to bulk-add translations`));

  } catch (error) {
    spinner.fail('Failed to generate locale');
    console.error(error);
  }
}

/**
 * Clone object with empty string values (keep structure)
 */
function cloneWithEmptyValues(obj: any): any {
  const result: any = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      result[key] = cloneWithEmptyValues(obj[key]);
    } else {
      result[key] = '';
    }
  }
  return result;
}

/**
 * Generate i18n setup files
 */
async function generateI18nSetup(config: any) {
  const srcDir = config.srcDir || 'src';
  const libDir = path.join(process.cwd(), srcDir, 'lib');
  const i18nPath = path.join(libDir, 'i18n.ts');

  if (await fs.pathExists(i18nPath)) {
    return;
  }

  await fs.ensureDir(libDir);

  const i18nContent = `/**
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
    const locale = await import(\`@/locales/\${lang}.json\`);
    loadedLocales[lang] = locale.default;
    return locale.default;
  } catch (error) {
    console.error(\`Failed to load locale: \${lang}\`, error);
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
  return value.replace(/\\{\\{(\\w+)\\}\\}/g, (_, paramKey) => {
    return String(params[paramKey] ?? \`{{\${paramKey}}}\`);
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
 */
export function useTranslation() {
  // Implement with Zustand store
  throw new Error('useTranslation should be implemented with Zustand store');
}
`;

  await fs.writeFile(i18nPath, i18nContent);

  // Update lib/index.ts barrel export
  const barrelPath = path.join(libDir, 'index.ts');
  let barrelContent = '';
  if (await fs.pathExists(barrelPath)) {
    barrelContent = await fs.readFile(barrelPath, 'utf-8');
  }

  if (!barrelContent.includes('i18n')) {
    barrelContent += `\nexport * from './i18n';\n`;
    await fs.writeFile(barrelPath, barrelContent);
  }

  console.log(chalk.dim('  Auto-created: ') + chalk.cyan(`${srcDir}/lib/i18n.ts`));
}

/**
 * Interactive: add a translation entry to all locale files
 * Usage: lunar add locale
 */
export async function addLocaleEntry() {
  try {
    const config = await loadConfig();
    if (!config) {
      console.log(chalk.red('kit.config.json not found. Run `lunar init` first.'));
      return;
    }

    const localesDir = path.join(process.cwd(), config.localization?.localesDir || 'src/locales');

    if (!fs.existsSync(localesDir)) {
      console.log(chalk.red('Locales directory not found. Initialize localization first.'));
      return;
    }

    // Discover existing locale files
    const localeFiles = (await fs.readdir(localesDir))
      .filter(f => f.endsWith('.json'));

    if (localeFiles.length === 0) {
      console.log(chalk.red('No locale files found. Run `lunar g locale <lang>` first.'));
      return;
    }

    const locales = localeFiles.map(f => f.replace('.json', ''));

    // Discover existing categories from first locale
    const firstLocaleContent = await fs.readJson(path.join(localesDir, localeFiles[0]));
    const existingCategories = Object.keys(firstLocaleContent);

    // Prompt: category
    const categoryResponse = await prompts({
      type: 'select',
      name: 'category',
      message: 'Category:',
      choices: [
        ...existingCategories.map(c => ({ title: c, value: c })),
        { title: chalk.green('+ Create new category'), value: '__new__' },
      ],
    });

    let category = categoryResponse.category;
    if (!category) return;

    if (category === '__new__') {
      const newCatResponse = await prompts({
        type: 'text',
        name: 'name',
        message: 'New category name:',
        validate: (v: string) => /^[a-z_]+$/.test(v) || 'Use lowercase with underscores',
      });
      category = newCatResponse.name;
      if (!category) return;
    }

    // Prompt: key name
    const keyResponse = await prompts({
      type: 'text',
      name: 'key',
      message: 'Key name:',
      validate: (v: string) => /^[a-z_]+$/.test(v) || 'Use lowercase with underscores (e.g., hello_world)',
    });

    const key = keyResponse.key;
    if (!key) return;

    // Prompt: translations for each locale
    console.log(chalk.dim('\nEnter translations for each language:'));

    const translations: Record<string, string> = {};
    for (const lang of locales) {
      const { value } = await prompts({
        type: 'text',
        name: 'value',
        message: `  ${lang}`,
      });
      if (value === undefined) return;
      translations[lang] = value;
    }

    // Write to each locale file
    const spinner = ora('Adding translations...').start();

    for (const lang of locales) {
      const filePath = path.join(localesDir, `${lang}.json`);
      let content = await fs.readJson(filePath);

      // Check if category exists
      if (!content[category]) {
        content[category] = {};
      }

      // Check if key already exists
      if (content[category][key]) {
        spinner.warn(chalk.yellow(`Key "${category}.${key}" already exists in ${lang}.json — updating`));
      }

      content[category][key] = translations[lang];

      await fs.writeJson(filePath, content, { spaces: 2 });
    }

    spinner.succeed(chalk.green(`Added "${category}.${key}" to ${locales.length} locale files`));

  } catch (error) {
    console.error(chalk.red('Failed to add locale entry'), error);
  }
}

/**
 * Update locale: Bulk add translations for a specific locale
 * Usage: lunar add locale update
 */
export async function updateLocaleTranslations() {
  try {
    const config = await loadConfig();
    if (!config) {
      console.log(chalk.red('kit.config.json not found. Run `lunar init` first.'));
      return;
    }

    const localesDir = path.join(process.cwd(), config.localization?.localesDir || 'src/locales');

    if (!fs.existsSync(localesDir)) {
      console.log(chalk.red('Locales directory not found.'));
      return;
    }

    const localeFiles = (await fs.readdir(localesDir))
      .filter(f => f.endsWith('.json'));

    if (localeFiles.length === 0) {
      console.log(chalk.red('No locale files found.'));
      return;
    }

    // Select which locale to update
    const locales = localeFiles.map(f => f.replace('.json', ''));
    
    const localeResponse = await prompts({
      type: 'select',
      name: 'locale',
      message: 'Which locale do you want to update?',
      choices: locales.map(lang => ({ title: lang, value: lang })),
    });

    const targetLocale = localeResponse.locale;
    if (!targetLocale) return;

    // Find reference locale (first one that's not the target)
    const referenceLocale = locales.find(l => l !== targetLocale) || locales[0];
    
    // Load reference locale to get all keys
    const referenceFile = path.join(localesDir, `${referenceLocale}.json`);
    const referenceContent = await fs.readJson(referenceFile);
    
    // Load target locale
    const targetFile = path.join(localesDir, `${targetLocale}.json`);
    let targetContent = await fs.readJson(targetFile);

    // Extract all keys from reference
    const allKeys = extractAllKeys(referenceContent);

    console.log(chalk.dim(`\nFound ${allKeys.length} keys to translate (from ${referenceLocale}.json)`));
    console.log(chalk.dim(`Target: ${targetLocale}.json\n`));

    const spinner = ora('Updating translations...').start();
    let updatedCount = 0;

    // Prompt for each key
    for (const keyPath of allKeys) {
      const currentValue = getNestedValue(targetContent, keyPath);
      
      // Skip if already has value
      if (currentValue && currentValue !== '') {
        spinner.text = `Skipping: ${chalk.cyan(keyPath)} (already translated)`;
        continue;
      }

      const referenceValue = getNestedValue(referenceContent, keyPath);
      
      spinner.stop();
      console.log(chalk.dim(`\nKey: ${chalk.cyan(keyPath)}`));
      console.log(chalk.dim(`Reference (${referenceLocale}): ${chalk.green(referenceValue || '(empty)')}`));
      
      const response = await prompts({
        type: 'text',
        name: 'value',
        message: `${targetLocale}:`,
        initial: '',
      });

      if (response.value === undefined) {
        spinner.start('Cancelled...');
        break;
      }

      setNestedValue(targetContent, keyPath, response.value);
      updatedCount++;
      
      spinner.start(`Updated ${updatedCount}/${allKeys.length} keys...`);
    }

    if (updatedCount > 0) {
      // Write updated content
      await fs.writeJson(targetFile, targetContent, { spaces: 2 });
      spinner.succeed(chalk.green(`Updated ${updatedCount} translations in ${targetLocale}.json`));
    } else {
      spinner.info(chalk.yellow('No translations updated'));
    }

  } catch (error) {
    console.error(chalk.red('Failed to update locale translations'), error);
  }
}

/**
 * Extract all dot-notation keys from an object
 */
function extractAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...extractAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get nested value using dot notation
 */
function getNestedValue(obj: any, keyPath: string): any {
  const parts = keyPath.split('.');
  let value: any = obj;
  
  for (const part of parts) {
    value = value?.[part];
  }
  
  return value;
}

/**
 * Set nested value using dot notation
 */
function setNestedValue(obj: any, keyPath: string, value: any) {
  const parts = keyPath.split('.');
  let current: any = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}
