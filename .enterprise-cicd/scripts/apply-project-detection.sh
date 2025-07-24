#!/bin/bash
# Project Detection Integration Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD
# 
# This script applies Node.js project detection results to control CI/CD pipeline behavior

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Detection results files
DETECTION_RESULTS_FILE=".enterprise-cicd/project-detection.json"
DETECTION_ENV_FILE=".enterprise-cicd/project-detection.env"
PIPELINE_CONFIG_FILE=".enterprise-cicd/pipeline-config.env"

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"; }

# Function to check if detection results exist
check_detection_results() {
    if [[ ! -f "$DETECTION_RESULTS_FILE" ]]; then
        warn "Detection results not found. Running project detection..."
        if .enterprise-cicd/scripts/detect-nodejs-project.sh detect; then
            log "✅ Project detection completed"
        else
            error "Failed to run project detection"
            return 1
        fi
    fi
    
    if [[ ! -f "$DETECTION_ENV_FILE" ]]; then
        error "Detection environment file missing"
        return 1
    fi
    
    return 0
}

# Function to load detection results
load_detection_results() {
    log "📄 Loading project detection results..."
    
    # Source the environment variables
    set -a  # automatically export all variables
    # shellcheck source=/dev/null
    source "$DETECTION_ENV_FILE"
    set +a
    
    log "Project type: $PROJECT_TYPE"
    log "Frontend build: $FRONTEND_BUILD"
    log "Server tests: $SERVER_TESTS"
    log "Docker build: $DOCKER_BUILD"
    log "Library build: $LIBRARY_BUILD"
    log "TypeScript: $HAS_TYPESCRIPT"
    log "Tests: $HAS_TESTS"
}

# Function to determine Node.js version based on project type
determine_node_version() {
    local node_version="20"  # Default
    
    case "$PROJECT_TYPE" in
        "nextjs")
            node_version="20"  # Next.js 14+ requires Node 20+
            ;;
        "nuxt")
            node_version="20"  # Nuxt 3 works best with Node 20
            ;;
        "vite")
            node_version="20"  # Vite works well with latest Node
            ;;
        "react-native")
            node_version="18"  # React Native is more conservative
            ;;
        "electron")
            node_version="20"  # Electron uses recent Node versions
            ;;
        "express"|"fastify")
            node_version="20"  # Backend projects can use latest
            ;;
        "shared-library")
            node_version="18"  # Libraries should support wider range
            ;;
        *)
            node_version="20"  # Default to LTS
            ;;
    esac
    
    echo "$node_version"
}

# Function to determine build strategy
determine_build_strategy() {
    local build_strategy=""
    
    if [[ "$FRONTEND_BUILD" == "true" ]]; then
        case "$PROJECT_TYPE" in
            "nextjs")
                build_strategy="nextjs-static-build"
                ;;
            "nuxt")
                build_strategy="nuxt-static-build"
                ;;
            "vite")
                build_strategy="vite-spa-build"
                ;;
            "react-native")
                build_strategy="react-native-bundle"
                ;;
            "electron")
                build_strategy="electron-package"
                ;;
            *)
                build_strategy="generic-frontend-build"
                ;;
        esac
    elif [[ "$SERVER_TESTS" == "true" ]]; then
        build_strategy="api-server-build"
    elif [[ "$LIBRARY_BUILD" == "true" ]]; then
        build_strategy="library-package-build"
    else
        build_strategy="generic-build"
    fi
    
    echo "$build_strategy"
}

# Function to determine test strategy
determine_test_strategy() {
    local test_strategy=""
    
    if [[ "$HAS_TESTS" != "true" ]]; then
        test_strategy="no-tests"
        return
    fi
    
    case "$PROJECT_TYPE" in
        "nextjs"|"nuxt"|"vite"|"react-native")
            test_strategy="frontend-component-tests"
            ;;
        "express"|"fastify")
            test_strategy="api-integration-tests"
            ;;
        "shared-library")
            test_strategy="library-unit-tests"
            ;;
        "electron")
            test_strategy="electron-e2e-tests"
            ;;
        *)
            test_strategy="generic-unit-tests"
            ;;
    esac
    
    echo "$test_strategy"
}

