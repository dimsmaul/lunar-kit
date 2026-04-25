import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const missing = [
  'alert', 'breadcrumb', 'carousel', 'empty-state', 'input-otp',
  'progress', 'radio-group', 'search-bar', 'separator', 'skeleton',
  'slider', 'step-indicator', 'switch', 'toast', 'toaster'
];

function pascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateMDX(name: string): string {
  const Pascal = pascalCase(name);
  
  return `---
sidebar_position: 1
title: ${Pascal}
---
import ${Pascal}Demo from '@/demo/${Pascal}Demo'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

${Pascal} component for ${name.replace(/-/g, ' ')}.

<${Pascal}Demo />

## Installation

<DynamicCodeBlock lang="bash" code={\`lunar add ${name}\`} />

## Usage

<DynamicCodeBlock lang="tsx" code={\`import { ${Pascal} } from '@lunar-kit/core';

export default function Example() {
  return <${Pascal} />;
}\`} />

## Examples

### Basic

<DynamicCodeBlock lang="tsx" code={\`<${Pascal} />\`} />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | \`ReactNode\` | — | Component content |

---

Check [source](https://github.com/dimsmaul/lunar-kit/tree/main/packages/core/src/components/ui/${name}.tsx).
`;
}

async function main() {
  const docsDir = 'docs/content/docs/components';
  let updated = 0;

  for (const comp of missing) {
    const filePath = join(docsDir, `${comp}.mdx`);
    const mdx = generateMDX(comp);
    writeFileSync(filePath, mdx);
    console.log(`✅ ${comp}`);
    updated++;
  }

  console.log(`\n✨ Updated ${updated} MDX files with demos`);
}

main().catch(console.error);
