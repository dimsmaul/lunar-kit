/**
 * Mock Data Template
 * 
 * Usage: lunar g test mocks
 * Generates: __tests__/mocks.ts
 */

export function generateMocksTemplate(): string {
  return `// Mock data for testing

// ============================================
// User Mocks
// ============================================

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockUsers = [
  mockUser,
  {
    id: '2',
    email: 'user2@example.com',
    name: 'User Two',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'user3@example.com',
    name: 'User Three',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// ============================================
// Product Mocks
// ============================================

export const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 99.99,
  stock: 100,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockProducts = [
  mockProduct,
  {
    id: '2',
    name: 'Another Product',
    description: 'Another test product',
    price: 149.99,
    stock: 50,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// ============================================
// Mock Handlers
// ============================================

export const mockHandlers = {
  onPress: jest.fn(),
  onSubmit: jest.fn(),
  onChange: jest.fn(),
  onDelete: jest.fn(),
  onRefresh: jest.fn(),
  onEndReached: jest.fn(),
};

// ============================================
// Mock Navigation
// ============================================

export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
};

export const mockRoute = {
  key: 'test-key',
  name: 'Test',
  params: {},
};
`;
}

export default generateMocksTemplate;