# Function to determine deployment strategy
determine_deployment_strategy() {
    local deployment_strategy=""
    
    if [[ "$DOCKER_BUILD" == "true" ]]; then
        case "$PROJECT_TYPE" in
            "nextjs")
                deployment_strategy="nextjs-docker-deployment"
                ;;
            "nuxt")
                deployment_strategy="nuxt-docker-deployment"
                ;;
            "vite")
                deployment_strategy="static-site-deployment"
                ;;
            "express"|"fastify")
                deployment_strategy="api-server-deployment"
                ;;
            *)
                deployment_strategy="generic-docker-deployment"
                ;;
        esac
    elif [[ "$FRONTEND_BUILD" == "true" ]]; then
        deployment_strategy="static-site-deployment"
    elif [[ "$LIBRARY_BUILD" == "true" ]]; then
        deployment_strategy="npm-registry-publish"
    else
        deployment_strategy="no-deployment"
    fi
    
    echo "$deployment_strategy"
}

# Function to determine Docker base image
determine_docker_base_image() {
    local base_image=""
    local node_version
    node_version=$(determine_node_version)
    
    case "$PROJECT_TYPE" in
        "nextjs")
            base_image="node:${node_version}-alpine"
            ;;
        "nuxt")
            base_image="node:${node_version}-alpine"
            ;;
        "vite")
            base_image="nginx:alpine"  # Static files served by nginx
            ;;
        "express"|"fastify")
            base_image="node:${node_version}-alpine"
            ;;
        *)
            base_image="node:${node_version}-alpine"
            ;;
    esac
    
    echo "$base_image"
}

# Function to determine quality gates
determine_quality_gates() {
    local lint_enabled="false"
    local type_check_enabled="false"
    local security_scan_enabled="true"  # Always enabled
    local performance_test_enabled="false"
    
    # Enable linting for all JavaScript/TypeScript projects
    if [[ "$PROJECT_TYPE" != "generic-nodejs" ]]; then
        lint_enabled="true"
    fi
    
    # Enable type checking for TypeScript projects
    if [[ "$HAS_TYPESCRIPT" == "true" ]]; then
        type_check_enabled="true"
    fi
    
    # Enable performance tests for frontend applications
    if [[ "$FRONTEND_BUILD" == "true" ]] && [[ "$PROJECT_TYPE" =~ ^(nextjs|nuxt|vite)$ ]]; then
        performance_test_enabled="true"
    fi
    
    echo "LINT_ENABLED=$lint_enabled"
    echo "TYPE_CHECK_ENABLED=$type_check_enabled"
    echo "SECURITY_SCAN_ENABLED=$security_scan_enabled"
    echo "PERFORMANCE_TEST_ENABLED=$performance_test_enabled"
}

