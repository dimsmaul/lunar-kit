# Lunar Kit - AI Assistant Reference Guide

This document provides comprehensive context about **Lunar Kit** for AI assistants helping users. It covers the project structure, CLI workflows, component patterns, and architecture decisions.

---

## 1. Project Overview

**Lunar Kit** is a universal React Native UI component library built on [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native). It combines pre-built, production-ready components with a powerful CLI for project scaffolding and code generation inspired by NestJS.

### Key Features
- **39 production-ready components** styled with Tailwind CSS via NativeWind
- **CLI-driven development** with generators for modules, components, hooks, stores, and navigators
- **Cross-platform support** via React Native, Expo, and React Native Web
- **Theming system** with dark mode and CSS variables
- **Component registry** enabling selective component adoption (not all-or-nothing)
- **Monorepo structure** separating components, CLI, primitives, and examples

### Current Version
`@lunar-kit/core` v0.1.20 | `@lunar-kit/cli` v0.1.20

### Tech Stack Snapshot
- **React 19.1.0** + **React Native 0.81.5**
- **Expo ~54.0** with Expo Router for navigation
- **NativeWind 4.2.1** for Tailwind styling
- **Tailwind CSS 3.4.17** (utility-first CSS framework)
- **CVA (Class Variance Authority)** for component variants
- **Zustand** for state management
- **Reanimated 3.x** + **Gesture Handler** for animations
- **React Hook Form** + **Zod** for form validation

---

## 2. Monorepo Structure

Lunar Kit is organized as a monorepo with workspaces managed by **bun**.

```
lunar-kit/
├── packages/
│   ├── core/                    # @lunar-kit/core (main component library)
│   │   ├── src/
│   │   │   ├── components/ui/   # 39 UI components
│   │   │   ├── registry/ui/     # Component metadata (JSON registry)
│   │   │   ├── hooks/           # useTheme, useToast, useToolbar, useThemeColors
│   │   │   ├── providers/       # ThemeProvider
│   │   │   ├── stores/          # Zustand: theme store, toast store
│   │   │   ├── templates/       # CLI template generators
│   │   │   ├── lib/             # Utilities: cn(), theme tokens, formatters
│   │   │   └── index.ts         # Main exports
│   │   ├── tsup.config.ts       # Build config (ESM, external deps)
│   │   └── package.json
│   │
│   ├── cli/                     # @lunar-kit/cli (CLI tool)
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── init.ts           # lunar init (project setup)
│   │   │   │   ├── add.ts            # lunar add (add components)
│   │   │   │   ├── module.ts         # lunar generate mod (scaffold modules)
│   │   │   │   ├── generate-*.ts     # Code generators (component, hook, store, etc.)
│   │   │   │   ├── navigation.ts     # lunar gen nav:* (navigator generators)
│   │   │   │   └── test.ts           # Test generation
│   │   │   └── index.ts
│   │   ├── tsup.config.ts       # Build config (ESM with bin shebang)
│   │   └── package.json
│   │
│   ├── primitives/
│   │   ├── adaptive-modal/      # Platform bridge: Modal (native) ↔ Portal (web)
│   │   └── bottom-sheet/        # Gesture-driven sheet with Reanimated
│   │
│   ├── create-lunar-kit/        # Project scaffolder (create-lunar-kit-app)
│   │
│   └── stubs/                   # Type stubs for Expo packages
│       ├── expo-router/
│       ├── expo-modules-core/
│       ├── react-native-screens/
│       └── ... (stub definitions for optional deps)
│
├── apps/
│   └── example/                 # Expo app demonstrating all components
│       ├── src/
│       │   ├── modules/preview/ # Feature module example
│       │   ├── components/      # App-specific UI
│       │   ├── hooks/           # App custom hooks
│       │   ├── stores/          # Zustand stores
│       │   ├── contexts/        # Context providers
│       │   ├── locales/         # i18n translations
│       │   └── providers/       # Root providers
│       └── package.json
│
└── docs/                        # Documentation site
    ├── src/
    │   ├── app/                 # Next.js App Router routes
    │   ├── components/          # Doc components
    │   └── lib/                 # Doc utilities
    ├── content/docs/            # MDX documentation files
    └── package.json
```

### Package Responsibilities

