/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login user
       * @example cy.login('email@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to get element by data-cy attribute
       * @example cy.dataCy('login-button')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to setup mock user session
       * @example cy.setAuthState(user, token)
       */
      setAuthState(user: any, token: string): Chainable<void>;

      /**
       * Custom command to clear auth state
       * @example cy.clearAuthState()
       */
      clearAuthState(): Chainable<void>;

      /**
       * Custom command to wait for API response
       * @example cy.waitForAPI('@getUserData')
       */
      waitForAPI(alias: string): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        user: {
          id: '1',
          email,
          name: 'Test User',
          role: 'supervisor',
        },
        token: 'mock-jwt-token',
      },
    },
  }).as('loginRequest');

  cy.visit('/login');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
  cy.wait('@loginRequest');
});

// Data-cy selector command
Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

// Set auth state command
Cypress.Commands.add('setAuthState', (user: any, token: string) => {
  cy.window().then((win) => {
    win.localStorage.setItem('auth_token', token);
    win.localStorage.setItem('user_data', JSON.stringify(user));
  });
});

// Clear auth state command
Cypress.Commands.add('clearAuthState', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('auth_token');
    win.localStorage.removeItem('user_data');
  });
});

// Wait for API command
Cypress.Commands.add('waitForAPI', (alias: string) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response?.statusCode).to.be.oneOf([200, 201, 204]);
  });
});

export {};