# Function to generate pipeline configuration
generate_pipeline_config() {
    log "🔧 Generating pipeline configuration..."
    
    local node_version
    local build_strategy
    local test_strategy
    local deployment_strategy
    local docker_base_image
    
    node_version=$(determine_node_version)
    build_strategy=$(determine_build_strategy)
    test_strategy=$(determine_test_strategy)
    deployment_strategy=$(determine_deployment_strategy)
    docker_base_image=$(determine_docker_base_image)
    
    # Create pipeline configuration
    cat > "$PIPELINE_CONFIG_FILE" << EOF
# Pipeline Configuration Generated from Project Detection
# Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Project Type: $PROJECT_TYPE

# Project Detection Results
export PROJECT_TYPE="$PROJECT_TYPE"
export FRONTEND_BUILD=$FRONTEND_BUILD
export SERVER_TESTS=$SERVER_TESTS
export DOCKER_BUILD=$DOCKER_BUILD
export LIBRARY_BUILD=$LIBRARY_BUILD
export HAS_TYPESCRIPT=$HAS_TYPESCRIPT
export HAS_TESTS=$HAS_TESTS

# Pipeline Configuration
export NODE_VERSION="$node_version"
export BUILD_STRATEGY="$build_strategy"
export TEST_STRATEGY="$test_strategy"
export DEPLOYMENT_STRATEGY="$deployment_strategy"
export DOCKER_BASE_IMAGE="$docker_base_image"

# Build Commands
export BUILD_COMMAND="$BUILD_COMMAND"
export START_COMMAND="$START_COMMAND"
export TEST_COMMAND="$TEST_COMMAND"

# Quality Gates
$(determine_quality_gates)

# Feature Flags Based on Project Type
export ENABLE_FRONTEND_BUILD=$FRONTEND_BUILD
export ENABLE_SERVER_TESTS=$SERVER_TESTS
export ENABLE_DOCKER_BUILD=$DOCKER_BUILD
export ENABLE_LIBRARY_BUILD=$LIBRARY_BUILD
export ENABLE_TYPESCRIPT_CHECK=$HAS_TYPESCRIPT

# Caching Strategy
export CACHE_KEY_PREFIX="${PROJECT_TYPE}-\${CI_COMMIT_REF_SLUG:-main}"
export CACHE_PATHS="node_modules/ .npm/ dist/ build/ coverage/"

# Monitoring and Alerts
export ENABLE_PERFORMANCE_MONITORING=$FRONTEND_BUILD
export ENABLE_ERROR_TRACKING=true
export ENABLE_LOG_AGGREGATION=true

EOF
    
    log "✅ Pipeline configuration saved to: $PIPELINE_CONFIG_FILE"
}

# Function to create project-specific Docker configuration
create_docker_config() {
    if [[ "$DOCKER_BUILD" != "true" ]]; then
        return 0
    fi
    
    log "🐳 Creating Docker configuration for $PROJECT_TYPE..."
    
    local dockerfile_template=""
    local docker_compose_template=""
    
    case "$PROJECT_TYPE" in
        "nextjs")
            dockerfile_template=".enterprise-cicd/templates/docker/Dockerfile.nextjs"
            docker_compose_template=".enterprise-cicd/templates/docker/docker-compose.nextjs.yml"
            ;;
        "nuxt")
            dockerfile_template=".enterprise-cicd/templates/docker/Dockerfile.nuxt"
            docker_compose_template=".enterprise-cicd/templates/docker/docker-compose.nuxt.yml"
            ;;
        "vite")
            dockerfile_template=".enterprise-cicd/templates/docker/Dockerfile.vite"
            docker_compose_template=".enterprise-cicd/templates/docker/docker-compose.vite.yml"
            ;;
        "express"|"fastify")
            dockerfile_template=".enterprise-cicd/templates/docker/Dockerfile.api"
            docker_compose_template=".enterprise-cicd/templates/docker/docker-compose.api.yml"
            ;;
        *)
            dockerfile_template=".enterprise-cicd/templates/docker/Dockerfile.generic"
            docker_compose_template=".enterprise-cicd/templates/docker/docker-compose.generic.yml"
            ;;
    esac
    
    # Create Docker templates directory if it doesn't exist
    mkdir -p .enterprise-cicd/templates/docker
    
    # Generate Dockerfile if it doesn't exist
    if [[ ! -f "Dockerfile" ]] && [[ -f "$dockerfile_template" ]]; then
        log "📄 Creating Dockerfile from template: $dockerfile_template"
        cp "$dockerfile_template" Dockerfile
    fi
    
    # Generate docker-compose.yml if it doesn't exist
    if [[ ! -f "docker-compose.yml" ]] && [[ -f "$docker_compose_template" ]]; then
        log "📄 Creating docker-compose.yml from template: $docker_compose_template"
        cp "$docker_compose_template" docker-compose.yml
    fi
}

