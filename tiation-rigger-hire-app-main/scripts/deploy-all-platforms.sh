#!/usr/bin/env bash

# 🚀 Tiation SaaS Ecosystem - Master Deployment Script
# Orchestrates deployment across all platforms with enterprise-grade reliability

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="$PROJECT_ROOT/deployment/config"
TERRAFORM_DIR="$PROJECT_ROOT/deployment/terraform"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Platform configurations
declare -A PLATFORMS=(
    ["rigger"]="tiation-rigger-platform"
    ["ai-agents"]="tiation-ai-agents"
    ["gaming"]="tiation-dnd-gaming"
    ["podcast"]="tiation-podcast-saas"
    ["templates"]="tiation-react-template"
    ["enterprise"]="tiation-enterprise-core"
)

# AWS Configuration
AWS_REGION="${AWS_REGION:-ap-southeast-2}"
ECR_REGISTRY="${ECR_REGISTRY:-123456789012.dkr.ecr.${AWS_REGION}.amazonaws.com}"

# Global deployment options
TARGET_PLATFORM=""
SKIP_TESTS="false"
SKIP_MIGRATIONS="false"
SKIP_BUILD="false"
ROLLBACK="false"
DRY_RUN="false"
ENVIRONMENT=""

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

show_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║               🚀 TIATION SAAS DEPLOYMENT SYSTEM               ║
║                                                                ║
║            Multi-Platform Enterprise-Grade Deployment         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

usage() {
    echo "Usage: $0 <environment> [options]"
    echo ""
    echo "Environments:"
    echo "  development  - Local development deployment"
    echo "  staging      - AWS ECS staging environment"
    echo "  production   - AWS ECS production environment"
    echo ""
    echo "Options:"
    echo "  --platform <name>     Deploy specific platform only"
    echo "  --skip-tests         Skip test execution"
    echo "  --skip-migrations    Skip database migrations"
    echo "  --skip-build         Skip Docker image builds"
    echo "  --rollback           Rollback to previous version"
    echo "  --dry-run            Show what would be deployed"
    echo "  --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 production"
    echo "  $0 staging --platform rigger"
    echo "  $0 production --skip-tests --skip-migrations"
    exit 1
}

check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    # Check required tools
    local required_tools=("aws" "docker" "terraform" "kubectl" "node" "npm")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed"
        fi
    done
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured or invalid"
    fi
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
    fi
    
    log_success "All prerequisites satisfied"
}

setup_environment() {
    local env="$1"
    
    log "🔧 Setting up $env environment..."
    
    # Load environment-specific variables
    if [[ -f "$CONFIG_DIR/$env.env" ]]; then
        source "$CONFIG_DIR/$env.env"
        log_success "Loaded $env configuration"
    else
        log_error "Environment configuration file not found: $CONFIG_DIR/$env.env"
    fi
    
    # Configure AWS CLI
    aws configure set region "$AWS_REGION"
    
    # Login to ECR
    if [[ "$env" != "development" ]]; then
        log "🔑 Logging into AWS ECR..."
        aws ecr get-login-password --region "$AWS_REGION" | \
            docker login --username AWS --password-stdin "$ECR_REGISTRY"
        log_success "ECR login successful"
    fi
}

