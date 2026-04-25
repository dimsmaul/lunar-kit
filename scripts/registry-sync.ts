import fs from 'fs-extra';
import path from 'node:path';

const COMPONENTS_DIR = path.join(process.cwd(), 'packages/core/src/components/ui');
const REGISTRY_DIR = path.join(process.cwd(), 'packages/core/src/registry/ui');

/**
 * Extract JSDoc description from component file
 */
function extractDescription(content: string): string {
  const match = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n\s*\*\//s);
  return match ? match[1].trim() : 'Component';
}

/**
 * Create registry entry for component
 */
function createRegistry(componentName: string) {
  const componentPath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
  const registryPath = path.join(REGISTRY_DIR, `${componentName}.json`);

  // Skip if registry already exists
  if (fs.existsSync(registryPath)) {
    return false;
  }

  // Read component file
  if (!fs.existsSync(componentPath)) {
    return false;
  }

  const content = fs.readFileSync(componentPath, 'utf-8');
  const description = extractDescription(content);

  const registry = {
    name: componentName,
    type: 'registry:ui',
    description: description,
    files: [
      {
        path: `/src/components/ui/${componentName}.tsx`,
        type: 'component',
      },
    ],
    dependencies: [],
    registryDependencies: [],
    meta: {
      description: description,
      features: [],
    },
  };

  fs.writeJsonSync(registryPath, registry, { spaces: 2 });
  return true;
}

/**
 * Sync registry for all components
 */
function syncRegistry() {
  try {
    const components = fs
      .readdirSync(COMPONENTS_DIR)
      .filter(f => f.endsWith('.tsx') && !f.includes('index'))
      .map(f => f.replace('.tsx', ''));

    let created = 0;
    let skipped = 0;

    for (const componentName of components) {
      if (createRegistry(componentName)) {
        console.log(`✅ ${componentName} - registry created`);
        created++;
      } else {
        skipped++;
      }
    }

    console.log(`\n📊 Summary: ${created} created, ${skipped} skipped (already exist)`);
  } catch (error) {
    console.error('Error syncing registry:', error);
    process.exit(1);
  }
}

syncRegistry();
