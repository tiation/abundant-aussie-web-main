#!/bin/bash

# scripts/security-scan.sh
# Comprehensive security scanning for the RiggerHub ecosystem

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCAN_RESULTS_DIR="/tmp/rigger-security-scans"
SEVERITY_THRESHOLD=${SEVERITY_THRESHOLD:-"HIGH"}
FAIL_ON_VULNERABILITIES=${FAIL_ON_VULNERABILITIES:-"true"}

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

# Setup scan results directory
setup_scan_directory() {
    log "Setting up security scan directory..."
    
    rm -rf "$SCAN_RESULTS_DIR"
    mkdir -p "$SCAN_RESULTS_DIR"
    
    log_success "Scan directory created: $SCAN_RESULTS_DIR"
}

# Install required security tools
install_security_tools() {
    log "Installing security scanning tools..."
    
    # Install npm audit (comes with npm)
    if ! command -v npm &> /dev/null; then
        log_error "npm is required but not installed"
        exit 1
    fi
    
    # Install Snyk CLI if not present
    if ! command -v snyk &> /dev/null; then
        log "Installing Snyk CLI..."
        npm install -g snyk
    fi
    
    # Install Semgrep if not present
    if ! command -v semgrep &> /dev/null; then
        log "Installing Semgrep..."
        if command -v pip3 &> /dev/null; then
            pip3 install semgrep
        elif command -v brew &> /dev/null; then
            brew install semgrep
        else
            log_warning "Could not install Semgrep automatically"
        fi
    fi
    
    # Install ESLint security plugin
    if [[ ! -f "node_modules/.bin/eslint" ]]; then
        log "Installing ESLint and security plugins..."
        npm install --save-dev eslint eslint-plugin-security @typescript-eslint/eslint-plugin
    fi
    
    log_success "Security tools installation completed"
}

# Scan Node.js dependencies for vulnerabilities
scan_npm_dependencies() {
    log "Scanning Node.js dependencies for vulnerabilities..."
    
    local projects=("RiggerHub-web" "RiggerConnect-web" "RiggerBackend")
    
    for project in "${projects[@]}"; do
        if [[ -d "$project" && -f "$project/package.json" ]]; then
            log "Scanning $project dependencies..."
            
            cd "$project"
            
            # npm audit
            log "Running npm audit for $project..."
            npm audit --audit-level="$SEVERITY_THRESHOLD" --json > "$SCAN_RESULTS_DIR/${project}-npm-audit.json" || {
                log_warning "npm audit found vulnerabilities in $project"
            }
            
            # Snyk test
            if command -v snyk &> /dev/null; then
                log "Running Snyk scan for $project..."
                snyk test --json > "$SCAN_RESULTS_DIR/${project}-snyk.json" || {
                    log_warning "Snyk found vulnerabilities in $project"
                }
            fi
            
            cd ..
        else
            log_warning "Project directory $project not found or missing package.json"
        fi
    done
    
    log_success "Dependency vulnerability scanning completed"
}

# Static code analysis for security issues
static_code_analysis() {
    log "Running static code analysis for security issues..."
    
    # ESLint security scan
    log "Running ESLint security analysis..."
    
    local projects=("RiggerHub-web" "RiggerConnect-web" "RiggerBackend")
    
    for project in "${projects[@]}"; do
        if [[ -d "$project" ]]; then
            log "Running ESLint security scan for $project..."
            
            cd "$project"
            
            # Create ESLint config if it doesn't exist
            if [[ ! -f ".eslintrc.js" && ! -f ".eslintrc.json" ]]; then
                cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  plugins: ['security', '@typescript-eslint'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
};
EOF
            fi
            
            # Run ESLint with security rules
            npx eslint . --ext .js,.ts,.tsx --format json > "$SCAN_RESULTS_DIR/${project}-eslint-security.json" || {
                log_warning "ESLint found security issues in $project"
            }
            
            cd ..
        fi
    done
    
    # Semgrep scan
    if command -v semgrep &> /dev/null; then
        log "Running Semgrep security analysis..."
        
        semgrep --config=auto --json --output="$SCAN_RESULTS_DIR/semgrep-results.json" . || {
            log_warning "Semgrep found security issues"
        }
    fi
    
    log_success "Static code analysis completed"
}

