#!/bin/bash
# Enterprise-Grade Deployment Script
# ChaseWhiteRabbit NGO - Rigger Ecosystem Deployment

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENTERPRISE_CICD_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$ENTERPRISE_CICD_DIR")"

# Default values
ENVIRONMENT="${1:-staging}"
SERVICE_NAME="${2:-}"
VERSION="${3:-latest}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation function
validate_inputs() {
    if [[ -z "$SERVICE_NAME" ]]; then
        log_error "Service name is required"
        echo "Usage: $0 <environment> <service_name> [version]"
        echo "Example: $0 staging RiggerHub-web v1.2.3"
        exit 1
    fi

    if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
        log_error "Environment must be 'staging' or 'production'"
        exit 1
    fi

    if [[ ! -d "$PROJECT_ROOT/$SERVICE_NAME" ]]; then
        log_error "Service directory not found: $PROJECT_ROOT/$SERVICE_NAME"
        exit 1
    fi
}

# Load environment configuration
load_config() {
    local config_file="$ENTERPRISE_CICD_DIR/environments/$ENVIRONMENT/config.yml"
    if [[ ! -f "$config_file" ]]; then
        log_error "Environment configuration not found: $config_file"
        exit 1
    fi
    
    log_info "Loading configuration for $ENVIRONMENT environment"
    # Export key variables from config (simplified YAML parsing)
    export DOCKER_REGISTRY=$(grep "registry:" "$config_file" | cut -d':' -f2 | xargs)
    export DOCKER_BUILD_HOST=$(grep "build_host:" "$config_file" | cut -d':' -f2 | xargs)
    export K8S_CLUSTER=$(grep "cluster:" "$config_file" | cut -d':' -f2 | xargs)
    export K8S_NAMESPACE=$(grep "namespace:" "$config_file" | cut -d':' -f2 | xargs)
    
    log_success "Configuration loaded successfully"
}

# Build Docker image
build_image() {
    log_info "Building Docker image for $SERVICE_NAME"
    
    cd "$PROJECT_ROOT/$SERVICE_NAME"
    
    # Determine Dockerfile based on service type
    local dockerfile="Dockerfile"
    if [[ "$SERVICE_NAME" == *"-web" ]]; then
        dockerfile="$ENTERPRISE_CICD_DIR/dockerfiles/Dockerfile.web"
    elif [[ "$SERVICE_NAME" == "RiggerBackend" || "$SERVICE_NAME" == "RiggerShared" ]]; then
        dockerfile="$ENTERPRISE_CICD_DIR/dockerfiles/Dockerfile.backend"
    fi
    
    local image_tag="$DOCKER_REGISTRY/${SERVICE_NAME,,}:$VERSION"
    
    docker build -f "$dockerfile" -t "$image_tag" . || {
        log_error "Docker build failed"
        exit 1
    }
    
    log_success "Docker image built: $image_tag"
    
    # Push to registry
    docker push "$image_tag" || {
        log_error "Docker push failed"
        exit 1
    }
    
    log_success "Docker image pushed to registry"
}

# Deploy to Kubernetes
deploy_k8s() {
    log_info "Deploying $SERVICE_NAME to Kubernetes ($ENVIRONMENT)"
    
    # Create deployment manifest from template
    local deployment_file="/tmp/${SERVICE_NAME}-${ENVIRONMENT}-deployment.yml"
    local template_file="$ENTERPRISE_CICD_DIR/templates/deployment-template.yml"
    
    if [[ ! -f "$template_file" ]]; then
        log_error "Deployment template not found: $template_file"
        exit 1
    fi
    
    # Replace template variables
    sed -e "s/{{SERVICE_NAME}}/${SERVICE_NAME}/g" \
        -e "s/{{ENVIRONMENT}}/${ENVIRONMENT}/g" \
        -e "s/{{VERSION}}/${VERSION}/g" \
        -e "s/{{NAMESPACE}}/${K8S_NAMESPACE}/g" \
        -e "s|{{IMAGE}}|${DOCKER_REGISTRY}/${SERVICE_NAME,,}:${VERSION}|g" \
        "$template_file" > "$deployment_file"
    
    # Apply deployment
    kubectl apply -f "$deployment_file" || {
        log_error "Kubernetes deployment failed"
        exit 1
    }
    
    log_success "Kubernetes deployment applied"
    
    # Wait for rollout to complete
    kubectl rollout status deployment/${SERVICE_NAME,,} -n "$K8S_NAMESPACE" --timeout=600s || {
        log_error "Deployment rollout failed or timed out"
        exit 1
    }
    
    log_success "Deployment rollout completed successfully"
    
    # Clean up temporary file
    rm -f "$deployment_file"
}

# Health check
health_check() {
    log_info "Performing health check for $SERVICE_NAME"
    
    local service_url
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        service_url="https://staging.sxc.codes/${SERVICE_NAME,,}/health"
    else
        service_url="https://sxc.codes/${SERVICE_NAME,,}/health"
    fi
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "$service_url" > /dev/null 2>&1; then
            log_success "Health check passed for $SERVICE_NAME"
            return 0
        fi
        
        log_info "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Main deployment function
main() {
    log_info "Starting deployment of $SERVICE_NAME to $ENVIRONMENT"
    
    validate_inputs
    load_config
    build_image
    deploy_k8s
    health_check
    
    log_success "Deployment of $SERVICE_NAME to $ENVIRONMENT completed successfully!"
    
    # Send notification (if configured)
    if command -v mail &> /dev/null; then
        echo "Deployment of $SERVICE_NAME to $ENVIRONMENT completed successfully at $(date)" | \
            mail -s "Rigger Deployment Success" tiatheone@protonmail.com garrett@sxc.codes
    fi
}

# Trap for cleanup
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
