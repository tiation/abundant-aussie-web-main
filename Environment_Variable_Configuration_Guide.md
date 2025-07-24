# Environment Variable Configuration Guide

## Best Practices to Avoid Naming Conflicts

### Prefixing Strategy
- **Use Project-Specific Prefixes:** Always prefix your environment variables with your project name to avoid conflicts:
  - `RIGGER_` for RiggerConnect/RiggerHub projects
  - `DOCKER_` for Docker-specific configurations
  - `DB_` for database connections
  - `API_` for external API configurations

### Naming Conventions
- **Consistent Case:** Use UPPERCASE for all environment variable names
- **Descriptive Names:** Variables should clearly indicate their purpose:
  - ✅ `RIGGER_DATABASE_URL` (clear and specific)
  - ❌ `DB_URL` (too generic, could conflict)
- **Hierarchical Structure:** Use underscores to create logical groupings:
  - `RIGGER_DB_HOST`, `RIGGER_DB_PORT`, `RIGGER_DB_NAME`
  - `RIGGER_REDIS_HOST`, `RIGGER_REDIS_PORT`
  - `RIGGER_API_KEY`, `RIGGER_API_SECRET`

### Environment-Specific Prefixes
- **Development:** `DEV_RIGGER_*`
- **Staging:** `STAGING_RIGGER_*`
- **Production:** `PROD_RIGGER_*`

## Example .env Files for Hostinger VPS Infrastructure

### Local Development (.env.local)
```env
# =================================================
# RIGGER PROJECT - LOCAL DEVELOPMENT
# =================================================

# Database Configuration
RIGGER_DB_HOST=localhost
RIGGER_DB_PORT=5432
RIGGER_DB_NAME=rigger_dev
RIGGER_DB_USER=rigger_user
RIGGER_DB_PASSWORD=dev_password_123
RIGGER_DB_SSL_MODE=disable

# API Configuration
RIGGER_API_BASE_URL=http://localhost:3000
RIGGER_API_KEY=dev-api-key-local-only
RIGGER_API_SECRET=dev-secret-local-only
RIGGER_API_RATE_LIMIT=1000

# Redis Configuration
RIGGER_REDIS_HOST=localhost
RIGGER_REDIS_PORT=6379
RIGGER_REDIS_PASSWORD=
RIGGER_REDIS_DB=0

# Application Settings
RIGGER_APP_ENV=development
RIGGER_DEBUG_MODE=true
RIGGER_LOG_LEVEL=debug
RIGGER_JWT_SECRET=local-jwt-secret-change-in-prod

# Email Configuration (using Hostinger SMTP)
RIGGER_SMTP_HOST=smtp.hostinger.com
RIGGER_SMTP_PORT=587
RIGGER_SMTP_USER=noreply@sxc.codes
RIGGER_SMTP_PASSWORD=your_email_password
RIGGER_SMTP_SECURE=true

# File Storage
RIGGER_STORAGE_TYPE=local
RIGGER_STORAGE_PATH=/tmp/rigger_uploads
```

### Staging Environment (.env.staging) - Hostinger VPS
```env
# =================================================
# RIGGER PROJECT - STAGING (docker.tiation.net)
# Hostinger VPS: 145.223.22.9
# =================================================

# Database Configuration (Supabase VPS)
RIGGER_DB_HOST=93.127.167.157
RIGGER_DB_PORT=5432
RIGGER_DB_NAME=rigger_staging
RIGGER_DB_USER=rigger_stage
RIGGER_DB_PASSWORD=staging_secure_password_2024
RIGGER_DB_SSL_MODE=require
RIGGER_DB_POOL_SIZE=10

# API Configuration
RIGGER_API_BASE_URL=https://staging-api.sxc.codes
RIGGER_API_KEY=staging-api-key-secure
RIGGER_API_SECRET=staging-secret-secure
RIGGER_API_RATE_LIMIT=5000

# Redis Configuration (ElasticSearch VPS)
RIGGER_REDIS_HOST=145.223.22.14
RIGGER_REDIS_PORT=6379
RIGGER_REDIS_PASSWORD=staging_redis_password
RIGGER_REDIS_DB=1

# Application Settings
RIGGER_APP_ENV=staging
RIGGER_DEBUG_MODE=false
RIGGER_LOG_LEVEL=info
RIGGER_JWT_SECRET=staging-jwt-secret-complex-2024
RIGGER_SESSION_TIMEOUT=3600

# Monitoring (Grafana VPS)
RIGGER_GRAFANA_URL=https://grafana.sxc.codes
RIGGER_GRAFANA_API_KEY=staging_grafana_key

# Email Configuration
RIGGER_SMTP_HOST=smtp.hostinger.com
RIGGER_SMTP_PORT=587
RIGGER_SMTP_USER=staging@sxc.codes
RIGGER_SMTP_PASSWORD=staging_email_password
RIGGER_SMTP_SECURE=true

# File Storage
RIGGER_STORAGE_TYPE=s3
RIGGER_STORAGE_BUCKET=rigger-staging-uploads
RIGGER_STORAGE_REGION=eu-central-1
```

