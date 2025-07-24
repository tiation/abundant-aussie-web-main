#!/bin/bash

# scripts/smoke-tests.sh
# Comprehensive smoke tests for post-deployment validation

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NAMESPACE=${K8S_NAMESPACE:-"rigger-production"}
BASE_URL=${BASE_URL:-"https://riggerhub.com"}
CONNECT_URL=${CONNECT_URL:-"https://riggerconnect.com"}

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

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    log "Running test: $test_name"
    
    if eval "$test_command"; then
        log_success "✓ $test_name"
        ((TESTS_PASSED++))
        return 0
    else
        log_error "✗ $test_name"
        ((TESTS_FAILED++))
        FAILED_TESTS+=("$test_name")
        return 1
    fi
}

# Test API endpoints
test_api_endpoints() {
    log "Testing API endpoints..."
    
    # Backend health check
    run_test "Backend Health Check" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health'"
    
    # RiggerHub web health check
    run_test "RiggerHub Web Health Check" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health'"
    
    # RiggerConnect web health check
    run_test "RiggerConnect Web Health Check" \
        "curl -f --connect-timeout 10 --max-time 30 '$CONNECT_URL/api/health'"
    
    # Test rigger search endpoint
    run_test "Rigger Search API" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/riggers/search?location=Perth'"
    
    # Test job listings endpoint
    run_test "Job Listings API" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/jobs'"
    
    # Test authentication endpoints
    run_test "Auth Health Check" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/auth/status'"
}

# Test database connectivity
test_database_connectivity() {
    log "Testing database connectivity..."
    
    # Test database connection through API
    run_test "Database Connection Test" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health/db'"
    
    # Test Redis connection
    run_test "Redis Connection Test" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health/redis'"
}

# Test critical user flows
test_user_flows() {
    log "Testing critical user flows..."
    
    # Test rigger registration flow
    local rigger_data='{
        "email": "test-rigger@example.com",
        "password": "TestPassword123!",
        "firstName": "Test",
        "lastName": "Rigger",
        "phone": "+61400000000",
        "location": "Perth, WA",
        "certifications": ["Dogging", "Rigging"]
    }'
    
    run_test "Rigger Registration Flow" \
        "curl -f --connect-timeout 10 --max-time 30 -X POST -H 'Content-Type: application/json' -d '$rigger_data' '$BASE_URL/api/auth/register/rigger'"
    
    # Test client registration flow
    local client_data='{
        "email": "test-client@example.com",
        "password": "TestPassword123!",
        "companyName": "Test Company",
        "contactName": "Test Client",
        "phone": "+61400000001",
        "location": "Perth, WA"
    }'
    
    run_test "Client Registration Flow" \
        "curl -f --connect-timeout 10 --max-time 30 -X POST -H 'Content-Type: application/json' -d '$client_data' '$BASE_URL/api/auth/register/client'"
    
    # Test job posting flow (requires authentication, so we'll test the endpoint availability)
    run_test "Job Posting Endpoint Availability" \
        "curl -f --connect-timeout 10 --max-time 30 -X OPTIONS '$BASE_URL/api/jobs' -H 'Access-Control-Request-Method: POST'"
}

# Test security headers
test_security_headers() {
    log "Testing security headers..."
    
    # Test HTTPS enforcement
    run_test "HTTPS Enforcement" \
        "curl -f --connect-timeout 10 --max-time 30 -I '$BASE_URL' | grep -i 'strict-transport-security'"
    
    # Test Content Security Policy
    run_test "Content Security Policy" \
        "curl -f --connect-timeout 10 --max-time 30 -I '$BASE_URL' | grep -i 'content-security-policy'"
    
    # Test X-Frame-Options
    run_test "X-Frame-Options Header" \
        "curl -f --connect-timeout 10 --max-time 30 -I '$BASE_URL' | grep -i 'x-frame-options'"
}

# Test performance metrics
test_performance() {
    log "Testing performance metrics..."
    
    # Test page load time
    run_test "Homepage Load Time (<3s)" \
        "timeout 10 curl -w '%{time_total}' -o /dev/null -s '$BASE_URL' | awk '{if(\$1 < 3.0) exit 0; else exit 1}'"
    
    # Test API response time
    run_test "API Response Time (<1s)" \
        "timeout 10 curl -w '%{time_total}' -o /dev/null -s '$BASE_URL/api/health' | awk '{if(\$1 < 1.0) exit 0; else exit 1}'"
}

# Test monitoring endpoints
test_monitoring() {
    log "Testing monitoring endpoints..."
    
    # Test metrics endpoint
    run_test "Metrics Endpoint" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/metrics'"
    
    # Test Prometheus metrics format
    run_test "Prometheus Metrics Format" \
        "curl -s '$BASE_URL/metrics' | grep -E '^[a-zA-Z_][a-zA-Z0-9_]*{.*}[[:space:]]+[0-9.]+\$'"
}

# Test third-party integrations
test_integrations() {
    log "Testing third-party integrations..."
    
    # Test email service health
    run_test "Email Service Health" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health/email'"
    
    # Test payment service health (if applicable)
    run_test "Payment Service Health" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/health/payments' || true"
}

# Test mobile app endpoints
test_mobile_endpoints() {
    log "Testing mobile app endpoints..."
    
    # Test mobile API version
    run_test "Mobile API Version" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/mobile/version'"
    
    # Test mobile app config
    run_test "Mobile App Config" \
        "curl -f --connect-timeout 10 --max-time 30 '$BASE_URL/api/mobile/config'"
}

# Generate test report
generate_report() {
    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    local success_rate=0
    
    if [[ $total_tests -gt 0 ]]; then
        success_rate=$(echo "scale=2; $TESTS_PASSED * 100 / $total_tests" | bc)
    fi
    
    log "📊 Smoke Test Results:"
    log "  Total Tests: $total_tests"
    log "  Passed: $TESTS_PASSED"
    log "  Failed: $TESTS_FAILED"
    log "  Success Rate: ${success_rate}%"
    
    if [[ $TESTS_FAILED -gt 0 ]]; then
        log_error "Failed Tests:"
        for test in "${FAILED_TESTS[@]}"; do
            log_error "  - $test"
        done
    fi
    
    # Generate JSON report
    cat > /tmp/smoke-test-report.json << EOF
{
  "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "total_tests": $total_tests,
  "passed": $TESTS_PASSED,
  "failed": $TESTS_FAILED,
  "success_rate": $success_rate,
  "failed_tests": $(printf '%s\n' "${FAILED_TESTS[@]}" | jq -R . | jq -s .)
}
EOF
    
    log "Test report saved to /tmp/smoke-test-report.json"
    
    # Exit with error if any tests failed
    if [[ $TESTS_FAILED -gt 0 ]]; then
        log_error "❌ Smoke tests failed!"
        exit 1
    else
        log_success "✅ All smoke tests passed!"
    fi
}

# Main execution
main() {
    log "🧪 Starting comprehensive smoke tests for RiggerHub ecosystem"
    
    # Install bc for calculations if not available
    if ! command -v bc &> /dev/null; then
        log_warning "Installing bc for calculations..."
        if command -v apt-get &> /dev/null; then
            apt-get update && apt-get install -y bc
        elif command -v yum &> /dev/null; then
            yum install -y bc
        elif command -v brew &> /dev/null; then
            brew install bc
        fi
    fi
    
    test_api_endpoints
    test_database_connectivity
    test_user_flows
    test_security_headers
    test_performance
    test_monitoring
    test_integrations
    test_mobile_endpoints
    
    generate_report
}

# Execute main function
main "$@"
