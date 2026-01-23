# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [pnpm workspaces](https://pnpm.io/workspaces). It contains the following packages:

- **create-lunar-kit** - Project scaffolding CLI in `packages/create-lunar-kit/`
- **lunar-kit-cli** - Module generator CLI in `packages/lunar-kit-cli/`

To get started with the project, make sure you have the correct version of [Node.js](https://nodejs.org/) installed. See the [`.nvmrc`](./.nvmrc) file for the version used in this project.

### Prerequisites

- Node.js (see `.nvmrc` for version)
- pnpm 8.x or higher

Install pnpm globally if you haven't:

```sh
npm install -g pnpm
```
### Installation
Run pnpm install in the root directory to install the required dependencies for each package:

```sh
pnpm install
```
Since the project relies on pnpm workspaces, you cannot use npm or yarn for development without manually migrating.

### Building packages
Build all packages from the root directory:

```sh
pnpm build
```
Or build a specific package:

```sh
cd packages/create-lunar-kit
pnpm build
```
```sh
cd packages/lunar-kit-cli
pnpm build
```

Testing locally to test create-lunar-kit:

```sh
cd packages/create-lunar-kit
npm build
npm link -g
```

# Test it
```sh
cd ../..
mkdir test-project
cd test-project
create-lunar-kit my-app
```
To test lunar-kit-cli:

```sh
cd packages/lunar-kit-cli
pnpm build
npm link -g
```

# Test it in a Lunar Kit project
```sh
cd /path/to/lunar-kit-project
lunar g mod auth/login
lunar g mod:vi auth/splash
```
### Linting and Type Checking
Make sure your code passes TypeScript:

```sh
pnpm typecheck
```
To check for linting errors, run the following:

```sh
pnpm lint
```
To fix formatting errors, run the following:

```sh
pnpm lint --fix
```
### Testing
Run the unit tests:

```sh
pnpm test
```
Run tests in watch mode:

```sh
pnpm test:watch
```