| Package | Purpose | Exports |
|---------|---------|---------|
| `@lunar-kit/core` | Component library + registry + hooks | Components, hooks, providers, stores |
| `@lunar-kit/cli` | CLI tool for dev workflows | `lunar` command (init, add, generate) |
| `@lunar-kit/create-lunar-kit` | Project scaffolder | Used by `create-lunar-kit-app` |
| `@lunar-primitive/adaptive-modal` | Platform-agnostic modal bridge | `AdaptiveModal`, `Portal` |
| `@lunar-primitive/bottom-sheet` | Gesture-driven sheet primitive | Bottom sheet APIs |

---

## 3. Component Library & Patterns

### 39 Pre-Built Components

Components are organized into logical categories:

#### **Form Components** (11)
Button, Input, Textarea, Checkbox, Radio, Radio Group, Select, Select Sheet, Switch, Slider, Input OTP

#### **Layout Components** (6)
Card, Dialog, Bottom Sheet, Banner, Accordion, Breadcrumb

#### **Display Components** (8)
Avatar, Badge, Progress, Skeleton, Separator, Text, Tooltip, Empty State

#### **Data Input Components** (8)
Calendar, Date Picker, Date Range Picker, Carousel, Tabs, Keyboard Avoiding View, Search Bar, Dropdown Menu

#### **Navigation/Advanced** (6)
Step Indicator, and platform-specific wrappers

### Styling Architecture

All components use a consistent **Tailwind + CVA** pattern:

```typescript
// Example: Button component styling
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded px-3 text-sm',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ComponentProps<typeof Pressable>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Pressable
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
```

### The `cn()` Utility

All components use `cn()` to merge Tailwind classes while handling conflicts:

```typescript
// From: src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in components
<View className={cn(
  'px-4 py-2',
  disabled && 'opacity-50'  // Conditional styles
)} />
```

### Component Registry System

Each component has a **registry file** (JSON) that defines:
- Component metadata (name, description, features)
- File paths to download during `lunar add`
- Dependencies (npm packages, other components)
- Type information

Example registry entry: `packages/core/src/registry/ui/button.json`
```json
{
  "name": "button",
  "type": "registry:ui",
  "description": "A customizable button component with variants",
  "files": [
    {
      "path": "/src/components/ui/button.tsx",
      "type": "component"
    }
  ],
  "dependencies": ["react-native"],
  "registryDependencies": ["text"],
  "meta": {
    "features": ["Variant support", "Size options", "Loading state"],
    "description": "Pressable button with CVA variants"
  }
}
```

**Benefit:** The CLI resolves component dependencies automatically when you run `lunar add button` — it downloads Button + its dependencies (Text in this case).

---

## 4. CLI Commands & Workflows

The CLI is accessed via `lunar` command (installed as `@lunar-kit/cli`).

### Core Commands

#### **Initialize Project**
```bash
lunar init
```
- Interactive setup: TypeScript, package manager, aliases
- Creates project structure:
  ```
  src/
  ├── components/ui/        # Components added via CLI
  ├── modules/              # Feature modules (for lunar gen mod)
  ├── components/           # App-specific components
  ├── hooks/                # App hooks
  ├── stores/               # Zustand stores
  ├── services/             # API clients, business logic
  └── lib/
      ├── utils.ts          # cn() utility
      └── theme.ts          # Design tokens
  ```
- Generates `kit.config.json`:
  ```json
  {
    "name": "my-app",
    "typescript": true,
    "packageManager": "bun",
    "alias": "@"
  }
  ```

#### **Add Components**
```bash
# Add single component
lunar add button

# Add multiple components
lunar add button card input

# Add all components
lunar add --all

# Add with confirmation
lunar add button --yes

# Add locale file
lunar add locale en-US
```

Workflow:
1. Check `kit.config.json` for project settings
2. Fetch component registry from GitHub CDN
3. Resolve dependencies (e.g., button → text)
4. Download component files to `src/components/ui/`
5. Install peer dependencies (if missing)

#### **Generate Module (Scaffold Feature)**
```bash
lunar generate mod auth
# or: lunar g mod auth

# Creates:
# src/modules/auth/
# ├── index.ts              # Barrel export
# ├── screens/
# │   └── login.tsx         # Login screen
# ├── components/           # Module-specific UI
# ├── hooks/                # Module hooks
# ├── stores/               # Module state
# ├── services/             # API clients
# ├── types.ts              # Type definitions
# └── constants.ts          # Constants
```

