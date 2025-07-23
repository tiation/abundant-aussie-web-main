#!/bin/bash

# 🚀 Tiation SaaS - Development Environment Setup Script
# Simple script to manage the development environment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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
║            🚀 TIATION DEVELOPMENT ENVIRONMENT                  ║
║                                                                ║
║                    Quick Setup Script                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

usage() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start        Start the development environment"
    echo "  stop         Stop the development environment"
    echo "  restart      Restart the development environment"
    echo "  status       Show status of all services"
    echo "  logs         Show logs from all services"
    echo "  clean        Stop and remove all containers and volumes"
    echo "  test         Test database connections"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 logs"
    exit 1
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker first."
    fi
    
    log_success "Docker is ready"
}

start_environment() {
    log "🚀 Starting Tiation development environment..."
    
    cd "$PROJECT_ROOT"
    
    # Check if minimal setup should be used
    if [[ ! -f "docker-compose.dev.yml" ]] || [[ "$1" == "--minimal" ]]; then
        log_info "Using minimal setup (databases and tools only)"
        docker-compose -f docker-compose.minimal.yml up -d
        COMPOSE_FILE="docker-compose.minimal.yml"
    else
        log_info "Using full development setup"
        docker-compose -f docker-compose.dev.yml up -d
        COMPOSE_FILE="docker-compose.dev.yml"
    fi
    
    # Wait for services to be ready
    log "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Test database connections
    test_connections
    
    log_success "Development environment started successfully!"
    show_access_info
}

stop_environment() {
    log "🛑 Stopping Tiation development environment..."
    
    cd "$PROJECT_ROOT"
    
    # Try to stop both compose files
    docker-compose -f docker-compose.minimal.yml down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    log_success "Development environment stopped"
}

restart_environment() {
    log "🔄 Restarting Tiation development environment..."
    stop_environment
    sleep 3
    start_environment "$@"
}

show_status() {
    log "📊 Checking status of Tiation services..."
    
    cd "$PROJECT_ROOT"
    
    echo ""
    echo "=== MINIMAL SERVICES ==="
    docker-compose -f docker-compose.minimal.yml ps 2>/dev/null || echo "Minimal services not running"
    
    echo ""
    echo "=== FULL SERVICES ==="
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "Full services not running"
}

show_logs() {
    log "📝 Showing logs from Tiation services..."
    
    cd "$PROJECT_ROOT"
    
    # Show logs from whichever compose file is running
    if docker-compose -f docker-compose.minimal.yml ps -q 2>/dev/null | grep -q .; then
        docker-compose -f docker-compose.minimal.yml logs -f --tail=100
    elif docker-compose -f docker-compose.dev.yml ps -q 2>/dev/null | grep -q .; then
        docker-compose -f docker-compose.dev.yml logs -f --tail=100
    else
        log_warning "No services are currently running"
    fi
}

clean_environment() {
    log "🧹 Cleaning up Tiation development environment..."
    
    cd "$PROJECT_ROOT"
    
    # Stop and remove containers and volumes
    docker-compose -f docker-compose.minimal.yml down -v --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
    
    # Remove unused Docker resources
    docker system prune -f
    
    log_success "Environment cleaned up"
}

test_connections() {
    log "🔍 Testing database connections..."
    
    # Test PostgreSQL
    if docker exec tiation-postgres-minimal pg_isready -U tiation &>/dev/null; then
        log_success "PostgreSQL is ready"
    else
        log_warning "PostgreSQL is not ready yet"
    fi
    
    # Test Redis
    if docker exec tiation-redis-minimal redis-cli -a dev123 ping &>/dev/null; then
        log_success "Redis is ready"
    else
        log_warning "Redis is not ready yet"
    fi
    
    # Test MongoDB
    if docker exec tiation-mongodb-minimal mongosh --eval "db.adminCommand('ping')" &>/dev/null; then
        log_success "MongoDB is ready"
    else
        log_warning "MongoDB is not ready yet"
    fi
}

show_access_info() {
    echo ""
    log_info "🌐 Access Information:"
    echo ""
    echo "  📊 Database Admin Tools:"
    echo "    • Adminer (PostgreSQL):     http://localhost:8080"
    echo "    • Mongo Express (MongoDB):  http://localhost:8083 (admin/admin123)"
    echo "    • Redis Commander:          http://localhost:8082"
    echo ""
    echo "  🗄️ Direct Database Connections:"
    echo "    • PostgreSQL: localhost:5432 (user: tiation, pass: dev123, db: tiation_dev)"
    echo "    • MongoDB:    localhost:27017 (user: tiation, pass: dev123, db: tiation_gaming)"
    echo "    • Redis:      localhost:6379 (pass: dev123)"
    echo ""
    echo "  📝 Useful Commands:"
    echo "    • Check status: $0 status"
    echo "    • View logs:    $0 logs"
    echo "    • Stop:         $0 stop"
    echo "    • Clean up:     $0 clean"
}

main() {
    show_banner
    
    if [[ $# -eq 0 ]]; then
        usage
    fi
    
    local command="$1"
    shift || true
    
    check_docker
    
    case $command in
        start)
            start_environment "$@"
            ;;
        stop)
            stop_environment
            ;;
        restart)
            restart_environment "$@"
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        clean)
            clean_environment
            ;;
        test)
            test_connections
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            log_error "Unknown command: $command"
            ;;
    esac
}

# Execute main function with all arguments
main "$@"
