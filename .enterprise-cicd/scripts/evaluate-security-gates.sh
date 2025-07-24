#!/bin/bash
# Security Gates Evaluation Script
# ChaseWhiteRabbit NGO - Enterprise CI/CD

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; }

# Security gate thresholds
CRITICAL_VULNERABILITIES_THRESHOLD=0
HIGH_VULNERABILITIES_THRESHOLD=5
MEDIUM_VULNERABILITIES_THRESHOLD=20
SECRET_DETECTIONS_THRESHOLD=0
LICENSE_VIOLATIONS_THRESHOLD=0

# Initialize counters
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
LOW_COUNT=0
SECRET_COUNT=0
LICENSE_VIOLATIONS=0
GATE_FAILURES=0

log "🚦 Evaluating security gates..."

# Function to check Trivy results
check_trivy_results() {
    local report_file="security-reports/trivy-fs.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "Trivy filesystem scan report not found"
        return 1
    fi
    
    log "📊 Analyzing Trivy results..."
    
    # Count vulnerabilities by severity
    if command -v jq >/dev/null 2>&1; then
        CRITICAL_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "CRITICAL")] | length' "$report_file" 2>/dev/null || echo 0)
        HIGH_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "HIGH")] | length' "$report_file" 2>/dev/null || echo 0)
        MEDIUM_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "MEDIUM")] | length' "$report_file" 2>/dev/null || echo 0)
        LOW_COUNT=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity == "LOW")] | length' "$report_file" 2>/dev/null || echo 0)
    fi
    
    log "Vulnerability counts - Critical: $CRITICAL_COUNT, High: $HIGH_COUNT, Medium: $MEDIUM_COUNT, Low: $LOW_COUNT"
    
    # Evaluate against thresholds
    if [[ $CRITICAL_COUNT -gt $CRITICAL_VULNERABILITIES_THRESHOLD ]]; then
        error "❌ Critical vulnerabilities threshold exceeded: $CRITICAL_COUNT > $CRITICAL_VULNERABILITIES_THRESHOLD"
        ((GATE_FAILURES++))
    else
        log "✅ Critical vulnerabilities within threshold: $CRITICAL_COUNT <= $CRITICAL_VULNERABILITIES_THRESHOLD"
    fi
    
    if [[ $HIGH_COUNT -gt $HIGH_VULNERABILITIES_THRESHOLD ]]; then
        error "❌ High vulnerabilities threshold exceeded: $HIGH_COUNT > $HIGH_VULNERABILITIES_THRESHOLD"
        ((GATE_FAILURES++))
    else
        log "✅ High vulnerabilities within threshold: $HIGH_COUNT <= $HIGH_VULNERABILITIES_THRESHOLD"
    fi
    
    if [[ $MEDIUM_COUNT -gt $MEDIUM_VULNERABILITIES_THRESHOLD ]]; then
        warn "⚠️  Medium vulnerabilities threshold exceeded: $MEDIUM_COUNT > $MEDIUM_VULNERABILITIES_THRESHOLD"
        # Don't fail the gate for medium vulnerabilities, just warn
    else
        log "✅ Medium vulnerabilities within threshold: $MEDIUM_COUNT <= $MEDIUM_VULNERABILITIES_THRESHOLD"
    fi
}

# Function to check GitLeaks results
check_gitleaks_results() {
    local report_file="security-reports/gitleaks.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "GitLeaks report not found"
        return 1
    fi
    
    log "🔍 Analyzing GitLeaks results..."
    
    # Count secret detections
    if command -v jq >/dev/null 2>&1; then
        SECRET_COUNT=$(jq 'length' "$report_file" 2>/dev/null || echo 0)
    fi
    
    log "Secret detections: $SECRET_COUNT"
    
    if [[ $SECRET_COUNT -gt $SECRET_DETECTIONS_THRESHOLD ]]; then
        error "❌ Secret detections threshold exceeded: $SECRET_COUNT > $SECRET_DETECTIONS_THRESHOLD"
        ((GATE_FAILURES++))
        
        # List detected secrets (without revealing them)
        if command -v jq >/dev/null 2>&1; then
            log "Detected secrets:"
            jq -r '.[] | "- File: \(.File), Rule: \(.RuleID), Line: \(.StartLine)"' "$report_file" 2>/dev/null || true
        fi
    else
        log "✅ No secrets detected"
    fi
}

