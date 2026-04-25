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

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

${Pascal} component description.

## Installation

\`\`\`bash
lunar add ${name}
\`\`\`

## Usage

\`\`\`tsx
import { ${Pascal} } from '@lunar-kit/core';

export default function Example() {
  return (
    <${Pascal}>
      Content here
    </${Pascal}>
  );
}
\`\`\`

## Props

| Prop | Type | Description |
|------|------|-------------|
| - | - | Add props documentation |

## Examples

### Basic

\`\`\`tsx
<${Pascal} />
\`\`\`

---

Check [source](https://github.com/dimsmaul/lunar-kit/tree/main/packages/core/src/components/ui/${name}.tsx).
`;
}

async function main() {
  const docsDir = 'docs/content/docs/components';
  let created = 0;

  for (const comp of missing) {
    const filePath = join(docsDir, `${comp}.mdx`);
    const mdx = generateMDX(comp);
    writeFileSync(filePath, mdx);
    console.log(`✅ ${comp}`);
    created++;
  }

  console.log(`\n✨ Created ${created} component docs`);
}

main().catch(console.error);
