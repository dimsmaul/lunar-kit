import fs from 'fs-extra';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { loadConfig } from '../utils/helpers.js';

/**
 * Generate a new locale file
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

    const targetFile = path.join(localesDir, `${lang}.ts`);

    if (fs.existsSync(targetFile)) {
      spinner.fail(`Locale "${lang}" already exists at ${targetFile}`);
      return;
    }

    // Find existing locale to clone structure from
    const existingLocales = (await fs.readdir(localesDir))
      .filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'locale-store.ts')
      .map(f => f.replace('.ts', ''));

    let template: string;

    if (existingLocales.length > 0) {
      // Read first existing locale and create empty-value clone
      const sourceFile = path.join(localesDir, `${existingLocales[0]}.ts`);
      const sourceContent = await fs.readFile(sourceFile, 'utf-8');

      // Replace all string values with empty strings for translation
      template = sourceContent
        .replace(/from '\.\/index'/, `from './index'`)
        .replace(
          new RegExp(`const ${existingLocales[0]}`),
          `const ${lang}`,
        )
        .replace(
          new RegExp(`export default ${existingLocales[0]}`),
          `export default ${lang}`,
        )
        // Replace string values with TODO markers
        .replace(/: '([^']+)'/g, (match, value) => {
          // Keep {{param}} placeholders but clear the text
          if (value.includes('{{')) {
            return `: '${value}'`; // Keep parameterized strings as reference
          }
          return `: ''`; // Empty for translation
        });
    } else {
      // No existing locale — create minimal template
      template = `import type { TranslationDictionary } from './index';

const ${lang}: TranslationDictionary = {
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

export default ${lang};
`;
    }

    await fs.writeFile(targetFile, template, 'utf-8');

    // Update the locales/index.ts to register new locale
    await registerLocaleInIndex(localesDir, lang);

    // Update kit.config.json
    if (config.localization) {
      if (!config.localization.locales.includes(lang)) {
        config.localization.locales.push(lang);
        const configPath = path.join(process.cwd(), 'kit.config.json');
        await fs.writeJson(configPath, config, { spaces: 2 });
      }
    }

    spinner.succeed(chalk.green(`Locale "${lang}" generated`));
    console.log(chalk.cyan(`  ${localesDir}/${lang}.ts`));
    console.log(chalk.dim(`  → Fill in the translations, then use t('category.key') in your components`));

  } catch (error) {
    spinner.fail('Failed to generate locale');
    console.error(error);
  }
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
      .filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'locale-store.ts');

    if (localeFiles.length === 0) {
      console.log(chalk.red('No locale files found. Run `lunar g locale <lang>` first.'));
      return;
    }

    const locales = localeFiles.map(f => f.replace('.ts', ''));

    // Discover existing categories from first locale
    const firstLocaleContent = await fs.readFile(path.join(localesDir, localeFiles[0]), 'utf-8');
    const categoryMatches = firstLocaleContent.match(/^\s{2}(\w+):\s*\{/gm);
    const existingCategories = categoryMatches
      ? categoryMatches.map(m => m.trim().replace(/:\s*\{$/, ''))
      : [];

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
      const filePath = path.join(localesDir, `${lang}.ts`);
      let content = await fs.readFile(filePath, 'utf-8');

      const escapedValue = translations[lang].replace(/'/g, "\\'");

      // Check if category exists
      const categoryRegex = new RegExp(`(\\s{2}${category}:\\s*\\{)([^}]*)(\\})`);
      const categoryMatch = content.match(categoryRegex);

      if (categoryMatch) {
        // Category exists — add key before closing brace
        const existingKeys = categoryMatch[2];
        const newKey = `    ${key}: '${escapedValue}',\n`;

        // Check if key already exists
        if (existingKeys.includes(`${key}:`)) {
          spinner.warn(chalk.yellow(`Key "${category}.${key}" already exists in ${lang}.ts — skipping`));
          continue;
        }

        content = content.replace(
          categoryRegex,
          `$1${existingKeys}${newKey}  $3`,
        );
      } else {
        // Category doesn't exist — add before the closing of the object
        const newCategory = `  ${category}: {\n    ${key}: '${escapedValue}',\n  },\n`;
        // Insert before the final `};`
        content = content.replace(/^(\};)/m, `${newCategory}$1`);
      }

      await fs.writeFile(filePath, content, 'utf-8');
    }

    spinner.succeed(chalk.green(`Added "${category}.${key}" to ${locales.length} locale files`));

  } catch (error) {
    console.error(chalk.red('Failed to add locale entry'), error);
  }
}

/**
 * Register a new locale in the locales/index.ts
 */
async function registerLocaleInIndex(localesDir: string, lang: string) {
  const indexPath = path.join(localesDir, 'index.ts');
  if (!fs.existsSync(indexPath)) return;

  let content = await fs.readFile(indexPath, 'utf-8');

  const registerLine = `registerLocale('${lang}', () => import('./${lang}'));`;

  if (content.includes(registerLine)) return;

  // Find the last registerLocale line or the end of file
  const lastRegisterIndex = content.lastIndexOf('registerLocale(');
  if (lastRegisterIndex !== -1) {
    const lineEnd = content.indexOf('\n', lastRegisterIndex);
    content = content.slice(0, lineEnd + 1) + registerLine + '\n' + content.slice(lineEnd + 1);
  } else {
    // No registerLocale yet — add at end
    content += `\n${registerLine}\n`;
  }

  await fs.writeFile(indexPath, content, 'utf-8');
}
