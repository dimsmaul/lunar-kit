import { readFileSync, writeFileSync, readdirSync } from 'fs';
import * as readline from 'readline';
import { join } from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> =>
  new Promise((resolve) => rl.question(prompt, resolve));

function getPackages(): string[] {
  const packagesDir = 'packages';
  const packages: string[] = [];

  const dirs = readdirSync(packagesDir, { withFileTypes: true });

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      try {
        const pkgJson = JSON.parse(
          readFileSync(join(packagesDir, dir.name, 'package.json'), 'utf-8')
        );
        if (pkgJson.name) {
          packages.push(pkgJson.name);
        }
      } catch {
        // Skip if not a valid package
      }
    }
  }

  return packages.sort();
}

async function main() {
  console.log('📦 Create Changeset\n');

  const packages = getPackages();

  console.log('Available packages:');
  packages.forEach((pkg, i) => console.log(`  ${i + 1}. ${pkg}`));

  const pkgIdx = await question('\nSelect package (number): ');
  const selectedPackage = packages[Number.parseInt(pkgIdx) - 1];

  if (!selectedPackage) {
    console.error('Invalid selection');
    rl.close();
    return;
  }

  console.log('\nBump type:');
  console.log('  1. major');
  console.log('  2. minor');
  console.log('  3. patch');

  const bumpIdx = await question('\nSelect type (number): ');
  const bumpTypes = ['major', 'minor', 'patch'];
  const bumpType = bumpTypes[Number.parseInt(bumpIdx) - 1];

  if (!bumpType) {
    console.error('Invalid selection');
    rl.close();
    return;
  }

  const description = await question('\nDescription: ');

  if (!description.trim()) {
    console.error('Description required');
    rl.close();
    return;
  }

  // Create changeset file
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timestamp = now.getTime();
  const filename = `.changeset/${dateStr}-${timestamp}.md`;

  const content = `---
'${selectedPackage}': ${bumpType}
---

${description}
`;

  writeFileSync(filename, content);
  console.log(`\n✅ Created ${filename}`);

  rl.close();
}

main().catch(console.error);
