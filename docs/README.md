# @lunar-kit/docs

Next.js documentation site for **Lunar Kit** React Native components, built with **Fumadocs**, **Tailwind CSS**, and **NativeWind v4**.

## Overview

This documentation showcases React Native components styled with NativeWind and rendered on the web using react-native-web. It includes:

- **39+ component documentation** with usage examples
- **MDX-based pages** in `/content/docs/`
- **Interactive component previews** using React Native Web
- **Full-text search** via Fumadocs
- **Responsive design** optimized for all devices
- **Dark mode support** with Tailwind CSS

## Project Structure

```
docs/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (home)/                  # Home page layout
│   │   ├── docs/[[...slug]]/        # Docs pages (dynamic routes)
│   │   ├── api/                     # API routes (search, OG images)
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── button-demo.tsx          # Button component demo
│   │   ├── component-preview.tsx    # Generic component preview wrapper
│   │   ├── mdx.tsx                  # MDX component overrides
│   │   └── rn-web-provider.tsx      # React Native Web setup
│   ├── lib/
│   │   ├── source.ts                # Fumadocs source configuration
│   │   ├── layout.shared.tsx        # Shared layout options
│   │   └── shared.ts                # Shared utilities
│   └── styles/
│       └── globals.css              # Global styles
├── content/
│   └── docs/                        # MDX documentation files
│       ├── index.mdx                # Getting started
│       ├── components/              # Component docs
│       │   ├── button.mdx
│       │   └── ...
│       └── ...
├── next.config.mjs                  # Next.js config with Turbopack
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## Setup & Development

### Prerequisites
- **Node.js 18+** or **Bun** runtime
- **@lunar-kit/core** (sister package)

### Installation
```bash
# Install dependencies
bun install
# or
npm install
```

### Development Server
```bash
bun run dev
# Server runs on http://localhost:3000 (or next available port)
```

### Build for Production
```bash
bun run build
bun run start
```

## Configuration

### Tailwind CSS
- **Config**: `tailwind.config.ts`
- **Supports**: All Tailwind utilities + NativeWind extensions
- **Plugins**: `@tailwindcss/postcss`, `autoprefixer`

### Next.js (Turbopack)
- **File**: `next.config.mjs`
- **Features**:
  - Turbopack for fast builds
  - React Native Web alias (`react-native` → `react-native-web`)
  - Web file resolution (`.web.tsx`, `.web.ts`)
  - MDX via Fumadocs

### React Native Web
The docs use `react-native-web` to render React Native components in the browser:

- **Provider**: `RNWebProvider` wraps components for platform setup
- **Imports**: `View`, `ScrollView`, `Pressable`, etc. from `react-native`
- **Styling**: NativeWind/Tailwind utilities work seamlessly

## Component Documentation Template

Each component gets an `.mdx` file in `/content/docs/components/`:

```mdx
---
title: Button Component
description: Click-able element with multiple variants
---

import { ComponentPreview } from '@/components/component-preview';
import { ButtonDemo } from '@/components/button-demo';

# Button

[Overview, examples, code snippets...]

<ComponentPreview title="Variants" height={200}>
  <ButtonDemo showAll />
</ComponentPreview>
```

### ComponentPreview Props
- **title** (string): Preview title
- **description** (string): Short description
- **height** (number): Container height in pixels (default: 400)
- **children**: React component to render
- **className**: Additional CSS classes
- **background**: Background color (default: `#f5f5f5`)

## Adding New Documentation

1. **Create MDX file** in `/content/docs/components/your-component.mdx`
2. **Add import statements** for demos and previews
3. **Write documentation** with examples and props table
4. **Add code snippets** with proper TypeScript types
5. **Include previews** using `<ComponentPreview>`

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** | React framework + SSR |
| **Fumadocs** | MDX documentation framework |
| **Tailwind CSS 4** | Utility-first CSS |
| **NativeWind v4** | Tailwind for React Native |
| **react-native-web** | Run React Native on web |
| **Turbopack** | Fast bundler (Next.js default) |
| **TypeScript** | Type safety |

## Resources

- [Lunar Kit](https://github.com/dimsmaul/lunar-kit)
- [Fumadocs](https://fumadocs.dev)
- [Next.js](https://nextjs.org)
- [NativeWind](https://nativewind.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Native Web](https://necolas.github.io/react-native-web/)

## License

MIT
