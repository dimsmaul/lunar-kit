import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

function syncDirRecursive(srcDir: string, destDir: string, extensions: string[] = []): { copied: number; updated: number; skipped: number } {
  let copied = 0;
  let updated = 0;
  let skipped = 0;

  if (!existsSync(srcDir)) return { copied, updated, skipped };

  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (!existsSync(destPath)) mkdirSync(destPath, { recursive: true });
      const result = syncDirRecursive(srcPath, destPath, extensions);
      copied += result.copied;
      updated += result.updated;
      skipped += result.skipped;
    } else if (entry.isFile()) {
      // Skip if extensions filter exists and file doesn't match
      if (extensions.length > 0 && !extensions.some(ext => entry.name.endsWith(ext))) {
        continue;
      }

      const srcContent = readFileSync(srcPath, 'utf-8');

      if (existsSync(destPath)) {
        const destContent = readFileSync(destPath, 'utf-8');
        if (srcContent === destContent) {
          skipped++;
          continue;
        }
        updated++;
      } else {
        copied++;
      }

      writeFileSync(destPath, srcContent);
    }
  }

  return { copied, updated, skipped };
}

function syncCoreComponentsToDocs() {
  const coreBase = join(process.cwd(), 'packages/core/src');
  const docsBase = join(process.cwd(), 'docs/src/lunar-kit');

  console.log('📦 Syncing core → docs...\n');

  // Sync components
  console.log('Components:');
  const componentsResult = syncDirRecursive(
    join(coreBase, 'components/ui'),
    join(docsBase, 'components'),
    ['.tsx']
  );
  console.log(`  ${componentsResult.copied} copied, ${componentsResult.updated} updated, ${componentsResult.skipped} unchanged`);

  // Sync lib
  console.log('Lib utilities:');
  const libResult = syncDirRecursive(
    join(coreBase, 'lib'),
    join(docsBase, 'lib'),
    ['.ts', '.tsx']
  );
  console.log(`  ${libResult.copied} copied, ${libResult.updated} updated, ${libResult.skipped} unchanged`);

  // Sync hooks
  console.log('Hooks:');
  const hooksResult = syncDirRecursive(
    join(coreBase, 'hooks'),
    join(docsBase, 'hooks'),
    ['.ts', '.tsx']
  );
  console.log(`  ${hooksResult.copied} copied, ${hooksResult.updated} updated, ${hooksResult.skipped} unchanged`);

  // Sync constants
  console.log('Constants:');
  const constantsResult = syncDirRecursive(
    join(coreBase, 'constants'),
    join(docsBase, 'constants'),
    ['.ts', '.tsx']
  );
  console.log(`  ${constantsResult.copied} copied, ${constantsResult.updated} updated, ${constantsResult.skipped} unchanged`);

  const totalCopied = componentsResult.copied + libResult.copied + hooksResult.copied + constantsResult.copied;
  const totalUpdated = componentsResult.updated + libResult.updated + hooksResult.updated + constantsResult.updated;

  console.log(`\n✨ Sync complete: ${totalCopied} files copied, ${totalUpdated} files updated`);
  return totalCopied + totalUpdated > 0;
}

const changed = syncCoreComponentsToDocs();
process.exit(changed ? 0 : 0);
