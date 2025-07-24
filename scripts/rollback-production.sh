#!/bin/bash

# scripts/rollback-production.sh
# Emergency rollback script for production deployment failures

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NAMESPACE=${K8S_NAMESPACE:-"rigger-production"}
SLACK_WEBHOOK=${SLACK_WEBHOOK:-""}

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

notify_slack() {
    local message="$1"
    local color="$2"
    
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK" || echo "Failed to send Slack notification"
    fi
}

rollback_deployment() {
    log "🔄 Starting emergency rollback for RiggerHub production"
    notify_slack "🔄 Emergency rollback initiated for RiggerHub production" "warning"
    
    local start_time=$(date +%s)
    
    # Get previous revision
    local previous_revision=$(helm history rigger-ecosystem -n "$NAMESPACE" --max 2 -o json | jq -r '.[1].revision // "1"')
    
    log "Rolling back to revision: $previous_revision"
    
    # Perform Helm rollback
    helm rollback rigger-ecosystem "$previous_revision" -n "$NAMESPACE" --timeout 10m --wait
    
    # Verify rollback
    local deployments=("rigger-backend" "rigger-connect-web" "rigger-hub-web")
    
    for deployment in "${deployments[@]}"; do
        log "Verifying rollback for $deployment..."
        kubectl rollout status deployment/"$deployment" -n "$NAMESPACE" --timeout=300s
    done
    
    # Basic health check
    sleep 30
    log "Running post-rollback health checks..."
    
    local health_passed=true
    for endpoint in "rigger-backend" "rigger-connect-web" "rigger-hub-web"; do
        if ! kubectl run rollback-health-check-$RANDOM --rm -i --restart=Never \
            --image=curlimages/curl:latest -- \
            curl -f --connect-timeout 5 "http://$endpoint.$NAMESPACE.svc.cluster.local:8080/health" &> /dev/null; then
            log_error "Health check failed for $endpoint"
            health_passed=false
        else
            log_success "Health check passed for $endpoint"
        fi
    done
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [[ "$health_passed" == "true" ]]; then
        log_success "🎉 Rollback completed successfully in ${duration}s"
        notify_slack "✅ RiggerHub production rollback SUCCESS! Duration: ${duration}s" "good"
    else
        log_error "⚠️ Rollback completed but health checks failed"
        notify_slack "⚠️ RiggerHub rollback completed but health checks failed" "warning"
        exit 1
    fi
}

rollback_deployment "$@"
