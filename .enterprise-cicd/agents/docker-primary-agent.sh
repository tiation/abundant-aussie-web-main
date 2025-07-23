#!/bin/bash
# Docker Primary CI/CD Agent (docker.sxc.codes)
# Handles primary container builds and deployments

AGENT_NAME="docker-primary"
SERVER_IP="145.223.22.7"
LOG_FILE="/var/log/cicd-agent.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$AGENT_NAME] $1" | tee -a $LOG_FILE
}

# Health check
health_check() {
    log_message "Running health check..."
    docker system df
    docker system prune -f
    log_message "Health check completed"
}

# Build application
build_application() {
    local repo_url=$1
    local branch=${2:-main}
    
    log_message "Building application from $repo_url (branch: $branch)"
    
    # Clone repository
    TEMP_DIR="/tmp/build-$(date +%s)"
    git clone -b $branch $repo_url $TEMP_DIR
    cd $TEMP_DIR
    
    # Build Docker image if Dockerfile exists
    if [ -f "Dockerfile" ]; then
        log_message "Building Docker image..."
        docker build -t ${repo_url##*/}:$branch .
        log_message "Docker image built successfully"
    fi
    
    # Run tests if available
    if [ -f "package.json" ]; then
        log_message "Running Node.js tests..."
        npm ci && npm test
    elif [ -f "requirements.txt" ]; then
        log_message "Running Python tests..."
        pip install -r requirements.txt && python -m pytest
    elif [ -f "go.mod" ]; then
        log_message "Running Go tests..."
        go test ./...
    fi
    
    # Cleanup
    cd /
    rm -rf $TEMP_DIR
    log_message "Build completed"
}

# Deploy application
deploy_application() {
    local image_name=$1
    local service_name=$2
    
    log_message "Deploying $image_name as $service_name"
    
    # Stop existing service
    docker stop $service_name 2>/dev/null || true
    docker rm $service_name 2>/dev/null || true
    
    # Start new service
    docker run -d --name $service_name --restart unless-stopped $image_name
    log_message "Deployment completed"
}

# Monitor services
monitor_services() {
    log_message "Monitoring services..."
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main execution
case "$1" in
    health)
        health_check
        ;;
    build)
        build_application "$2" "$3"
        ;;
    deploy)
        deploy_application "$2" "$3"
        ;;
    monitor)
        monitor_services
        ;;
    *)
        echo "Usage: $0 {health|build|deploy|monitor}"
        echo "  health                     - Run system health check"
        echo "  build <repo_url> [branch]  - Build application from repository"
        echo "  deploy <image> <service>   - Deploy application"
        echo "  monitor                    - Monitor running services"
        exit 1
        ;;
esac
