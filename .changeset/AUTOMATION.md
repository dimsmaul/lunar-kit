# Changeset Automation

## Overview

Lunar Kit uses Changesets for:
- **Version management**: Semantic versioning across monorepo
- **Release automation**: Publishing to npm via CI/CD
- **Changelog generation**: Auto-documented changes per package

## Commands

### Local Workflow

```bash
# Interactive changeset creation
bun changeset:create

# Official Changesets prompt
bun changeset

# Check pending releases
bun release:check

# Version bump (creates Release PR)
bun release:version

# Publish to npm
bun release:publish
```

### CI/CD Automation

**Changeset Check** (on every PR):
- Validates changeset exists
- Comments if missing
- Blocks merge if absent

**Release Workflow** (on main branch):
- Detects changesets
- Creates Release PR with version bumps
- Generates CHANGELOG entries
- Auto-publishes when Release PR merges

## File Structure

```
.changeset/
├── README.md              # Changesets documentation
├── AUTOMATION.md          # This file
├── config.json            # Changesets config
└── 2026-04-25-*.md        # Individual changeset files
```

## Creating Changesets

### Quick (Recommended)

```bash
bun changeset:create
# Follow interactive prompts
```

### Manual

```bash
bun changeset
# Or edit .changeset/YYYY-MM-DD-*.md directly
```

Changeset format:
```markdown
---
'@lunar-kit/core': minor
'@lunar-primitive/adaptive-modal': patch
---

Description of changes. What was added/fixed.
```

## Release Flow

1. Developer creates PR with changes
2. Runs `bun changeset:create` to document changes
3. CI validates changeset exists
4. PR merged to main
5. Changesets workflow creates Release PR
6. Release PR bumps versions, updates CHANGELOG
7. Release PR merged
8. CI publishes to npm

## Bump Types

- **patch**: Bug fixes, non-breaking changes (0.1.0 → 0.1.1)
- **minor**: New features, backward compatible (0.1.0 → 0.2.0)
- **major**: Breaking changes (0.1.0 → 1.0.0)

## Triggers

- **Changeset Check**: Every PR (requires changeset)
- **Release Workflow**: Push to main branch (publishes if changesets exist)
