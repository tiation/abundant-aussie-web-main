describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('contain.text', 'Sign In');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('[data-cy="login-button"]').click();
    
    cy.get('[data-cy="email-error"]').should('contain.text', 'Email is required');
    cy.get('[data-cy="password-error"]').should('contain.text', 'Password is required');
  });

  it('should show validation error for invalid email', () => {
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();
    
    cy.get('[data-cy="email-error"]').should('contain.text', 'Invalid email format');
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: '1',
            email: 'supervisor@test.com',
            name: 'Test Supervisor',
            role: 'supervisor',
          },
          token: 'mock-jwt-token',
        },
      },
    }).as('loginRequest');

    cy.get('[data-cy="email-input"]').type('supervisor@test.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });

  it('should show error message for invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        success: false,
        error: 'Invalid credentials',
      },
    }).as('loginFailure');

    cy.get('[data-cy="email-input"]').type('wrong@test.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginFailure');
    cy.get('[data-cy="error-message"]').should('contain.text', 'Invalid credentials');
  });

  it('should logout successfully', () => {
    // Login first
    cy.login('supervisor@test.com', 'password123');
    cy.visit('/dashboard');

    cy.intercept('POST', '/api/auth/logout', {
      statusCode: 200,
      body: { success: true },
    }).as('logoutRequest');

    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();

    cy.wait('@logoutRequest');
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected routes without authentication', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('should remember user session on page refresh', () => {
    cy.login('supervisor@test.com', 'password123');
    cy.visit('/dashboard');
    
    cy.reload();
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="user-name"]').should('contain.text', 'Test Supervisor');
  });
});
