import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
}

interface ComponentInfo {
  name: string;
  pascalName: string;
  kebabName: string;
  props: PropInfo[];
  variants?: Record<string, { values: string[]; default?: string }>;
  description?: string;
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function extractProps(fileContent: string, componentName: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Find interface definition
  const interfacePattern = new RegExp(
    `export interface ${componentName}Props[^{]*\\{([^}]+)\\}`,
    's'
  );
  const match = fileContent.match(interfacePattern);

  if (!match) return props;

  const interfaceBody = match[1];

  // Match individual prop lines: propName?: Type; or propName: Type;
  const propPattern = /(\w+)\s*(\??):\s*([^;]+);/g;
  let propMatch;

  while ((propMatch = propPattern.exec(interfaceBody)) !== null) {
    const [, name, optional, type] = propMatch;
    const trimmedType = type.trim();
    const required = !optional;

    props.push({
      name,
      type: trimmedType,
      required,
      default: required ? undefined : 'undefined'
    });
  }

  return props;
}

function extractVariants(
  fileContent: string
): Record<string, { values: string[]; default?: string }> {
  const variants: Record<string, { values: string[]; default?: string }> = {};

  // Find cva definition
  const cvaPattern = /const\s+\w+Variants\s*=\s*cva\([^)]*,\s*\{([\s\S]*?)\}\s*\)/;
  const match = fileContent.match(cvaPattern);

  if (!match) return variants;

  const cvaBody = match[1];

  // Extract variants object with proper nesting
  const variantsMatch = cvaBody.match(/variants:\s*\{([\s\S]*)\}\s*,?\s*defaultVariants/);
  if (!variantsMatch) return variants;

  const variantsObj = variantsMatch[1];

  // Find variant keys like "variant: {", "size: {" etc. then extract values
  // Each variant key maps to an object with string values
  const lines = variantsObj.split('\n');
  let currentVariantName: string | null = null;
  let currentValues: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect variant name line: "variant: {" or "size: {"
    const variantKeyMatch = trimmed.match(/^(\w+):\s*\{/);
    if (variantKeyMatch) {
      // Save previous variant if any
      if (currentVariantName) {
        variants[currentVariantName] = { values: currentValues };
      }
      currentVariantName = variantKeyMatch[1];
      currentValues = [];
      continue;
    }

    // Detect end of this variant object
    if (trimmed === '},' || trimmed === '}') {
      if (currentVariantName) {
        variants[currentVariantName] = { values: currentValues };
      }
      currentVariantName = null;
      currentValues = [];
      continue;
    }

    // Extract value name from lines like: "default: 'bg-background border-border',"
    if (currentVariantName) {
      const valueMatch = trimmed.match(/^(\w+):/);
      if (valueMatch) {
        currentValues.push(valueMatch[1]);
      }
    }
  }

