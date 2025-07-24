#!/bin/bash
# Node.js Project Detection Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD
# 
# This script identifies the project type based on configuration files and dependencies
# and stores the results to control CI/CD pipeline behavior

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Detection results file
DETECTION_RESULTS_FILE=".enterprise-cicd/project-detection.json"
DETECTION_ENV_FILE=".enterprise-cicd/project-detection.env"

# Initialize detection results
PROJECT_TYPE=""
FRONTEND_BUILD=false
SERVER_TESTS=false
DOCKER_BUILD=false
LIBRARY_BUILD=false
HAS_TYPESCRIPT=false
HAS_TESTS=false
BUILD_COMMAND=""
START_COMMAND=""
TEST_COMMAND=""
DEPENDENCIES=()

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"; }

# Function to check if package.json exists and is valid
check_package_json() {
    if [[ ! -f "package.json" ]]; then
        return 1
    fi
    
    if ! jq empty package.json 2>/dev/null; then
        error "package.json exists but contains invalid JSON"
        return 1
    fi
    
    return 0
}

# Function to extract dependencies from package.json
extract_dependencies() {
    local deps_json
    deps_json=$(jq -r '(.dependencies // {}) + (.devDependencies // {}) | keys[]' package.json 2>/dev/null | sort -u)
    readarray -t DEPENDENCIES <<< "$deps_json"
}

# Function to detect Next.js project
detect_nextjs() {
    log "🔍 Checking for Next.js project..."
    
    # Check for next.config.js/ts
    if [[ -f "next.config.js" ]] || [[ -f "next.config.ts" ]] || [[ -f "next.config.mjs" ]]; then
        log "✓ Found Next.js config file"
        return 0
    fi
    
    # Check for Next.js dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^next$"; then
        log "✓ Found Next.js in dependencies"
        return 0
    fi
    
    # Check for Next.js specific directories
    if [[ -d "pages" ]] || [[ -d "app" ]] || [[ -d ".next" ]]; then
        log "✓ Found Next.js directory structure"
        return 0
    fi
    
    return 1
}

# Function to detect Vite project
detect_vite() {
    log "🔍 Checking for Vite project..."
    
    # Check for vite.config.js/ts
    if [[ -f "vite.config.js" ]] || [[ -f "vite.config.ts" ]] || [[ -f "vite.config.mjs" ]]; then
        log "✓ Found Vite config file"
        return 0
    fi
    
    # Check for Vite dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^vite$"; then
        log "✓ Found Vite in dependencies"
        return 0
    fi
    
    # Check for Vite plugins
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "@vitejs/"; then
        log "✓ Found Vite plugins in dependencies"
        return 0
    fi
    
    return 1
}

# Function to detect Express project
detect_express() {
    log "🔍 Checking for Express project..."
    
    # Check for Express dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^express$"; then
        log "✓ Found Express in dependencies"
        return 0
    fi
    
    # Check for Express-like server files
    if [[ -f "server.js" ]] || [[ -f "server.ts" ]] || [[ -f "app.js" ]] || [[ -f "app.ts" ]]; then
        # Verify it's actually using Express
        if grep -q "express" server.js server.ts app.js app.ts 2>/dev/null; then
            log "✓ Found Express server file"
            return 0
        fi
    fi
    
    # Check for common Express patterns in src directory
    if [[ -d "src" ]]; then
        if find src -name "*.js" -o -name "*.ts" | xargs grep -l "express" 2>/dev/null | grep -q .; then
            log "✓ Found Express usage in src directory"
            return 0
        fi
    fi
    
    return 1
}

# Function to detect Fastify project
detect_fastify() {
    log "🔍 Checking for Fastify project..."
    
    # Check for Fastify dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^fastify$"; then
        log "✓ Found Fastify in dependencies"
        return 0
    fi
    
    return 1
}

# Function to detect shared library project
detect_shared_library() {
    log "🔍 Checking for shared library project..."
    
    if ! check_package_json; then
        return 1
    fi
    
    local package_name
    package_name=$(jq -r '.name // ""' package.json)
    
    # Check for scoped package name (typical for shared libraries)
    if [[ $package_name =~ ^@[^/]+/.+ ]]; then
        log "✓ Found scoped package name: $package_name"
        return 0
    fi
    
    # Check for library-specific configuration
    if jq -e '.main // .module // .exports' package.json >/dev/null 2>&1; then
        log "✓ Found library entry points in package.json"
        return 0
    fi
    
    # Check for build tools commonly used in libraries
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -E "^(rollup|webpack|esbuild|tsup|microbundle)$" | grep -q .; then
        log "✓ Found library build tools"
        return 0
    fi
    
    # Check for library-specific files
    if [[ -f "rollup.config.js" ]] || [[ -f "rollup.config.ts" ]] || [[ -f "webpack.config.js" ]]; then
        log "✓ Found library build configuration"
        return 0
    fi
    
    return 1
}

