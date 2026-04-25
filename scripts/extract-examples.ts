import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface ComponentExample {
  component: string;
  imports: string[];
  usage: string;
  description: string;
}

function extractExampleFromView(filePath: string, componentName: string): ComponentExample | null {
  const content = readFileSync(filePath, 'utf-8');

  // Extract imports
  const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]@lunar-kit\/core['"]/);
  const imports = importMatch ? importMatch[1].split(',').map(s => s.trim()) : [];

  if (!imports.includes(componentName)) {
    return null;
  }

  // Extract JSX usage - look for return statement with component
  // Very basic - extract from return() to closing tag
  const componentPattern = new RegExp(
    `<${componentName}[\\s\\S]*?<\\/${componentName}>|<${componentName}[\\s\\S]*?/>`,
    'm'
  );
  const match = content.match(componentPattern);

  if (!match) {
    return null;
  }

  const usage = match[0].trim();

  // Get description from first Text variant="header" or Text after imports
  const descMatch = content.match(/<Text[^>]*variant="header"[^>]*>([^<]+)<\/Text>/);
  const description = descMatch ? descMatch[1] : `${componentName} component`;

  return {
    component: componentName,
    imports,
    usage,
    description
  };
}

function analyzeExamples() {
  const exampleDir = '/Users/dimasmaulana/Documents/personal/lunar-kit/lunar-kit/apps/example/src/modules/preview/view';
  const files = readdirSync(exampleDir).filter(f => f.endsWith('_view.tsx'));

  console.log('📚 Analyzing example views...\n');

  const examples: Record<string, ComponentExample> = {};

  for (const file of files) {
    const componentName = file
      .replace('_view.tsx', '')
      .split('-')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join('');

    const example = extractExampleFromView(join(exampleDir, file), componentName);

    if (example) {
      examples[componentName] = example;
      console.log(`✅ ${componentName}`);
      console.log(`   Usage: ${example.usage.substring(0, 80)}...`);
    } else {
      console.log(`⚠️  ${componentName} - no usage found`);
    }
  }

  console.log(`\n📊 Found ${Object.keys(examples).length} component examples\n`);
  console.log(JSON.stringify(examples, null, 2));
}

analyzeExamples();