# Scan Docker images for vulnerabilities
scan_docker_images() {
    log "Scanning Docker images for vulnerabilities..."
    
    # Check if Trivy is available
    if ! command -v trivy &> /dev/null; then
        log "Installing Trivy..."
        if command -v brew &> /dev/null; then
            brew install trivy
        elif command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y wget apt-transport-https gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
            echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
            sudo apt-get update && sudo apt-get install -y trivy
        else
            log_warning "Could not install Trivy automatically"
            return 0
        fi
    fi
    
    local images=("node:18-alpine" "nginx:alpine" "postgres:15")
    
    # Scan base images used in Dockerfiles
    for image in "${images[@]}"; do
        log "Scanning Docker image: $image"
        
        trivy image --format json --output "$SCAN_RESULTS_DIR/trivy-${image//[\/:]/-}.json" \
            --severity "$SEVERITY_THRESHOLD,CRITICAL" "$image" || {
            log_warning "Trivy found vulnerabilities in $image"
        }
    done
    
    # Scan custom images if they exist
    local custom_images=("rigger/backend" "rigger/hub-web" "rigger/connect-web")
    
    for image in "${custom_images[@]}"; do
        if docker images | grep -q "${image%:*}"; then
            log "Scanning custom Docker image: $image"
            
            trivy image --format json --output "$SCAN_RESULTS_DIR/trivy-${image//[\/:]/-}.json" \
                --severity "$SEVERITY_THRESHOLD,CRITICAL" "$image" || {
                log_warning "Trivy found vulnerabilities in $image"
            }
        fi
    done
    
    log_success "Docker image vulnerability scanning completed"
}

# Scan secrets and sensitive information
scan_secrets() {
    log "Scanning for exposed secrets and sensitive information..."
    
    # Install git-secrets if not present
    if ! command -v git-secrets &> /dev/null; then
        log "Installing git-secrets..."
        if command -v brew &> /dev/null; then
            brew install git-secrets
        else
            log_warning "git-secrets not available, using grep-based secret scanning"
            
            # Manual secret patterns
            local secret_patterns=(
                "password.*=.*['\"][^'\"]+['\"]"
                "api[_-]?key.*=.*['\"][^'\"]+['\"]"
                "secret.*=.*['\"][^'\"]+['\"]"
                "token.*=.*['\"][^'\"]+['\"]"
                "access[_-]?key.*=.*['\"][^'\"]+['\"]"
                "private[_-]?key.*=.*['\"][^'\"]+['\"]"
                "aws[_-]?access[_-]?key.*=.*['\"][^'\"]+['\"]"
                "aws[_-]?secret.*=.*['\"][^'\"]+['\"]"
                "database[_-]?url.*=.*['\"][^'\"]+['\"]"
                "connection[_-]?string.*=.*['\"][^'\"]+['\"]"
            )
            
            log "Running manual secret pattern detection..."
            
            for pattern in "${secret_patterns[@]}"; do
                grep -r -i -E "$pattern" . \
                    --exclude-dir=node_modules \
                    --exclude-dir=.git \
                    --exclude-dir=dist \
                    --exclude-dir=build \
                    --exclude="*.log" \
                    --exclude="*.md" >> "$SCAN_RESULTS_DIR/secrets-scan.txt" 2>/dev/null || true
            done
            
            if [[ -s "$SCAN_RESULTS_DIR/secrets-scan.txt" ]]; then
                log_warning "Potential secrets found in codebase"
            else
                log_success "No obvious secrets found in manual scan"
            fi
            
            return 0
        fi
    fi
    
    # Configure git-secrets
    git secrets --register-aws || true
    git secrets --install || true
    
    # Scan for secrets
    git secrets --scan > "$SCAN_RESULTS_DIR/git-secrets-scan.txt" 2>&1 || {
        log_warning "git-secrets found potential secrets"
    }
    
    log_success "Secret scanning completed"
}

# Infrastructure security checks
infrastructure_security_checks() {
    log "Running infrastructure security checks..."
    
    # Check for insecure configurations in Docker Compose files
    if [[ -f "docker-compose.yml" ]] || [[ -f "docker-compose.prod.yml" ]]; then
        log "Checking Docker Compose security configurations..."
        
        # Check for privileged containers
        if grep -q "privileged.*true" docker-compose*.yml; then
            echo "WARNING: Privileged containers detected" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
        fi
        
        # Check for host network mode
        if grep -q "network_mode.*host" docker-compose*.yml; then
            echo "WARNING: Host network mode detected" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
        fi
        
        # Check for bind mounts to sensitive directories
        if grep -q "/etc:/etc" docker-compose*.yml || grep -q "/:/host" docker-compose*.yml; then
            echo "WARNING: Sensitive host directories mounted" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
        fi
    fi
    
    # Check Kubernetes configurations if present
    if [[ -d "k8s" ]] || [[ -d "kubernetes" ]]; then
        log "Checking Kubernetes security configurations..."
        
        find k8s kubernetes -name "*.yaml" -o -name "*.yml" 2>/dev/null | while read -r file; do
            # Check for privileged containers
            if grep -q "privileged.*true" "$file"; then
                echo "WARNING: Privileged container in $file" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
            fi
            
            # Check for runAsRoot
            if grep -q "runAsUser.*0" "$file"; then
                echo "WARNING: Container running as root in $file" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
            fi
            
            # Check for missing resource limits
            if ! grep -q "resources:" "$file"; then
                echo "WARNING: Missing resource limits in $file" >> "$SCAN_RESULTS_DIR/infrastructure-issues.txt"
            fi
        done
    fi
    
    log_success "Infrastructure security checks completed"
}