# Function to detect React Native project
detect_react_native() {
    log "🔍 Checking for React Native project..."
    
    # Check for React Native dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^react-native$"; then
        log "✓ Found React Native in dependencies"
        return 0
    fi
    
    # Check for React Native CLI or Expo
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -E "^(@react-native-community|expo|@expo)" | grep -q .; then
        log "✓ Found React Native tooling"
        return 0
    fi
    
    # Check for platform directories
    if [[ -d "android" ]] && [[ -d "ios" ]]; then
        log "✓ Found React Native platform directories"
        return 0
    fi
    
    return 1
}

# Function to detect Nuxt project
detect_nuxt() {
    log "🔍 Checking for Nuxt project..."
    
    # Check for nuxt.config.js/ts
    if [[ -f "nuxt.config.js" ]] || [[ -f "nuxt.config.ts" ]]; then
        log "✓ Found Nuxt config file"
        return 0
    fi
    
    # Check for Nuxt dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -E "^(nuxt|@nuxt)" | grep -q .; then
        log "✓ Found Nuxt in dependencies"
        return 0
    fi
    
    return 1
}

# Function to detect Electron project
detect_electron() {
    log "🔍 Checking for Electron project..."
    
    # Check for Electron dependency
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^electron$"; then
        log "✓ Found Electron in dependencies"
        return 0
    fi
    
    # Check for Electron main file
    if jq -e '.main' package.json | grep -q "electron" 2>/dev/null; then
        log "✓ Found Electron main file reference"
        return 0
    fi
    
    return 1
}

# Function to detect additional project characteristics
detect_characteristics() {
    log "🔍 Analyzing project characteristics..."
    
    # Check for TypeScript
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -q "^typescript$" || [[ -f "tsconfig.json" ]]; then
        HAS_TYPESCRIPT=true
        log "✓ TypeScript detected"
    fi
    
    # Check for testing frameworks
    if printf '%s\n' "${DEPENDENCIES[@]}" | grep -E "^(jest|vitest|mocha|ava|tap)$" | grep -q .; then
        HAS_TESTS=true
        log "✓ Testing framework detected"
    fi
    
    # Extract commands from package.json if it exists
    if check_package_json; then
        BUILD_COMMAND=$(jq -r '.scripts.build // ""' package.json)
        START_COMMAND=$(jq -r '.scripts.start // ""' package.json)
        TEST_COMMAND=$(jq -r '.scripts.test // ""' package.json)
        
        log "Build command: ${BUILD_COMMAND:-'not defined'}"
        log "Start command: ${START_COMMAND:-'not defined'}"
        log "Test command: ${TEST_COMMAND:-'not defined'}"
    fi
}

# Function to determine project type and flags
determine_project_type() {
    log "🎯 Determining project type..."
    
    if ! check_package_json; then
        warn "No package.json found, cannot detect Node.js project type"
        return 1
    fi
    
    extract_dependencies
    
    # Detect project type in order of specificity
    if detect_nextjs; then
        PROJECT_TYPE="nextjs"
        FRONTEND_BUILD=true
        DOCKER_BUILD=true
        info "Detected: Next.js application"
        
    elif detect_nuxt; then
        PROJECT_TYPE="nuxt"
        FRONTEND_BUILD=true
        DOCKER_BUILD=true
        info "Detected: Nuxt.js application"
        
    elif detect_vite; then
        PROJECT_TYPE="vite"
        FRONTEND_BUILD=true
        DOCKER_BUILD=true
        info "Detected: Vite application"
        
    elif detect_react_native; then
        PROJECT_TYPE="react-native"
        FRONTEND_BUILD=true
        DOCKER_BUILD=false  # React Native doesn't typically use Docker
        info "Detected: React Native application"
        
    elif detect_electron; then
        PROJECT_TYPE="electron"
        FRONTEND_BUILD=true
        DOCKER_BUILD=false  # Electron apps aren't typically containerized
        info "Detected: Electron application"
        
    elif detect_fastify; then
        PROJECT_TYPE="fastify"
        SERVER_TESTS=true
        DOCKER_BUILD=true
        info "Detected: Fastify API server"
        
    elif detect_express; then
        PROJECT_TYPE="express"
        SERVER_TESTS=true
        DOCKER_BUILD=true
        info "Detected: Express.js application"
        
    elif detect_shared_library; then
        PROJECT_TYPE="shared-library"
        LIBRARY_BUILD=true
        DOCKER_BUILD=false  # Libraries typically aren't containerized
        info "Detected: Shared library/package"
        
    else
        PROJECT_TYPE="generic-nodejs"
        info "Detected: Generic Node.js project"
    fi
    
    detect_characteristics
    
    # Enable server tests for any backend project
    if [[ "$PROJECT_TYPE" =~ ^(express|fastify|generic-nodejs)$ ]] && [[ "$HAS_TESTS" == "true" ]]; then
        SERVER_TESTS=true
    fi
    
    return 0
}

