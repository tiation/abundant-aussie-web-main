# Setup Guide - Abundant Aussie Web

This guide provides comprehensive instructions for setting up the development environment for the Abundant Aussie Web application.

## Prerequisites

### Required Software

- **Node.js** (v18.0.0 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Bun** (recommended package manager) - [Install from official site](https://bun.sh/docs/installation)
- **Git** - Version control system
- **IDE/Editor** - VS Code recommended with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## Environment Setup

### 1. Repository Clone

Clone the repository using SSH (recommended for enterprise environments):

```bash
git clone git@github.com:ChaseWhiteRabbit/abundant-aussie-web.git
cd abundant-aussie-web
```

### 2. Node.js Version Management

Use nvm to ensure consistent Node.js version:

```bash
# Install and use the required Node.js version
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

### 3. Package Manager Setup

This project uses Bun for enhanced performance:

```bash
# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# Verify Bun installation
bun --version
```

### 4. Dependencies Installation

Install project dependencies:

```bash
# Using Bun (recommended)
bun install

# Alternative: Using npm
npm install
```

### 5. Environment Configuration

Create environment configuration files:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the environment variables as needed
# nano .env.local  # or use your preferred editor
```

#### Required Environment Variables

```bash
# Development Configuration
NODE_ENV=development
VITE_APP_NAME="Abundant Aussie Web"
VITE_API_BASE_URL="http://localhost:3000/api"

# ChaseWhiteRabbit NGO Configuration
VITE_NGO_NAME="ChaseWhiteRabbit"
VITE_NGO_WEBSITE="https://chasewhiterabbit.org"

# Analytics (Optional)
VITE_ANALYTICS_ID=""

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

## Development Server

### Starting the Development Server

```bash
# Using Bun (recommended)
bun run dev

# Alternative: Using npm
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://[your-ip]:5173

### Development Features

- ⚡ **Hot Module Replacement** - Instant updates without page refresh
- 🔍 **TypeScript** - Full type checking and IntelliSense
- 🎨 **Tailwind CSS** - Utility-first styling with JIT compilation
- 🧩 **Component Hot Reloading** - React Fast Refresh enabled

## Build Configuration

### Development Build

```bash
bun run build:dev
```

### Production Build

```bash
bun run build
```

### Build Output

- **Development**: Optimized for debugging with source maps
- **Production**: Minified, optimized for performance
- **Output Directory**: `dist/`

## Code Quality Tools

### Linting

```bash
# Run ESLint
bun run lint

# Fix auto-fixable issues
bun run lint --fix
```

### Type Checking

```bash
# Run TypeScript compiler check
bunx tsc --noEmit
```

### Formatting (if Prettier is configured)

```bash
# Format code
bunx prettier --write .
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5173
npx kill-port 5173

# Or use alternative port
bun run dev -- --port 3001
```

#### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Command Palette: "TypeScript: Restart TS Server"

# Or clear TypeScript cache
rm -rf node_modules/.cache
```

### Performance Optimization

#### Development Mode
- Use `bun` instead of `npm` for faster package management
- Enable hardware acceleration in your browser
- Close unnecessary browser tabs and applications

#### System Requirements
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: At least 2GB free space for dependencies
- **CPU**: Modern multi-core processor recommended

## Next Steps

After successful setup:

1. Review the [USAGE.md](./USAGE.md) guide for development workflows
2. Check the main [README.md](../README.md) for project overview
3. Explore the codebase starting with `src/App.tsx`
4. Join the ChaseWhiteRabbit NGO development community

## Support

For setup issues or questions:

- Check the [FAQ section](../README.md#faq) in the main README
- Create an issue in the project repository
- Contact the ChaseWhiteRabbit NGO development team

---

*This setup guide is maintained by the ChaseWhiteRabbit NGO development team and follows enterprise-grade development practices.*
