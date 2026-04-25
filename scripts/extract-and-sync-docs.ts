import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface ComponentExample {
  component: string;
  imports: string;
  usage: string;
  description: string;
}

function extractJSXFromReturn(content: string, componentName: string): string | null {
  // Look for component usage in return statements
  // Handle self-closing: <Component ... />
  // Handle nested: <Component ...>...</Component>

  // First try self-closing
  const selfClosingRegex = new RegExp(`<${componentName}[^>]*/>`, 'i');
  const selfMatch = content.match(selfClosingRegex);
  if (selfMatch) return selfMatch[0];

  // Then try nested (find opening tag and matching closing tag)
  const openingRegex = new RegExp(`<${componentName}[\\s\\S]*?[^/>]>`, 'i');
  const openingMatch = content.match(openingRegex);

  if (!openingMatch) return null;

  const openingTag = openingMatch[0];
  const openIndex = content.indexOf(openingTag);
  const afterOpening = content.substring(openIndex + openingTag.length);

  // Count nested tags
  let depth = 1;
  let closingIndex = 0;

  for (let i = 0; i < afterOpening.length; i++) {
    if (afterOpening.substring(i).startsWith(`<${componentName}`)) {
      depth++;
      i += componentName.length;
    } else if (afterOpening.substring(i).startsWith(`</${componentName}>`)) {
      depth--;
      if (depth === 0) {
        closingIndex = i + `</${componentName}>`.length;
        break;
      }
      i += componentName.length + 3;
    }
  }

  if (closingIndex === 0) return null;

  return (openingTag + afterOpening.substring(0, closingIndex)).trim();
}

function extractExampleFromView(viewFilePath: string, componentName: string): ComponentExample | null {
  try {
    const content = readFileSync(viewFilePath, 'utf-8');

    // Extract imports from '@lunar-kit/core'
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]@lunar-kit\/core['"]/);
    const allImports = importMatch ? importMatch[1] : '';

    if (!allImports.includes(componentName)) {
      return null;
    }

    // Extract JSX usage
    const usage = extractJSXFromReturn(content, componentName);
    if (!usage) return null;

    // Get description
    const descMatch = content.match(/<Text[^>]*variant="header"[^>]*>([^<]+)<\/Text>/);
    const description = descMatch ? descMatch[1].trim() : `${componentName} component`;

    return {
      component: componentName,
      imports: allImports,
      usage,
      description
    };
  } catch {
    return null;
  }
}

function generateDemoFromExample(component: string, example: ComponentExample): string {
  const importLines = example.imports
    .split(',')
    .map(i => i.trim())
    .filter(i => i && i !== component)
    .map(i => `  ${i}`)
    .join(',\n');

  return `'use client'

import Demonstration from '@/components/demontration'
import { ${component} } from '@/lunar-kit/components/${component.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}'
import { View } from 'react-native'
import React from 'react'
${importLines ? `import {${importLines}} from '@lunar-kit/core'` : ''}

const ${component}Demo = () => {
  const [state, setState] = React.useState<any>();

  return (
    <Demonstration components={
      <View className="items-center justify-center p-4">
        ${example.usage}
      </View>
    } code={\`import { ${component} } from '@/components/ui/${component.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}'

const ${component}Preview = () => {
  return (
    ${example.usage}
  )
}

export default ${component}Preview\`}/>
  )
}

export default ${component}Demo
`;
}

function main() {
  const exampleDir = '/Users/dimasmaulana/Documents/personal/lunar-kit/lunar-kit/apps/example/src/modules/preview/view';
  const exampleFiles = readdirSync(exampleDir).filter(f => f.endsWith('_view.tsx'));

  console.log('📚 Extracting real examples from apps/example...\n');

  const examples: Record<string, ComponentExample> = {};
  let found = 0;

  for (const file of exampleFiles) {
    const componentName = file
      .replace('_view.tsx', '')
      .split('-')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join('');

    const example = extractExampleFromView(join(exampleDir, file), componentName);
    if (example) {
      examples[componentName] = example;
      console.log(`✅ ${componentName}`);
      found++;
    }
  }

  console.log(`\n✨ Found ${found} component examples`);
  console.log('\nExamples ready to use:');
  Object.entries(examples).forEach(([name, ex]) => {
    console.log(`  ${name}: ${ex.usage.substring(0, 60)}...`);
  });
}

main();
