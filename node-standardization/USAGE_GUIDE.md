# Node.js Standardization Templates - Usage Guide

This guide explains how to use the enterprise-grade Node.js project templates for ChaseWhiteRabbit NGO initiatives.

## 🎯 Quick Setup

### 1. Choose Your Project Type

Select the appropriate template directory:
- `nextjs/` - For React-based web applications
- `express/` - For API servers and backends
- `vite/` - For modern frontend applications
- `shared-library/` - For reusable npm packages
- `react-native/` - For mobile applications
- `nuxt/` - For Vue.js applications
- `fastify/` - For high-performance APIs
- `koa/` - For lightweight Node.js apps
- `electron/` - For desktop applications

### 2. Copy Template Files

```bash
# Example: Setting up a new Next.js project
mkdir my-new-project
cd my-new-project

# Copy the package.json template
cp /path/to/node-standardization/nextjs/package.json .

# Copy common configuration files
cp /path/to/node-standardization/common/.eslintrc.js .
cp /path/to/node-standardization/common/.prettierrc .
cp /path/to/node-standardization/common/tsconfig.json .
cp /path/to/node-standardization/common/jest.config.js .
cp /path/to/node-standardization/common/.gitignore .
cp /path/to/node-standardization/common/.dockerignore .

# Copy Dockerfile if available
cp /path/to/node-standardization/nextjs/Dockerfile .
```

### 3. Customize for Your Project

#### Update package.json:
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "repository": {
    "url": "https://github.com/your-username/your-repo.git"
  },
  "author": "Your Name <your.email@example.com>"
}
```

#### Update project-specific configurations:
- Modify `tsconfig.json` paths if needed
- Adjust ESLint rules in `.eslintrc.js`
- Update Docker configuration for your needs

### 4. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify setup
npm run validate
```

## 📁 Project Structure

All templates follow this standardized structure:

```
your-project/
├── src/                 # Source code
│   ├── components/      # Reusable components
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── hooks/          # Custom hooks (React projects)
│   ├── services/       # API and external services
│   └── constants/      # Application constants
├── tests/              # Test files
│   ├── setup.ts        # Test setup configuration
│   ├── __mocks__/      # Mock files
│   └── fixtures/       # Test data
├── docs/               # Documentation
├── .github/            # GitHub workflows (optional)
├── public/             # Static assets (web projects)
└── dist/               # Build output (generated)
```

## 🛠 Standard Scripts

All templates include these npm scripts:

### Development
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
```

### Testing
```bash
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

### Code Quality
```bash
npm run lint        # Fix linting issues
npm run lint:check  # Check for linting issues
npm run format      # Format code with Prettier
npm run type-check  # Check TypeScript types
npm run validate    # Run all checks (CI-ready)
```

### Docker
```bash
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
```

## 🔧 Configuration Details

### ESLint Configuration
- Enterprise-grade rules with security focus
- TypeScript support with strict settings
- Import organization and unused import removal
- React-specific rules (where applicable)
- Jest testing rules

### Prettier Configuration
- Consistent code formatting
- 2-space indentation
- Single quotes preference
- Trailing commas for cleaner diffs

### Jest Configuration
- TypeScript support with ts-jest
- 80% coverage threshold
- Path mapping support
- Setup files for testing utilities

### TypeScript Configuration
- Strict mode enabled
- Latest ECMAScript features
- Path mapping for clean imports
- Declaration files generation (libraries)

## 🏢 Enterprise Features

### Security
- ESLint security plugin
- Dependency vulnerability scanning
- Environment variable validation
- HTTPS enforcement (production)

### Performance
- Bundle size monitoring
- Code splitting (where applicable)
- Optimization for production builds
- Memory leak detection in tests

### DevOps
- Docker containerization
- Multi-stage builds
- Health checks
- CI/CD ready configurations

## 🚀 Deployment

### Docker Deployment
```bash
# Build production image
docker build -t your-app-name .

# Run container
docker run -p 3000:3000 your-app-name
```

### VPS Deployment (Hostinger)
```bash
# Deploy to your VPS
scp -r . root@your-vps-ip:/path/to/app
ssh root@your-vps-ip
cd /path/to/app
npm ci --production
npm run build
npm start
```

## 🔍 Common Customizations

### Adding New Dependencies
```bash
# Add runtime dependency
npm install package-name

# Add development dependency
npm install -D package-name

# Update package.json scripts if needed
```

### Environment Configuration
Create `.env` files for different environments:
```bash
# .env.local
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://...

# .env.production
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://production-db...
```

### CI/CD Integration
Copy GitHub Actions workflows:
```bash
mkdir -p .github/workflows
# Add your CI/CD pipeline configurations
```

## 📋 Checklist for New Projects

- [ ] Copy appropriate template files
- [ ] Update package.json with project details
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.example` file
- [ ] Set up project structure (`src/`, `tests/`, `docs/`)
- [ ] Write initial tests
- [ ] Update README.md with project-specific information
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring and logging
- [ ] Perform security audit (`npm audit`)
- [ ] Run validation suite (`npm run validate`)

## 🤝 Contributing

When adding new templates or improving existing ones:

1. Follow the established patterns
2. Include comprehensive `package.json` with all standard scripts
3. Add appropriate `Dockerfile` if applicable
4. Update this usage guide
5. Test with a real project
6. Document any project-specific requirements

## 📞 Support

For questions about these templates:
- Check existing project examples in the tiation-repos
- Review the documentation templates
- Contact the development team
- Submit issues for template improvements

---

**Built for ethical software development at ChaseWhiteRabbit NGO**
