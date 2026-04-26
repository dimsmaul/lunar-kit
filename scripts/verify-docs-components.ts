import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

function syncComponentFiles() {
  const coreDir = '/Users/dimasmaulana/Documents/personal/lunar-kit/lunar-kit/packages/core/src/components/ui';
  const docsDir = '/Users/dimasmaulana/Documents/personal/lunar-kit/lunar-kit/docs/src/lunar-kit/components';

  const coreFiles = readdirSync(coreDir).filter(f => f.endsWith('.tsx') && !['index.ts', 'index.tsx'].includes(f));

  console.log('🔍 Verifying docs/src/lunar-kit/components/* against core...\n');

  let copied = 0;
  let updated = 0;
  let verified = 0;

  for (const file of coreFiles) {
    const corePath = join(coreDir, file);
    const docsPath = join(docsDir, file);

    const coreContent = readFileSync(corePath, 'utf-8');

    if (!existsSync(docsPath)) {
      writeFileSync(docsPath, coreContent);
      console.log(`✅ COPIED ${file}`);
      copied++;
    } else {
      const docsContent = readFileSync(docsPath, 'utf-8');
      if (coreContent !== docsContent) {
        writeFileSync(docsPath, coreContent);
        console.log(`🔄 UPDATED ${file}`);
        updated++;
      } else {
        console.log(`✓ VERIFIED ${file}`);
        verified++;
      }
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Copied: ${copied}`);
  console.log(`  🔄 Updated: ${updated}`);
  console.log(`  ✓ Verified: ${verified}`);
  console.log(`  📦 Total: ${coreFiles.length}`);
}

syncComponentFiles();
