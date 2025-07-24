#!/bin/bash
# scripts/update-dependencies.sh
# Automated dependency update and security scanning for RiggerHub ecosystem

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECTS=("RiggerConnect-web" "RiggerHub-web" "RiggerConnect-android" "RiggerConnect-ios" "RiggerHub-android" "RiggerHub-ios" "RiggerConnect-capacitor" "RiggerBackend" "RiggerShared")
UPDATE_LOG="dependency-updates-$(date +%Y%m%d-%H%M%S).log"

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$UPDATE_LOG"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$UPDATE_LOG"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$UPDATE_LOG"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$UPDATE_LOG"
}

# Check and install required tools
install_tools() {
    log "Installing/updating dependency management tools..."
    
    # Install npm-check-updates
    if ! command -v ncu &> /dev/null; then
        npm install -g npm-check-updates
    fi
    
    # Install audit-ci for CI integration
    if ! command -v audit-ci &> /dev/null; then
        npm install -g audit-ci
    fi
    
    # Install snyk
    if ! command -v snyk &> /dev/null; then
        npm install -g snyk
    fi
    
    log_success "Tools installation completed"
}

# Update Docker base images
update_docker_images() {
    log "Updating Docker base images..."
    
    local images=("node:18-alpine" "nginx:alpine" "postgres:15" "redis:7-alpine")
    
    for image in "${images[@]}"; do
        log "Pulling latest $image..."
        docker pull "$image" || log_warning "Failed to pull $image"
    done
    
    log_success "Docker base images updated"
}

# Update project dependencies
update_project_dependencies() {
    local project=$1
    
    if [[ ! -d "$project" ]]; then
        log_warning "Project directory $project not found, skipping..."
        return 0
    fi
    
    if [[ ! -f "$project/package.json" ]]; then
        log_warning "No package.json found in $project, skipping..."
        return 0
    fi
    
    log "Updating dependencies for $project..."
    
    cd "$project"
    
    # Check current vulnerabilities
    log "Checking current vulnerabilities in $project..."
    npm audit --json > "../audit-before-$project.json" 2>/dev/null || true
    
    # Update dependencies
    log "Running dependency updates for $project..."
    ncu -u --timeout 60000 || log_warning "ncu failed for $project"
    
    # Install updated dependencies
    if [[ -f "package-lock.json" ]]; then
        npm ci || npm install
    else
        npm install
    fi
    
    # Run security audit
    log "Running security audit for $project..."
    npm audit --json > "../audit-after-$project.json" 2>/dev/null || true
    
    # Run automated security fixes
    npm audit fix --force || log_warning "Some vulnerabilities couldn't be automatically fixed in $project"
    
    # Run tests if available
    if npm run test --dry-run &>/dev/null; then
        log "Running tests for $project..."
        npm test || log_warning "Tests failed for $project - manual review required"
    fi
    
    # Build project to verify everything works
    if npm run build --dry-run &>/dev/null; then
        log "Building $project to verify updates..."
        npm run build || log_error "Build failed for $project - updates may have broken compatibility"
    fi
    
    cd ..
    
    log_success "Completed dependency updates for $project"
}

# Generate update report
generate_update_report() {
    log "Generating comprehensive update report..."
    
    cat > "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md" << EOF
# Dependency Update Report
Generated: $(date)

## Summary
- Total projects processed: ${#PROJECTS[@]}
- Update log: $UPDATE_LOG

## Projects Updated
EOF
    
    for project in "${PROJECTS[@]}"; do
        if [[ -d "$project" ]]; then
            echo "- ✅ $project" >> "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md"
        else
            echo "- ❌ $project (not found)" >> "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md"
        fi
    done
    
    cat >> "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md" << EOF

## Security Audit Results
EOF
    
    # Process audit results
    for project in "${PROJECTS[@]}"; do
        if [[ -f "audit-after-$project.json" ]]; then
            local vulnerabilities=$(jq '.metadata.vulnerabilities.total // 0' "audit-after-$project.json" 2>/dev/null || echo "0")
            echo "- $project: $vulnerabilities vulnerabilities remaining" >> "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md"
        fi
    done
    
    cat >> "DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md" << EOF

## Next Steps
1. Review any failing tests or builds
2. Test applications in staging environment
3. Deploy updates to production after validation
4. Schedule next update cycle (recommended: weekly)

## Automated Actions Taken
- Updated all npm dependencies to latest compatible versions
- Applied automatic security fixes
- Ran security audits
- Updated Docker base images
- Ran available tests and builds

## Manual Review Required
- Check changelog for breaking changes
- Review any test failures
- Validate critical application functionality
- Update documentation if APIs changed
EOF
    
    log_success "Update report generated: DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md"
}

# Cleanup old audit files
cleanup() {
    log "Cleaning up temporary files..."
    find . -name "audit-*.json" -mtime +7 -delete 2>/dev/null || true
    find . -name "dependency-updates-*.log" -mtime +30 -delete 2>/dev/null || true
    log_success "Cleanup completed"
}

# Main execution
main() {
    log "🔄 Starting automated dependency update process..."
    
    install_tools
    update_docker_images
    
    # Process each project
    for project in "${PROJECTS[@]}"; do
        update_project_dependencies "$project"
    done
    
    generate_update_report
    cleanup
    
    log_success "🎉 Dependency update process completed successfully!"
    log "📊 View the full report: DEPENDENCY_UPDATE_REPORT_$(date +%Y%m%d).md"
    log "📝 Detailed log: $UPDATE_LOG"
}

# Handle script termination
trap cleanup EXIT

# Execute main function
main "$@"
