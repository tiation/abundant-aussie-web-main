# RiggerConnect Testing Guide

This document outlines the comprehensive cross-platform testing strategy for the RiggerConnect mobile application, following enterprise standards outlined by ChaseWhiteRabbit NGO.

## Overview

Our testing approach covers:
- **Unit Tests**: Component and service testing with Jest and React Testing Library
- **Integration Tests**: Full application flow testing
- **Capacitor Tests**: Device plugin and native API testing
- **Platform Tests**: Android and iOS native testing
- **E2E Tests**: End-to-end user journey testing

## Testing Stack

### Core Testing Tools
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation
- **ts-jest**: TypeScript support for Jest

### Platform-Specific Testing
- **Android**: Espresso and JUnit for instrumented tests
- **iOS**: XCTest for native iOS testing
- **Capacitor**: Mock plugins for cross-platform API testing

## Test Structure

```
tests/
├── setup/              # Test configuration and setup
│   └── jest.setup.js   # Global test setup
├── utils/              # Test utilities and helpers
│   └── test-utils.tsx  # Custom render functions and factories
├── mocks/              # Mock implementations
│   ├── capacitor.ts    # Capacitor plugin mocks
│   └── supabase.ts     # Supabase client mocks
├── unit/               # Unit tests
├── integration/        # Integration tests
├── capacitor/          # Capacitor plugin tests
├── e2e/               # End-to-end tests
└── android/           # Android-specific native tests
```

## Running Tests

