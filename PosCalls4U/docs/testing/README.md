# PosCalls4U Testing Documentation

## Overview

This document outlines the comprehensive testing strategy for the PosCalls4U call center platform, covering unit tests, integration tests, and end-to-end tests across both client and server components.

## Testing Stack

### Frontend Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking for tests
- **User Event**: Testing library for user interactions

### Backend Testing
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for Express.js
- **MongoDB Memory Server**: In-memory MongoDB instance for testing
- **Redis Mock**: Mock Redis client for testing

### End-to-End Testing
- **Cypress**: Modern E2E testing framework
- **Cypress Testing Library**: Additional testing utilities

## Test Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── **/__tests__/
│   │   ├── services/
│   │   │   └── **/__tests__/
│   │   └── tests/
│   │       ├── setup.ts
│   │       ├── mocks/
│   │       └── utils/
├── server/
│   ├── src/
│   │   ├── tests/
│   │   │   ├── setup.ts
│   │   │   ├── fixtures/
│   │   │   ├── unit/
│   │   │   └── integration/
├── cypress/
│   ├── e2e/
│   ├── support/
│   └── fixtures/
```

## Running Tests

### All Tests
```bash
npm test                    # Run all tests (client + server)
npm run test:coverage      # Run all tests with coverage
```

### Client Tests
```bash
npm run test:client         # Run client tests once
npm run test:client:watch   # Run client tests in watch mode
npm run test:client:coverage # Run client tests with coverage
```

### Server Tests
```bash
npm run test:server         # Run server tests once
npm run test:server:watch   # Run server tests in watch mode
npm run test:server:coverage # Run server tests with coverage
npm run test:integration    # Run integration tests only
npm run test:unit          # Run unit tests only
```

### E2E Tests
```bash
npm run test:e2e           # Run E2E tests headlessly
npm run test:e2e:open      # Open Cypress test runner
```

## Test Categories

### 1. Unit Tests
Test individual components and functions in isolation.

**Examples:**
- Component rendering
- Function logic
- State management
- Utility functions

**Naming Convention:** `ComponentName.test.tsx` or `functionName.test.ts`

### 2. Integration Tests
Test interactions between multiple components or modules.

**Examples:**
- API endpoint testing
- Database operations
- Component integration
- Service layer testing

**Naming Convention:** `feature.integration.test.ts`

### 3. End-to-End Tests
Test complete user workflows from UI to database.

**Examples:**
- User authentication flow
- Call management workflow
- Team management features
- Statistics dashboard

**Naming Convention:** `feature.cy.ts`

## Testing Guidelines

### Writing Good Tests

1. **Follow AAA Pattern**
   ```javascript
   // Arrange
   const user = { name: 'Test User' };
   
   // Act
   const result = processUser(user);
   
   // Assert
   expect(result).toBeDefined();
   ```

2. **Use Descriptive Test Names**
   ```javascript
   // Good
   it('should display error message when login fails with invalid credentials', () => {
   
   // Bad
   it('should handle error', () => {
   ```

3. **Test User Behavior, Not Implementation**
   ```javascript
   // Good - tests what user sees/does
   expect(screen.getByText('Welcome, John')).toBeInTheDocument();
   
   // Bad - tests implementation details
   expect(component.state.userName).toBe('John');
   ```

### Mock Strategy

1. **Mock External Dependencies**
   - API calls
   - Third-party services
   - PBX connections
   - Database operations (in unit tests)

2. **Don't Mock Internal Logic**
   - Component methods
   - Utility functions
   - Business logic

### Coverage Requirements

- **Minimum Coverage**: 80%
- **Critical Paths**: 95%
  - Authentication flows
  - Call handling
  - Team management
  - Statistics calculation

## Critical Test Scenarios

### Authentication
- [x] User login with valid credentials
- [x] User login with invalid credentials
- [x] User logout
- [x] Token expiration handling
- [x] Protected route access
- [x] Password validation
- [x] Session persistence

### Team Management
- [x] Display team list
- [x] Create new team (supervisor only)
- [x] Add/remove team members
- [x] Team statistics display
- [x] Permission-based access
- [x] Team filtering and search

### Call Statistics
- [x] Display call metrics
- [x] Real-time updates
- [x] Date range filtering
- [x] Export functionality
- [x] Error handling
- [x] Data visualization

### PBX Integration
- [ ] Call initiation
- [ ] Call termination
- [ ] Call transfer
- [ ] Call recording
- [ ] Queue management
- [ ] Extension management

### Schedule Management
- [ ] Display agent schedules
- [ ] Create/update schedules
- [ ] Schedule conflicts
- [ ] Break time management
- [ ] Availability tracking

## Continuous Integration

### Pre-commit Hooks
- Run linting
- Run unit tests
- Check test coverage

### CI Pipeline
1. Install dependencies
2. Run linting
3. Run unit tests
4. Run integration tests
5. Generate coverage reports
6. Run E2E tests (on staging)

### Coverage Reports
- HTML report: `coverage/lcov-report/index.html`
- JSON report: `coverage/coverage-final.json`
- Text summary: Console output

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use `beforeEach`/`afterEach` for common setup/teardown
- Keep tests focused and independent
- Use factories for test data creation

### Performance
- Use `beforeAll`/`afterAll` for expensive setup
- Mock heavy operations
- Clean up after tests
- Use test databases for integration tests

### Debugging
- Use `screen.debug()` for React Testing Library
- Use `cy.debug()` for Cypress
- Add meaningful error messages
- Use test data attributes (`data-cy`, `data-testid`)

### Maintenance
- Review and update tests regularly
- Remove obsolete tests
- Keep test data current
- Document complex test scenarios

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout values
   - Check for unresolved promises
   - Ensure proper cleanup

2. **Flaky tests**
   - Add proper wait conditions
   - Mock time-dependent operations
   - Use deterministic test data

3. **Memory leaks**
   - Clean up event listeners
   - Clear timers/intervals
   - Close database connections

4. **Mock issues**
   - Clear mocks between tests
   - Verify mock implementations
   - Check mock call counts

## Resources

- [Jest Documentation](https://jestjs.io/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Cypress Documentation](https://docs.cypress.io)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