# Function to check license compliance
check_license_compliance() {
    local report_file="security-reports/licenses.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "License report not found"
        return 1
    fi
    
    log "📋 Analyzing license compliance..."
    
    # Define prohibited licenses
    local prohibited_licenses=("GPL-3.0" "AGPL-3.0" "LGPL-3.0" "CPAL-1.0" "OSL-3.0")
    
    # Check for license violations
    if command -v jq >/dev/null 2>&1; then
        for license in "${prohibited_licenses[@]}"; do
            local violations
            violations=$(jq -r "to_entries[] | select(.value.licenses | contains(\"$license\")) | .key" "$report_file" 2>/dev/null | wc -l)
            LICENSE_VIOLATIONS=$((LICENSE_VIOLATIONS + violations))
            
            if [[ $violations -gt 0 ]]; then
                warn "License violation detected: $license in $violations packages"
                jq -r "to_entries[] | select(.value.licenses | contains(\"$license\")) | \"- \(.key): \(.value.licenses)\"" "$report_file" 2>/dev/null || true
            fi
        done
    fi
    
    if [[ $LICENSE_VIOLATIONS -gt $LICENSE_VIOLATIONS_THRESHOLD ]]; then
        error "❌ License violations threshold exceeded: $LICENSE_VIOLATIONS > $LICENSE_VIOLATIONS_THRESHOLD"
        ((GATE_FAILURES++))
    else
        log "✅ License compliance check passed"
    fi
}

# Function to check SAST results
check_sast_results() {
    local report_file="security-reports/semgrep.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "SAST report not found"
        return 1
    fi
    
    log "🔒 Analyzing SAST results..."
    
    # Count high-severity SAST findings
    local high_severity_count=0
    if command -v jq >/dev/null 2>&1; then
        high_severity_count=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' "$report_file" 2>/dev/null || echo 0)
    fi
    
    log "High-severity SAST findings: $high_severity_count"
    
    if [[ $high_severity_count -gt 5 ]]; then
        error "❌ Too many high-severity SAST findings: $high_severity_count > 5"
        ((GATE_FAILURES++))
    else
        log "✅ SAST findings within acceptable range"
    fi
}

# Function to check OWASP dependency check results
check_owasp_results() {
    local report_file="security-reports/dependency-check-report.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "OWASP Dependency Check report not found"
        return 1
    fi
    
    log "🛡️ Analyzing OWASP Dependency Check results..."
    
    # Count high-severity vulnerabilities
    local high_cvss_count=0
    if command -v jq >/dev/null 2>&1; then
        high_cvss_count=$(jq '[.dependencies[]?.vulnerabilities[]? | select(.cvssv3?.baseScore >= 7.0 or .cvssv2?.score >= 7.0)] | length' "$report_file" 2>/dev/null || echo 0)
    fi
    
    log "High CVSS score vulnerabilities: $high_cvss_count"
    
    if [[ $high_cvss_count -gt 3 ]]; then
        error "❌ Too many high CVSS score vulnerabilities: $high_cvss_count > 3"
        ((GATE_FAILURES++))
    else
        log "✅ OWASP dependency check passed"
    fi
}

