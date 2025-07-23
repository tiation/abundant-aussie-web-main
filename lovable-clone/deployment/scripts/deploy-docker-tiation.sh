#!/bin/bash

# Deployment script for docker.tiation.net
# Usage: ./deploy-docker-tiation.sh [environment]
# Environment: production (default), staging

set -e

# Configuration
SERVER_HOST="145.223.22.9"
SERVER_USER="root"
SSH_KEY="/Users/tiaastor/.ssh/hostinger_key.pub"
REPO_URL="https://github.com/tiation-repos/lovable-clone.git"
ENVIRONMENT="${1:-staging}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if [[ ! -f "$SSH_KEY" ]]; then
        error "SSH key not found: $SSH_KEY"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        error "SSH command not found"
        exit 1
    fi
    
    # Test SSH connection
    if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o BatchMode=yes "$SERVER_USER@$SERVER_HOST" exit 2>/dev/null; then
        error "Cannot connect to server $SERVER_HOST"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Deploy to server
deploy_to_server() {
    log "Starting deployment to docker.tiation.net..."
    
    # SSH command wrapper
    ssh_cmd() {
        ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" "$@"
    }
    
    # Create deployment directory
    info "Setting up deployment directory..."
    ssh_cmd "mkdir -p /var/www/lovable-clone"
    
    # Clone or update repository
    info "Updating application code..."
    ssh_cmd "cd /var/www/lovable-clone && \
        if [ -d .git ]; then \
            git fetch origin && git reset --hard origin/develop; \
        else \
            git clone $REPO_URL .; \
        fi"
    
    # Create environment file
    info "Creating environment configuration..."
    ssh_cmd "cat > /var/www/lovable-clone/.env.${ENVIRONMENT} << EOF
NODE_ENV=${ENVIRONMENT}
PORT=${ENVIRONMENT_PORT:-3001}
NEXT_PUBLIC_API_URL=https://staging.lovable-clone.tiation.net/api
NEXT_PUBLIC_ENVIRONMENT=${ENVIRONMENT}
EOF"

    # Build and run Docker container
    info "Building Docker image and running container..."
    ssh_cmd "cd /var/www/lovable-clone && \
        docker-compose -f docker-compose.staging.yml up -d"

    # Set up systemd service
    info "Installing systemd service..."
    ssh_cmd "cat > /etc/systemd/system/lovable-clone-${ENVIRONMENT}.service << EOF
[Unit]
Description=Lovable Clone Staging Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/lovable-clone
ExecStart=/usr/bin/docker-compose -f docker-compose.staging.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.staging.yml down
Restart=on-failure
TimeoutStartSec=500
TimeoutStopSec=300

[Install]
WantedBy=multi-user.target
EOF"
    
    ssh_cmd "systemctl daemon-reload && \
        systemctl enable lovable-clone-${ENVIRONMENT} && \
        systemctl start lovable-clone-${ENVIRONMENT}"
    
    log "Deployment to docker.tiation.net completed successfully!"
    
    info "Deployment Summary:"
    info "- Server: docker.tiation.net ($SERVER_HOST)"
    info "- Environment: $ENVIRONMENT"
    info "- Application URL: https://staging.lovable-clone.tiation.net"
    info "- Health Check: https://staging.lovable-clone.tiation.net/health"
    
    info "Testing deployment..."
    if curl -f "https://staging.lovable-clone.tiation.net/health" 2>/dev/null; then
        log "✅ Deployment test passed!"
    else
        warn "⚠️  External health check failed. Please verify manually."
    fi
}

# Rollback function
rollback() {
    warn "Rolling back deployment..."
    ssh_cmd() {
        ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" "$@"
    }
    
    # Get previous image
    PREVIOUS_IMAGE=$(ssh_cmd "docker images lovable-clone --format 'table {{.Tag}}' | sed -n '2p'")
    
    if [[ -n "$PREVIOUS_IMAGE" && "$PREVIOUS_IMAGE" != "latest" ]]; then
        ssh_cmd "docker stop lovable-clone-${ENVIRONMENT} && \
            docker rm lovable-clone-${ENVIRONMENT} && \
            docker run -d \
                --name lovable-clone-${ENVIRONMENT} \
                --restart unless-stopped \
                -p ${ENVIRONMENT_PORT:-3001}:80 \
                --env-file .env.${ENVIRONMENT} \
                lovable-clone:$PREVIOUS_IMAGE"
        log "Rollback completed to image: $PREVIOUS_IMAGE"
    else
        error "No previous image found for rollback"
        exit 1
    fi
}

# Main execution
main() {
    info "Starting deployment to docker.tiation.net"
    info "Environment: $ENVIRONMENT"
    
    check_prerequisites
    
    deploy_to_server
    
    log "🎉 Deployment completed successfully!"
}

# Handle command line arguments
case "${1:-}" in
    --rollback)
        rollback
        ;;
    --help|-h)
        echo "Usage: $0 [environment|--rollback|--help]"
        echo "  environment: production (default), staging"
        echo "  --rollback:  Rollback to previous deployment"
        echo "  --help:      Show this help message"
        exit 0
        ;;
    *)
        main
        ;;
esac
