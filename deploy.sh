#!/bin/bash
# ==============================================
# RIGGER ECOSYSTEM DEPLOYMENT SCRIPT
# Enterprise deployment to Hostinger VPS
# ChaseWhiteRabbit NGO
# ==============================================

set -euo pipefail

# Configuration
DEPLOYMENT_TARGET=${1:-production}
VPS_HOST=""
VPS_USER="root"
SSH_KEY="/Users/tiaastor/.ssh/hostinger_key"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" >&2
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}" >&2
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" >&2
}

# Determine target VPS based on deployment environment
determine_vps_host() {
    case $DEPLOYMENT_TARGET in
        production)
            VPS_HOST="145.223.22.7"  # docker.sxc.codes
            info "Deploying to PRODUCTION: docker.sxc.codes"
            ;;
        staging)
            VPS_HOST="145.223.22.9"  # docker.tiation.net
            info "Deploying to STAGING: docker.tiation.net"
            ;;
        k8s)
            VPS_HOST="145.223.21.248"  # helm.sxc.codes
            info "Deploying to KUBERNETES: helm.sxc.codes"
            ;;
        *)
            error "Invalid deployment target: $DEPLOYMENT_TARGET. Use: production, staging, or k8s"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if SSH key exists
    if [[ ! -f "$SSH_KEY" ]]; then
        error "SSH key not found: $SSH_KEY"
    fi
    
    # Check if required files exist
    if [[ ! -f "docker-compose.yml" ]]; then
        error "docker-compose.yml not found in current directory"
    fi
    
    if [[ ! -f ".env.$DEPLOYMENT_TARGET" ]]; then
        error "Environment file .env.$DEPLOYMENT_TARGET not found"
    fi
    
    # Check if we can reach the VPS
    if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "echo 'SSH connection successful'" >/dev/null 2>&1; then
        error "Cannot connect to VPS: $VPS_HOST"
    fi
    
    log "Prerequisites check passed ✓"
}

# Prepare environment
prepare_environment() {
    log "Preparing deployment environment..."
    
    # Set build variables
    export BUILD_VERSION="v$(date +%Y%m%d-%H%M%S)"
    export BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    export GIT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    
    info "Build Version: $BUILD_VERSION"
    info "Build Date: $BUILD_DATE"
    info "Git Commit: $GIT_COMMIT"
}

# Create remote directories
create_remote_directories() {
    log "Creating remote directories on VPS..."
    
    ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" bash << 'EOF'
        # Create directory structure
        sudo mkdir -p /opt/rigger/{data,logs,uploads,backups,config,ssl}
        sudo mkdir -p /opt/rigger/data/{postgres,mongodb,redis,prometheus,grafana,loki,clamav,traefik}
        sudo mkdir -p /opt/rigger/logs/{backend,hub,connect}
        sudo mkdir -p /opt/rigger/uploads/{backend,hub,connect}
        sudo mkdir -p /opt/rigger/config/{prometheus,grafana,loki,promtail,traefik}
        
        # Set appropriate permissions
        sudo chown -R 1001:1001 /opt/rigger/data
        sudo chown -R 1001:1001 /opt/rigger/logs
        sudo chown -R 1001:1001 /opt/rigger/uploads
        sudo chmod -R 755 /opt/rigger
        
        echo "Remote directories created successfully"
EOF
    
    log "Remote directories created ✓"
}

# Deploy using Docker Compose
deploy_docker_compose() {
    log "Deploying using Docker Compose..."
    
    # Copy files to VPS
    info "Copying deployment files to VPS..."
    scp -i "$SSH_KEY" -r \
        docker-compose.yml \
        .env.$DEPLOYMENT_TARGET \
        scripts/ \
        config/ \
        "$VPS_USER@$VPS_HOST:/opt/rigger/"
    
    # Execute deployment on VPS
    ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" bash << EOF
        cd /opt/rigger
        
        # Load environment variables
        source .env.$DEPLOYMENT_TARGET
        export BUILD_VERSION="$BUILD_VERSION"
        export BUILD_DATE="$BUILD_DATE"
        export GIT_COMMIT="$GIT_COMMIT"
        
        # Pull latest images
        docker-compose pull
        
        # Build and deploy
        docker-compose --env-file .env.$DEPLOYMENT_TARGET up -d --build --remove-orphans
        
        # Show status
        docker-compose ps
        
        echo "Docker Compose deployment completed"
EOF
    
    log "Docker Compose deployment completed ✓"
}

