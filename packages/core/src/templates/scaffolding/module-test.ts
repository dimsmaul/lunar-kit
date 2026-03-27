/**
 * Module Test Template
 * 
 * Usage: lunar g mod:test auth/auth-screen
 * Generates: modules/auth/__tests__/auth-screen.test.tsx
 */

import { toSnakeCase, toPascalCase } from '../../lib/string-utils';

export interface ModuleTestTemplateOptions {
  testName: string;
  moduleName: string;
}

export function generateModuleTestTemplate(options: ModuleTestTemplateOptions): string {
  const { testName, moduleName } = options;
  const componentName = toPascalCase(testName);
  const snakeName = toSnakeCase(testName);

  return `/**
 * ${componentName} Tests
 */

import { render, screen, fireEvent } from '@testing-library/react-native';
import ${componentName} from '../view/${snakeName}_view';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName}')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<${componentName} />);
    expect(toJSON()).toMatchSnapshot();
  });

  // Add more tests here
  // it('handles user interaction', () => {
  //   render(<${componentName} />);
  //   fireEvent.press(screen.getByTestId('button'));
  //   expect(...).toBeTruthy();
  // });
});
`;
}

export default generateModuleTestTemplate;
