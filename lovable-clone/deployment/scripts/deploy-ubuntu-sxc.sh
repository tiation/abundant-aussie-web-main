#!/bin/bash

# Deployment script for ubuntu.sxc.codes
# Usage: ./deploy-ubuntu-sxc.sh [environment]
# Environment: production (default), staging

set -e

# Configuration
SERVER_HOST="89.116.191.60"
SERVER_USER="root"
SSH_KEY="/Users/tiaastor/.ssh/hostinger_key.pub"
REPO_URL="https://github.com/tiation-repos/lovable-clone.git"
ENVIRONMENT="${1:-production}"

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
    log "Starting deployment to ubuntu.sxc.codes..."
    
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
            git fetch origin && git reset --hard origin/main; \
        else \
            git clone $REPO_URL .; \
        fi"
    
    # Create environment file
    info "Creating environment configuration..."
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ssh_cmd "cat > /var/www/lovable-clone/.env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://lovable-clone.sxc.codes/api
NEXT_PUBLIC_ENVIRONMENT=production
EOF"
    else
        ssh_cmd "cat > /var/www/lovable-clone/.env.staging << 'EOF'
NODE_ENV=staging
PORT=3001
NEXT_PUBLIC_API_URL=https://staging.lovable-clone.sxc.codes/api
NEXT_PUBLIC_ENVIRONMENT=staging
EOF"
    fi
    
    # Build Docker image
    info "Building Docker image..."
    ssh_cmd "cd /var/www/lovable-clone && docker build -t lovable-clone:latest ."
    
    # Stop existing container
    info "Stopping existing container..."
    ssh_cmd "docker stop lovable-clone-$ENVIRONMENT || true"
    ssh_cmd "docker rm lovable-clone-$ENVIRONMENT || true"
    
    # Start new container
    info "Starting new container..."
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ssh_cmd "cd /var/www/lovable-clone && \
            docker run -d \
                --name lovable-clone-production \
                --restart unless-stopped \
                -p 3000:80 \
                --env-file .env.production \
                lovable-clone:latest"
    else
        ssh_cmd "cd /var/www/lovable-clone && \
            docker run -d \
                --name lovable-clone-staging \
                --restart unless-stopped \
                -p 3001:80 \
                --env-file .env.staging \
                lovable-clone:latest"
    fi
    
    # Wait for container to be healthy
    info "Waiting for application to be healthy..."
    for i in {1..30}; do
        if ssh_cmd "curl -f http://localhost:${ENVIRONMENT_PORT:-3000}/health" 2>/dev/null; then
            log "Application is healthy!"
            break
        fi
        
        if [[ $i -eq 30 ]]; then
            error "Application failed to become healthy after 5 minutes"
            exit 1
        fi
        
        warn "Waiting for application to be healthy... ($i/30)"
        sleep 10
    done
    
    # Setup nginx configuration
    info "Configuring nginx reverse proxy..."
    ssh_cmd "cat > /etc/nginx/sites-available/lovable-clone << 'EOF'
server {
    listen 80;
    server_name lovable-clone.sxc.codes ubuntu.sxc.codes;

    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header X-Content-Type-Options \"nosniff\" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOF"
    
    # Enable site and reload nginx
    ssh_cmd "ln -sf /etc/nginx/sites-available/lovable-clone /etc/nginx/sites-enabled/ && \
        nginx -t && systemctl reload nginx"
    
    # Setup systemd service
    info "Installing systemd service..."
    ssh_cmd "cat > /etc/systemd/system/lovable-clone.service << 'EOF'
[Unit]
Description=Lovable Clone Web Application
After=docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/var/www/lovable-clone
ExecStart=/usr/bin/docker start -a lovable-clone-$ENVIRONMENT
ExecStop=/usr/bin/docker stop lovable-clone-$ENVIRONMENT
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF"
    
    ssh_cmd "systemctl daemon-reload && \
        systemctl enable lovable-clone && \
        systemctl start lovable-clone"
    
    # Clean up old images
    info "Cleaning up old Docker images..."
    ssh_cmd "docker image prune -f"
    
    log "Deployment to ubuntu.sxc.codes completed successfully!"
    
    # Display deployment information
    info "Deployment Summary:"
    info "- Server: ubuntu.sxc.codes ($SERVER_HOST)"
    info "- Environment: $ENVIRONMENT"
    info "- Application URL: https://lovable-clone.sxc.codes"
    info "- Health Check: https://lovable-clone.sxc.codes/health"
    
    # Test the deployment
    info "Testing deployment..."
    if curl -f "https://lovable-clone.sxc.codes/health" 2>/dev/null; then
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
        ssh_cmd "docker stop lovable-clone-$ENVIRONMENT && \
            docker rm lovable-clone-$ENVIRONMENT && \
            docker run -d \
                --name lovable-clone-$ENVIRONMENT \
                --restart unless-stopped \
                -p 3000:80 \
                --env-file .env.$ENVIRONMENT \
                lovable-clone:$PREVIOUS_IMAGE"
        log "Rollback completed to image: $PREVIOUS_IMAGE"
    else
        error "No previous image found for rollback"
        exit 1
    fi
}

# Main execution
main() {
    info "Starting deployment to ubuntu.sxc.codes"
    info "Environment: $ENVIRONMENT"
    
    check_prerequisites
    
    # Ask for confirmation in production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        read -p "Are you sure you want to deploy to PRODUCTION? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            warn "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Trap for rollback on failure
    trap 'error "Deployment failed! Use --rollback to revert changes."; exit 1' ERR
    
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