### Production Environment (.env.production) - Hostinger VPS
```env
# =================================================
# RIGGER PROJECT - PRODUCTION
# Primary: docker.sxc.codes (145.223.22.7)
# Backup: ubuntu.sxc.codes (89.116.191.60)
# =================================================

# Database Configuration (Supabase VPS)
RIGGER_DB_HOST=93.127.167.157
RIGGER_DB_PORT=5432
RIGGER_DB_NAME=rigger_production
RIGGER_DB_USER=rigger_prod
RIGGER_DB_PASSWORD=production_ultra_secure_password_2024
RIGGER_DB_SSL_MODE=require
RIGGER_DB_POOL_SIZE=25
RIGGER_DB_MAX_CONNECTIONS=100

# API Configuration
RIGGER_API_BASE_URL=https://api.riggerconnect.com
RIGGER_API_KEY=prod-api-key-ultra-secure
RIGGER_API_SECRET=prod-secret-ultra-secure
RIGGER_API_RATE_LIMIT=10000
RIGGER_API_TIMEOUT=30

# Redis Configuration (ElasticSearch VPS)
RIGGER_REDIS_HOST=145.223.22.14
RIGGER_REDIS_PORT=6379
RIGGER_REDIS_PASSWORD=production_redis_ultra_secure
RIGGER_REDIS_DB=0
RIGGER_REDIS_CLUSTER_MODE=true

# Application Settings
RIGGER_APP_ENV=production
RIGGER_DEBUG_MODE=false
RIGGER_LOG_LEVEL=warn
RIGGER_JWT_SECRET=production-jwt-secret-ultra-complex-2024
RIGGER_SESSION_TIMEOUT=7200
RIGGER_CORS_ORIGINS=https://riggerconnect.com,https://www.riggerconnect.com

# Monitoring and Logging
RIGGER_GRAFANA_URL=https://grafana.sxc.codes
RIGGER_GRAFANA_API_KEY=production_grafana_key
RIGGER_ELASTICSEARCH_HOST=145.223.22.14
RIGGER_ELASTICSEARCH_PORT=9200
RIGGER_ELASTICSEARCH_USER=rigger_logs
RIGGER_ELASTICSEARCH_PASSWORD=elastic_secure_password

# Email Configuration
RIGGER_SMTP_HOST=smtp.hostinger.com
RIGGER_SMTP_PORT=587
RIGGER_SMTP_USER=noreply@riggerconnect.com
RIGGER_SMTP_PASSWORD=production_email_password
RIGGER_SMTP_SECURE=true

# File Storage
RIGGER_STORAGE_TYPE=s3
RIGGER_STORAGE_BUCKET=rigger-production-uploads
RIGGER_STORAGE_REGION=eu-central-1
RIGGER_STORAGE_CDN=https://cdn.riggerconnect.com

# Security
RIGGER_ENCRYPTION_KEY=production-encryption-key-2024
RIGGER_HTTPS_ONLY=true
RIGGER_CSRF_PROTECTION=true

# Backup Configuration (Ubuntu VPS)
RIGGER_BACKUP_HOST=89.116.191.60
RIGGER_BACKUP_USER=backup_user
RIGGER_BACKUP_PATH=/backups/rigger
```

