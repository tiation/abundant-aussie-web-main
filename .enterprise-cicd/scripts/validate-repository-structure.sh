#!/bin/bash
# Repository Structure Validation Script
# ChaseWhiteRabbit NGO - Enterprise Standards Verification

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Required directories for each repository
REQUIRED_DIRS=(
    ".github/workflows"
    "src"
    "tests"
    "docs"
    ".enterprise-cicd"
    "assets"
    "config"
    "scripts"
    "k8s"
    "docker"
    ".vscode"
    "tools"
)

# Required symlinks in .enterprise-cicd
REQUIRED_SYMLINKS=(
    "templates"
    "environments"
    "dockerfiles"
    "scripts"
)

RIGGER_REPOS=(
    "RiggerConnect-web"
    "RiggerConnect-android"
    "RiggerConnect-ios"
    "RiggerHub-web"
    "RiggerHub-android"
    "RiggerHub-ios"
    "RiggerBackend"
    "RiggerShared"
)

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Main validation function
validate_repository() {
    local repo="$1"
    local errors=0
    
    log_info "Validating $repo..."
    
    if [[ ! -d "$repo" ]]; then
        log_error "$repo directory does not exist"
        return 1
    fi
    
    cd "$repo"
    
    # Check required directories
    for dir in "${REQUIRED_DIRS[@]}"; do
        if [[ -d "$dir" ]]; then
            log_success "$repo/$dir exists"
        else
            log_error "$repo/$dir missing"
            ((errors++))
        fi
    done
    
    # Check .enterprise-cicd symlinks
    if [[ -d ".enterprise-cicd" ]]; then
        cd ".enterprise-cicd"
        for symlink in "${REQUIRED_SYMLINKS[@]}"; do
            if [[ -L "$symlink" ]]; then
                if [[ -e "$symlink" ]]; then
                    log_success "$repo/.enterprise-cicd/$symlink symlink valid"
                else
                    log_error "$repo/.enterprise-cicd/$symlink symlink broken"
                    ((errors++))
                fi
            else
                log_error "$repo/.enterprise-cicd/$symlink symlink missing"
                ((errors++))
            fi
        done
        
        # Check for README
        if [[ -f "README.md" ]]; then
            log_success "$repo/.enterprise-cicd/README.md exists"
        else
            log_error "$repo/.enterprise-cicd/README.md missing"
            ((errors++))
        fi
        
        cd ..
    fi
    
    cd ..
    
    if [[ $errors -eq 0 ]]; then
        log_success "$repo structure validation PASSED"
        return 0
    else
        log_error "$repo structure validation FAILED ($errors errors)"
        return 1
    fi
}

# Validate shared .enterprise-cicd infrastructure
validate_shared_infrastructure() {
    log_info "Validating shared .enterprise-cicd infrastructure..."
    local errors=0
    
    if [[ ! -d ".enterprise-cicd" ]]; then
        log_error "Shared .enterprise-cicd directory missing"
        return 1
    fi
    
    # Check required subdirectories
    local required_shared_dirs=(
        "agents"
        "configs"
        "dockerfiles"
        "environments"
        "scripts"
        "templates"
        "workflows"
    )
    
    for dir in "${required_shared_dirs[@]}"; do
        if [[ -d ".enterprise-cicd/$dir" ]]; then
            log_success ".enterprise-cicd/$dir exists"
        else
            log_error ".enterprise-cicd/$dir missing"
            ((errors++))
        fi
    done
    
    # Check environment configs
    if [[ -f ".enterprise-cicd/environments/staging/config.yml" ]]; then
        log_success "Staging environment config exists"
    else
        log_error "Staging environment config missing"
        ((errors++))
    fi
    
    if [[ -f ".enterprise-cicd/environments/production/config.yml" ]]; then
        log_success "Production environment config exists"
    else
        log_error "Production environment config missing"
        ((errors++))
    fi
    
    # Check master Dockerfiles
    if [[ -f ".enterprise-cicd/dockerfiles/Dockerfile.web" ]]; then
        log_success "Master web Dockerfile exists"
    else
        log_error "Master web Dockerfile missing"
        ((errors++))
    fi
    
    if [[ -f ".enterprise-cicd/dockerfiles/Dockerfile.backend" ]]; then
        log_success "Master backend Dockerfile exists"
    else
        log_error "Master backend Dockerfile missing"
        ((errors++))
    fi
    
    # Check deployment script
    if [[ -f ".enterprise-cicd/scripts/deploy-rigger-service.sh" ]] && [[ -x ".enterprise-cicd/scripts/deploy-rigger-service.sh" ]]; then
        log_success "Deployment script exists and is executable"
    else
        log_error "Deployment script missing or not executable"
        ((errors++))
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "Shared infrastructure validation PASSED"
        return 0
    else
        log_error "Shared infrastructure validation FAILED ($errors errors)"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}=== Repository Structure Validation ===${NC}"
    echo -e "${BLUE}ChaseWhiteRabbit NGO - Enterprise Standards${NC}"
    echo ""
    
    local total_errors=0
    
    # Validate shared infrastructure first
    if ! validate_shared_infrastructure; then
        ((total_errors++))
    fi
    
    echo ""
    
    # Validate each Rigger repository
    for repo in "${RIGGER_REPOS[@]}"; do
        if ! validate_repository "$repo"; then
            ((total_errors++))
        fi
        echo ""
    done
    
    # Summary
    echo -e "${BLUE}=== Validation Summary ===${NC}"
    if [[ $total_errors -eq 0 ]]; then
        log_success "All repositories pass enterprise structure validation!"
        log_info "Directory standardization is COMPLETE and compliant"
        return 0
    else
        log_error "$total_errors repositories failed validation"
        log_warning "Please fix the reported issues"
        return 1
    fi
}

# Run validation
main "$@"
