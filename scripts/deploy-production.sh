#!/bin/bash

# scripts/deploy-production.sh
# Enterprise-grade production deployment with comprehensive safety checks

set -euo pipefail  # Exit on any error, undefined variable, or pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY=${DOCKER_REGISTRY:-"rigger-registry.azurecr.io"}
NAMESPACE=${K8S_NAMESPACE:-"rigger-production"}
HEALTH_CHECK_TIMEOUT=${HEALTH_CHECK_TIMEOUT:-300}
ROLLBACK_ON_FAILURE=${ROLLBACK_ON_FAILURE:-true}
SLACK_WEBHOOK=${SLACK_WEBHOOK:-""}

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

# Slack notification function
notify_slack() {
    local message="$1"
    local color="$2"
    
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK" || log_warning "Failed to send Slack notification"
    fi
}

# Cleanup function for graceful exit
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Deployment failed with exit code $exit_code"
        notify_slack "🚨 RiggerHub Production Deployment FAILED!" "danger"
        
        if [[ "$ROLLBACK_ON_FAILURE" == "true" ]]; then
            log "Initiating automatic rollback..."
            ./scripts/rollback-production.sh || log_error "Rollback also failed!"
        fi
    fi
    
    # Cleanup temporary files
    rm -f /tmp/rigger-deploy-*
}

trap cleanup EXIT

# Verify prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check required tools
    local required_tools=("docker" "kubectl" "helm" "jq" "curl")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed"
            exit 1
        fi
    done
    
    # Check Kubernetes connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    # Check Docker registry access
    if ! docker login "$REGISTRY" &> /dev/null; then
        log_error "Cannot authenticate with Docker registry: $REGISTRY"
        exit 1
    fi
    
    # Check namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log "Creating namespace: $NAMESPACE"
        kubectl create namespace "$NAMESPACE"
    fi
    
    log_success "Prerequisites check passed"
}

# Pre-deployment safety checks
run_safety_checks() {
    log "Running comprehensive safety checks..."
    
    # Code quality and security
    log "Running linting and security scans..."
    ./scripts/lint-all.sh || { log_error "Linting failed"; exit 1; }
    ./scripts/security-scan.sh || { log_error "Security scan failed"; exit 1; }
    
    # Integration tests
    log "Running integration tests..."
    ./scripts/run-integration-tests.sh || { log_error "Integration tests failed"; exit 1; }
    
    # Performance tests
    log "Running performance tests..."
    ./scripts/performance-tests.sh || { log_error "Performance tests failed"; exit 1; }
    
    # Database migration dry run
    log "Validating database migrations..."
    ./scripts/test-migrations.sh || { log_error "Migration validation failed"; exit 1; }
    
    log_success "All safety checks passed"
}

# Build and push container images
build_and_push_images() {
    log "Building and pushing container images..."
    
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local git_sha=$(git rev-parse --short HEAD)
    local version="${timestamp}-${git_sha}"
    
    # Build images with multi-stage builds and security scanning
    local services=("backend" "connect-web" "hub-web")
    local build_args="--build-arg VERSION=$version --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
    
    for service in "${services[@]}"; do
        local image_name="$REGISTRY/rigger-$service:$version"
        local latest_name="$REGISTRY/rigger-$service:latest"
        
        log "Building $service..."
        
        case $service in
            "backend")
                docker build $build_args -t "$image_name" -t "$latest_name" ./RiggerBackend
                ;;
            "connect-web")
                docker build $build_args -t "$image_name" -t "$latest_name" ./RiggerConnect-web
                ;;
            "hub-web")
                docker build $build_args -t "$image_name" -t "$latest_name" ./RiggerHub-web
                ;;
        esac
        
        # Security scan
        log "Scanning $service for vulnerabilities..."
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image --exit-code 1 --severity HIGH,CRITICAL "$image_name" || {
            log_error "Security vulnerabilities found in $service"
            exit 1
        }
        
        # Push images
        log "Pushing $service images..."
        docker push "$image_name"
        docker push "$latest_name"
        
        log_success "$service build and push completed"
    done
    
    # Save version for deployment
    echo "$version" > /tmp/rigger-deploy-version
    
    log_success "All images built and pushed successfully"
}