# Function to check Dockerfile security
check_dockerfile_security() {
    local report_file="security-reports/hadolint.json"
    
    if [[ ! -f "$report_file" ]]; then
        warn "Dockerfile security report not found"
        return 1
    fi
    
    log "🐳 Analyzing Dockerfile security..."
    
    # Count error-level issues
    local error_count=0
    if command -v jq >/dev/null 2>&1; then
        error_count=$(jq '[.[] | select(.level == "error")] | length' "$report_file" 2>/dev/null || echo 0)
    fi
    
    log "Dockerfile security errors: $error_count"
    
    if [[ $error_count -gt 0 ]]; then
        error "❌ Dockerfile security errors found: $error_count"
        ((GATE_FAILURES++))
        
        # List the errors
        if command -v jq >/dev/null 2>&1; then
            jq -r '.[] | select(.level == "error") | "- \(.message) (Rule: \(.code))"' "$report_file" 2>/dev/null || true
        fi
    else
        log "✅ Dockerfile security check passed"
    fi
}

# Run all security checks
mkdir -p security-reports

log "Running security gate evaluations..."

check_trivy_results || warn "Trivy check failed"
check_gitleaks_results || warn "GitLeaks check failed"
check_license_compliance || warn "License compliance check failed"
check_sast_results || warn "SAST check failed"
check_owasp_results || warn "OWASP check failed"
check_dockerfile_security || warn "Dockerfile security check failed"

# Generate security gate report
cat > security-reports/security-gates-report.json << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "project": "${CI_PROJECT_NAME:-unknown}",
    "commit": "${CI_COMMIT_SHA:-unknown}",
    "branch": "${CI_COMMIT_REF_NAME:-unknown}",
    "gates": {
        "critical_vulnerabilities": {
            "threshold": $CRITICAL_VULNERABILITIES_THRESHOLD,
            "actual": $CRITICAL_COUNT,
            "passed": $([ $CRITICAL_COUNT -le $CRITICAL_VULNERABILITIES_THRESHOLD ] && echo true || echo false)
        },
        "high_vulnerabilities": {
            "threshold": $HIGH_VULNERABILITIES_THRESHOLD,
            "actual": $HIGH_COUNT,
            "passed": $([ $HIGH_COUNT -le $HIGH_VULNERABILITIES_THRESHOLD ] && echo true || echo false)
        },
        "secret_detections": {
            "threshold": $SECRET_DETECTIONS_THRESHOLD,
            "actual": $SECRET_COUNT,
            "passed": $([ $SECRET_COUNT -le $SECRET_DETECTIONS_THRESHOLD ] && echo true || echo false)
        },
        "license_violations": {
            "threshold": $LICENSE_VIOLATIONS_THRESHOLD,
            "actual": $LICENSE_VIOLATIONS,
            "passed": $([ $LICENSE_VIOLATIONS -le $LICENSE_VIOLATIONS_THRESHOLD ] && echo true || echo false)
        }
    },
    "summary": {
        "total_gate_failures": $GATE_FAILURES,
        "overall_status": "$([ $GATE_FAILURES -eq 0 ] && echo "PASSED" || echo "FAILED")"
    }
}
EOF

# Final evaluation
log "📊 Security gates evaluation summary:"
log "  Critical vulnerabilities: $CRITICAL_COUNT (threshold: $CRITICAL_VULNERABILITIES_THRESHOLD)"
log "  High vulnerabilities: $HIGH_COUNT (threshold: $HIGH_VULNERABILITIES_THRESHOLD)"
log "  Medium vulnerabilities: $MEDIUM_COUNT (threshold: $MEDIUM_VULNERABILITIES_THRESHOLD)"
log "  Secret detections: $SECRET_COUNT (threshold: $SECRET_DETECTIONS_THRESHOLD)"
log "  License violations: $LICENSE_VIOLATIONS (threshold: $LICENSE_VIOLATIONS_THRESHOLD)"
log "  Total gate failures: $GATE_FAILURES"

if [[ $GATE_FAILURES -eq 0 ]]; then
    log "✅ All security gates passed successfully!"
    exit 0
else
    error "❌ Security gates failed with $GATE_FAILURES violations"
    exit 1
fi
