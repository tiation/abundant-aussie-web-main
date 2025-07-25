#!/bin/bash
set -euo pipefail

# Local Development Environment Setup Script
# Enterprise-grade, ethical, DevOps best practices with striking design!

echo "🚀 Starting Local Development Environment Setup..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOCAL_DEV_DIR="$HOME/Github/tiation-repos/local-development"

# Email addresses for alerts
ALERT_EMAILS=("tiatheone@protonmail.com" "garrett@sxc.codes" "garrett.dillman@gmail.com")

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

send_alert() {
    local message="$1"
    local subject="Local Dev Setup Alert"
    for email in "${ALERT_EMAILS[@]}"; do
        echo "$message" | mail -s "$subject" "$email" 2>/dev/null || true
    done
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not available. Please ensure Docker Desktop is running."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js is not installed. Installing via Homebrew..."
        brew install node || {
            log_error "Failed to install Node.js"
            exit 1
        }
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        log_warning "Python 3 is not installed. Installing via Homebrew..."
        brew install python@3.13 || {
            log_error "Failed to install Python"
            exit 1
        }
    fi
    
    log_success "Prerequisites check completed"
}

setup_directory_structure() {
    log_info "Setting up directory structure..."
    
    # Create main development directory
    mkdir -p "$LOCAL_DEV_DIR"/{databases,services,configs,logs,scripts}
    
    # Create database directories
    mkdir -p "$LOCAL_DEV_DIR"/databases/{postgres-init,mongo-init}
    
    # Create config directories
    mkdir -p "$LOCAL_DEV_DIR"/configs/{nginx,env-templates}
    
    log_success "Directory structure created"
}

copy_configuration_files() {
    log_info "Copying configuration files..."
    
    # Copy Docker Compose file from local guide
    if [ -f "$PROJECT_ROOT/local/README.md" ]; then
        log_info "Extracting Docker Compose configuration..."
        
        # Extract docker-compose.dev.yml from README.md
        sed -n '/^cat > docker-compose\.dev\.yml << '\''EOF'\''/,/^EOF$/p' "$PROJECT_ROOT/local/README.md" | \
        sed '1d;$d' > "$LOCAL_DEV_DIR/docker-compose.dev.yml"
        
        # Extract database initialization scripts
        sed -n '/^cat > databases\/postgres-init\/create-multiple-dbs\.sh << '\''EOF'\''/,/^EOF$/p' "$PROJECT_ROOT/local/README.md" | \
        sed '1d;$d' > "$LOCAL_DEV_DIR/databases/postgres-init/create-multiple-dbs.sh"
        chmod +x "$LOCAL_DEV_DIR/databases/postgres-init/create-multiple-dbs.sh"
        
        sed -n '/^cat > databases\/mongo-init\/create-users\.js << '\''EOF'\''/,/^EOF$/p' "$PROJECT_ROOT/local/README.md" | \
        sed '1d;$d' > "$LOCAL_DEV_DIR/databases/mongo-init/create-users.js"
        
        # Extract nginx configuration
        sed -n '/^cat > configs\/nginx\/default\.conf << '\''EOF'\''/,/^EOF$/p' "$PROJECT_ROOT/local/README.md" | \
        sed '1d;$d' > "$LOCAL_DEV_DIR/configs/nginx/default.conf"
        
        # Extract Redis configuration
        sed -n '/^cat > configs\/redis\.conf << '\''EOF'\''/,/^EOF$/p' "$PROJECT_ROOT/local/README.md" | \
        sed '1d;$d' > "$LOCAL_DEV_DIR/configs/redis.conf"
        
        log_success "Configuration files extracted from documentation"
    else
        log_error "Local development guide not found"
        exit 1
    fi
}