## Common Mistakes and How to Avoid Them

### 1. Typographical Errors
**Problem:** Typos in variable names can cause silent failures or hard-to-diagnose bugs.

**Examples of Common Typos:**
```bash
# ❌ Wrong
RIGGER_DATABSE_HOST=localhost  # Missing 'A' in DATABASE
RIGGER_API_SECERT=secret123    # Wrong spelling of SECRET

# ✅ Correct
RIGGER_DATABASE_HOST=localhost
RIGGER_API_SECRET=secret123
```

**Prevention:** Use consistent naming patterns and validation scripts.

### 2. Missing or Incorrect Quotes
**Problem:** Values with spaces, special characters, or that start with numbers need proper quoting.

**Examples:**
```bash
# ❌ Wrong - will break parsing
RIGGER_APP_NAME=Rigger Connect App
RIGGER_PASSWORD=Pass@123!Special
RIGGER_JSON_CONFIG={"key": "value"}

# ✅ Correct
RIGGER_APP_NAME="Rigger Connect App"
RIGGER_PASSWORD="Pass@123!Special"
RIGGER_JSON_CONFIG='{"key": "value"}'
```

### 3. Numeric and Boolean Handling
**Problem:** Inconsistent formatting of numbers and booleans across different environments.

**Examples:**
```bash
# ❌ Inconsistent
RIGGER_DEBUG_MODE="true"     # String in one env
RIGGER_DEBUG_MODE=1          # Number in another
RIGGER_PORT="3000"           # String port number

# ✅ Consistent
RIGGER_DEBUG_MODE=true       # Boolean (no quotes)
RIGGER_PORT=3000             # Number (no quotes)
RIGGER_TIMEOUT_SECONDS=30    # Number (no quotes)
```

### 4. Environment-Specific Configuration Leaks
**Problem:** Using development values in production or vice versa.

**Examples:**
```bash
# ❌ Dangerous - development config in production
RIGGER_DB_HOST=localhost      # Should be production DB
RIGGER_DEBUG_MODE=true        # Should be false in production
RIGGER_LOG_LEVEL=debug        # Too verbose for production

# ✅ Proper production config
RIGGER_DB_HOST=93.127.167.157
RIGGER_DEBUG_MODE=false
RIGGER_LOG_LEVEL=warn
```

### 5. Hardcoded Secrets in Version Control
**Problem:** Accidentally committing sensitive information to repositories.

**Examples:**
```bash
# ❌ Never commit these
RIGGER_API_SECRET=abc123secretkey
RIGGER_DB_PASSWORD=mypassword123

# ✅ Use placeholder values in committed files
RIGGER_API_SECRET=${RIGGER_API_SECRET}
RIGGER_DB_PASSWORD=${RIGGER_DB_PASSWORD}
```

### 6. Missing Required Variables
**Problem:** Application fails to start due to missing critical environment variables.

**Prevention:** Use validation scripts and comprehensive documentation.

## Scripts for Validation and Troubleshooting

### 1. Comprehensive Environment Validation Script

Create a script named `validate_rigger_env.sh`:

