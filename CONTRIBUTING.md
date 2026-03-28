# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Bun workspaces](https://bun.sh/docs/install/workspaces). It contains the following packages:

- **`@lunar-kit/core`** - Shared registry and UI components in `packages/core/`
- **`@lunar-kit/cli`** - Module generator CLI in `packages/cli/`
- **`create-lunar-kit`** - Project scaffolding CLI in `packages/create-lunar-kit/`

And an example application:
- **`example`** - Example Expo application in `apps/example/`

To get started with the project, make sure you have [Bun](https://bun.sh/) installed.

### Prerequisites

- [Bun](https://bun.sh/) natively installed.

Install Bun globally if you haven't:

```sh
curl -fsSL https://bun.sh/install | bash
```

### Installation

Run `bun install` in the root directory to install the required dependencies for all packages and apps:

```sh
bun install
```

Since the project relies on Bun workspaces, you should use `bun` instead of `npm`, `yarn`, or `pnpm` for development.

### Building packages

Build all packages from the root directory by running their respect build scripts if applicable:

```sh
bun run build:cli
```

Or build a specific CLI package:

```sh
cd packages/create-lunar-kit
bun run build
```

```sh
cd packages/cli
bun run build
```

### Testing locally

To test `create-lunar-kit` locally:

```sh
cd packages/create-lunar-kit
bun run build
npm link -g
```

Then test it anywhere:
```sh
cd ../..
mkdir test-project
cd test-project
create-lunar-kit my-app
```

To test `@lunar-kit/cli` locally:

```sh
cd packages/cli
bun run build
npm link -g
```

Then test it in a Lunar Kit project:
```sh
cd /path/to/lunar-kit-project
lunar g mod auth/login
```

### Dev Scripts

To run the example app locally:

```sh
bun run dev
```

To run the CLI module in watch mode:

```sh
bun run dev:cli
```

### Linting and Type Checking

Make sure your code passes TypeScript in the respective packages if defined, though typically you'd run `tsc --noEmit` or similar scripts depending on what's configured.

```sh
bun run lint
```
*(If lint scripts are configured in the target package)*

## Release Process

The project uses a fully automated release pipeline via GitHub Actions.

### Stable Releases (to `main`)
- **Automated**: Every merge/push to `main` will automatically bump the patch version, tag it, and publish to NPM as `latest`.
- **Manual**: To specify a version, use a commit message like `release: 0.1.21`.

### Beta Releases (to `dev`)
- **Automated**: Every push to `dev` will automatically publish a beta version (e.g., `0.1.20-beta.45`) with the `beta` tag. No Git tag is created.
- **Manual**: To create a formal, tagged beta version, use a commit message like `beta: 0.1.20-beta.1`. This will create a Git tag `v0.1.20-beta.1`.

### Installing Pre-releases
Test the beta version by running:
```sh
bunx create-lunar-kit@beta
```
or 
```sh
npm install @lunar-kit/core@beta
```