# Function to create detection results
create_results() {
    log "📝 Creating detection results..."
    
    # Ensure the .enterprise-cicd directory exists
    mkdir -p ".enterprise-cicd"
    
    # Create JSON results file
    cat > "$DETECTION_RESULTS_FILE" << EOF
{
  "projectType": "$PROJECT_TYPE",
  "capabilities": {
    "frontendBuild": $FRONTEND_BUILD,
    "serverTests": $SERVER_TESTS,
    "dockerBuild": $DOCKER_BUILD,
    "libraryBuild": $LIBRARY_BUILD,
    "hasTypeScript": $HAS_TYPESCRIPT,
    "hasTests": $HAS_TESTS
  },
  "commands": {
    "build": "$BUILD_COMMAND",
    "start": "$START_COMMAND",
    "test": "$TEST_COMMAND"
  },
  "dependencies": $(printf '%s\n' "${DEPENDENCIES[@]}" | jq -R . | jq -s .),
  "detectedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "detectionVersion": "1.0.0"
}
EOF
    
    # Create environment variables file for easy sourcing in CI/CD
    cat > "$DETECTION_ENV_FILE" << EOF
# Node.js Project Detection Results
# Generated at $(date -u +"%Y-%m-%dT%H:%M:%SZ")

export PROJECT_TYPE="$PROJECT_TYPE"
export FRONTEND_BUILD=$FRONTEND_BUILD
export SERVER_TESTS=$SERVER_TESTS
export DOCKER_BUILD=$DOCKER_BUILD
export LIBRARY_BUILD=$LIBRARY_BUILD
export HAS_TYPESCRIPT=$HAS_TYPESCRIPT
export HAS_TESTS=$HAS_TESTS
export BUILD_COMMAND="$BUILD_COMMAND"
export START_COMMAND="$START_COMMAND"
export TEST_COMMAND="$TEST_COMMAND"
EOF
    
    log "✅ Detection results saved to:"
    log "  - JSON: $DETECTION_RESULTS_FILE"
    log "  - ENV:  $DETECTION_ENV_FILE"
}

# Function to display results summary
display_summary() {
    echo
    echo -e "${PURPLE}╔══════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           PROJECT DETECTION          ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════╝${NC}"
    echo
    echo -e "${BLUE}Project Type:${NC} $PROJECT_TYPE"
    echo -e "${BLUE}Frontend Build:${NC} $FRONTEND_BUILD"
    echo -e "${BLUE}Server Tests:${NC} $SERVER_TESTS"
    echo -e "${BLUE}Docker Build:${NC} $DOCKER_BUILD"
    echo -e "${BLUE}Library Build:${NC} $LIBRARY_BUILD"
    echo -e "${BLUE}TypeScript:${NC} $HAS_TYPESCRIPT"
    echo -e "${BLUE}Tests:${NC} $HAS_TESTS"
    echo
    if [[ -n "$BUILD_COMMAND" ]]; then
        echo -e "${BLUE}Build Command:${NC} $BUILD_COMMAND"
    fi
    if [[ -n "$START_COMMAND" ]]; then
        echo -e "${BLUE}Start Command:${NC} $START_COMMAND"
    fi
    if [[ -n "$TEST_COMMAND" ]]; then
        echo -e "${BLUE}Test Command:${NC} $TEST_COMMAND"
    fi
    echo
}

# Main execution
main() {
    log "🚀 Starting Node.js project detection..."
    
    if determine_project_type; then
        create_results
        display_summary
        log "🎉 Project detection completed successfully"
        return 0
    else
        error "Failed to detect project type"
        return 1
    fi
}

# Handle command line arguments
case "${1:-detect}" in
    "detect")
        main
        ;;
    "results")
        if [[ -f "$DETECTION_RESULTS_FILE" ]]; then
            jq . "$DETECTION_RESULTS_FILE"
        else
            error "No detection results found. Run detection first."
            exit 1
        fi
        ;;
    "env")
        if [[ -f "$DETECTION_ENV_FILE" ]]; then
            cat "$DETECTION_ENV_FILE"
        else
            error "No detection environment file found. Run detection first."
            exit 1
        fi
        ;;
    "clean")
        rm -f "$DETECTION_RESULTS_FILE" "$DETECTION_ENV_FILE"
        log "🧹 Detection results cleaned"
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo "Commands:"
        echo "  detect  - Run project detection (default)"
        echo "  results - Show detection results as JSON"
        echo "  env     - Show detection results as environment variables"
        echo "  clean   - Remove detection result files"
        echo "  help    - Show this help message"
        ;;
    *)
        error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