#### **Generate Module Screen/View**
```bash
lunar generate mod:view auth/login
# or: lunar g mod:vi auth/login

# Creates: src/modules/auth/screens/login.tsx
# Template includes theme context, navigation setup
```

#### **Generate Module Component**
```bash
lunar generate mod:component auth/login-form
# Creates: src/modules/auth/components/login-form.tsx
```

#### **Generate Module Store (Zustand)**
```bash
lunar generate mod:store auth/auth-store
# Creates: src/modules/auth/stores/auth-store.ts
# Template includes persist middleware example
```

#### **Generate Module Hook**
```bash
lunar generate mod:hook auth/use-auth
# Creates: src/modules/auth/hooks/use-auth.ts
```

#### **Generate Module API Client**
```bash
lunar generate mod:api auth/api
# Creates: src/modules/auth/services/api.ts
# Template includes fetch patterns
```

#### **Generate Global Component**
```bash
lunar generate component my-custom-button
# Creates: src/components/my-custom-button.tsx
```

#### **Generate Global Hook**
```bash
lunar generate hook use-custom-hook
# Creates: src/hooks/use-custom-hook.ts
```

#### **Generate Navigators**
```bash
# Stack navigator
lunar generate nav:stack main-stack

# Tab navigator
lunar generate nav:tab bottom-tabs

# Drawer navigator
lunar generate nav:drawer app-drawer
```

### Command Aliases

| Full Command | Short Alias |
|--------------|-------------|
| `lunar generate` | `lunar g` |
| `lunar add` | — |
| `mod:view` | `mod:vi` |
| `mod:component` | `mod:co` |
| `mod:store` | `mod:st` |
| `mod:hook` | `mod:ho` |
| `mod:api` | `mod:ap` |
| `nav:stack` | `n:stack` |
| `nav:tab` | `n:tab` |
| `nav:drawer` | `n:drawer` |

```bash
# Examples of short forms
lunar g mod auth        # generate module
lunar g mod:vi auth/login
lunar g mod:st auth/auth-store
```

---

## 5. Setup & Getting Started

### Installation Steps

#### Step 1: Install CLI globally
```bash
bun install -g @lunar-kit/cli
# or
npm install -g @lunar-kit/cli
# or
pnpm add -g @lunar-kit/cli
```

#### Step 2: Initialize your Expo project
```bash
# If starting from scratch
create-expo-app my-app
cd my-app

# Initialize Lunar Kit
lunar init
```

#### Step 3: Add your first component
```bash
lunar add button card input
```

#### Step 4: Use components in your code
```tsx
// app.tsx or any screen
import { Button, Card, Input } from '@/components/ui';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <Card className="p-4 m-4">
      <Text className="text-lg font-bold mb-2">Welcome to Lunar Kit</Text>
      <Input placeholder="Enter your name" className="mb-2" />
      <Button>
        <Text>Submit</Text>
      </Button>
    </Card>
  );
}
```

### Project Structure After Init
```
src/
├── app.tsx                     # Entry point (or app/ for routing)
├── modules/                    # Feature modules (scaffold with CLI)
├── components/
│   ├── ui/                     # Components added via lunar add
│   └── ...                     # App-specific components
├── hooks/                      # Custom hooks
├── stores/                     # Zustand stores
├── services/                   # API clients
└── lib/
    ├── utils.ts                # cn() function
    └── theme.ts                # Design tokens

kit.config.json                 # CLI config
tsconfig.json                   # TypeScript config
```

### Configuration: kit.config.json
```json
{
  "name": "my-app",
  "description": "My Lunar Kit app",
  "typescript": true,
  "packageManager": "bun",
  "alias": "@"
}
```

---

## 6. Common Tasks & Code Examples

### Using a Component
```tsx
import { Button, Card, Input, Text } from '@/components/ui';
import { View, ScrollView } from 'react-native';
import { useState } from 'react';

export function MyPage() {
  const [name, setName] = useState('');

  return (
    <ScrollView className="flex-1 bg-background">
      <Card className="m-4 p-4">
        <Text className="text-xl font-semibold mb-4">User Form</Text>
        
        <Input
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          className="mb-4"
        />
        
        <Button onPress={() => console.log('Submitted:', name)}>
          <Text>Submit</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
```

