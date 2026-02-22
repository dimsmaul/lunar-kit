# Lunar Kit

Lunar Kit is a collection of universal React Native UI components, styled with [NativeWind](https://www.nativewind.dev/) and designed for building beautiful, cross-platform mobile applications efficiently.

## Packages

This monorepo consists of several interconnected packages and applications:

- **[`@lunar-kit/core`](./packages/core)**: The core repository containing the shared component registry, hooks, providers, and raw UI components.
- **[`@lunar-kit/cli`](./packages/cli)**: A module generator CLI (`lunar`) for easily adding pre-built components and modules into your project.
- **[`create-lunar-kit`](./packages/create-lunar-kit)**: A scaffolding utility to quickly generate a new React Native / Expo application with Lunar Kit and NativeWind pre-configured.

### Apps

- **`example`**: An example Expo application located in `apps/example/` demonstrating how to integrate and use the components.

## Quick Start

To create a new project with Lunar Kit pre-configured, you can use our initialization package:

```sh
npx create-lunar-kit@latest my-app
```

Once your project is created, you can use the Lunar Kit CLI to inject modules and components:

```sh
npx @lunar-kit/cli add button
```

Or globally:

```sh
npm install -g @lunar-kit/cli
lunar add button
```

## Contributing

We welcome contributions from the community! Whether it's adding a new component, fixing a bug, or improving documentation, your help is appreciated. 

Please read our [Contributing Guide](./CONTRIBUTING.md) to learn about our development workflow, how to set up the project locally, and how to submit pull requests.

## License

MIT
