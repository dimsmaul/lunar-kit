# Lunar Kit Primitives Releases

This folder contains changesets for Lunar Kit Primitives packages (`@lunar-primitive/*`).

Each primitive package is versioned and released independently using [Changesets](https://github.com/changesets/changesets).

## Packages

- `@lunar-primitive/adaptive-modal` - Adaptive modal component for React Native (web + native bridge)
- `@lunar-primitive/bottom-sheet` - Bottom sheet with gesture handling and snap points

## How to Add a Changeset

When making changes to any primitive package:

```bash
bun changeset
```

Select the changed packages and specify the bump type (patch/minor/major).

## Release Process

1. Changesets are added to this folder
2. On push to main, GitHub Actions creates a version PR
3. Merging the version PR triggers automatic publish to npm
4. GitHub release is created with these changelogs

For more details, see [PRIMITIVES_CHANGESET.md](../PRIMITIVES_CHANGESET.md)
