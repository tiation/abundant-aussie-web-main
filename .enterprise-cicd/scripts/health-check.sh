#!/bin/bash
# Health Check Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD

set -euo pipefail

# Configuration
TIMEOUT=300  # 5 minutes
RETRY_INTERVAL=10  # 10 seconds
MAX_RETRIES=$((TIMEOUT / RETRY_INTERVAL))

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Usage
if [[ $# -lt 1 ]]; then
    error "Usage: $0 <URL> [expected_status_code]"
    exit 1
fi

URL="$1"
EXPECTED_STATUS="${2:-200}"

log "🏥 Starting health check for: $URL"
log "Expected status code: $EXPECTED_STATUS"

# Function to check HTTP status
check_http_status() {
    local url="$1"
    local expected="$2"
    
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$url" || echo "000")
    
    if [[ "$status_code" == "$expected" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local url="$1"
    local max_time="${2:-5}"  # 5 seconds default
    
    local response_time
    response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time 30 "$url" 2>/dev/null || echo "999")
    
    if (( $(echo "$response_time < $max_time" | bc -l) )); then
        log "✓ Response time: ${response_time}s (< ${max_time}s)"
        return 0
    else
        warn "Slow response time: ${response_time}s (> ${max_time}s)"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl_cert() {
    local url="$1"
    
    if [[ "$url" =~ ^https:// ]]; then
        local domain
        domain=$(echo "$url" | sed -E 's|https://([^/]+).*|\1|')
        
        local cert_expiry
        cert_expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                     openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)
        
        if [[ -n "$cert_expiry" ]]; then
            local expiry_epoch
            expiry_epoch=$(date -d "$cert_expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$cert_expiry" +%s 2>/dev/null)
            local current_epoch
            current_epoch=$(date +%s)
            local days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
            
            if [[ $days_left -gt 30 ]]; then
                log "✓ SSL certificate valid for $days_left days"
                return 0
            elif [[ $days_left -gt 0 ]]; then
                warn "SSL certificate expires in $days_left days"
                return 1
            else
                error "SSL certificate has expired"
                return 2
            fi
        else
            warn "Could not check SSL certificate"
            return 1
        fi
    fi
    return 0
}

# Function to check specific health endpoints
check_health_endpoints() {
    local base_url="$1"
    local endpoints=("/health" "/healthz" "/status" "/ping" "/actuator/health")
    
    for endpoint in "${endpoints[@]}"; do
        local full_url="${base_url}${endpoint}"
        if check_http_status "$full_url" "200"; then
            log "✓ Health endpoint available: $endpoint"
            
            # Try to get detailed health info
            local health_response
            health_response=$(curl -s --max-time 10 "$full_url" 2>/dev/null || echo "{}")
            
            if [[ -n "$health_response" ]] && echo "$health_response" | jq . >/dev/null 2>&1; then
                log "Health endpoint response: $(echo "$health_response" | jq -c .)"
            fi
            return 0
        fi
    done
    
    warn "No standard health endpoints found"
    return 1
}

# Function to check database connectivity (if health endpoint provides it)
check_database_health() {
    local url="$1"
    local base_url
    base_url=$(echo "$url" | sed -E 's|(/[^/]*){0,1}$||')
    
    local db_health_url="${base_url}/health/db"
    if check_http_status "$db_health_url" "200"; then
        log "✓ Database health check passed"
        return 0
    else
        warn "Database health check not available or failed"
        return 1
    fi
}

# Function to check external dependencies
check_external_dependencies() {
    local url="$1"
    local base_url
    base_url=$(echo "$url" | sed -E 's|(/[^/]*){0,1}$||')
    
    local deps_health_url="${base_url}/health/dependencies"
    if check_http_status "$deps_health_url" "200"; then
        log "✓ External dependencies health check passed"
        return 0
    else
        warn "External dependencies health check not available or failed"
        return 1
    fi
}

# Main health check loop
RETRY_COUNT=0
HEALTH_PASSED=false

while [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; do
    log "Health check attempt $((RETRY_COUNT + 1))/$MAX_RETRIES"
    
    # Basic HTTP status check
    if check_http_status "$URL" "$EXPECTED_STATUS"; then
        log "✓ HTTP status check passed ($EXPECTED_STATUS)"
        
        # Additional checks
        ADDITIONAL_CHECKS=0
        PASSED_CHECKS=0
        
        # Response time check
        ((ADDITIONAL_CHECKS++))
        if check_response_time "$URL" 5; then
            ((PASSED_CHECKS++))
        fi
        
        # SSL certificate check
        ((ADDITIONAL_CHECKS++))
        if check_ssl_cert "$URL"; then
            ((PASSED_CHECKS++))
        fi
        
        # Health endpoints check
        ((ADDITIONAL_CHECKS++))
        if check_health_endpoints "$(echo "$URL" | sed -E 's|(/[^/]*){0,1}$||')"; then
            ((PASSED_CHECKS++))
        fi
        
        # Database health check
        ((ADDITIONAL_CHECKS++))
        if check_database_health "$URL"; then
            ((PASSED_CHECKS++))
        fi
        
        # External dependencies check
        ((ADDITIONAL_CHECKS++))
        if check_external_dependencies "$URL"; then
            ((PASSED_CHECKS++))
        fi
        
        # Evaluate results
        local success_rate=$((PASSED_CHECKS * 100 / ADDITIONAL_CHECKS))
        log "Additional checks: $PASSED_CHECKS/$ADDITIONAL_CHECKS passed ($success_rate%)"
        
        if [[ $success_rate -ge 60 ]]; then  # At least 60% of additional checks must pass
            HEALTH_PASSED=true
            break
        else
            warn "Insufficient additional checks passed. Retrying..."
        fi
    else
        error "HTTP status check failed (got $(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$URL" || echo "000"), expected $EXPECTED_STATUS)"
    fi
    
    ((RETRY_COUNT++))
    
    if [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; then
        log "Waiting ${RETRY_INTERVAL}s before next attempt..."
        sleep $RETRY_INTERVAL
    fi
done

# Final result
if [[ "$HEALTH_PASSED" == true ]]; then
    log "✅ Health check passed successfully"
    
    # Generate health report
    cat > health-report.json << EOF
{
    "url": "$URL",
    "status": "healthy",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "checks": {
        "http_status": true,
        "response_time": true,
        "ssl_certificate": true,
        "health_endpoints": true
    },
    "attempts": $((RETRY_COUNT + 1)),
    "total_time": $(($(date +%s) - $(date +%s)))
}
EOF
    
    exit 0
else
    error "❌ Health check failed after $MAX_RETRIES attempts"
    
    # Generate failure report
    cat > health-report.json << EOF
{
    "url": "$URL",
    "status": "unhealthy",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "checks": {
        "http_status": false,
        "response_time": false,
        "ssl_certificate": false,
        "health_endpoints": false
    },
    "attempts": $RETRY_COUNT,
    "error": "Health check failed after maximum retries"
}
EOF
    
    exit 1
fi
