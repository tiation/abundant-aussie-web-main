#!/bin/bash
# Node.js Project Detection Test Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD
# 
# This script tests the project detection functionality

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Test configuration
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
DETECTION_SCRIPT="$SCRIPT_DIR/detect-nodejs-project.sh"
INTEGRATION_SCRIPT="$SCRIPT_DIR/apply-project-detection.sh"
TEST_DIR="/tmp/nodejs-detection-tests"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"; }
success() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"; }
fail() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"; }

# Test helper functions
run_test() {
    local test_name="$1"
    local test_function="$2"
    
    info "Running test: $test_name"
    ((TESTS_RUN++))
    
    if $test_function; then
        success "Test passed: $test_name"
        ((TESTS_PASSED++))
        return 0
    else
        fail "Test failed: $test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

create_test_project() {
    local project_type="$1"
    local project_dir="$TEST_DIR/$project_type-test"
    
    mkdir -p "$project_dir"
    cd "$project_dir"
    
    case "$project_type" in
        "nextjs")
            cat > package.json << 'EOF'
{
  "name": "nextjs-test-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "jest": "^29.7.0"
  }
}
EOF
            touch next.config.js
            mkdir -p pages
            ;;
            
        "vite")
            cat > package.json << 'EOF'
{
  "name": "vite-test-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.1.0",
    "vitest": "^1.0.0",
    "typescript": "^5.2.0"
  }
}
EOF
            touch vite.config.ts
            ;;
            
        "express")
            cat > package.json << 'EOF'
{
  "name": "express-test-api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "jest": "^29.7.0",
    "@types/express": "^4.17.0"
  }
}
EOF
            mkdir -p src
            touch src/index.ts
            ;;
            
        "shared-library")
            cat > package.json << 'EOF'
{
  "name": "@test-org/shared-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "test": "jest"
  },
  "devDependencies": {
    "rollup": "^4.0.0",
    "typescript": "^5.2.0",
    "jest": "^29.7.0"
  }
}
EOF
            touch rollup.config.js
            ;;
            
        "generic")
            cat > package.json << 'EOF'
{
  "name": "generic-nodejs-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "mocha"
  },
  "devDependencies": {
    "mocha": "^10.0.0"
  }
}
EOF
            touch index.js
            ;;
    esac
    
    echo "$project_dir"
}

# Test functions
test_detection_script_exists() {
    [[ -f "$DETECTION_SCRIPT" ]] && [[ -x "$DETECTION_SCRIPT" ]]
}

test_integration_script_exists() {
    [[ -f "$INTEGRATION_SCRIPT" ]] && [[ -x "$INTEGRATION_SCRIPT" ]]
}