# Function to create project-specific CI/CD configuration
create_cicd_config() {
    log "⚙️ Creating CI/CD configuration for $PROJECT_TYPE..."
    
    # Create GitHub Actions workflow if .github directory exists
    if [[ -d ".github/workflows" ]]; then
        local workflow_template=".enterprise-cicd/templates/github-actions/${PROJECT_TYPE}.yml"
        if [[ -f "$workflow_template" ]]; then
            log "📄 Creating GitHub Actions workflow"
            cp "$workflow_template" ".github/workflows/ci-cd.yml"
        fi
    fi
    
    # Create GitLab CI configuration
    if [[ ! -f ".gitlab-ci.yml" ]]; then
        log "📄 Creating .gitlab-ci.yml configuration"
        cat > .gitlab-ci.yml << EOF
# GitLab CI/CD Configuration
# Generated from project detection: $PROJECT_TYPE

include:
  - local: '.enterprise-cicd/templates/gitlab-ci-master.yml'

variables:
  PROJECT_TYPE: "$PROJECT_TYPE"
  FRONTEND_BUILD: "$FRONTEND_BUILD"
  SERVER_TESTS: "$SERVER_TESTS"
  DOCKER_BUILD: "$DOCKER_BUILD"
  LIBRARY_BUILD: "$LIBRARY_BUILD"

# Load pipeline configuration
before_script:
  - source .enterprise-cicd/pipeline-config.env

EOF
    fi
}

# Function to display configuration summary
display_summary() {
    echo
    echo -e "${PURPLE}╔══════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║        PIPELINE CONFIGURATION        ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════╝${NC}"
    echo
    echo -e "${BLUE}Project Type:${NC} $PROJECT_TYPE"
    echo -e "${BLUE}Node Version:${NC} $(determine_node_version)"
    echo -e "${BLUE}Build Strategy:${NC} $(determine_build_strategy)"
    echo -e "${BLUE}Test Strategy:${NC} $(determine_test_strategy)"
    echo -e "${BLUE}Deployment Strategy:${NC} $(determine_deployment_strategy)"
    echo -e "${BLUE}Docker Base Image:${NC} $(determine_docker_base_image)"
    echo
    echo -e "${BLUE}Enabled Features:${NC}"
    [[ "$FRONTEND_BUILD" == "true" ]] && echo -e "  ✓ Frontend Build"
    [[ "$SERVER_TESTS" == "true" ]] && echo -e "  ✓ Server Tests"
    [[ "$DOCKER_BUILD" == "true" ]] && echo -e "  ✓ Docker Build"
    [[ "$LIBRARY_BUILD" == "true" ]] && echo -e "  ✓ Library Build"
    [[ "$HAS_TYPESCRIPT" == "true" ]] && echo -e "  ✓ TypeScript Support"
    [[ "$HAS_TESTS" == "true" ]] && echo -e "  ✓ Testing Framework"
    echo
}

# Main execution
main() {
    log "🚀 Applying project detection to CI/CD pipeline..."
    
    if ! check_detection_results; then
        error "Failed to ensure detection results are available"
        return 1
    fi
    
    load_detection_results
    generate_pipeline_config
    create_docker_config
    create_cicd_config
    display_summary
    
    log "🎉 Pipeline configuration applied successfully"
    log "📄 Configuration files created:"
    log "  - Pipeline config: $PIPELINE_CONFIG_FILE"
    [[ -f "Dockerfile" ]] && log "  - Dockerfile: Generated"
    [[ -f "docker-compose.yml" ]] && log "  - Docker Compose: Generated"
    [[ -f ".gitlab-ci.yml" ]] && log "  - GitLab CI: Generated"
    
    return 0
}

# Handle command line arguments
case "${1:-apply}" in
    "apply")
        main
        ;;
    "config")
        if [[ -f "$PIPELINE_CONFIG_FILE" ]]; then
            cat "$PIPELINE_CONFIG_FILE"
        else
            error "No pipeline configuration found. Run 'apply' first."
            exit 1
        fi
        ;;
    "summary")
        if check_detection_results; then
            load_detection_results
            display_summary
        else
            error "Detection results not available"
            exit 1
        fi
        ;;
    "clean")
        rm -f "$PIPELINE_CONFIG_FILE"
        log "🧹 Pipeline configuration cleaned"
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo "Commands:"
        echo "  apply   - Apply project detection to CI/CD pipeline (default)"
        echo "  config  - Show generated pipeline configuration"
        echo "  summary - Show configuration summary"
        echo "  clean   - Remove generated pipeline configuration"
        echo "  help    - Show this help message"
        ;;
    *)
        error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
