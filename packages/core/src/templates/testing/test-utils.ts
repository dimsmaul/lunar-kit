/**
 * Test Utilities Template
 * 
 * Usage: lunar g test utils
 * Generates: __tests__/test-utils.tsx
 */

export function generateTestUtilsTemplate(): string {
  return `import { render as nativeRender, RenderOptions, RenderAPI } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withNavigation?: boolean;
  withSafeArea?: boolean;
}

interface AllProvidersProps {
  children: React.ReactNode;
  withNavigation?: boolean;
  withSafeArea?: boolean;
}

function AllProviders({
  children,
  withNavigation = false,
  withSafeArea = true,
}: AllProvidersProps) {
  let content = children;

  if (withNavigation) {
    content = <NavigationContainer>{content}</NavigationContainer>;
  }

  if (withSafeArea) {
    content = <SafeAreaProvider>{content}</SafeAreaProvider>;
  }

  return content;
}

function customRender(
  ui: React.ReactElement,
  options?: CustomRenderOptions
): RenderAPI {
  const { withNavigation = false, withSafeArea = true, ...renderOptions } = options || {};

  return nativeRender(ui, {
    wrapper: (props) => (
      <AllProviders withNavigation={withNavigation} withSafeArea={withSafeArea}>
        {props.children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

export * from '@testing-library/react-native';
export { customRender as render };
`;
}

export default generateTestUtilsTemplate;
