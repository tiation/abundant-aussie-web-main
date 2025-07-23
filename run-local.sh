#!/bin/bash
# ==============================================
# RIGGER ECOSYSTEM - LOCAL DEVELOPMENT RUNNER
# Quick startup script for MacOS development environment
# ChaseWhiteRabbit NGO
# ==============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}" >&2
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

# Configuration
COMPOSE_FILE="docker-compose.local.yml"
ENV_FILE=".env.local"

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running. Please start Docker Desktop and try again."
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "docker-compose is not installed. Please install Docker Compose."
    fi
    
    # Check if required files exist
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        error "Docker compose file not found: $COMPOSE_FILE"
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found: $ENV_FILE"
    fi
    
    log "Prerequisites check passed ✓"
}

# Function to create local directories
create_local_directories() {
    log "Creating local directories..."
    
    mkdir -p {data,logs,uploads,backups,config}
    mkdir -p {data/{postgres,mongodb,redis,prometheus,grafana},logs/{backend,hub,connect},uploads/{backend,hub,connect}}
    
    log "Local directories created ✓"
}

# Function to set permissions for database init scripts
fix_permissions() {
    log "Setting up file permissions..."
    
    # Make database init scripts executable
    if [[ -f "scripts/postgres/init-multiple-databases.sh" ]]; then
        chmod +x scripts/postgres/init-multiple-databases.sh
    fi
    
    log "Permissions set ✓"
}

# Function to start services
start_services() {
    local service_filter=${1:-""}
    
    if [[ -n "$service_filter" ]]; then
        log "Starting specific services: $service_filter"
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d $service_filter
    else
        log "Starting all Rigger ecosystem services..."
        docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
    fi
    
    log "Services started ✓"
}

# Function to show service status
show_status() {
    log "Service Status:"
    docker-compose -f $COMPOSE_FILE ps
    
    echo ""
    log "Service URLs:"
    info "🌐 RiggerHub (Business Portal): http://localhost:3000"
    info "🔧 RiggerConnect (Worker Portal): http://localhost:3001"  
    info "🚀 API Backend: http://localhost:8000"
    info "📧 Mailhog (Email Testing): http://localhost:8025"
    info "📊 Grafana (Monitoring): http://localhost:3002"
    info "📈 Prometheus (Metrics): http://localhost:9090"
    
    echo ""
    info "Database connections:"
    info "🐘 PostgreSQL: localhost:5432 (user: rigger_local, password: rigger123)"
    info "🍃 MongoDB: localhost:27017 (user: admin, password: mongo123)"
    info "🔴 Redis: localhost:6379 (password: redis123)"
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    
    if [[ -n "$service" ]]; then
        log "Showing logs for: $service"
        docker-compose -f $COMPOSE_FILE logs -f "$service"
    else
        log "Showing logs for all services (press Ctrl+C to exit):"
        docker-compose -f $COMPOSE_FILE logs -f
    fi
}

# Function to stop services
stop_services() {
    log "Stopping Rigger ecosystem services..."
    docker-compose -f $COMPOSE_FILE down
    log "Services stopped ✓"
}

# Function to cleanup
cleanup() {
    log "Cleaning up Docker resources..."
    docker-compose -f $COMPOSE_FILE down -v --remove-orphans
    docker system prune -f
    log "Cleanup completed ✓"
}

# Function to run tests
run_tests() {
    log "Running tests..."
    
    # Wait for services to be ready
    sleep 30
    
    # Test API health
    if curl -f -s http://localhost:8000/health >/dev/null; then
        log "✓ Backend API is healthy"
    else
        warn "✗ Backend API is not responding"
    fi
    
    # Test web services
    if curl -f -s http://localhost:3000 >/dev/null; then
        log "✓ RiggerHub web is responding"
    else  
        warn "✗ RiggerHub web is not responding"
    fi
    
    if curl -f -s http://localhost:3001 >/dev/null; then
        log "✓ RiggerConnect web is responding"
    else
        warn "✗ RiggerConnect web is not responding"
    fi
}

# Function to open browser tabs
open_browser() {
    log "Opening browser tabs..."
    
    # Wait a moment for services to start
    sleep 5
    
    # Open main application URLs
    open "http://localhost:3000" # RiggerHub
    open "http://localhost:3001" # RiggerConnect
    open "http://localhost:8025" # Mailhog
    open "http://localhost:3002" # Grafana
    
    log "Browser tabs opened ✓"
}

# Main function
main() {
    local command=${1:-"start"}
    
    case $command in
        start)
            log "🚀 Starting Rigger Ecosystem (Local Development)"
            check_prerequisites
            create_local_directories
            fix_permissions
            start_services
            show_status
            info "Startup complete! Services are starting in the background."
            info "Run '$0 logs' to see service logs"
            info "Run '$0 test' to test service health"
            ;;
        start-db)
            log "🚀 Starting database services only"
            check_prerequisites
            create_local_directories
            fix_permissions
            start_services "postgres redis mongodb"
            show_status
            ;;
        start-backend)
            log "🚀 Starting backend services"
            check_prerequisites
            create_local_directories
            fix_permissions
            start_services "postgres redis mongodb rigger-backend mailhog"
            show_status
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        test)
            run_tests
            ;;
        open)
            open_browser
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 2
            start_services
            show_status
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  start         Start all services (default)"
            echo "  start-db      Start database services only"
            echo "  start-backend Start backend + database services"
            echo "  status        Show service status and URLs"
            echo "  logs [service] Show logs (all services or specific service)"
            echo "  test          Test service health"
            echo "  open          Open browser tabs for all services"
            echo "  stop          Stop all services"
            echo "  restart       Restart all services"
            echo "  cleanup       Stop services and cleanup Docker resources"
            echo "  help          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Start all services"
            echo "  $0 start-db     # Start only databases"
            echo "  $0 logs backend # Show backend logs"
            echo "  $0 test         # Test service health"
            echo "  $0 cleanup      # Full cleanup"
            ;;
        *)
            error "Unknown command: $command. Use '$0 help' for usage information."
            ;;
    esac
}

# Handle script interruption
trap 'log "Script interrupted. Services may still be running. Use '$0' stop to stop them."' INT

# Execute main function with all arguments
main "$@"
