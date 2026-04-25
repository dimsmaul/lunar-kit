import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface VersionParts {
  version: number;
  major: number;
  minor: number;
}

function parseVersion(version: string): VersionParts {
  const parts = version.replace(/^v/, '').split('.');
  return {
    version: Number.parseInt(parts[0]) || 0,
    major: Number.parseInt(parts[1]) || 0,
    minor: Number.parseInt(parts[2]) || 0,
  };
}

function formatVersion(parts: VersionParts, isBeta?: boolean): string {
  const base = `${parts.version}.${parts.major}.${parts.minor}`;
  if (isBeta) {
    return `${base}-beta.0`;
  }
  return base;
}

function bumpVersion(version: string, type: 'version' | 'major' | 'minor' | 'patch', isBeta?: boolean): string {
  const parts = parseVersion(version);

  switch (type) {
    case 'version':
      parts.version++;
      parts.major = 0;
      parts.minor = 0;
      break;
    case 'major':
      parts.major++;
      parts.minor = 0;
      break;
    case 'minor':
    case 'patch':
      parts.minor++;
      break;
  }

  return formatVersion(parts, isBeta);
}

function updatePackageVersion(pkgPath: string, newVersion: string) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function updateDependencies(pkgPath: string, pkg: string, newVersion: string) {
  const data = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  
  if (data.dependencies?.[pkg]) {
    data.dependencies[pkg] = newVersion;
  }
  if (data.devDependencies?.[pkg]) {
    data.devDependencies[pkg] = newVersion;
  }
  if (data.peerDependencies?.[pkg]) {
    data.peerDependencies[pkg] = newVersion;
  }
  
  writeFileSync(pkgPath, JSON.stringify(data, null, 2) + '\n');
}

async function main() {
  const type = (process.argv[2] || 'patch') as 'version' | 'major' | 'minor' | 'patch';
  const isBeta = process.argv[3] === 'beta';

  // Package dependencies map
  const deps: Record<string, string[]> = {
    '@lunar-kit/core': ['@lunar-kit/cli', 'create-lunar-kit'],
    '@lunar-primitive/adaptive-modal': ['@lunar-kit/core'],
    '@lunar-primitive/bottom-sheet': ['@lunar-kit/core'],
  };

  // Update each package
  const rootDir = process.cwd();
  const packages = [
    { name: '@lunar-kit/core', path: 'packages/core' },
    { name: '@lunar-kit/cli', path: 'packages/cli' },
    { name: 'create-lunar-kit', path: 'packages/create-lunar-kit' },
    { name: '@lunar-primitive/adaptive-modal', path: 'packages/primitives/adaptive-modal' },
    { name: '@lunar-primitive/bottom-sheet', path: 'packages/primitives/bottom-sheet' },
  ];

  for (const pkg of packages) {
    const pkgJsonPath = join(rootDir, pkg.path, 'package.json');
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    
    const newVersion = bumpVersion(pkgJson.version, type, isBeta);
    updatePackageVersion(pkgJsonPath, newVersion);
    
    console.log(`✅ ${pkg.name}: ${pkgJson.version} → ${newVersion}`);

    // Update dependents
    if (deps[pkg.name]) {
      for (const dependent of deps[pkg.name]) {
        const depPkg = packages.find(p => p.name === dependent);
        if (depPkg) {
          const depPkgPath = join(rootDir, depPkg.path, 'package.json');
          updateDependencies(depPkgPath, pkg.name, newVersion);
          console.log(`  📦 Updated ${dependent}`);
        }
      }
    }
  }

  console.log('\n✨ All versions bumped successfully');
}

main().catch(console.error);
