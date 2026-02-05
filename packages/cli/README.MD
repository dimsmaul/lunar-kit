# @lunar-kit/cli

CLI tool for Lunar Kit - A component library for React Native with NativeWind.

## Installation

```bash
npm install -g @lunar-kit/cli
# or
pnpm add -g @lunar-kit/cli
# or
yarn global add @lunar-kit/cli
```

## Usage

The CLI provides several commands to help you manage your Lunar Kit components:

```bash
lunar-kit [command] [options]
# or use shorter aliases
lk [command] [options]
lunar [command] [options]
```

## Commands

### `init`

Initialize Lunar Kit in your existing React Native project.

```bash
lunar-kit init
```

This command will:
- Create `src/components/ui` directory for your components
- Set up `lib/utils.ts` with helper functions (cn)
- Install required dependencies (clsx, tailwind-merge)
- Configure your project structure

**Options:**
- Interactive prompts will ask for:
  - TypeScript preference
  - Package manager (pnpm/npm/yarn)

### `add`

Add components from the Lunar Kit registry to your project.

```bash
lunar-kit add <component-name>
```

**Examples:**

```bash
# Add a single component
lunar-kit add button

# Add multiple components
lunar-kit add button card dialog

# Add all components
lunar-kit add --all
```

**What it does:**
- Downloads component files from the registry
- Installs required dependencies
- Resolves and installs registry dependencies automatically
- Updates component imports and paths

### `generate` (or `gen`)

Generate new components or modules using templates.

```bash
lunar-kit generate [options]
```

**Subcommands:**

#### Global Component
```bash
lunar-kit gen global <component-name>
# or
lunar-kit generate global MyComponent
```

Creates a global component in `src/components/`

#### Scoped Component
```bash
lunar-kit gen scoped <module-name> <component-name>
# or
lunar-kit generate scoped auth LoginForm
```

Creates a scoped component within a module, e.g., `src/modules/auth/components/LoginForm.tsx`

### `module`

Generate a complete module structure with all necessary folders.

```bash
lunar-kit module <module-name>
```

**Example:**

```bash
lunar-kit module auth
```

This creates:
```
src/modules/auth/
  ├── components/
  ├── hooks/
  ├── screens/
  ├── services/
  └── types/
```

## Available Components

Lunar Kit includes a rich set of pre-built components:

- **Form Components**: Button, Input, Textarea, Checkbox, Radio, Select
- **Layout Components**: Card, Banner, Bottom Sheet, Dialog
- **Display Components**: Avatar, Badge, Text
- **Data Components**: Calendar, Date Picker, Date Range Picker
- **Navigation**: Tabs
- **Form Management**: Form (with validation)
- **Interactive**: Accordion, Select Sheet

## Configuration

The CLI reads configuration from `kit.config.json` in your project root:

```json
{
  "typescript": true,
  "componentsPath": "src/components",
  "packageManager": "pnpm"
}
```

## Requirements

- **Node.js**: >= 18.0.0
- **React Native** project with **Expo** or bare workflow
- **NativeWind** configured in your project

## Examples

### Complete Setup Flow

```bash
# 1. Create a new Expo app (if you haven't already)
npx create-expo-app my-app
cd my-app

# 2. Initialize Lunar Kit
lunar-kit init

# 3. Add some components
lunar-kit add button card input

# 4. Start building!
```

### Adding Components to Existing Project

```bash
# Add specific components you need
lunar-kit add dialog select calendar

# Or add everything at once
lunar-kit add --all
```

### Generating Custom Components

```bash
# Create a global shared component
lunar-kit gen global UserCard

# Create module-specific components
lunar-kit module profile
lunar-kit gen scoped profile ProfileHeader
lunar-kit gen scoped profile ProfileStats
```

## Package Manager Support

Lunar Kit CLI automatically detects and works with:
- **pnpm** (recommended)
- **npm**
- **yarn**

The CLI will use the package manager specified during `init` or auto-detect based on lock files.

## Troubleshooting

### Command not found

If you get "command not found" error after installation:

```bash
# For npm
npm install -g @lunar-kit/cli

# For pnpm
pnpm add -g @lunar-kit/cli

# Verify installation
which lunar-kit
```

### Registry not found

If you encounter registry errors:

```bash
# Reinstall the CLI
pnpm add -g @lunar-kit/cli

# Verify @lunar-kit/core is installed
pnpm list @lunar-kit/core
```

## Links

- [GitHub Repository](https://github.com/dimsmaul/lunar-kit)
- [Documentation](https://github.com/dimsmaul/lunar-kit#readme)
- [Report Issues](https://github.com/dimsmaul/lunar-kit/issues)

## License

MIT © Dimas Maulana