```bash
#!/bin/bash
# =================================================
# RIGGER Environment Variable Validator
# Version: 1.0.0
# =================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

echo -e "${BLUE}🔍 RIGGER Environment Validation${NC}"
echo "==============================================="

# Required variables for all environments
REQUIRED_VARS=(
    "RIGGER_APP_ENV"
    "RIGGER_DB_HOST"
    "RIGGER_DB_PORT"
    "RIGGER_DB_NAME"
    "RIGGER_API_KEY"
    "RIGGER_JWT_SECRET"
)

# Environment-specific required variables
if [[ "${RIGGER_APP_ENV:-}" == "production" ]]; then
    PROD_REQUIRED=(
        "RIGGER_DB_PASSWORD"
        "RIGGER_API_SECRET"
        "RIGGER_ENCRYPTION_KEY"
        "RIGGER_SMTP_PASSWORD"
    )
    REQUIRED_VARS+=("${PROD_REQUIRED[@]}")
fi

# Function to check if variable exists
check_required_var() {
    local var_name="$1"
    if [[ -z "${!var_name:-}" ]]; then
        echo -e "${RED}❌ ERROR: $var_name is not set${NC}"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✅ $var_name is set${NC}"
        return 0
    fi
}

# Function to validate numeric variables
validate_numeric() {
    local var_name="$1"
    local var_value="${!var_name:-}"
    
    if [[ -n "$var_value" ]]; then
        if [[ "$var_value" =~ ^[0-9]+$ ]]; then
            echo -e "${GREEN}✅ $var_name ($var_value) is a valid number${NC}"
        else
            echo -e "${RED}❌ ERROR: $var_name ($var_value) is not a valid number${NC}"
            ((ERRORS++))
        fi
    fi
}

# Function to validate boolean variables
validate_boolean() {
    local var_name="$1"
    local var_value="${!var_name:-}"
    
    if [[ -n "$var_value" ]]; then
        if [[ "$var_value" =~ ^(true|false)$ ]]; then
            echo -e "${GREEN}✅ $var_name ($var_value) is a valid boolean${NC}"
        else
            echo -e "${YELLOW}⚠️  WARNING: $var_name ($var_value) should be 'true' or 'false'${NC}"
            ((WARNINGS++))
        fi
    fi
}

# Function to validate URL format
validate_url() {
    local var_name="$1"
    local var_value="${!var_name:-}"
    
    if [[ -n "$var_value" ]]; then
        if [[ "$var_value" =~ ^https?:// ]]; then
            echo -e "${GREEN}✅ $var_name appears to be a valid URL${NC}"
        else
            echo -e "${YELLOW}⚠️  WARNING: $var_name ($var_value) doesn't look like a URL${NC}"
            ((WARNINGS++))
        fi
    fi
}

# Function to check for dangerous development values in production
check_production_safety() {
    if [[ "${RIGGER_APP_ENV:-}" == "production" ]]; then
        echo -e "\n${BLUE}🔒 Production Safety Checks${NC}"
        
        # Check for development-specific values
        if [[ "${RIGGER_DEBUG_MODE:-}" == "true" ]]; then
            echo -e "${RED}❌ ERROR: DEBUG_MODE should be false in production${NC}"
            ((ERRORS++))
        fi
        
        if [[ "${RIGGER_LOG_LEVEL:-}" == "debug" ]]; then
            echo -e "${YELLOW}⚠️  WARNING: LOG_LEVEL is 'debug' in production${NC}"
            ((WARNINGS++))
        fi
        
        if [[ "${RIGGER_DB_HOST:-}" == "localhost" ]]; then
            echo -e "${RED}❌ ERROR: DB_HOST is localhost in production${NC}"
            ((ERRORS++))
        fi
        
        # Check for weak secrets
        if [[ "${RIGGER_JWT_SECRET:-}" =~ (test|dev|local|demo) ]]; then
            echo -e "${RED}❌ ERROR: JWT_SECRET appears to contain development keywords${NC}"
            ((ERRORS++))
        fi
    fi
}

echo -e "\n${BLUE}📋 Required Variables Check${NC}"
for var in "${REQUIRED_VARS[@]}"; do
    check_required_var "$var"
done

echo -e "\n${BLUE}🔢 Numeric Variables Validation${NC}"
NUMERIC_VARS=("RIGGER_DB_PORT" "RIGGER_REDIS_PORT" "RIGGER_API_RATE_LIMIT" "RIGGER_SESSION_TIMEOUT")
for var in "${NUMERIC_VARS[@]}"; do
    validate_numeric "$var"
done

echo -e "\n${BLUE}🔘 Boolean Variables Validation${NC}"
BOOLEAN_VARS=("RIGGER_DEBUG_MODE" "RIGGER_HTTPS_ONLY" "RIGGER_CSRF_PROTECTION")
for var in "${BOOLEAN_VARS[@]}"; do
    validate_boolean "$var"
done

echo -e "\n${BLUE}🌐 URL Variables Validation${NC}"
URL_VARS=("RIGGER_API_BASE_URL" "RIGGER_GRAFANA_URL")
for var in "${URL_VARS[@]}"; do
    validate_url "$var"
done

check_production_safety

# Final summary
echo -e "\n${BLUE}📊 Validation Summary${NC}"
echo "==============================================="
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}🎉 All environment variables are valid!${NC}"
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  Validation completed with $WARNINGS warning(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    exit 1
fi
```