  // Extract default variants
  const defaultMatch = cvaBody.match(/defaultVariants:\s*\{([\s\S]*?)\}/);
  if (defaultMatch) {
    const defaultValues = defaultMatch[1];
    const defaultPattern = /(\w+):\s*['"`]?([^'"`},]+)['"`]?/g;
    let defMatch;
    while ((defMatch = defaultPattern.exec(defaultValues)) !== null) {
      const [, key, value] = defMatch;
      if (variants[key]) {
        variants[key].default = value.trim();
      }
    }
  }

  return variants;
}

function discoverComponents(coreDir: string): ComponentInfo[] {
  const uiDir = join(coreDir, 'src/components/ui');
  const files = readdirSync(uiDir).filter(
    f => f.endsWith('.tsx') && !['index.ts', 'index.tsx'].includes(f)
  );

  const components: ComponentInfo[] = [];

  for (const file of files) {
    const kebabName = file.replace('.tsx', '');
    const pascalName = kebabToPascal(kebabName);
    const filePath = join(uiDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Check if this file exports the component
    if (!content.includes(`export function ${pascalName}`) &&
        !content.includes(`export const ${pascalName}`)) {
      continue;
    }

    const props = extractProps(content, pascalName);
    const variants = extractVariants(content);

    components.push({
      name: kebabName,
      pascalName,
      kebabName,
      props,
      variants: Object.keys(variants).length > 0 ? variants : undefined
    });
  }

  return components;
}

function generateDemo(component: ComponentInfo): string {
  const { pascalName, kebabName } = component;
  const hasChildren = component.props.some(p => p.name === 'children');

  // Build demo JSX based on variants
  let demoJsx: string;
  let codeSnippet: string;

  if (component.variants?.variant?.values) {
    // Multiple variant examples
    demoJsx = `<View className="gap-2">\n        ${component.variants.variant.values
      .slice(0, 3)
      .map(v => {
        let jsx = `<${pascalName} variant="${v}"`;
        if (hasChildren) jsx += `>Example</${pascalName}>`;
        else jsx += ' />';
        return jsx;
      })
      .join('\n        ')}\n      </View>`;

    codeSnippet = `<${pascalName} variant="${component.variants.variant.default || component.variants.variant.values[0]}"`;
    if (hasChildren) codeSnippet += '>Example</' + pascalName + '>';
    else codeSnippet += ' />';
  } else {
    // Simple demo without variants
    codeSnippet = `<${pascalName}`;
    if (hasChildren) {
      codeSnippet += '>Example</' + pascalName + '>';
      demoJsx = `<View>\n        ${codeSnippet}\n      </View>`;
    } else {
      codeSnippet += ' />';
      demoJsx = `<View>\n        ${codeSnippet}\n      </View>`;
    }
  }

  return `'use client'

import Demonstration from '@/components/demontration'
import { ${pascalName} } from '@/lunar-kit/components/${kebabName}'
import { View } from 'react-native'
import React from 'react'

const ${pascalName}Demo = () => {
  return (
    <Demonstration components={
      ${demoJsx}
    } code={\`import { ${pascalName} } from '@/components/ui/${kebabName}'

const ${pascalName}Preview = () => {
  return (
    ${codeSnippet}
  )
}

export default ${pascalName}Preview\`}/>
  )
}

export default ${pascalName}Demo
`;
}

function generatePropsTable(component: ComponentInfo): string {
  let table = '| Prop | Type | Default | Description |\n';
  table += '|------|------|---------|-------------|\n';

  const addedProps = new Set<string>();

  // Add variant props first
  if (component.variants?.variant) {
    const values = component.variants.variant.values
      .map(v => `\`'${v}'\``)
      .join(' \\| ');
    const defaultVal = component.variants.variant.default || 'N/A';
    table += `| \`variant\` | ${values} | \`'${defaultVal}'\` | Visual style variant |\n`;
    addedProps.add('variant');
  }

  // Add other variant types
  for (const [variantName, variantData] of Object.entries(component.variants || {})) {
    if (variantName === 'variant') continue;
    const values = variantData.values.map(v => `\`'${v}'\``).join(' \\| ');
    const defaultVal = variantData.default || 'N/A';
    table += `| \`${variantName}\` | ${values} | \`'${defaultVal}'\` | — |\n`;
    addedProps.add(variantName);
  }

  // Add custom props
  for (const prop of component.props) {
    if (prop.name === 'className' || addedProps.has(prop.name)) continue;
    const required = prop.required ? ' (required)' : '';
    const defaultStr = prop.default || '—';
    table += `| \`${prop.name}\` | \`${prop.type}\` | ${defaultStr} | ${required} |\n`;
    addedProps.add(prop.name);
  }

  return table;
}

function generateMDX(component: ComponentInfo): string {
  const { pascalName, kebabName } = component;
  const propsTable = generatePropsTable(component);
  const hasChildren = component.props.some(p => p.name === 'children');

  const usageExample = hasChildren
    ? `<${pascalName}>Example</${pascalName}>`
    : `<${pascalName} />`;

  return `---
sidebar_position: 1
title: ${pascalName}
---
import ${pascalName}Demo from '@/demo/${pascalName}Demo'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

${pascalName} component for your UI needs.

<${pascalName}Demo />

## Installation

<DynamicCodeBlock lang="bash" code={\`lunar add ${kebabName}\`} />

## Usage

<DynamicCodeBlock lang="tsx" code={\`import { ${pascalName} } from '@lunar-kit/core';

export default function Example() {
  return ${usageExample};
}\`} />

## Examples

### Basic

<DynamicCodeBlock lang="tsx" code={\`${usageExample}\`} />

## Props

${propsTable}
---

Check [source](https://github.com/dimsmaul/lunar-kit/tree/main/packages/core/src/components/ui/${kebabName}.tsx).
`;
}

async function main() {
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');
  const dryRun = args.includes('--dry-run');
  const onlyIndex = args.indexOf('--only');
  const onlyComponent = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

  const coreDir = join(process.cwd(), 'packages/core');
  const docsDir = join(process.cwd(), 'docs');
  const demoDir = join(docsDir, 'src/demo');
  const mdxDir = join(docsDir, 'content/docs/components');

  console.log('📦 Discovering components...');
  const components = discoverComponents(coreDir);

  if (!components.length) {
    console.error('❌ No components found');
    process.exit(1);
  }

  let filtered = components;
  if (onlyComponent) {
    filtered = components.filter(c => c.kebabName === onlyComponent);
    if (!filtered.length) {
      console.error(`❌ Component "${onlyComponent}" not found`);
      process.exit(1);
    }
  }

  console.log(`✅ Found ${filtered.length} component(s)`);

  let demoCount = 0;
  let mdxCount = 0;

  for (const component of filtered) {
    const demoPath = join(demoDir, `${component.pascalName}Demo.tsx`);
    const mdxPath = join(mdxDir, `${component.kebabName}.mdx`);

    const demoExists = existsSync(demoPath);
    const mdxExists = existsSync(mdxPath);

    if (dryRun) {
      if (!demoExists || forceFlag) console.log(`  [DEMO] ${component.pascalName}Demo.tsx`);
      if (!mdxExists || forceFlag) console.log(`  [MDX]  ${component.kebabName}.mdx`);
      continue;
    }

    if (!demoExists || forceFlag) {
      const demo = generateDemo(component);
      writeFileSync(demoPath, demo);
      console.log(`✅ ${component.pascalName}Demo.tsx`);
      demoCount++;
    }

    if (!mdxExists || forceFlag) {
      const mdx = generateMDX(component);
      writeFileSync(mdxPath, mdx);
      console.log(`✅ ${component.kebabName}.mdx`);
      mdxCount++;
    }
  }

  if (dryRun) {
    console.log(`\n📋 Dry-run complete. ${filtered.length} component(s) would be processed.`);
  } else {
    console.log(`\n✨ Synced ${demoCount} demos and ${mdxCount} MDX files`);
  }
}

main().catch(console.error);