# Deploy to production with zero-downtime
deploy_to_production() {
    log "Deploying to production with zero-downtime strategy..."
    
    local version=$(cat /tmp/rigger-deploy-version)
    
    # Update Helm values with new image versions
    log "Updating Helm values with version: $version"
    helm upgrade --install rigger-ecosystem ./helm/rigger-ecosystem \
        --namespace "$NAMESPACE" \
        --set global.imageTag="$version" \
        --set global.registry="$REGISTRY" \
        --timeout 10m \
        --wait
    
    # Monitor rollout status
    log "Monitoring deployment rollout..."
    local deployments=("rigger-backend" "rigger-connect-web" "rigger-hub-web")
    
    for deployment in "${deployments[@]}"; do
        log "Waiting for $deployment rollout..."
        kubectl rollout status deployment/"$deployment" -n "$NAMESPACE" --timeout="${HEALTH_CHECK_TIMEOUT}s"
    done
    
    log_success "Deployment rollout completed"
}

# Comprehensive health checks
run_health_checks() {
    log "Running comprehensive health checks..."
    
    local health_endpoints=(
        "http://rigger-backend.${NAMESPACE}.svc.cluster.local:8080/health"
        "http://rigger-connect-web.${NAMESPACE}.svc.cluster.local:3000/api/health"
        "http://rigger-hub-web.${NAMESPACE}.svc.cluster.local:3000/api/health"
    )
    
    # Wait for services to be ready
    sleep 30
    
    for endpoint in "${health_endpoints[@]}"; do
        log "Checking health: $endpoint"
        
        local retries=0
        local max_retries=10
        
        while [[ $retries -lt $max_retries ]]; do
            if kubectl run health-check-$$-$retries --rm -i --restart=Never \
                --image=curlimages/curl:latest -- \
                curl -f --connect-timeout 5 "$endpoint" &> /dev/null; then
                log_success "Health check passed: $endpoint"
                break
            else
                retries=$((retries + 1))
                log_warning "Health check failed (attempt $retries/$max_retries): $endpoint"
                sleep 10
            fi
        done
        
        if [[ $retries -eq $max_retries ]]; then
            log_error "Health check failed after $max_retries attempts: $endpoint"
            exit 1
        fi
    done
    
    # Run end-to-end smoke tests
    log "Running smoke tests..."
    ./scripts/smoke-tests.sh || { log_error "Smoke tests failed"; exit 1; }
    
    log_success "All health checks passed"
}

# Update monitoring and alerting
update_monitoring() {
    log "Updating monitoring and alerting configurations..."
    
    # Deploy Prometheus rules
    kubectl apply -f monitoring/prometheus-rules.yaml -n "$NAMESPACE"
    
    # Deploy Grafana dashboards
    kubectl apply -f monitoring/grafana-dashboards.yaml -n "$NAMESPACE"
    
    # Update alert manager
    kubectl apply -f monitoring/alertmanager-config.yaml -n "$NAMESPACE"
    
    log_success "Monitoring configuration updated"
}

# Main deployment flow
main() {
    log "🚀 Starting RiggerHub Enterprise Production Deployment"
    notify_slack "🚀 RiggerHub Production Deployment Started" "good"
    
    local start_time=$(date +%s)
    
    check_prerequisites
    run_safety_checks
    build_and_push_images
    deploy_to_production
    run_health_checks
    update_monitoring
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_success "🎉 Production deployment completed successfully in ${duration}s!"
    
    # Generate deployment report
    local version=$(cat /tmp/rigger-deploy-version)
    cat > /tmp/rigger-deploy-report.json << EOF
{
  "deployment_id": "$(uuidgen)",
  "version": "$version",
  "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "duration_seconds": $duration,
  "status": "success",
  "services_deployed": ["backend", "connect-web", "hub-web"],
  "namespace": "$NAMESPACE",
  "registry": "$REGISTRY"
}
EOF
    
    log "Deployment report saved to /tmp/rigger-deploy-report.json"
    
    notify_slack "✅ RiggerHub Production Deployment SUCCESS! Version: $version (${duration}s)" "good"
}

# Execute main function
main "$@"