### 2. Environment Troubleshooting Script

Create a script named `troubleshoot_env.sh`:

```bash
#!/bin/bash
# =================================================
# RIGGER Environment Troubleshooting Tool
# Version: 1.0.0
# =================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 RIGGER Environment Troubleshooter${NC}"
echo "==============================================="

# Function to test database connection
test_database_connection() {
    echo -e "\n${BLUE}🗄️  Testing Database Connection${NC}"
    
    if command -v psql >/dev/null 2>&1; then
        if PGPASSWORD="${RIGGER_DB_PASSWORD:-}" psql -h "${RIGGER_DB_HOST:-}" -p "${RIGGER_DB_PORT:-}" -U "${RIGGER_DB_USER:-}" -d "${RIGGER_DB_NAME:-}" -c "SELECT 1;" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Database connection successful${NC}"
        else
            echo -e "${RED}❌ Database connection failed${NC}"
            echo -e "${YELLOW}💡 Check: Host, port, credentials, and network connectivity${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  psql not installed, skipping database test${NC}"
    fi
}

# Function to test Redis connection
test_redis_connection() {
    echo -e "\n${BLUE}📦 Testing Redis Connection${NC}"
    
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h "${RIGGER_REDIS_HOST:-}" -p "${RIGGER_REDIS_PORT:-}" ${RIGGER_REDIS_PASSWORD:+-a "$RIGGER_REDIS_PASSWORD"} ping >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Redis connection successful${NC}"
        else
            echo -e "${RED}❌ Redis connection failed${NC}"
            echo -e "${YELLOW}💡 Check: Host, port, password, and network connectivity${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  redis-cli not installed, skipping Redis test${NC}"
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    echo -e "\n${BLUE}🌐 Testing API Endpoint${NC}"
    
    if [[ -n "${RIGGER_API_BASE_URL:-}" ]]; then
        if curl -s --connect-timeout 10 "${RIGGER_API_BASE_URL}/health" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ API endpoint is reachable${NC}"
        else
            echo -e "${RED}❌ API endpoint is not reachable${NC}"
            echo -e "${YELLOW}💡 Check: URL, network connectivity, and API server status${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  RIGGER_API_BASE_URL not set, skipping API test${NC}"
    fi
}

# Function to check file permissions
check_file_permissions() {
    echo -e "\n${BLUE}📁 Checking File Permissions${NC}"
    
    if [[ -n "${RIGGER_STORAGE_PATH:-}" ]]; then
        if [[ -d "${RIGGER_STORAGE_PATH}" ]]; then
            if [[ -w "${RIGGER_STORAGE_PATH}" ]]; then
                echo -e "${GREEN}✅ Storage directory is writable${NC}"
            else
                echo -e "${RED}❌ Storage directory is not writable${NC}"
                echo -e "${YELLOW}💡 Fix: chmod 755 ${RIGGER_STORAGE_PATH}${NC}"
            fi
        else
            echo -e "${RED}❌ Storage directory does not exist${NC}"
            echo -e "${YELLOW}💡 Fix: mkdir -p ${RIGGER_STORAGE_PATH}${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  RIGGER_STORAGE_PATH not set, skipping file check${NC}"
    fi
}

# Function to display environment summary
display_env_summary() {
    echo -e "\n${BLUE}📋 Environment Summary${NC}"
    echo "==============================================="
    echo -e "Environment: ${RIGGER_APP_ENV:-'Not Set'}"
    echo -e "Database Host: ${RIGGER_DB_HOST:-'Not Set'}"
    echo -e "Redis Host: ${RIGGER_REDIS_HOST:-'Not Set'}"
    echo -e "API Base URL: ${RIGGER_API_BASE_URL:-'Not Set'}"
    echo -e "Debug Mode: ${RIGGER_DEBUG_MODE:-'Not Set'}"
    echo -e "Log Level: ${RIGGER_LOG_LEVEL:-'Not Set'}"
}

# Function to generate diagnostic report
generate_diagnostic_report() {
    local report_file="rigger_diagnostic_$(date +%Y%m%d_%H%M%S).txt"
    
    echo -e "\n${BLUE}📝 Generating Diagnostic Report${NC}"
    {
        echo "RIGGER Environment Diagnostic Report"
        echo "Generated: $(date)"
        echo "=====================================\n"
        
        echo "Environment Variables:"
        env | grep -E '^RIGGER_' | sort || echo "No RIGGER_ variables found"
        
        echo -e "\nSystem Information:"
        echo "OS: $(uname -s)"
        echo "Hostname: $(hostname)"
        echo "User: $(whoami)"
        echo "Working Directory: $(pwd)"
        
        echo -e "\nInstalled Tools:"
        command -v psql >/dev/null && echo "psql: $(psql --version)" || echo "psql: Not installed"
        command -v redis-cli >/dev/null && echo "redis-cli: $(redis-cli --version)" || echo "redis-cli: Not installed"
        command -v curl >/dev/null && echo "curl: $(curl --version | head -1)" || echo "curl: Not installed"
        
    } > "$report_file"
    
    echo -e "${GREEN}✅ Diagnostic report saved to: $report_file${NC}"
}

# Main execution
display_env_summary
test_database_connection
test_redis_connection
test_api_endpoint
check_file_permissions
generate_diagnostic_report

echo -e "\n${GREEN}🏁 Troubleshooting complete!${NC}"
```