### Creating a Form with Validation (React Hook Form + Zod)
```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Text } from '@/components/ui';
import { View } from 'react-native';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be 6+ characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Login:', data);
  };

  return (
    <View className="p-4">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <View className="mb-4">
            <Input placeholder="Email" {...field} />
            {errors.email && <Text className="text-red-500 text-sm">{errors.email.message}</Text>}
          </View>
        )}
      />
      
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <View className="mb-4">
            <Input placeholder="Password" secureTextEntry {...field} />
            {errors.password && <Text className="text-red-500 text-sm">{errors.password.message}</Text>}
          </View>
        )}
      />
      
      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Sign In</Text>
      </Button>
    </View>
  );
}
```

### Using Hooks
```tsx
import { useTheme, useToast, useThemeColors, useToolbar } from '@lunar-kit/core';
import { View, Button, Text } from 'react-native';
import { useEffect } from 'react';

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const colors = useThemeColors();
  const { setOptions } = useToolbar();

  useEffect(() => {
    setOptions({
      title: 'Settings',
      headerShown: true,
    });
  }, [setOptions]);

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground mb-2">Current theme: {theme}</Text>
      
      <Button
        title="Toggle Dark Mode"
        onPress={() => {
          toggleTheme();
          toast({
            title: 'Theme Updated',
            description: `Switched to ${theme === 'light' ? 'dark' : 'light'} mode`,
          });
        }}
      />
    </View>
  );
}
```

### Managing State with Zustand
```tsx
// src/stores/counter-store.ts
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage in component
import { useCounterStore } from '@/stores/counter-store';
import { Button, Text } from '@/components/ui';

export function Counter() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-3xl font-bold">{count}</Text>
      <Button onPress={increment} className="mt-4">
        <Text>Increment</Text>
      </Button>
      <Button onPress={decrement} className="mt-2">
        <Text>Decrement</Text>
      </Button>
    </View>
  );
}
```

### Navigation Setup (Expo Router)
```tsx
// app/_layout.tsx
import { ThemeProvider, useTheme } from '@lunar-kit/core';
import { Stack } from 'expo-router';

function RootLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}
```

---

## 7. Theme & Styling System

### Design Tokens

Lunar Kit uses CSS variables for theming (via NativeWind). Tokens are defined in `src/lib/theme.ts`:

```typescript
// Example theme structure
export const colors = {
  // Semantic colors
  primary: 'hsl(262, 80%, 50%)',           // Purple
  secondary: 'hsl(49, 100%, 50%)',          // Yellow
  destructive: 'hsl(0, 100%, 50%)',         // Red
  muted: 'hsl(240, 3.7%, 15.9%)',          // Gray
  accent: 'hsl(262, 80%, 50%)',
  
  // Text colors
  foreground: 'hsl(0, 0%, 100%)',
  'muted-foreground': 'hsl(215, 14%, 34%)',
  
  // Background
  background: 'hsl(240, 10%, 3.9%)',
  'card-background': 'hsl(240, 10%, 9.8%)',
  
  // Borders
  border: 'hsl(215, 27.9%, 16.9%)',
  input: 'hsl(215, 27.9%, 16.9%)',
};
```

### Dark Mode Implementation

NativeWind automatically applies CSS variables based on device color scheme:

```tsx
// Components automatically respond to theme
<View className="bg-background text-foreground">
  {/* Light mode: white background, black text */}
  {/* Dark mode: black background, white text */}
</View>
```

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--colors-primary) / <alpha-value>)',
        secondary: 'hsl(var(--colors-secondary) / <alpha-value>)',
        // ... other color tokens
      },
    },
  },
  plugins: [require('nativewind/plugin')],
};
```

### Customizing Component Styles

Use the `className` prop to override component styles:

```tsx
import { Button, Text } from '@/components/ui';

// Override button color
<Button className="bg-green-500 hover:bg-green-600">
  <Text>Custom Button</Text>
</Button>

// Conditional styling
<View className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary',
  isDisabled && 'opacity-50'
)}>
  Content
</View>
```

### Creating Custom Styled Components

```tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

