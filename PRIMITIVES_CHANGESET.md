# Lunar Kit Primitives - Changeset Guide

## Quick Start

### Adding a Changeset

When you make changes to any `@lunar-primitive/*` package, create a changeset:

```bash
bun changeset
```

**Example flow:**
```
🦋  Which packages would you like to include?
🦋  🦋  @lunar-primitive/adaptive-modal
🦋  🦋  @lunar-primitive/bottom-sheet

🦋  Which packages should have a major bump?
🦋  (none for bug fixes/features)

🦋  Which packages should have a minor bump?
🦋  🦋  @lunar-primitive/adaptive-modal  (for new features)

🦋  Which packages should have a patch bump?
🦋  🦋  @lunar-primitive/bottom-sheet  (for bug fixes)

🦋  Please enter a summary for the changes
🦋  ✍️  Added new feature / Fixed bug description
```

### Changeset File Format

A changeset file will be created in `.changeset/`:

```markdown
---
"@lunar-primitive/adaptive-modal": minor
"@lunar-primitive/bottom-sheet": patch
---

Added new `closeOnBackdropPress` prop to AdaptiveModal.
Fixed scroll issue in BottomSheet component.
```

## Versioning

Each primitive package is versioned **independently**:

| Package | Current Version |
|---------|----------------|
| `@lunar-primitive/adaptive-modal` | 0.0.0 |
| `@lunar-primitive/bottom-sheet` | 0.0.0 |

### Bump Types

- **patch** (`0.0.x`) - Bug fixes, no new features
- **minor** (`0.x.0`) - New features, backwards compatible
- **major** (`x.0.0`) - Breaking changes

## Release Workflow

### Automated Release (Recommended)

1. Make changes to primitive packages
2. Run `bun changeset` and commit the changeset file
3. Push to `main` branch
4. GitHub Actions creates a version PR automatically
5. Merge the version PR
6. Packages are published to npm automatically
7. GitHub release is created

### Manual Release

```bash
# Check what will be released
bun run release:check

# Generate version updates (updates package.json files)
bun run release:version

# Review the changes
git diff

# Commit the version updates
git add .
git commit -m "chore: version packages"

# Publish to npm
bun run release:publish
```

## GitHub Actions

The release workflow (`.github/workflows/release-primitives.yml`):

- Runs on push to `main`
- Detects changesets for `@lunar-primitive/*` packages
- Creates version PR (if changesets exist)
- On merge: builds and publishes to npm
- Creates GitHub release

## Differences from Core Packages

| Aspect | Core Packages | Primitives |
|--------|--------------|------------|
| Packages | `@lunar-kit/core`, `@lunar-kit/cli`, `create-lunar-kit` | `@lunar-primitive/*` |
| Versioning | Fixed (same version) | Independent |
| Release | Manual (via release commit) | Automated (via changesets) |
| Config | `.changeset/config.json` (fixed) | `.changeset/config.json` (independent) |

## Configuration

Changeset config: `.changeset/config.json`

```json
{
  "fixed": [["@lunar-kit/core", "@lunar-kit/cli", "create-lunar-kit"]],
  "access": "public",
  "baseBranch": "main"
}
```

- **fixed**: Core packages share the same version
- **primitives**: Versioned independently (not in fixed array)

## Troubleshooting

### Package not detected?
```bash
# Reinstall to refresh workspace
bun install
```

### Wrong version bump?
```bash
# Edit the changeset file in .changeset/
# Change minor → patch or major as needed
```

### Skip a package?
Just don't include it when running `bun changeset`

### Check status
```bash
bun changeset status
```

## NPM Secrets Required

Ensure these GitHub secrets are set:
- `NPM_TOKEN` - npm publish token
- `GITHUB_TOKEN` - Auto-provided by GitHub Actions

## Example Release Flow

```bash
# 1. Make changes to bottom-sheet
cd packages/primitives/bottom-sheet
# ... edit files ...

# 2. Create changeset
cd ../../..
bun changeset
# Select: @lunar-primitive/bottom-sheet
# Select: patch (for bug fix)
# Enter: "Fixed gesture handler issue"

# 3. Commit
git add .
git commit -m "fix(bottom-sheet): fix gesture handler"

# 4. Push
git push origin main

# 5. GitHub Actions will:
#    - Detect the changeset
#    - Create version PR
#    - Wait for merge
#    - Publish automatically
```
