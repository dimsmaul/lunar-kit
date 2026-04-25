#!/bin/bash

echo "📦 Syncing core → docs..."

# Copy components
cp -r packages/core/src/components/ui/* docs/src/lunar-kit/components/ 2>/dev/null || true

# Copy lib, hooks, constants
cp -r packages/core/src/lib docs/src/lunar-kit/ 2>/dev/null || true
cp -r packages/core/src/hooks docs/src/lunar-kit/ 2>/dev/null || true
cp -r packages/core/src/constants docs/src/lunar-kit/ 2>/dev/null || true

echo "✅ Core synced to docs"
