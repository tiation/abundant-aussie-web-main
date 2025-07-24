# Usage Guide - Abundant Aussie Web

This document provides instructions on how to use, build, and run the Abundant Aussie Web application.

## Development Workflow

### Starting the Development Server

1. Clone the repository:
    ```bash
    git clone git@github.com:ChaseWhiteRabbit/abundant-aussie-web.git
    cd abundant-aussie-web
    ```

2. Install dependencies using Bun or npm:
    ```bash
    # Using Bun (recommended)
    bun install

    # Alternative: Using npm
    npm install
    ```

3. Run the development server:
    ```bash
    bun run dev
    # Or using npm
    npm run dev
    ```

   Open your browser and navigate to `http://localhost:5173` to view the application.

### Building the Application

- **Development Build**:
  ```bash
  bun run build:dev
  ```
  Generates a non-minified build for debugging.

- **Production Build**:
  ```bash
  bun run build
  ```
  Generates a minified and optimized build for production deployment.

### Testing Your Changes

- Run unit tests with coverage:
    ```bash
    # Assuming you have test scripts
    run test:unit
    ```

- Run end-to-end tests:
    ```bash
    run test:e2e
    ```

## CI/CD Integration

This project supports continuous integration and deployment using GitLab CI/CD pipelines.

- **Development Environment**:
  - Deployed automatically on pull requests.

- **Staging Environment**:
  - Merge to develop branch triggers the staging deployment.

- **Production Environment**:
  - Merge to main branch triggers production deployment.

Deployments are containerized using Docker and hosted on the enterprise VPS infrastructure.

## FAQs

### What technologies are used?

- The application uses a combination of React, TypeScript, Tailwind CSS, and utilizes the Vite build tool.

### How do I configure the environment variables?

- Copy the example file:
  ```bash
  cp .env.example .env.local
  # Edit the required variables in .env.local
  ```

### How do I contribute?

1. Fork the repository.
2. Create a new feature branch.
3. Implement your changes.
4. Submit a pull request for review.

---

For additional support, refer to the [main README.md](../README.md) or contact the ChaseWhiteRabbit NGO support team.

