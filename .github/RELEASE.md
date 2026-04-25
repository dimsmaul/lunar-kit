# Release Process

Lunar Kit uses an automated release system based on branch merging and commit messages.

## Release Channels

### Beta Releases (Development)
- **Trigger:** Merge from `feat/*` branch → `dev` branch
- **Version:** `v0.1.22-beta.0`
- **Tag:** `beta` on npm
- **Automatic:** Yes, on PR merge

### Stable Releases (Production)
- **Trigger:** Merge from `dev` branch → `main` branch
- **Version:** `v0.1.22` (bumped by commit message)
- **Tag:** `latest` on npm
- **Automatic:** Yes, on push to main

## Commit Message Format

When merging `dev` → `main`, include release type in commit message:

```
release: major
release: minor
release: patch
```

Default is `patch` if not specified.

### Examples

**Major Release** (breaking changes)
```
Merge pull request #123 from dev
release: major

BREAKING: Redesigned component API
```
Result: `v0.1.0` → `v1.0.0`

**Minor Release** (new features)
```
Merge pull request #123 from dev
release: minor

Add new Form component
```
Result: `v0.1.22` → `v0.2.0`

**Patch Release** (bug fixes)
```
Merge pull request #123 from dev
release: patch

Fix button padding
```
Result: `v0.1.22` → `v0.1.23`

## Workflow

### 1. Feature Development
```bash
git checkout -b feat/new-component dev
# ... develop feature ...
git push origin feat/new-component
# Create PR: feat/new-component → dev
```

### 2. PR Review
- SonarCloud scans for quality issues
- Required reviewers approve (CODEOWNERS)
- CI checks pass

### 3. Merge to Dev
- Automatic beta release triggered
- Beta version published to npm with `beta` tag
- `v0.1.22-beta.0` created

### 4. Release to Main
```bash
# When ready for stable release
git checkout main
git merge dev --no-ff -m "release: minor"
git push origin main
```

- Extract version type from commit message
- Bump all packages according to type
- Update dependent packages automatically
  - If `@lunar-kit/core` updates → cli, create-lunar-kit updated
  - If `@lunar-primitive/adaptive-modal` updates → core updated
- Publish all packages to npm (latest tag)
- Create GitHub Release with notes

## Automatic Dependency Updates

When a package is released, dependents are automatically updated:

```
@lunar-primitive/adaptive-modal → @lunar-kit/core
    ↓
@lunar-kit/core → @lunar-kit/cli, create-lunar-kit
```

No manual package.json updates needed.

## Publishing

### Manual Publish (if needed)
```bash
# Test locally
npm publish --dry-run

# Publish specific package
cd packages/core
npm publish
```

### CI/CD Publish
Automatic on:
- Beta: feat branch merge to dev
- Release: dev branch merge to main

Requires `NPM_TOKEN` secret in GitHub.

## Code Review

Uses SonarCloud for automated code analysis:
- Security issues
- Code quality
- Test coverage
- Duplication

Also uses CODEOWNERS for required human review.

## Troubleshooting

### Release didn't trigger
- Check commit message format: `release: major/minor/patch`
- Verify merged to correct branch (dev→main)
- Check GitHub Actions logs

### Wrong version bumped
- Version bumper maps dependencies automatically
- Check `scripts/bump-versions.ts` for dependency map
- Manual edit allowed before merge to main

### NPM publish failed
- Check `NPM_TOKEN` secret in GitHub Settings
- Verify token hasn't expired
- Token must be npm Automation token, not classic
