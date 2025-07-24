#!/bin/bash
# Environment Validation Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Validation results
VALIDATION_ERRORS=0
VALIDATION_WARNINGS=0

# Required environment variables
REQUIRED_VARS=(
    "CI_PROJECT_NAME"
    "CI_COMMIT_SHA"
    "CI_COMMIT_REF_NAME"
    "DOCKER_REGISTRY"
    "DOCKER_REGISTRY_USER"
    "DOCKER_REGISTRY_PASSWORD"
)

# Optional but recommended variables
RECOMMENDED_VARS=(
    "HELM_REGISTRY"
    "SONAR_TOKEN"
    "SSH_PRIVATE_KEY"
    "GRAFANA_URL"
    "ELASTIC_URL"
)

log "🔍 Starting environment validation..."

# Check required environment variables
log "Checking required environment variables..."
for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        error "Required environment variable '$var' is not set"
        ((VALIDATION_ERRORS++))
    else
        log "✓ $var is set"
    fi
done

# Check recommended environment variables
log "Checking recommended environment variables..."
for var in "${RECOMMENDED_VARS[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        warn "Recommended environment variable '$var' is not set"
        ((VALIDATION_WARNINGS++))
    else
        log "✓ $var is set"
    fi
done

# Validate Docker registry connectivity
log "Validating Docker registry connectivity..."
if [[ -n "${DOCKER_REGISTRY:-}" ]] && [[ -n "${DOCKER_REGISTRY_USER:-}" ]] && [[ -n "${DOCKER_REGISTRY_PASSWORD:-}" ]]; then
    if echo "$DOCKER_REGISTRY_PASSWORD" | docker login "$DOCKER_REGISTRY" -u "$DOCKER_REGISTRY_USER" --password-stdin >/dev/null 2>&1; then
        log "✓ Docker registry connectivity verified"
        docker logout "$DOCKER_REGISTRY" >/dev/null 2>&1
    else
        error "Cannot connect to Docker registry"
        ((VALIDATION_ERRORS++))
    fi
else
    error "Docker registry credentials not properly configured"
    ((VALIDATION_ERRORS++))
fi

# Validate project structure
log "Validating project structure..."
REQUIRED_FILES=(
    "README.md"
    ".gitignore"
)