### All Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:ci           # Run tests in CI mode
```

### Specific Test Suites
```bash
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:capacitor    # Capacitor plugin tests only
npm run test:e2e         # End-to-end tests only
```

### Platform-Specific Tests
```bash
npm run test:android     # Android native tests
npm run test:ios         # iOS native tests
npm run test:enterprise  # Full enterprise test suite
```

## Test Categories

### 1. Unit Tests (`src/**/__tests__/**`)

Unit tests focus on individual components and services in isolation.

**Component Testing Example:**
```typescript
// src/components/__tests__/Auth.test.tsx
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import Auth from '../Auth';

describe('Auth Component', () => {
  it('renders login form by default', () => {
    render(<Auth />);
    expect(screen.getByText('Sign In to RiggerConnect')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    // Test implementation
  });
});
```

**Service Testing Example:**
```typescript
// src/services/__tests__/NotificationService.test.ts
import { NotificationService } from '../NotificationService';

describe('NotificationService', () => {
  it('should schedule local notifications', async () => {
    // Test implementation
  });
});
```

### 2. Integration Tests (`tests/integration/`)

Integration tests verify complete user flows and component interactions.

**App Flow Testing:**
```typescript
// tests/integration/app-flow.test.tsx
describe('App Integration Tests', () => {
  it('should handle complete authentication flow', async () => {
    render(<App />);
    // Simulate login process
    // Verify dashboard loads
  });

  it('should handle offline functionality', async () => {
    // Mock offline network status
    // Verify app works offline
  });
});
```

### 3. Capacitor Tests (`tests/capacitor/`)

Tests for Capacitor plugins and device API integration.

**Device Plugin Testing:**
```typescript
// tests/capacitor/device.test.ts
import { Device } from '@capacitor/device';

describe('Device Plugin', () => {
  it('should get device information', async () => {
    const deviceInfo = await Device.getInfo();
    expect(deviceInfo.platform).toBeDefined();
  });
});
```

### 4. Native Platform Tests

#### Android Tests (`tests/android/`)
```java
// tests/android/RiggerConnectTest.java
@RunWith(AndroidJUnit4.class)
public class RiggerConnectTest {
    @Test
    public void testMainActivityLaunches() {
        // Test native Android functionality
    }
}
```

#### iOS Tests
```swift
// RiggerConnectTests/RiggerConnectTests.swift
import XCTest
@testable import RiggerConnect

class RiggerConnectTests: XCTestCase {
    func testMainViewLoads() {
        // Test native iOS functionality
    }
}
```

## Testing Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names that explain the behavior
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Mocking Strategy
```typescript
// Mock external dependencies
jest.mock('@capacitor/device');
jest.mock('../../services/supabase');

// Use test data factories
const mockUser = createMockUser({ email: 'test@example.com' });
```

### 3. Async Testing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});

// Handle promises properly
await expect(service.fetchData()).resolves.toEqual(expectedData);
```

### 4. Error Testing
```typescript
it('handles network errors gracefully', async () => {
  mockSupabase.auth.signInWithPassword.mockRejectedValue(
    new Error('Network error')
  );
  
  // Test error handling
  await waitFor(() => {
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });
});
```

## Coverage Requirements

Following enterprise standards, we maintain:
- **Minimum 80% code coverage** across all metrics:
  - Lines: 80%
  - Functions: 80%
  - Branches: 80%
  - Statements: 80%

### Coverage Reports
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - Visual HTML report
- `coverage/lcov.info` - LCOV format for CI integration
- `coverage/coverage-final.json` - JSON format for programmatic access

## Continuous Integration

### GitHub Actions Integration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:android
```

### Test Reports
- Unit test results in JUnit XML format
- Coverage reports in LCOV format
- Integration test screenshots
- Performance metrics

## Platform-Specific Considerations

### Web Testing
- Tests run in jsdom environment
- Mock browser APIs (localStorage, fetch, etc.)
- Test responsive design breakpoints

### Mobile Testing
- Mock Capacitor plugins
- Test offline functionality
- Verify platform-specific UI adaptations
- Test device orientation changes

### Enterprise Standards Compliance

1. **Security Testing**
   - Authentication flow validation
   - Data encryption verification
   - Input sanitization tests

2. **Performance Testing**
   - Component render performance
   - Memory leak detection
   - Network request optimization

3. **Accessibility Testing**
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast validation

4. **Error Handling**
   - Network failure scenarios
   - Device permission denials
   - Data corruption recovery

## Test Data Management

### Mock Data Factories
```typescript
// tests/utils/test-utils.tsx
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@riggerconnect.com',
  user_metadata: { full_name: 'John Doe' },
  ...overrides,
});
```

### Test Database
- Use separate test database for integration tests
- Seed data for consistent test scenarios
- Clean up after test runs

## Debugging Tests

### Common Issues
1. **Async timing issues**: Use waitFor() for async operations
2. **Mock not working**: Ensure mocks are properly configured
3. **DOM queries failing**: Use appropriate queries (getByRole, getByLabelText)

### Debug Commands
```bash
# Run specific test
npm test -- --testNamePattern="Auth Component"

# Debug mode
npm test -- --debug

# Verbose output
npm test -- --verbose
```

## Performance Testing

### Component Performance
```typescript
// Test component render performance
it('should render large lists efficiently', () => {
  const startTime = performance.now();
  render(<JobList jobs={largeMockJobsList} />);
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
});
```

### Memory Testing
```typescript
// Test for memory leaks
it('should not leak memory on unmount', () => {
  const { unmount } = render(<Component />);
  unmount();
  
  // Verify cleanup
  expect(mockCleanupFunction).toHaveBeenCalled();
});
```

## Deployment Testing

### Pre-deployment Checklist
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Platform-specific tests pass
- [ ] Coverage meets requirements (80%+)
- [ ] Performance benchmarks met
- [ ] Security tests pass
- [ ] Accessibility tests pass

### Staging Environment Testing
```bash
# Deploy to staging and run E2E tests
npm run deploy:staging
npm run test:e2e:staging
```

## Contributing to Tests

### Adding New Tests
1. Place unit tests alongside source files in `__tests__` directories
2. Add integration tests to `tests/integration/`
3. Update test utilities for reusable components
4. Maintain test coverage above 80%

### Test Review Checklist
- [ ] Tests cover happy path and error cases
- [ ] Descriptive test names
- [ ] Proper mocking of dependencies
- [ ] No hardcoded values
- [ ] Async operations handled correctly
- [ ] Accessibility considerations included

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Capacitor Testing Guide](https://capacitorjs.com/docs/testing)
- [Android Testing](https://developer.android.com/training/testing)
- [iOS Testing](https://developer.apple.com/documentation/xctest)

## Support

For testing questions or issues:
1. Check existing test examples
2. Review this documentation
3. Consult the test utilities in `tests/utils/`
4. Contact the ChaseWhiteRabbit NGO development team

---

**Note**: This testing strategy ensures enterprise-grade quality and cross-platform compatibility for the RiggerConnect mobile application.
