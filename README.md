# Abundant Aussie Web - Enterprise Grade Web Application

An enterprise-grade web application developed for the ChaseWhiteRabbit NGO initiative, following DevOps best practices with striking, edgy design principles.

## Project info

This is a professional React/TypeScript application built with modern tooling and enterprise-grade architecture.

## Development Workflow

This project follows enterprise development practices with multiple deployment environments and CI/CD integration.

**Local Development**

Clone this repository and work locally using your preferred IDE. All changes should follow the established code review process.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

This project follows enterprise CI/CD practices using our dedicated infrastructure:

- **Development**: Deployed automatically on pull requests
- **Staging**: Deployed on merge to develop branch
- **Production**: Deployed on merge to main branch

Deployment is handled through our GitLab CI/CD pipeline with Docker containers hosted on our VPS infrastructure.

## Custom Domains & Infrastructure

This project is part of the ChaseWhiteRabbit NGO technical infrastructure, utilizing:

- Multiple VPS environments for different stages
- Kubernetes orchestration via helm.sxc.codes
- Monitoring and observability through grafana.sxc.codes
- Centralized logging via elastic.sxc.codes

For domain configuration and infrastructure questions, consult the DevOps documentation.