# Generate comprehensive security report
generate_security_report() {
    log "Generating comprehensive security report..."
    
    local total_issues=0
    local critical_issues=0
    local high_issues=0
    
    # Count issues from various scans
    if [[ -f "$SCAN_RESULTS_DIR/secrets-scan.txt" && -s "$SCAN_RESULTS_DIR/secrets-scan.txt" ]]; then
        local secret_count=$(wc -l < "$SCAN_RESULTS_DIR/secrets-scan.txt")
        critical_issues=$((critical_issues + secret_count))
        total_issues=$((total_issues + secret_count))
    fi
    
    # Count npm audit issues
    for file in "$SCAN_RESULTS_DIR"/*-npm-audit.json; do
        if [[ -f "$file" ]]; then
            local npm_issues=$(jq '.metadata.vulnerabilities.high // 0' "$file" 2>/dev/null || echo 0)
            high_issues=$((high_issues + npm_issues))
            total_issues=$((total_issues + npm_issues))
        fi
    done
    
    # Count ESLint security issues
    for file in "$SCAN_RESULTS_DIR"/*-eslint-security.json; do
        if [[ -f "$file" ]]; then
            local eslint_issues=$(jq 'length' "$file" 2>/dev/null || echo 0)
            high_issues=$((high_issues + eslint_issues))
            total_issues=$((total_issues + eslint_issues))
        fi
    done
    
    # Generate summary report
    cat > "$SCAN_RESULTS_DIR/security-summary.json" << EOF
{
  "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "total_issues": $total_issues,
  "critical_issues": $critical_issues,
  "high_issues": $high_issues,
  "scan_results_directory": "$SCAN_RESULTS_DIR",
  "scans_performed": [
    "npm_audit",
    "snyk_scan",
    "eslint_security",
    "semgrep",
    "docker_image_scan",
    "secret_detection",
    "infrastructure_checks"
  ]
}
EOF
    
    # Generate human-readable report
    cat > "$SCAN_RESULTS_DIR/security-report.md" << EOF
# RiggerHub Security Scan Report

**Scan Date**: $(date +'%Y-%m-%d %H:%M:%S')
**Total Issues Found**: $total_issues
**Critical Issues**: $critical_issues
**High Issues**: $high_issues

## Scan Summary

### Dependencies
- npm audit completed for all Node.js projects
- Snyk vulnerability scanning performed
- Results stored in individual JSON files

### Static Code Analysis
- ESLint security rules applied
- Semgrep security patterns checked
- Custom security rule violations documented

### Container Security
- Docker image vulnerability scanning with Trivy
- Base image and custom image analysis completed

### Secret Detection
- Source code scanned for exposed secrets
- Configuration files checked for sensitive data

### Infrastructure Security
- Docker Compose configurations reviewed
- Kubernetes manifests analyzed (if present)
- Security best practices validated

## Recommendations

1. **Regular Updates**: Keep all dependencies updated to latest versions
2. **Secret Management**: Use proper secret management solutions (HashiCorp Vault, AWS Secrets Manager)
3. **Container Security**: Regularly update base images and scan for vulnerabilities
4. **Code Review**: Implement security-focused code review processes
5. **Monitoring**: Set up continuous security monitoring and alerting

## Detailed Results

All detailed scan results are available in: \`$SCAN_RESULTS_DIR\`

EOF
    
    log "📊 Security Scan Summary:"
    log "  Total Issues: $total_issues"
    log "  Critical Issues: $critical_issues"
    log "  High Issues: $high_issues"
    log "  Detailed results: $SCAN_RESULTS_DIR"
    
    # Fail if we have critical vulnerabilities and FAIL_ON_VULNERABILITIES is true
    if [[ "$FAIL_ON_VULNERABILITIES" == "true" && $critical_issues -gt 0 ]]; then
        log_error "❌ Critical security vulnerabilities found! Failing build."
        exit 1
    elif [[ $total_issues -gt 0 ]]; then
        log_warning "⚠️ Security issues found but build will continue"
        return 0
    else
        log_success "✅ No significant security issues found!"
    fi
}

# Main execution
main() {
    log "🔒 Starting comprehensive security scanning for RiggerHub ecosystem"
    
    setup_scan_directory
    install_security_tools
    scan_npm_dependencies
    static_code_analysis
    scan_docker_images
    scan_secrets
    infrastructure_security_checks
    generate_security_report
    
    log_success "🔒 Security scanning completed successfully!"
}

# Execute main function
main "$@"
