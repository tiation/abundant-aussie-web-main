#!/bin/bash
# ==========================================================================
# RiggerBackend - Production Deployment Script
# ChaseWhiteRabbit NGO Initiative
# 
# Enterprise-grade deployment with safety checks and monitoring
# ==========================================================================

set -euo pipefail

# Configuration
DOCKER_REGISTRY="docker.sxc.codes"
IMAGE_NAME="rigger-backend"
NAMESPACE="production"
HELM_RELEASE="rigger-backend-prod"
DOCKER_HOST="ssh://root@145.223.22.7"
KUBECTL_CONFIG="/path/to/kubeconfig"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Safety checks
check_environment() {
    log_info "Checking deployment environment..."
    
    # Check if we're on the correct branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
        log_error "Production deployments must be from main/master branch. Current: $CURRENT_BRANCH"
        exit 1
    fi
    
    # Check if working directory is clean
    if ! git diff-index --quiet HEAD --; then
        log_error "Working directory is not clean. Commit or stash changes first."
        exit 1
    fi
    
    # Check if required tools are available
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v helm >/dev/null 2>&1 || { log_error "Helm is required but not installed."; exit 1; }
    
    log_info "Environment checks passed."
}

# Build and test
build_and_test() {
    log_info "Building and testing application..."
    
    # Run tests
    npm test
    
    # Security audit
    npm audit --audit-level=high
    
    # Build Docker image
    VERSION=$(git describe --tags --always --dirty)
    IMAGE_TAG="${IMAGE_NAME}:${VERSION}"
    LATEST_TAG="${IMAGE_NAME}:latest"
    
    log_info "Building Docker image: $IMAGE_TAG"
    docker build \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
        --build-arg VCS_REF=$(git rev-parse HEAD) \
        --build-arg VERSION=$VERSION \
        -t $IMAGE_TAG \
        -t $LATEST_TAG \
        .
    
    # Security scan
    log_info "Running security scan..."
    docker scan $IMAGE_TAG || log_warning "Security scan found issues. Review before proceeding."
    
    export IMAGE_TAG
    export LATEST_TAG
}

# Deploy to registry
push_to_registry() {
    log_info "Pushing to Docker registry: $DOCKER_REGISTRY"
    
    # Tag for registry
    REGISTRY_IMAGE="$DOCKER_REGISTRY/$IMAGE_TAG"
    REGISTRY_LATEST="$DOCKER_REGISTRY/$LATEST_TAG"
    
    docker tag $IMAGE_TAG $REGISTRY_IMAGE
    docker tag $LATEST_TAG $REGISTRY_LATEST
    
    # Push to registry
    docker push $REGISTRY_IMAGE
    docker push $REGISTRY_LATEST
    
    export REGISTRY_IMAGE
    export REGISTRY_LATEST
}

# Deploy with Helm
deploy_with_helm() {
    log_info "Deploying to Kubernetes cluster..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy with Helm
    helm upgrade --install $HELM_RELEASE ./helm-charts/rigger-backend \
        --namespace $NAMESPACE \
        --set image.repository=$DOCKER_REGISTRY/$IMAGE_NAME \
        --set image.tag=$VERSION \
        --set environment=production \
        --set replicaCount=3 \
        --set resources.requests.cpu=500m \
        --set resources.requests.memory=512Mi \
        --set resources.limits.cpu=1000m \
        --set resources.limits.memory=1Gi \
        --set autoscaling.enabled=true \
        --set autoscaling.minReplicas=3 \
        --set autoscaling.maxReplicas=10 \
        --set service.type=ClusterIP \
        --set ingress.enabled=true \
        --set ingress.hosts[0].host=api.rigger.sxc.codes \
        --set ingress.hosts[0].paths[0].path=/ \
        --set ingress.hosts[0].paths[0].pathType=Prefix \
        --set monitoring.enabled=true \
        --set monitoring.serviceMonitor.enabled=true \
        --timeout=300s \
        --wait
    
    log_info "Helm deployment completed."
}

# Health check
verify_deployment() {
    log_info "Verifying deployment health..."
    
    # Wait for rollout to complete
    kubectl rollout status deployment/$HELM_RELEASE -n $NAMESPACE --timeout=300s
    
    # Check pod health
    READY_PODS=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=$HELM_RELEASE --field-selector=status.phase=Running --no-headers | wc -l)
    if [[ $READY_PODS -lt 3 ]]; then
        log_error "Not enough healthy pods. Expected: 3, Got: $READY_PODS"
        exit 1
    fi
    
    # Health check endpoint
    log_info "Testing health endpoint..."
    kubectl port-forward -n $NAMESPACE svc/$HELM_RELEASE 8080:80 &
    PORT_FORWARD_PID=$!
    
    sleep 10
    
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        log_info "Health check passed."
    else
        log_error "Health check failed."
        kill $PORT_FORWARD_PID
        exit 1
    fi
    
    kill $PORT_FORWARD_PID
}

# Setup monitoring and alerts
setup_monitoring() {
    log_info "Setting up monitoring and alerts..."
    
    # Deploy ServiceMonitor for Prometheus
    kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: rigger-backend-monitor
  namespace: $NAMESPACE
  labels:
    app: rigger-backend
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: $HELM_RELEASE
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
EOF
    
    # Configure alerts (assuming AlertManager is configured)
    kubectl apply -f monitoring/alerts/rigger-backend-alerts.yaml
    
    log_info "Monitoring setup completed."
}

# Notification
send_notification() {
    log_info "Sending deployment notification..."
    
    # Send notification to configured email addresses
    NOTIFICATION_EMAILS="tiatheone@protonmail.com,garrett@sxc.codes,garrett.dillman@gmail.com"
    
    curl -X POST \
        -H 'Content-Type: application/json' \
        -d "{
            \"to\": \"$NOTIFICATION_EMAILS\",
            \"subject\": \"RiggerBackend Production Deployment Successful\",
            \"body\": \"RiggerBackend version $VERSION has been successfully deployed to production at $(date).\"
        }" \
        https://api.notification-service.sxc.codes/send || log_warning "Failed to send notification"
}

# Main deployment flow
main() {
    log_info "Starting RiggerBackend production deployment..."
    
    check_environment
    build_and_test
    push_to_registry
    deploy_with_helm
    verify_deployment
    setup_monitoring
    send_notification
    
    log_info "🎉 Production deployment completed successfully!"
    log_info "Application available at: https://api.rigger.sxc.codes"
    log_info "Monitoring dashboard: https://grafana.sxc.codes"
}

# Error handling
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"

# ==========================================================================
# Usage:
#   ./deploy-to-production.sh
#
# Prerequisites:
#   - Docker daemon running
#   - Helm 3.x installed
#   - kubectl configured for target cluster
#   - Access to Docker registry
#   - Clean working directory on main/master branch
# ==========================================================================