const cardVariants = cva(
  'rounded-lg border border-border',
  {
    variants: {
      variant: {
        default: 'bg-card',
        elevated: 'bg-card shadow-lg',
        outline: 'bg-transparent border-2',
      },
      padding: {
        default: 'p-4',
        lg: 'p-6',
        sm: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export function CustomCard({ variant, padding, className, ...props }) {
  return (
    <View className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}
```

---

## 8. Architecture & Design Decisions

### Why NativeWind?

**Chosen over:** styled-components (RN), UI libraries (NativeBase, React Native Paper)

**Advantages:**
- **Consistency:** Same Tailwind utility classes across React Native and Web
- **Developer velocity:** Familiar Tailwind patterns reduce learning curve
- **File size:** Utilities compiled at build time, not bundled into JS
- **Theming:** CSS variables enable system-wide dark mode without code changes
- **Flexibility:** Arbitrary utility values (`w-[42px]`) support custom designs

### Primitives Layer (`@lunar-primitive/*`)

The library abstracts platform differences via primitives:

**`@lunar-primitive/adaptive-modal`**
- Uses `react-native/Modal` on iOS/Android
- Uses DOM `Portal` on Web (React)
- Single import, works everywhere: `<AdaptiveModal />`

**`@lunar-primitive/bottom-sheet`**
- Encapsulates Reanimated + Gesture Handler complexity
- Provides snap points, pan gestures, layout animation
- Used by Dialog and Select Sheet components

**Benefit:** Component authors use primitives, not platform-specific APIs directly.

### Registry System Rationale

Components are published via **registry files** (JSON), not as a monolithic package.

**Why:**
1. **Selective adoption:** Add only components you need (Button, not full library)
2. **Zero bloat:** Unused components don't ship with your app
3. **Dependency resolution:** CLI auto-fetches component dependencies (Button → Text)
4. **Version flexibility:** Update individual components independently
5. **Tree-shaking ready:** ESM exports enable dead-code elimination

**Analogous to:** shadcn/ui (React), but built for React Native from the ground up.

### Module-Driven Architecture

Lunar Kit CLI promotes feature-based organization:

```
src/modules/
├── auth/
│   ├── screens/       # Feature UI screens
│   ├── components/    # Feature-specific components
│   ├── hooks/         # Feature-specific hooks
│   ├── stores/        # Feature state (Zustand)
│   ├── services/      # Feature API clients
│   └── types.ts       # Feature types
├── dashboard/         # Similar structure
└── ...
```

**Benefits:**
- **Scalability:** Organize by feature, not by file type
- **Isolation:** Each feature is self-contained
- **Code splitting:** Easy to lazy-load modules with Expo Router
- **Team handoff:** Clear ownership boundaries

### Monorepo Benefits

Organizing CLI, components, and primitives in one monorepo enables:
- **Synchronized updates:** All packages version together
- **Shared testing:** Single CI/CD for all packages
- **Unified documentation:** Single source of truth

---

## 9. Hooks & Stores

### `useTheme()`

Access and control the theme context.

```tsx
import { useTheme } from '@lunar-kit/core';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onPress={toggleTheme}>
      <Text>Current: {theme}</Text>
    </Button>
  );
}
```

**API:**
- `theme: 'light' | 'dark'` — Current theme
- `toggleTheme(): void` — Switch between light/dark
- `setTheme(theme: 'light' | 'dark'): void` — Set specific theme

### `useThemeColors()`

Get resolved color tokens for the current theme.

```tsx
import { useThemeColors } from '@lunar-kit/core';

export function ColoredBox() {
  const colors = useThemeColors();
  
  return (
    <View style={{ backgroundColor: colors.primary }}>
      <Text style={{ color: colors.foreground }}>Content</Text>
    </View>
  );
}
```

**Returns:** Object with all CSS variable colors (primary, secondary, muted, etc.)

### `useToast()`

Trigger toast notifications.

```tsx
import { useToast } from '@lunar-kit/core';

export function ToastExample() {
  const { toast } = useToast();

  return (
    <Button onPress={() => toast({
      title: 'Success',
      description: 'Action completed!',
      variant: 'success', // or 'error', 'warning', 'info'
    })}>
      <Text>Show Toast</Text>
    </Button>
  );
}
```

**API:**
```typescript
toast({
  title: string;           // Toast heading
  description?: string;    // Toast body
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;       // ms (default 3000)
});
```

### `useToolbar()`

Control navigation toolbar (header, options).

```tsx
import { useToolbar } from '@lunar-kit/core';
import { useEffect } from 'react';

export function DetailsScreen() {
  const { setOptions } = useToolbar();

  useEffect(() => {
    setOptions({
      title: 'Detail View',
      headerShown: true,
      headerRight: () => <ShareButton />,
    });
  }, [setOptions]);

  return <View>...</View>;
}
```

### Zustand Pattern (State Management)

Lunar Kit uses **Zustand** for global state. CLI scaffolds stores:

```tsx
// src/stores/user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-store', // LocalStorage key
    }
  )
);

// Usage
import { useUserStore } from '@/stores/user-store';

export function Profile() {
  const { user, logout } = useUserStore();

  return (
    <View>
      <Text>{user?.name}</Text>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
```

### Theme Store (Internal)

Lunar Kit maintains theme state internally via Zustand. Access it via `useTheme()`:

```typescript
// Internal implementation (FYI)
const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}));
```

### Toast Store (Internal)

Toast notifications are managed by an internal Zustand store. Use the `useToast()` hook.

---

## 10. Key Files & Exports

### Main Exports from `@lunar-kit/core`

#### Components
```typescript
export {
  // Form
  Button, Input, Textarea, Checkbox, Radio, RadioGroup,
  Select, SelectSheet, Switch, Slider, InputOTP,
  
  // Layout
  Card, Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogBody, BottomSheet, Banner, Accordion, Breadcrumb,
  
  // Display
  Avatar, Badge, Progress, Skeleton, Separator,
  Text, Tooltip, EmptyState,
  
  // Data
  Calendar, DatePicker, DateRangePicker, Carousel,
  Tabs, KeyboardAvoidingView, SearchBar, DropdownMenu,
  
  // Advanced
  StepIndicator,
} from './components/ui';
```

#### Hooks
```typescript
export {
  useTheme,
  useThemeColors,
  useToolbar,
  useToast,
} from './hooks';
```

#### Providers
```typescript
export { ThemeProvider } from './providers/theme-provider';
```

#### Stores
```typescript
export { toast } from './stores/toast';
```

#### CLI Templates (Used by CLI)
```typescript
export {
  moduleTemplate,
  viewTemplate,
  componentTemplate,
  hookTemplate,
  storeTemplate,
  serviceTemplate,
  // ... other templates
} from './templates';
```

### CLI Exports (`@lunar-kit/cli`)

```
lunar init                      # Initialize project
lunar add <component(s)>        # Add components
lunar generate <generator>      # Execute generator
```

### Key Configuration Files

#### `kit.config.json`
Located at project root after `lunar init`:
```json
{
  "name": "app-name",
  "description": "My Lunar Kit App",
  "typescript": true,
  "packageManager": "bun",
  "alias": "@"
}
```

#### `tsconfig.json`
Includes path aliases for components:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### `tailwind.config.js`
Extends with NativeWind plugin and color tokens:
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { /* theme tokens */ }
    }
  },
  plugins: [require('nativewind/plugin')]
};
```

### Build Outputs

After `bun run build`:

```
packages/core/dist/          # ESM components + main export
packages/cli/dist/index.js   # CLI binary (lunar command)
```

**Core exports:**
- `dist/index.js` — All components, hooks, providers
- `dist/templates.js` — CLI template generators
- `dist/cli-utils.js` — CLI helper functions

---

## Quick Reference

### Common Commands
```bash
# Initialize
lunar init

# Add components
lunar add button card input
lunar add --all

# Generate feature module
lunar g mod auth
lunar g mod:vi auth/login
lunar g mod:st auth/auth-store

# Generate globals
lunar g component my-button
lunar g hook use-my-hook

# Build (from repo root)
bun run build
```

### Important Patterns
- **Styling:** Tailwind utility classes + `cn()` utility
- **State:** Zustand stores with optional persistence
- **Forms:** React Hook Form + Zod validation
- **Navigation:** Expo Router (file-based)
- **Themes:** CSS variables via NativeWind
- **Components:** CVA for variants, TypeScript for types

### Repository Links
- **Monorepo:** `/Users/dimasmaulana/Documents/personal/lunar-kit/lunar-kit`
- **Core:** `packages/core/`
- **CLI:** `packages/cli/`
- **Docs:** `docs/`
- **Example:** `apps/example/`

---

**Last Updated:** April 2026 | **Version:** 0.1.20