test_nextjs_detection() {
    local project_dir
    project_dir=$(create_test_project "nextjs")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check results
    local project_type
    project_type=$(jq -r '.projectType' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$project_type" == "nextjs" ]]
}

test_vite_detection() {
    local project_dir
    project_dir=$(create_test_project "vite")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check results
    local project_type
    project_type=$(jq -r '.projectType' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$project_type" == "vite" ]]
}

test_express_detection() {
    local project_dir
    project_dir=$(create_test_project "express")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check results
    local project_type
    project_type=$(jq -r '.projectType' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$project_type" == "express" ]]
}

test_shared_library_detection() {
    local project_dir
    project_dir=$(create_test_project "shared-library")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check results
    local project_type
    project_type=$(jq -r '.projectType' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$project_type" == "shared-library" ]]
}

test_generic_nodejs_detection() {
    local project_dir
    project_dir=$(create_test_project "generic")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check results
    local project_type
    project_type=$(jq -r '.projectType' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$project_type" == "generic-nodejs" ]]
}

test_typescript_detection() {
    local project_dir
    project_dir=$(create_test_project "nextjs")  # NextJS has TypeScript
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check TypeScript detection
    local has_typescript
    has_typescript=$(jq -r '.capabilities.hasTypeScript' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$has_typescript" == "true" ]]
}

test_testing_framework_detection() {
    local project_dir
    project_dir=$(create_test_project "nextjs")  # NextJS has Jest
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check testing framework detection
    local has_tests
    has_tests=$(jq -r '.capabilities.hasTests' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$has_tests" == "true" ]]
}

test_docker_build_flag() {
    local project_dir
    project_dir=$(create_test_project "nextjs")  # NextJS should enable Docker
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check Docker build flag
    local docker_build
    docker_build=$(jq -r '.capabilities.dockerBuild' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$docker_build" == "true" ]]
}

test_frontend_build_flag() {
    local project_dir
    project_dir=$(create_test_project "nextjs")  # NextJS should enable frontend build
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check frontend build flag
    local frontend_build
    frontend_build=$(jq -r '.capabilities.frontendBuild' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$frontend_build" == "true" ]]
}

test_server_tests_flag() {
    local project_dir
    project_dir=$(create_test_project "express")  # Express should enable server tests
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check server tests flag
    local server_tests
    server_tests=$(jq -r '.capabilities.serverTests' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$server_tests" == "true" ]]
}

test_library_build_flag() {
    local project_dir
    project_dir=$(create_test_project "shared-library")  # Library should enable library build
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check library build flag
    local library_build
    library_build=$(jq -r '.capabilities.libraryBuild' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$library_build" == "true" ]]
}

test_command_extraction() {
    local project_dir
    project_dir=$(create_test_project "nextjs")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check command extraction
    local build_command
    build_command=$(jq -r '.commands.build' .enterprise-cicd/project-detection.json 2>/dev/null)
    [[ "$build_command" == "next build" ]]
}

test_integration_script() {
    local project_dir
    project_dir=$(create_test_project "nextjs")
    cd "$project_dir"
    
    # Run detection first
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Run integration
    if ! "$INTEGRATION_SCRIPT" apply >/dev/null 2>&1; then
        return 1
    fi
    
    # Check if pipeline config was created
    [[ -f .enterprise-cicd/pipeline-config.env ]]
}

test_env_file_generation() {
    local project_dir
    project_dir=$(create_test_project "vite")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check if env file exists and contains expected variables
    [[ -f .enterprise-cicd/project-detection.env ]] && \
    grep -q "PROJECT_TYPE=" .enterprise-cicd/project-detection.env && \
    grep -q "FRONTEND_BUILD=" .enterprise-cicd/project-detection.env
}

test_json_file_generation() {
    local project_dir
    project_dir=$(create_test_project "express")
    cd "$project_dir"
    
    # Run detection
    if ! "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1
    fi
    
    # Check if JSON file exists and is valid
    [[ -f .enterprise-cicd/project-detection.json ]] && \
    jq empty .enterprise-cicd/project-detection.json >/dev/null 2>&1
}

test_no_package_json() {
    local project_dir="$TEST_DIR/no-package-json-test"
    mkdir -p "$project_dir"
    cd "$project_dir"
    
    # Run detection (should fail gracefully)
    if "$DETECTION_SCRIPT" detect >/dev/null 2>&1; then
        return 1  # Should fail when no package.json
    fi
    
    return 0  # Expecting failure is success for this test
}

# Setup and cleanup functions
setup_tests() {
    log "🧪 Setting up test environment..."
    
    # Clean up any existing test directory
    rm -rf "$TEST_DIR"
    mkdir -p "$TEST_DIR"
    
    # Check dependencies
    if ! command -v jq >/dev/null 2>&1; then
        error "jq is required for tests but not installed"
        return 1
    fi
    
    success "Test environment ready"
}

cleanup_tests() {
    log "🧹 Cleaning up test environment..."
    rm -rf "$TEST_DIR"
    success "Test cleanup completed"
}

# Test summary
print_test_summary() {
    echo
    echo -e "${PURPLE}╔══════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║            TEST SUMMARY              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════╝${NC}"
    echo
    echo -e "${BLUE}Tests Run:${NC} $TESTS_RUN"
    echo -e "${GREEN}Tests Passed:${NC} $TESTS_PASSED"
    echo -e "${RED}Tests Failed:${NC} $TESTS_FAILED"
    echo
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        success "All tests passed! 🎉"
        return 0
    else
        fail "Some tests failed!"
        return 1
    fi
}

# Main test execution
main() {
    log "🚀 Starting Node.js Project Detection Tests..."
    
    if ! setup_tests; then
        error "Failed to setup test environment"
        return 1
    fi
    
    # Basic functionality tests
    run_test "Detection script exists and is executable" test_detection_script_exists
    run_test "Integration script exists and is executable" test_integration_script_exists
    
    # Project type detection tests
    run_test "Next.js project detection" test_nextjs_detection
    run_test "Vite project detection" test_vite_detection
    run_test "Express project detection" test_express_detection
    run_test "Shared library detection" test_shared_library_detection
    run_test "Generic Node.js detection" test_generic_nodejs_detection
    
    # Feature detection tests
    run_test "TypeScript detection" test_typescript_detection
    run_test "Testing framework detection" test_testing_framework_detection
    run_test "Docker build flag detection" test_docker_build_flag
    run_test "Frontend build flag detection" test_frontend_build_flag
    run_test "Server tests flag detection" test_server_tests_flag
    run_test "Library build flag detection" test_library_build_flag
    
    # Output tests
    run_test "Command extraction" test_command_extraction
    run_test "Environment file generation" test_env_file_generation
    run_test "JSON file generation" test_json_file_generation
    
    # Integration tests
    run_test "Integration script functionality" test_integration_script
    
    # Error handling tests
    run_test "No package.json handling" test_no_package_json
    
    cleanup_tests
    print_test_summary
}

# Handle command line arguments
case "${1:-run}" in
    "run")
        main
        ;;
    "setup")
        setup_tests
        ;;
    "cleanup")
        cleanup_tests
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo "Commands:"
        echo "  run     - Run all tests (default)"
        echo "  setup   - Setup test environment"
        echo "  cleanup - Clean up test environment"
        echo "  help    - Show this help message"
        ;;
    *)
        error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