# Deploy using Kubernetes/Helm
deploy_kubernetes() {
    log "Deploying using Kubernetes/Helm..."
    
    # Copy Helm chart to VPS
    info "Copying Helm chart to VPS..."
    scp -i "$SSH_KEY" -r k8s/ "$VPS_USER@$VPS_HOST:/opt/rigger/"
    
    # Execute Helm deployment on VPS
    ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" bash << 'EOF'
        cd /opt/rigger/k8s/helm-chart
        
        # Update Helm dependencies
        helm dependency update rigger-ecosystem/
        
        # Deploy using Helm
        helm upgrade --install rigger-ecosystem rigger-ecosystem/ \
            --namespace rigger-system \
            --create-namespace \
            --wait \
            --timeout 10m \
            --values rigger-ecosystem/values.yaml
        
        # Show deployment status
        kubectl get pods -n rigger-system
        kubectl get services -n rigger-system
        kubectl get ingress -n rigger-system
        
        echo "Kubernetes deployment completed"
EOF
    
    log "Kubernetes deployment completed ✓"
}

# Health check
health_check() {
    log "Performing health checks..."
    
    sleep 30  # Wait for services to start
    
    case $DEPLOYMENT_TARGET in
        production)
            ENDPOINTS=(
                "https://api.sxc.codes/health"
                "https://hub.sxc.codes"
                "https://connect.sxc.codes"
            )
            ;;
        staging)
            ENDPOINTS=(
                "https://api.staging.sxc.codes/health"
                "https://hub.staging.sxc.codes"
                "https://connect.staging.sxc.codes"
            )
            ;;
        k8s)
            # Use kubectl to check pod health
            ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" \
                "kubectl get pods -n rigger-system --no-headers | grep -v Running | wc -l" | read unhealthy_pods
            
            if [[ $unhealthy_pods -eq 0 ]]; then
                log "All Kubernetes pods are healthy ✓"
                return 0
            else
                error "$unhealthy_pods pods are not healthy"
            fi
            ;;
    esac
    
    if [[ $DEPLOYMENT_TARGET != "k8s" ]]; then
        for endpoint in "${ENDPOINTS[@]}"; do
            info "Checking: $endpoint"
            if curl -f -s --max-time 30 "$endpoint" >/dev/null; then
                log "✓ $endpoint is healthy"
            else
                warn "✗ $endpoint is not responding"
            fi
        done
    fi
}

# Cleanup old deployments
cleanup() {
    log "Cleaning up old deployments..."
    
    ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" bash << 'EOF'
        # Remove old Docker images
        docker image prune -f
        
        # Remove old logs (keep last 7 days)
        find /opt/rigger/logs -name "*.log" -mtime +7 -delete 2>/dev/null || true
        
        echo "Cleanup completed"
EOF
    
    log "Cleanup completed ✓"
}

# Send notifications
send_notifications() {
    log "Sending deployment notifications..."
    
    # This would integrate with your notification system
    # For now, just log the deployment success
    info "Deployment of $DEPLOYMENT_TARGET environment completed successfully!"
    info "Version: $BUILD_VERSION"
    info "Target: $VPS_HOST"
    info "Timestamp: $(date)"
}

# Main execution
main() {
    log "Starting Rigger ecosystem deployment..."
    log "Target environment: $DEPLOYMENT_TARGET"
    
    determine_vps_host
    check_prerequisites
    prepare_environment
    create_remote_directories
    
    if [[ $DEPLOYMENT_TARGET == "k8s" ]]; then
        deploy_kubernetes
    else
        deploy_docker_compose
    fi
    
    health_check
    cleanup
    send_notifications
    
    log "Deployment completed successfully! 🚀"
    log "Services are now available at:"
    case $DEPLOYMENT_TARGET in
        production)
            log "  - RiggerHub: https://hub.sxc.codes"
            log "  - RiggerConnect: https://connect.sxc.codes"
            log "  - API: https://api.sxc.codes"
            ;;
        staging)
            log "  - RiggerHub: https://hub.staging.sxc.codes"
            log "  - RiggerConnect: https://connect.staging.sxc.codes"
            log "  - API: https://api.staging.sxc.codes"
            ;;
        k8s)
            log "  - Check kubectl get ingress -n rigger-system for URLs"
            ;;
    esac
}

# Show usage if no arguments
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 [production|staging|k8s]"
    echo ""
    echo "Examples:"
    echo "  $0 production  # Deploy to production VPS"
    echo "  $0 staging     # Deploy to staging VPS"
    echo "  $0 k8s         # Deploy to Kubernetes cluster"
    exit 1
fi

# Execute main function
main "$@"