run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warning "Skipping tests as requested"
        return 0
    fi
    
    log "🧪 Running comprehensive test suite..."
    
    local failed_platforms=()
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        log "Testing $platform platform..."
        
        local platform_dir="$PROJECT_ROOT/$platform"
        if [[ -d "$platform_dir" ]]; then
            cd "$platform_dir"
            
            # Install dependencies
            if [[ -f "package.json" ]]; then
                npm ci --silent
            fi
            
            # Run tests
            if npm run test:coverage &> /dev/null; then
                log_success "$platform tests passed"
            else
                log_error "$platform tests failed"
                failed_platforms+=("$platform")
            fi
            
            cd "$PROJECT_ROOT"
        else
            log_warning "Platform directory not found: $platform_dir"
        fi
    done
    
    if [[ ${#failed_platforms[@]} -gt 0 ]]; then
        log_error "Tests failed for platforms: ${failed_platforms[*]}"
    fi
    
    log_success "All tests passed successfully"
}

build_images() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        log_warning "Skipping image builds as requested"
        return 0
    fi
    
    if [[ "$ENVIRONMENT" == "development" ]]; then
        log_info "Skipping image builds for development environment"
        return 0
    fi
    
    log "🔨 Building Docker images..."
    
    local build_timestamp=$(date +%Y%m%d%H%M%S)
    local git_sha=$(git rev-parse --short HEAD)
    local image_tag="${git_sha}-${build_timestamp}"
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        log "Building $platform image..."
        
        local platform_dir="$PROJECT_ROOT/$platform"
        local dockerfile_path="$platform_dir/Dockerfile"
        
        if [[ -f "$dockerfile_path" ]]; then
            local repository_name="tiation-${platform}-backend"
            local full_image_name="$ECR_REGISTRY/$repository_name:$image_tag"
            local latest_image_name="$ECR_REGISTRY/$repository_name:latest"
            
            # Build image
            docker build -t "$full_image_name" -t "$latest_image_name" "$platform_dir"
            
            # Push to ECR
            docker push "$full_image_name"
            docker push "$latest_image_name"
            
            log_success "$platform image built and pushed: $image_tag"
            
            # Store image tag for deployment
            echo "$image_tag" > "$CONFIG_DIR/${platform}-image-tag.txt"
        else
            log_warning "Dockerfile not found for $platform: $dockerfile_path"
        fi
    done
    
    log_success "All images built and pushed successfully"
}

deploy_infrastructure() {
    if [[ "$ENVIRONMENT" == "development" ]]; then
        log_info "Skipping infrastructure deployment for development environment"
        return 0
    fi
    
    log "🏗️ Deploying infrastructure with Terraform..."
    
    cd "$TERRAFORM_DIR"
    
    # Initialize Terraform
    terraform init -upgrade
    
    # Select or create workspace
    terraform workspace select "$ENVIRONMENT" || terraform workspace new "$ENVIRONMENT"
    
    # Plan deployment
    local tfvars_file="environments/$ENVIRONMENT.tfvars"
    if [[ "$DRY_RUN" == "true" ]]; then
        terraform plan -var-file="$tfvars_file"
        log_info "Dry run completed - infrastructure changes shown above"
        return 0
    fi
    
    # Apply infrastructure changes
    terraform apply -var-file="$tfvars_file" -auto-approve
    
    log_success "Infrastructure deployment completed"
    cd "$PROJECT_ROOT"
}

deploy_applications() {
    log "🚀 Deploying applications to $ENVIRONMENT..."
    
    if [[ "$ENVIRONMENT" == "development" ]]; then
        deploy_development
    else
        deploy_aws_ecs
    fi
}

deploy_development() {
    log "🐳 Starting development environment with Docker Compose..."
    
    # Stop existing containers
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    
    # Build and start services
    docker-compose -f docker-compose.dev.yml up -d --build
    
    # Wait for services to be healthy
    log "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Verify services
    local services=("backend" "frontend" "database" "redis")
    for service in "${services[@]}"; do
        if docker-compose -f docker-compose.dev.yml ps "$service" | grep -q "Up"; then
            log_success "$service is running"
        else
            log_error "$service failed to start"
        fi
    done
    
    log_success "Development environment deployed successfully"
    log_info "Access the application at: http://localhost:3000"
}

deploy_aws_ecs() {
    local cluster_name="tiation-saas-$ENVIRONMENT"
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        log "Deploying $platform to AWS ECS..."
        
        local service_name="${platform}-${ENVIRONMENT}-service"
        
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "Would deploy $platform service: $service_name"
            continue
        fi
        
        # Update ECS service to trigger deployment
        if aws ecs describe-services \
            --cluster "$cluster_name" \
            --services "$service_name" \
            --query 'services[0].serviceName' \
            --output text &> /dev/null; then
            
            aws ecs update-service \
                --cluster "$cluster_name" \
                --service "$service_name" \
                --force-new-deployment \
                --no-paginate
            
            log_success "$platform deployment initiated"
        else
            log_error "ECS service not found: $service_name"
        fi
    done
    
    # Wait for deployments to complete
    if [[ "$DRY_RUN" != "true" ]]; then
        wait_for_deployments "$cluster_name"
    fi
}

wait_for_deployments() {
    local cluster_name="$1"
    log "⏳ Waiting for deployments to complete..."
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        local service_name="${platform}-${ENVIRONMENT}-service"
        
        log "Waiting for $platform deployment..."
        
        aws ecs wait services-stable \
            --cluster "$cluster_name" \
            --services "$service_name"
        
        log_success "$platform deployment completed"
    done
    
    log_success "All deployments completed successfully"
}

run_migrations() {
    if [[ "$SKIP_MIGRATIONS" == "true" ]]; then
        log_warning "Skipping database migrations as requested"
        return 0
    fi
    
    log "🗄️ Running database migrations..."
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        log "Running migrations for $platform..."
        
        local platform_dir="$PROJECT_ROOT/$platform"
        if [[ -d "$platform_dir" && -f "$platform_dir/package.json" ]]; then
            cd "$platform_dir"
            
            # Check if migration script exists
            if npm run --silent migrate --if-present &> /dev/null; then
                npm run migrate
                log_success "$platform migrations completed"
            else
                log_info "No migrations script found for $platform"
            fi
            
            cd "$PROJECT_ROOT"
        fi
    done
    
    log_success "All migrations completed"
}

perform_health_checks() {
    log "🏥 Performing health checks..."
    
    if [[ "$ENVIRONMENT" == "development" ]]; then
        local base_url="http://localhost:3000"
    else
        # Get load balancer URL from Terraform output
        cd "$TERRAFORM_DIR"
        local base_url=$(terraform output -raw load_balancer_url 2>/dev/null || echo "")
        cd "$PROJECT_ROOT"
        
        if [[ -z "$base_url" ]]; then
            log_warning "Could not determine load balancer URL, skipping health checks"
            return 0
        fi
    fi
    
    # Health check endpoints
    local endpoints=("/health" "/api/health" "/metrics")
    local failed_checks=0
    
    for endpoint in "${endpoints[@]}"; do
        local url="${base_url}${endpoint}"
        
        if curl -f -s -o /dev/null "$url"; then
            log_success "Health check passed: $endpoint"
        else
            log_error "Health check failed: $endpoint"
            ((failed_checks++))
        fi
    done
    
    if [[ $failed_checks -gt 0 ]]; then
        log_error "$failed_checks health checks failed"
    fi
    
    log_success "All health checks passed"
}

rollback_deployment() {
    if [[ "$ENVIRONMENT" == "development" ]]; then
        log_error "Rollback not supported for development environment"
    fi
    
    log "🔄 Rolling back deployment..."
    
    local cluster_name="tiation-saas-$ENVIRONMENT"
    
    for platform in "${!PLATFORMS[@]}"; do
        if [[ -n "$TARGET_PLATFORM" && "$platform" != "$TARGET_PLATFORM" ]]; then
            continue
        fi
        
        log "Rolling back $platform..."
        
        local service_name="${platform}-${ENVIRONMENT}-service"
        
        # Get previous task definition
        local current_task_def=$(aws ecs describe-services \
            --cluster "$cluster_name" \
            --services "$service_name" \
            --query 'services[0].taskDefinition' \
            --output text)
        
        local task_family=$(echo "$current_task_def" | cut -d':' -f1)
        local current_revision=$(echo "$current_task_def" | cut -d':' -f2)
        local previous_revision=$((current_revision - 1))
        
        if [[ $previous_revision -gt 0 ]]; then
            local previous_task_def="${task_family}:${previous_revision}"
            
            aws ecs update-service \
                --cluster "$cluster_name" \
                --service "$service_name" \
                --task-definition "$previous_task_def"
            
            log_success "$platform rolled back to revision $previous_revision"
        else
            log_error "No previous revision available for $platform"
        fi
    done
    
    wait_for_deployments "$cluster_name"
    log_success "Rollback completed"
}

cleanup() {
    log "🧹 Cleaning up temporary files..."
    
    # Remove temporary files
    find "$CONFIG_DIR" -name "*-image-tag.txt" -delete 2>/dev/null || true
    
    # Clean up Docker images older than 7 days
    docker image prune -a -f --filter "until=168h" &> /dev/null || true
    
    log_success "Cleanup completed"
}

main() {
    show_banner
    
    # Parse arguments
    if [[ $# -eq 0 ]]; then
        usage
    fi
    
    ENVIRONMENT="$1"
    shift
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --platform)
                TARGET_PLATFORM="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS="true"
                shift
                ;;
            --skip-migrations)
                SKIP_MIGRATIONS="true"
                shift
                ;;
            --skip-build)
                SKIP_BUILD="true"
                shift
                ;;
            --rollback)
                ROLLBACK="true"
                shift
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            --help)
                usage
                ;;
            *)
                log_error "Unknown option: $1"
                ;;
        esac
    done
    
    # Validate environment
    case $ENVIRONMENT in
        development|staging|production)
            ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT"
            ;;
    esac
    
    # Validate platform if specified
    if [[ -n "$TARGET_PLATFORM" && ! -v "PLATFORMS[$TARGET_PLATFORM]" ]]; then
        log_error "Invalid platform: $TARGET_PLATFORM"
    fi
    
    log "🚀 Starting deployment to $ENVIRONMENT environment"
    if [[ -n "$TARGET_PLATFORM" ]]; then
        log_info "Target platform: $TARGET_PLATFORM"
    fi
    
    # Set trap for cleanup
    trap cleanup EXIT
    
    # Execute deployment pipeline
    check_prerequisites
    setup_environment "$ENVIRONMENT"
    
    if [[ "$ROLLBACK" == "true" ]]; then
        rollback_deployment
    else
        run_tests
        build_images
        deploy_infrastructure
        deploy_applications
        run_migrations
        perform_health_checks
    fi
    
    log_success "🎉 Deployment pipeline completed successfully!"
    
    # Show deployment summary
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                     DEPLOYMENT SUMMARY                        ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║ Environment: ${ENVIRONMENT}$(printf '%*s' $((51 - ${#ENVIRONMENT})) '')║${NC}"
    if [[ -n "$TARGET_PLATFORM" ]]; then
        echo -e "${GREEN}║ Platform: ${TARGET_PLATFORM}$(printf '%*s' $((54 - ${#TARGET_PLATFORM})) '')║${NC}"
    else
        echo -e "${GREEN}║ Platforms: All$(printf '%*s' 50 '')║${NC}"
    fi
    echo -e "${GREEN}║ Status: SUCCESS$(printf '%*s' 48 '')║${NC}"
    echo -e "${GREEN}║ Timestamp: $(date +'%Y-%m-%d %H:%M:%S %Z')$(printf '%*s' 37 '')║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    
    if [[ "$ENVIRONMENT" != "development" ]]; then
        echo ""
        log_info "Deployment URLs:"
        echo "  🌐 Load Balancer: $(cd "$TERRAFORM_DIR" && terraform output -raw load_balancer_url 2>/dev/null || echo 'N/A')"
        echo "  📊 Monitoring: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION"
        echo "  🐳 ECS Console: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION"
    else
        echo ""
        log_info "Development environment URLs:"
        echo "  🌐 Application: http://localhost:3000"
        echo "  📊 Metrics: http://localhost:3000/metrics"
        echo "  💾 Database: postgresql://localhost:5432"
    fi
}

# Execute main function with all arguments
main "$@"