create_helper_scripts() {
    log_info "Creating helper scripts..."
    
    # Create dev-start.sh
    cat > "$LOCAL_DEV_DIR/scripts/dev-start.sh" << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting local development environment..."

# Start Docker services
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
docker-compose -f docker-compose.dev.yml ps

echo "✅ Development environment is ready!"
echo ""
echo "📊 Service URLs:"
echo "   - Database GUI (Adminer): http://localhost:8080"
echo "   - Redis GUI: http://localhost:8081"
echo "   - Nginx Proxy: http://localhost"
echo "   - PostgreSQL: localhost:5432"
echo "   - MongoDB: localhost:27017"
echo "   - Redis: localhost:6379"
echo ""
echo "🔗 Database Connections:"
echo "   PostgreSQL: postgresql://devuser:devpass123@localhost:5432/devdb"
echo "   MongoDB: mongodb://devuser:devpass123@localhost:27017/devdb"
echo "   Redis: redis://localhost:6379"
EOF

    # Create other helper scripts
    cat > "$LOCAL_DEV_DIR/scripts/dev-stop.sh" << 'EOF'
#!/bin/bash
set -e

echo "🛑 Stopping local development environment..."
docker-compose -f docker-compose.dev.yml down

echo "✅ Development environment stopped!"
EOF

    cat > "$LOCAL_DEV_DIR/scripts/dev-logs.sh" << 'EOF'
#!/bin/bash
# Show logs for all services or specific service
if [ $# -eq 0 ]; then
    docker-compose -f docker-compose.dev.yml logs -f
else
    docker-compose -f docker-compose.dev.yml logs -f $1
fi
EOF

    cat > "$LOCAL_DEV_DIR/scripts/dev-reset.sh" << 'EOF'
#!/bin/bash
set -e

echo "🔄 Resetting local development environment..."
echo "⚠️  This will delete all data in development databases!"

read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo "✅ Development environment reset complete!"
else
    echo "❌ Reset cancelled"
fi
EOF

    # Make all scripts executable
    chmod +x "$LOCAL_DEV_DIR"/scripts/*.sh
    
    log_success "Helper scripts created"
}

create_environment_templates() {
    log_info "Creating environment variable templates..."
    
    # Create .env.local template
    cat > "$LOCAL_DEV_DIR/configs/env-templates/.env.local" << 'EOF'
# Local Development Environment Variables
NODE_ENV=development
DEBUG=true

# Database Configuration
DATABASE_URL=postgresql://devuser:devpass123@localhost:5432/devdb
MONGODB_URL=mongodb://devuser:devpass123@localhost:27017/devdb
REDIS_URL=redis://localhost:6379

# API Configuration
API_HOST=localhost
API_PORT=5000
API_BASE_URL=http://localhost:5000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Security (Development Only)
JWT_SECRET=dev-jwt-secret-key-change-in-production
ENCRYPTION_KEY=dev-encryption-key-32-chars-long

# External Services (Development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=dev@localhost
SMTP_PASS=devpass

# Logging
LOG_LEVEL=debug
LOG_FORMAT=dev
EOF

    # Create Rigger-specific environment template
    cat > "$LOCAL_DEV_DIR/configs/env-templates/.env.rigger" << 'EOF'
# RiggerConnect/RiggerHub Local Environment
NODE_ENV=development

# RiggerConnect Database
RIGGER_DB_URL=postgresql://rigger_user:rigger_pass123@localhost:5432/riggerdb

# RiggerHub Configuration
HUB_API_URL=http://localhost:5001
HUB_DB_URL=mongodb://rigger_user:rigger_pass123@localhost:27017/riggerdb

# Shared Services
REDIS_URL=redis://localhost:6379
SHARED_SECRET=rigger-dev-shared-secret

# ChaseWhiteRabbit NGO Settings
ORG_NAME=ChaseWhiteRabbit NGO
ORG_EMAIL=info@chasewhiterabbit.org
EOF

    log_success "Environment templates created"
}

start_development_environment() {
    log_info "Starting development environment..."
    
    cd "$LOCAL_DEV_DIR"
    
    # Pull latest images
    docker-compose -f docker-compose.dev.yml pull
    
    # Start services
    ./scripts/dev-start.sh
    
    log_success "Development environment started successfully!"
}

verify_setup() {
    log_info "Verifying setup..."
    
    cd "$LOCAL_DEV_DIR"
    
    # Test database connections
    sleep 15 # Give services time to fully start
    
    if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U devuser; then
        log_success "PostgreSQL is responding"
    else
        log_warning "PostgreSQL may not be fully ready yet"
    fi
    
    if docker-compose -f docker-compose.dev.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        log_success "MongoDB is responding"
    else
        log_warning "MongoDB may not be fully ready yet"
    fi
    
    if docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
        log_success "Redis is responding"
    else
        log_warning "Redis may not be fully ready yet"
    fi
    
    # Test HTTP endpoints
    if curl -s -I http://localhost:8080 >/dev/null 2>&1; then
        log_success "Adminer (Database GUI) is accessible"
    else
        log_warning "Adminer may not be ready yet"
    fi
    
    if curl -s -I http://localhost:8081 >/dev/null 2>&1; then
        log_success "Redis Commander is accessible"
    else
        log_warning "Redis Commander may not be ready yet"
    fi
}

print_success_message() {
    echo ""
    echo "🎉 Local Development Environment Setup Complete!"
    echo "================================================"
    echo ""
    echo "📊 Access your services:"
    echo "   • Database GUI (Adminer): http://localhost:8080"
    echo "   • Redis GUI (Commander): http://localhost:8081"
    echo "   • Nginx Proxy: http://localhost"
    echo ""
    echo "🔗 Database connections:"
    echo "   • PostgreSQL: postgresql://devuser:devpass123@localhost:5432/devdb"
    echo "   • MongoDB: mongodb://devuser:devpass123@localhost:27017/devdb"
    echo "   • Redis: redis://localhost:6379"
    echo ""
    echo "🛠️ Management commands:"
    echo "   • Start: cd $LOCAL_DEV_DIR && ./scripts/dev-start.sh"
    echo "   • Stop: cd $LOCAL_DEV_DIR && ./scripts/dev-stop.sh"
    echo "   • Logs: cd $LOCAL_DEV_DIR && ./scripts/dev-logs.sh"
    echo "   • Reset: cd $LOCAL_DEV_DIR && ./scripts/dev-reset.sh"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Copy environment templates to your projects"
    echo "   2. Review the Local Development Guide: $PROJECT_ROOT/local/README.md"
    echo "   3. Start developing with the database URLs above"
    echo ""
    echo "✨ Happy coding! - ChaseWhiteRabbit NGO"
}

# Error handling
trap 'log_error "Setup failed at line $LINENO"; send_alert "Local development setup failed"; exit 1' ERR

# Main execution
main() {
    check_prerequisites
    setup_directory_structure
    copy_configuration_files
    create_helper_scripts
    create_environment_templates
    start_development_environment
    verify_setup
    print_success_message
    
    # Send success notification
    send_alert "Local development environment setup completed successfully on $(hostname)"
}

# Run main function
main "$@"