OPTIONAL_FILES=(
    "package.json"
    "Dockerfile"
    "docker-compose.yml"
    "helm-chart/Chart.yaml"
    ".eslintrc.js"
    ".prettierrc"
    "jest.config.js"
    "cypress.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        error "Required file '$file' is missing"
        ((VALIDATION_ERRORS++))
    else
        log "✓ $file exists"
    fi
done

for file in "${OPTIONAL_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        warn "Optional file '$file' is missing"
        ((VALIDATION_WARNINGS++))
    else
        log "✓ $file exists"
    fi
done

# Validate package.json if it exists
if [[ -f "package.json" ]]; then
    log "Validating package.json..."
    
    # Check for required scripts
    REQUIRED_SCRIPTS=("test" "build")
    RECOMMENDED_SCRIPTS=("lint" "format" "test:unit" "test:integration")
    
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        if ! jq -e ".scripts.\"$script\"" package.json >/dev/null 2>&1; then
            error "Required npm script '$script' is missing in package.json"
            ((VALIDATION_ERRORS++))
        else
            log "✓ npm script '$script' is defined"
        fi
    done
    
    for script in "${RECOMMENDED_SCRIPTS[@]}"; do
        if ! jq -e ".scripts.\"$script\"" package.json >/dev/null 2>&1; then
            warn "Recommended npm script '$script' is missing in package.json"
            ((VALIDATION_WARNINGS++))
        else
            log "✓ npm script '$script' is defined"
        fi
    done
    
    # Validate semantic versioning
    if ! jq -e '.version' package.json | grep -E '^"[0-9]+\.[0-9]+\.[0-9]+"$' >/dev/null; then
        warn "package.json version does not follow semantic versioning"
        ((VALIDATION_WARNINGS++))
    else
        log "✓ package.json version follows semantic versioning"
    fi
fi

# Validate Dockerfile if it exists
if [[ -f "Dockerfile" ]]; then
    log "Validating Dockerfile..."
    
    # Check for multi-stage build
    if grep -q "FROM.*AS" Dockerfile; then
        log "✓ Dockerfile uses multi-stage build"
    else
        warn "Dockerfile does not use multi-stage build"
        ((VALIDATION_WARNINGS++))
    fi
    
    # Check for non-root user
    if grep -q "USER" Dockerfile; then
        log "✓ Dockerfile sets non-root user"
    else
        warn "Dockerfile does not set non-root user"
        ((VALIDATION_WARNINGS++))
    fi
    
    # Check for health check
    if grep -q "HEALTHCHECK" Dockerfile; then
        log "✓ Dockerfile includes health check"
    else
        warn "Dockerfile does not include health check"
        ((VALIDATION_WARNINGS++))
    fi
fi

# Validate Git configuration
log "Validating Git configuration..."
if git rev-parse --git-dir >/dev/null 2>&1; then
    log "✓ Git repository detected"
    
    # Check for .gitignore
    if [[ -f ".gitignore" ]]; then
        log "✓ .gitignore file exists"
        
        # Check for common ignore patterns
        COMMON_PATTERNS=("node_modules/" "*.log" ".env" "dist/" "build/")
        for pattern in "${COMMON_PATTERNS[@]}"; do
            if grep -q "$pattern" .gitignore; then
                log "✓ .gitignore includes '$pattern'"
            else
                warn ".gitignore missing pattern '$pattern'"
                ((VALIDATION_WARNINGS++))
            fi
        done
    else
        error ".gitignore file is missing"
        ((VALIDATION_ERRORS++))
    fi
else
    error "Not a Git repository"
    ((VALIDATION_ERRORS++))
fi

# Check for sensitive files in Git
log "Checking for sensitive files in Git..."
SENSITIVE_PATTERNS=("*.key" "*.pem" "*.p12" ".env" "secrets.*")
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git ls-files | grep -q "$pattern"; then
        error "Sensitive files matching '$pattern' found in Git repository"
        ((VALIDATION_ERRORS++))
    fi
done

# Validate CI/CD configuration
log "Validating CI/CD configuration..."
if [[ -f ".gitlab-ci.yml" ]]; then
    log "✓ GitLab CI configuration found"
    
    # Basic YAML validation
    if command -v python3 >/dev/null 2>&1; then
        if python3 -c "import yaml; yaml.safe_load(open('.gitlab-ci.yml'))" >/dev/null 2>&1; then
            log "✓ .gitlab-ci.yml is valid YAML"
        else
            error ".gitlab-ci.yml contains invalid YAML"
            ((VALIDATION_ERRORS++))
        fi
    fi
else
    warn "No GitLab CI configuration found"
    ((VALIDATION_WARNINGS++))
fi

# Network connectivity checks
log "Performing network connectivity checks..."

# Check external services
EXTERNAL_SERVICES=(
    "https://google.com"
    "https://github.com"
    "https://registry.npmjs.org"
)

for service in "${EXTERNAL_SERVICES[@]}"; do
    if curl -sSf "$service" >/dev/null 2>&1; then
        log "✓ Can reach $service"
    else
        warn "Cannot reach $service"
        ((VALIDATION_WARNINGS++))
    fi
done

# Check internal services
if [[ -n "${GRAFANA_URL:-}" ]]; then
    if curl -sSf "$GRAFANA_URL/api/health" >/dev/null 2>&1; then
        log "✓ Can reach Grafana"
    else
        warn "Cannot reach Grafana at $GRAFANA_URL"
        ((VALIDATION_WARNINGS++))
    fi
fi

# Resource availability checks
log "Checking resource availability..."

# Check disk space
AVAILABLE_SPACE=$(df . | awk 'NR==2 {print $4}')
REQUIRED_SPACE=1048576  # 1GB in KB

if [[ $AVAILABLE_SPACE -gt $REQUIRED_SPACE ]]; then
    log "✓ Sufficient disk space available ($(($AVAILABLE_SPACE / 1024))MB)"
else
    error "Insufficient disk space. Required: 1GB, Available: $(($AVAILABLE_SPACE / 1024))MB"
    ((VALIDATION_ERRORS++))
fi

# Check memory (if /proc/meminfo exists)
if [[ -f "/proc/meminfo" ]]; then
    AVAILABLE_MEMORY=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
    REQUIRED_MEMORY=524288  # 512MB in KB
    
    if [[ $AVAILABLE_MEMORY -gt $REQUIRED_MEMORY ]]; then
        log "✓ Sufficient memory available ($(($AVAILABLE_MEMORY / 1024))MB)"
    else
        warn "Low memory available. Required: 512MB, Available: $(($AVAILABLE_MEMORY / 1024))MB"
        ((VALIDATION_WARNINGS++))
    fi
fi

# Summary
log "Environment validation completed"
log "Errors: $VALIDATION_ERRORS"
log "Warnings: $VALIDATION_WARNINGS"

if [[ $VALIDATION_ERRORS -gt 0 ]]; then
    error "Environment validation failed with $VALIDATION_ERRORS errors"
    exit 1
elif [[ $VALIDATION_WARNINGS -gt 0 ]]; then
    warn "Environment validation completed with $VALIDATION_WARNINGS warnings"
    exit 0
else
    log "✅ Environment validation passed successfully"
    exit 0
fi