### 3. Environment Variable Checker Script

Create a script named `check_env_conflicts.sh`:

```bash
#!/bin/bash
# =================================================
# Environment Variable Conflict Checker
# Detects potential naming conflicts and issues
# =================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Environment Variable Conflict Checker${NC}"
echo "==============================================="

# Check for variables without RIGGER_ prefix
echo -e "\n${BLUE}📝 Checking for non-prefixed variables${NC}"
SUSPICIOUS_VARS=$(env | grep -E '^(DB_|API_|REDIS_|SMTP_)' | grep -v '^RIGGER_' || true)
if [[ -n "$SUSPICIOUS_VARS" ]]; then
    echo -e "${YELLOW}⚠️  Found potentially conflicting variables:${NC}"
    echo "$SUSPICIOUS_VARS"
    echo -e "${YELLOW}💡 Consider prefixing with RIGGER_ to avoid conflicts${NC}"
else
    echo -e "✅ No obvious naming conflicts detected"
fi

# Check for duplicate-like variables
echo -e "\n${BLUE}🔄 Checking for similar variable names${NC}"
RIGGER_VARS=$(env | grep '^RIGGER_' | cut -d'=' -f1 | sort)
echo "$RIGGER_VARS" | while read -r var; do
    similar=$(echo "$RIGGER_VARS" | grep -v "^$var$" | grep -i "$(echo "$var" | sed 's/RIGGER_//' | tr '[:upper:]' '[:lower:]')" || true)
    if [[ -n "$similar" ]]; then
        echo -e "${YELLOW}⚠️  Similar variables found: $var and $similar${NC}"
    fi
done

echo -e "\n${BLUE}✨ Conflict check complete${NC}"
```

### Usage Instructions

**Make scripts executable:**
```bash
chmod +x validate_rigger_env.sh
chmod +x troubleshoot_env.sh
chmod +x check_env_conflicts.sh
```

**Run validation before deployment:**
```bash
# Load your environment file
source .env.production

# Run comprehensive validation
./validate_rigger_env.sh

# Check for conflicts
./check_env_conflicts.sh

# If issues found, run troubleshooter
./troubleshoot_env.sh
```

**Integration with CI/CD:**
```bash
# Add to your deployment pipeline
set -e
source .env.${ENVIRONMENT}
./validate_rigger_env.sh || exit 1
```

These scripts provide comprehensive validation, troubleshooting, and conflict detection for your environment variables, ensuring reliable deployments across your Hostinger VPS infrastructure.
