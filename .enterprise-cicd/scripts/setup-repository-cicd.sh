#!/bin/bash
# Setup CI/CD for individual repositories
# Applies enterprise standards to any repository

set -eo pipefail

REPO_PATH=${1:-.}
cd "$REPO_PATH"

echo "Setting up enterprise CI/CD for $(basename $(pwd))..."

# Create GitHub Actions workflow directory
mkdir -p .github/workflows

# Copy enterprise workflow
if [ -f "/Users/tiaastor/Github/tiation-repos/.enterprise-cicd/workflows/enterprise-ci.yml" ]; then
    cp "/Users/tiaastor/Github/tiation-repos/.enterprise-cicd/workflows/enterprise-ci.yml" .github/workflows/
    echo "✅ Added GitHub Actions workflow"
else
    echo "⚠️ Enterprise workflow template not found"
fi

# Create pre-commit hooks
if [ -d ".git" ]; then
    mkdir -p .git/hooks

    cat > .git/hooks/pre-commit << 'HOOK_EOF'
#!/bin/bash
# Enterprise pre-commit hook

echo "Running enterprise pre-commit checks..."

# Check for secrets (if gitleaks is installed)
if command -v gitleaks >/dev/null 2>&1; then
    echo "🔍 Checking for secrets..."
    if ! gitleaks detect --source . --verbose; then
        echo "❌ Secrets detected! Please remove them before committing."
        exit 1
    fi
fi

# Run linting based on project type
if [ -f "package.json" ]; then
    echo "🧹 Running JavaScript/TypeScript linting..."
    if npm run lint >/dev/null 2>&1; then
        echo "✅ Linting passed"
    else
        echo "⚠️ No lint script found or linting issues detected"
    fi
fi

if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "🐍 Running Python formatting and linting..."
    if command -v black >/dev/null 2>&1; then
        black --check . >/dev/null 2>&1 || echo "⚠️ Python formatting issues found (run 'black .' to fix)"
    fi
    if command -v flake8 >/dev/null 2>&1; then
        flake8 . >/dev/null 2>&1 || echo "⚠️ Python linting issues found"
    fi
fi

if [ -f "go.mod" ]; then
    echo "🐹 Running Go formatting and checks..."
    go fmt ./...
    go vet ./...
fi

echo "✅ Pre-commit checks completed"
HOOK_EOF

    chmod +x .git/hooks/pre-commit
    echo "✅ Added pre-commit hook"

    # Create pre-push hook
    cat > .git/hooks/pre-push << 'HOOK_EOF'
#!/bin/bash
# Enterprise pre-push hook

echo "Running enterprise pre-push checks..."

# Run tests based on project type
if [ -f "package.json" ]; then
    echo "🧪 Running JavaScript/TypeScript tests..."
    if npm test >/dev/null 2>&1; then
        echo "✅ Tests passed"
    else
        echo "⚠️ No test script found or tests failed"
    fi
fi

if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "🐍 Running Python tests..."  
    if command -v pytest >/dev/null 2>&1; then
        python -m pytest >/dev/null 2>&1 || echo "⚠️ Python tests failed or no tests found"
    fi
fi

if [ -f "go.mod" ]; then
    echo "🐹 Running Go tests..."
    if ! go test ./...; then
        echo "❌ Go tests failed"
        exit 1
    fi
fi

echo "✅ Pre-push checks completed"
HOOK_EOF

    chmod +x .git/hooks/pre-push
    echo "✅ Added pre-push hook"
else
    echo "⚠️ Not a git repository - skipping git hooks"
fi

# Create Docker-related files if they don't exist and it's a Node.js project
if [ ! -f "Dockerfile" ] && [ -f "package.json" ]; then
    cat > Dockerfile << 'DOCKER_EOF'
# Enterprise Node.js Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
DOCKER_EOF
    echo "✅ Added Dockerfile"
fi

# Create docker-compose.yml if it doesn't exist
if [ ! -f "docker-compose.yml" ] && [ -f "package.json" ]; then
    cat > docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
COMPOSE_EOF
    echo "✅ Added docker-compose.yml"
fi

# Create .dockerignore if it doesn't exist
if [ ! -f ".dockerignore" ] && [ -f "package.json" ]; then
    cat > .dockerignore << 'DOCKERIGNORE_EOF'
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.eslintrc.js
.prettierrc
.vscode
.idea
*.log
DOCKERIGNORE_EOF
    echo "✅ Added .dockerignore"
fi

echo ""
echo "🎉 Enterprise CI/CD setup completed for $(basename $(pwd))"
echo ""
echo "Features added:"
echo "  • GitHub Actions workflow with automated checks"
echo "  • Pre-commit hooks for code quality validation"
echo "  • Pre-push hooks for testing"
if [ -f "Dockerfile" ]; then
    echo "  • Docker configuration for containerization"
fi
echo ""
echo "Next steps:"
echo "  1. Commit these changes to activate the CI/CD pipeline"
echo "  2. Configure any required secrets in GitHub repository settings"
echo "  3. Push changes to trigger the first automated build"
