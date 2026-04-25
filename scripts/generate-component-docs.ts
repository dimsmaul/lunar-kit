import fs from 'fs-extra';
import path from 'node:path';
import { execSync } from 'node:child_process';

const COMPONENTS_DIR = path.join(process.cwd(), 'packages/core/src/components/ui');
const DOCS_DIR = path.join(process.cwd(), 'docs/content/docs/components');
const DEMO_DIR = path.join(process.cwd(), 'docs/src/demo');
const REGISTRY_DIR = path.join(process.cwd(), 'packages/core/src/registry/ui');

interface ComponentProp {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentMeta {
  name: string;
  description: string;
  props: ComponentProp[];
}

/**
 * Extract JSDoc description from file
 */
function extractDescription(content: string): string {
  const match = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n\s*\*\//s);
  return match ? match[1].trim() : '';
}

/**
 * Extract component props from TypeScript interface
 */
function extractProps(content: string, componentName: string): ComponentProp[] {
  const interfaceName = `${componentName}Props`;
  const regex = new RegExp(
    `interface ${interfaceName}\\s*\\{([^}]+)\\}`,
    's'
  );
  const match = content.match(regex);
  if (!match) return [];

  const propsText = match[1];
  const props: ComponentProp[] = [];

  // Parse each prop line
  const lines = propsText.split('\n').filter(l => l.trim());
  for (const line of lines) {
    const propMatch = line.match(
      /\/\*\*(.+?)\*\/\s*(\w+)\??:\s*(.+?)[;,]/s
    );
    if (propMatch) {
      const [, comment, name, type] = propMatch;
      props.push({
        name,
        type: type.trim(),
        description: comment.replace(/\*\s*/g, '').trim(),
      });
    }
  }

  return props;
}

/**
 * Check if demo exists
 */
function hasDemoFile(componentName: string): boolean {
  const demoName = `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Demo.tsx`;
  return fs.existsSync(path.join(DEMO_DIR, demoName));
}

/**
 * Generate MDX content
 */
function generateMDX(meta: ComponentMeta, componentName: string): string {
  const demoExists = hasDemoFile(componentName);
  const demoImport = demoExists
    ? `import ${meta.name}Demo from '@/demo/${meta.name}Demo'`
    : '';
  const demoRender = demoExists ? `\n<${meta.name}Demo />\n` : '';

  const propsTable = meta.props
    .map(
      p =>
        `| \`${p.name}\` | \`${p.type}\` | ${p.default || '—'} | ${p.description} |`
    )
    .join('\n');

  return `---
sidebar_position: ${getComponentPosition(componentName)}
title: ${meta.name}
---
${demoImport}
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

${meta.description}
${demoRender}

## Installation

<DynamicCodeBlock lang="bash" code={\`lunar add ${componentName}\`} />

## Usage

<DynamicCodeBlock lang="tsx" code={\`import { ${meta.name} } from '@/components/ui/${componentName}';\`} />

### Basic Usage

<DynamicCodeBlock lang="tsx" code={\`<${meta.name}>Default</${meta.name}>\`} />

## API Reference

### ${meta.name}

| Prop | Type | Default | Description |
|------|------|---------|-------------|
${propsTable}
`;
}

/**
 * Get sidebar position based on alphabetical order
 */
function getComponentPosition(name: string): number {
  const components = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.mdx'));
  const sorted = components
    .map(f => f.replace('.mdx', ''))
    .sort()
    .indexOf(name) + 1;
  return sorted || components.length + 1;
}

/**
 * Generate/update registry entry for component
 */
function updateRegistry(componentName: string, meta: ComponentMeta) {
  const registryPath = path.join(REGISTRY_DIR, `${componentName}.json`);

  const registry = {
    name: componentName,
    type: 'registry:ui',
    description: meta.description.split('.')[0], // First sentence
    files: [
      {
        path: `/src/components/ui/${componentName}.tsx`,
        type: 'component',
      },
    ],
    dependencies: [],
    registryDependencies: [],
    meta: {
      description: meta.description,
      features: meta.props.slice(0, 3).map(p => `${p.name}: ${p.type}`),
    },
  };

  // Preserve existing registry if it has custom data
  if (fs.existsSync(registryPath)) {
    const existing = fs.readJsonSync(registryPath);
    registry.dependencies = existing.dependencies || [];
    registry.registryDependencies = existing.registryDependencies || [];
    if (existing.meta?.features?.length) {
      registry.meta.features = existing.meta.features;
    }
  }

  fs.writeJsonSync(registryPath, registry, { spaces: 2 });
}

/**
 * Main: Generate docs for all components
 */
async function generateDocs() {
  try {
    const components = fs
      .readdirSync(COMPONENTS_DIR)
      .filter(f => f.endsWith('.tsx') && !f.includes('index'));

    for (const componentFile of components) {
      const componentName = componentFile.replace('.tsx', '');
      const componentPath = path.join(COMPONENTS_DIR, componentFile);
      const docPath = path.join(DOCS_DIR, `${componentName}.mdx`);

      // Skip if doc already exists (manual docs take priority)
      if (fs.existsSync(docPath)) {
        console.log(`⏭️  ${componentName} - docs exist, skipping`);
        continue;
      }

      const content = fs.readFileSync(componentPath, 'utf-8');
      const description = extractDescription(content);

      if (!description) {
        console.log(`⚠️  ${componentName} - no JSDoc found, skipping`);
        continue;
      }

      const props = extractProps(content, componentName);

      const meta: ComponentMeta = {
        name: componentName.charAt(0).toUpperCase() + componentName.slice(1),
        description,
        props,
      };

      const mdx = generateMDX(meta, componentName);
      fs.writeFileSync(docPath, mdx);
      updateRegistry(componentName, meta);
      console.log(`✅ ${componentName} - docs + registry updated`);
    }

    console.log('\n✨ Component docs generation complete');
  } catch (error) {
    console.error('Error generating docs:', error);
    process.exit(1);
  }
}

generateDocs();
