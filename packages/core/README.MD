# @lunar-kit/core

Core package for Lunar Kit - Shared registry and component definitions for React Native with NativeWind.

## Overview

`@lunar-kit/core` is the foundational package that powers the Lunar Kit ecosystem. It contains:

- **Component Registry**: Metadata and definitions for all available components
- **Component Source Files**: Pre-built React Native components styled with NativeWind
- **Shared Constants**: Paths and configuration used across the CLI and projects
- **Type Definitions**: TypeScript types for components and registry

## Installation

```bash
npm install @lunar-kit/core
# or
pnpm add @lunar-kit/core
# or
yarn add @lunar-kit/core
```

> **Note**: This package is typically installed automatically as a dependency of `@lunar-kit/cli` and doesn't need to be installed manually in most cases.

## What's Inside

### Component Registry

The registry defines metadata for each component including:

```typescript
{
  name: "button",
  type: "ui",
  description: "A versatile button component",
  files: [
    {
      path: "components/ui/button.tsx",
      type: "ui"
    }
  ],
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: []
}
```

### Components Library

Pre-built, production-ready components for React Native:

#### Form Components
- **Button** - Versatile button with variants (default, destructive, outline, ghost, link)
- **Input** - Text input with label and error states
- **Textarea** - Multi-line text input
- **Checkbox** - Checkbox with label support
- **Radio** / **Radio Group** - Radio button components
- **Select** / **Select Sheet** - Dropdown and bottom sheet pickers

#### Layout Components
- **Card** - Container with header, content, and footer
- **Dialog** - Modal dialog with overlay
- **Bottom Sheet** - Sliding bottom panel
- **Banner** - Alert/notification banner

#### Display Components
- **Avatar** - User avatar with fallback
- **Badge** - Label/tag component with variants
- **Text** - Styled text component with variants

#### Data Components
- **Calendar** - Date selection calendar
- **Date Picker** - Date input with calendar
- **Date Range Picker** - Select date ranges

#### Navigation
- **Tabs** - Tab navigation component

#### Advanced
- **Accordion** - Collapsible content sections
- **Form** - Form wrapper with validation support

### Styling

All components are built with:

- **NativeWind** - Tailwind CSS for React Native
- **Consistent Design System** - Following design tokens and patterns
- **Dark Mode Support** - Built-in theme switching capabilities
- **Accessibility** - ARIA labels and accessible components

## Usage

### For CLI Tool Developers

```typescript
import { 
  LOCAL_REGISTRY_PATH,
  LOCAL_COMPONENTS_PATH 
} from '@lunar-kit/core';

// Access registry metadata
const registryPath = LOCAL_REGISTRY_PATH;

// Access component source files
const componentsPath = LOCAL_COMPONENTS_PATH;
```

### For App Developers

After using `lunar-kit add <component>`, import components directly:

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

export default function MyScreen() {
  return (
    <Card>
      <Button variant="default">
        Click Me
      </Button>
    </Card>
  );
}
```

## Component Examples

### Button Component

```typescript
import { Button } from '@/components/ui/button';

<Button variant="default" size="default">
  Default Button
</Button>

<Button variant="destructive">
  Delete
</Button>

<Button variant="outline">
  Cancel
</Button>

<Button variant="ghost">
  Ghost Button
</Button>
```

### Card Component

```typescript
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description goes here</Card.Description>
  </Card.Header>
  <Card.Content>
    <Text>Main content</Text>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Dialog Component

```typescript
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>
        Dialog description
      </Dialog.Description>
    </Dialog.Header>
    {/* Dialog content */}
    <Dialog.Footer>
      <Button onPress={() => setOpen(false)}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

## Registry Structure

The registry is organized as JSON files in `src/registry/`:

```
registry/
  ├── index.json           # Main registry index
  └── ui/
      ├── button.json
      ├── card.json
      ├── dialog.json
      └── ... (other components)
```

Each component has a registry entry that defines:
- Component metadata
- File paths
- Dependencies (npm packages)
- Registry dependencies (other Lunar Kit components)

## Exports

### Constants

```typescript
// Registry path
export const LOCAL_REGISTRY_PATH: string;

// Components source path
export const LOCAL_COMPONENTS_PATH: string;
```

### Types

```typescript
export interface ComponentRegistry {
  name: string;
  type: string;
  description?: string;
  files: Array<{
    path: string;
    type: string;
  }>;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
}
```

## Design Principles

1. **Composition First** - Components are designed to be composed together
2. **Unstyled Base** - Core functionality without opinionated styles
3. **NativeWind Integration** - Leverage Tailwind utility classes
4. **TypeScript** - Full type safety throughout
5. **Accessibility** - WCAG compliant components
6. **Performance** - Optimized for mobile performance

## Customization

Components are designed to be customized. You can:

1. **Override Styles**: Use NativeWind classes
2. **Extend Components**: Wrap or extend existing components
3. **Theme**: Use theme context for global styling
4. **Variants**: Use built-in variants or create your own

## Requirements

- **React Native**: >= 0.70.0
- **React**: >= 18.0.0
- **NativeWind**: >= 4.0.0
- **TypeScript**: >= 5.0.0 (recommended)

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes to component APIs
- **Minor**: New components or non-breaking features
- **Patch**: Bug fixes and improvements

## Contributing

Components and registry entries can be contributed to the project. See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Links

- [Main Repository](https://github.com/dimsmaul/lunar-kit)
- [CLI Package](@lunar-kit/cli)
- [Create Lunar Kit](create-lunar-kit)
- [Documentation](https://github.com/dimsmaul/lunar-kit#readme)

## License

MIT © Dimas Maulana
