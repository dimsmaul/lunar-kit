# create-lunar-kit

Scaffold a new React Native app with Lunar Kit and NativeWind pre-configured - the fastest way to start building beautiful mobile apps.

## Quick Start

Create a new Lunar Kit project with a single command:

```bash
npm create lunar-kit@latest
# or
pnpm create lunar-kit
# or
yarn create lunar-kit
```

## What You Get

A fully configured React Native + Expo project with:

✅ **Lunar Kit** - Component library pre-installed  
✅ **NativeWind v4** - Tailwind CSS for React Native  
✅ **Expo Router** - File-based routing  
✅ **TypeScript** - Full type safety (optional)  
✅ **Dark Mode** - Theme system built-in  
✅ **Best Practices** - Organized folder structure  

## Interactive Setup

When you run the command, you'll be prompted to configure your project:

```bash
? Project name: › my-app
? Select a template: › 
  ❯ Default (Expo Router + NativeWind)
    Minimal (Basic setup)
? Use TypeScript? › Yes / No
? Install dependencies? › Yes / No
? Package manager: › 
  ❯ pnpm
    npm
    yarn
```

## Project Structure

After scaffolding, your project will look like:

```
my-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   └── (tabs)/             # Tab navigation
├── src/
│   ├── components/         # Shared components
│   │   └── ui/            # Lunar Kit UI components
│   ├── lib/               # Utilities
│   │   └── utils.ts       # Helper functions (cn)
│   ├── hooks/             # Custom hooks
│   ├── contexts/          # React contexts
│   └── providers/         # App providers
├── assets/                # Images, fonts, etc.
├── tailwind.config.js     # Tailwind configuration
├── nativewind-env.d.ts    # NativeWind types
├── app.json               # Expo configuration
└── package.json
```

## Templates

### Default Template (Recommended)

Full-featured setup with:
- Expo Router with tab navigation
- NativeWind configured
- Theme provider with dark mode
- Example components and screens
- TypeScript ready

### Minimal Template

Bare-bones setup with:
- Basic Expo Router setup
- NativeWind configured
- Essential utilities only
- Clean slate for custom architecture

## What Happens During Scaffolding

1. **Project Creation**
   - Creates project directory
   - Copies template files
   - Sets up package.json

2. **Dependencies Installation** (if selected)
   - Installs Expo and React Native
   - Installs NativeWind and dependencies
   - Installs Lunar Kit packages
   - Installs development tools

3. **Configuration**
   - Configures TypeScript (if selected)
   - Sets up tailwind.config.js
   - Configures NativeWind
   - Initializes Git repository

4. **Post-Setup**
   - Generates type definitions
   - Creates necessary directories
   - Copies base components

## After Creation

Once your project is created, navigate to it and start developing:

```bash
cd my-app

# Start the development server
npm start
# or
pnpm start
# or
yarn start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for Expo Go on your device

## Adding More Components

After setup, use the Lunar Kit CLI to add more components:

```bash
# Install the CLI globally (if not already)
pnpm add -g @lunar-kit/cli

# Add components to your project
lunar-kit add button card dialog

# Or add all components
lunar-kit add --all
```

## Example Usage

After creation, you can start building immediately:

```typescript
// app/index.tsx
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Card className="w-full">
        <Card.Header>
          <Card.Title>Welcome to Lunar Kit!</Card.Title>
          <Card.Description>
            Start building your app with beautiful components
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Text>
            This project is powered by Lunar Kit and NativeWind.
          </Text>
        </Card.Content>
        <Card.Footer>
          <Button variant="default">
            Get Started
          </Button>
        </Card.Footer>
      </Card>
    </View>
  );
}
```

## CLI Options

Run with options to skip interactive prompts:

```bash
# Create with specific options
npm create lunar-kit@latest my-app -- --template default --typescript

# Available flags:
--template <name>      Template to use (default|minimal)
--typescript          Use TypeScript
--no-typescript       Use JavaScript
--install             Install dependencies
--no-install          Skip dependency installation
--packageManager      Package manager to use (pnpm|npm|yarn)
```

### Examples

```bash
# TypeScript project with pnpm
npm create lunar-kit@latest my-app -- --typescript --packageManager pnpm

# JavaScript project, skip install
npm create lunar-kit@latest my-app -- --no-typescript --no-install

# Minimal template
npm create lunar-kit@latest my-app -- --template minimal
```

## Requirements

- **Node.js**: >= 18.0.0
- **Package Manager**: npm, pnpm, or yarn
- **iOS**: Xcode 14.0+ (for iOS development)
- **Android**: Android Studio with SDK (for Android development)

## Features Included

### NativeWind v4

Tailwind CSS utilities work natively:

```typescript
<View className="flex-1 bg-white dark:bg-gray-900 p-4">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

### Dark Mode

Theme provider included:

```typescript
import { useTheme } from '@/hooks/useTheme';

const { theme, toggleTheme } = useTheme();
```

### Type Safety

Full TypeScript support with proper types:

```typescript
import type { ButtonProps } from '@/components/ui/button';
```

### File-based Routing

Expo Router for intuitive navigation:

```
app/
  index.tsx           → /
  profile.tsx         → /profile
  settings/
    index.tsx         → /settings
    account.tsx       → /settings/account
```

## Updating

Keep your project up to date:

```bash
# Update Lunar Kit packages
pnpm update @lunar-kit/cli @lunar-kit/core

# Update Expo SDK
npx expo install --fix
```

## Troubleshooting

### Installation Fails

```bash
# Clear cache and retry
pnpm store prune
pnpm create lunar-kit

# Or use npx with npm
npx create-lunar-kit@latest
```

### NativeWind Not Working

```bash
# Regenerate NativeWind setup
pnpm nativewind:check

# Clear Metro cache
pnpm start --clear
```

### Type Errors

```bash
# Regenerate types
npx expo customize tsconfig.json

# Check NativeWind types
cat nativewind-env.d.ts
```

## Differences from create-expo-app

`create-lunar-kit` extends Expo with:

- ✅ Pre-configured component library
- ✅ NativeWind (Tailwind CSS) setup
- ✅ Theme system with dark mode
- ✅ Better folder structure
- ✅ Utility functions included
- ✅ CLI tool for adding components

## Examples & Demos

Check out example apps in the [repository](https://github.com/yourusername/lunar-kit/tree/main/apps/example).

## Support

- [Documentation](https://github.com/yourusername/lunar-kit#readme)
- [Discord Community](https://discord.gg/your-invite)
- [GitHub Issues](https://github.com/yourusername/lunar-kit/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/lunar-kit)

## What's Next?

After creating your project:

1. **Explore Components**: Check `src/components/ui/`
2. **Add More Components**: Use `lunar-kit add <component>`
3. **Customize Theme**: Edit `tailwind.config.js`
4. **Build Screens**: Add files to `app/` directory
5. **Deploy**: Use Expo EAS Build

## Related Packages

- [@lunar-kit/cli](../cli) - CLI for managing components
- [@lunar-kit/core](../core) - Core component registry

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT © Dimas Maulana

---

**Made with 🌙 by the Lunar Kit team**
