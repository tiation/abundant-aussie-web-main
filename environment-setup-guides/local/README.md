# Local Development Environment Setup

> **Enterprise-grade local development with Docker and modern tooling** 🖥️

This guide walks you through setting up a complete local development environment on your Mac, optimized for working with your Hostinger VPS infrastructure.

## 📋 What You'll Set Up

- **Docker Development Environment** - Containerized services
- **Database Stack** - PostgreSQL, MongoDB, Redis locally
- **Frontend Development** - Node.js, React/Vue.js setup
- **Backend Development** - Python, API servers
- **Development Tools** - Code quality, testing, debugging

## 🔧 Prerequisites Check

Run these commands to verify your setup:

```bash
# Check Docker installation
docker --version          # Should be 27.5.1+
docker-compose --version  # Should be v2.32.4+

# Check Node.js installation  
node --version            # Should be 22.15.0+
npm --version            # Should be 10.0.0+

# Check Python installation
python3 --version        # Should be 3.13.3+
pip3 --version          # Should be 24.0+

# Check Git SSH configuration
ssh -T git@github.com    # Should authenticate successfully
```

## 🚀 Quick Start (Copy-Paste Commands)

### 1. Install Development Dependencies

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install essential development tools
brew install git docker docker-compose node python@3.13 postgresql mongodb-community redis

# Install Docker Desktop (GUI version)
brew install --cask docker

# Install development utilities
brew install jq curl wget htop tree fzf
```

### 2. Create Local Development Structure

```bash
# Navigate to your development directory
cd /Users/tiaastor/Github/tiation-repos

# Create local development workspace
mkdir -p local-development/{databases,services,configs,logs,scripts}
cd local-development

# Create Docker Compose configuration
cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: dev-postgres
    environment:
      POSTGRES_DB: devdb
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpass123
      POSTGRES_MULTIPLE_DATABASES: riggerdb,afldb,testdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./databases/postgres-init:/docker-entrypoint-initdb.d
    networks:
      - dev-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser -d devdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB Database
  mongodb:
    image: mongo:7-jammy
    container_name: dev-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: devuser
      MONGO_INITDB_ROOT_PASSWORD: devpass123
      MONGO_INITDB_DATABASE: devdb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./databases/mongo-init:/docker-entrypoint-initdb.d
    networks:
      - dev-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: dev-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./configs/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - dev-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: dev-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./configs/nginx:/etc/nginx/conf.d
      - ./logs/nginx:/var/log/nginx
    networks:
      - dev-network
    depends_on:
      - postgres
      - mongodb
      - redis

  # Adminer (Database GUI)
  adminer:
    image: adminer:latest
    container_name: dev-adminer
    ports:
      - "8080:8080"
    networks:
      - dev-network
    depends_on:
      - postgres
      - mongodb

  # Redis Commander (Redis GUI)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: dev-redis-commander
    environment:
      REDIS_HOSTS: redis:dev-redis:6379
    ports:
      - "8081:8081"
    networks:
      - dev-network
    depends_on:
      - redis

volumes:
  postgres_data:
  mongodb_data:
  redis_data:

networks:
  dev-network:
    driver: bridge
EOF
```

### 3. Create Database Initialization Scripts

```bash
# PostgreSQL initialization
mkdir -p databases/postgres-init
cat > databases/postgres-init/create-multiple-dbs.sh << 'EOF'
#!/bin/bash
set -e
set -u

function create_user_and_database() {
    local database=$1
    echo "Creating user and database '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE USER ${database}_user WITH PASSWORD '${database}_pass123';
        CREATE DATABASE $database;
        GRANT ALL PRIVILEGES ON DATABASE $database TO ${database}_user;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        create_user_and_database $db
    done
    echo "Multiple databases created"
fi
EOF

chmod +x databases/postgres-init/create-multiple-dbs.sh

# MongoDB initialization
mkdir -p databases/mongo-init
cat > databases/mongo-init/create-users.js << 'EOF'
// Create application users
db = db.getSiblingDB('riggerdb');
db.createUser({
  user: 'rigger_user',
  pwd: 'rigger_pass123',
  roles: [{ role: 'readWrite', db: 'riggerdb' }]
});

db = db.getSiblingDB('afldb');
db.createUser({
  user: 'afl_user', 
  pwd: 'afl_pass123',
  roles: [{ role: 'readWrite', db: 'afldb' }]
});

db = db.getSiblingDB('testdb');
db.createUser({
  user: 'test_user',
  pwd: 'test_pass123', 
  roles: [{ role: 'readWrite', db: 'testdb' }]
});
EOF
```

### 4. Create Configuration Files

```bash
# Nginx configuration
mkdir -p configs/nginx
cat > configs/nginx/default.conf << 'EOF'
# Development reverse proxy configuration
upstream backend_api {
    server host.docker.internal:5000;
}

upstream frontend_dev {
    server host.docker.internal:3000;
}

server {
    listen 80;
    server_name localhost dev.local;

    # Frontend proxy
    location / {
        proxy_pass http://frontend_dev;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://backend_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Redis configuration
cat > configs/redis.conf << 'EOF'
# Redis development configuration
bind 0.0.0.0
port 6379
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /data
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
```

### 5. Create Development Scripts

```bash
# Create development helper scripts
mkdir -p scripts

cat > scripts/dev-start.sh << 'EOF'
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

cat > scripts/dev-stop.sh << 'EOF'
#!/bin/bash
set -e

echo "🛑 Stopping local development environment..."
docker-compose -f docker-compose.dev.yml down

echo "✅ Development environment stopped!"
EOF

cat > scripts/dev-logs.sh << 'EOF'
#!/bin/bash
# Show logs for all services or specific service
if [ $# -eq 0 ]; then
    docker-compose -f docker-compose.dev.yml logs -f
else
    docker-compose -f docker-compose.dev.yml logs -f $1
fi
EOF

cat > scripts/dev-reset.sh << 'EOF'
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

# Make scripts executable
chmod +x scripts/*.sh
```

### 6. Create Environment Variables Templates

```bash
mkdir -p configs/env-templates

cat > configs/env-templates/.env.local << 'EOF'
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

cat > configs/env-templates/.env.rigger << 'EOF'
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
```

## 🛠️ Development Workflow

### Daily Development Commands

```bash
# Start your development day
cd /Users/tiaastor/Github/tiation-repos/local-development
./scripts/dev-start.sh

# Check service status
docker-compose -f docker-compose.dev.yml ps

# View logs (all services)
./scripts/dev-logs.sh

# View logs (specific service)
./scripts/dev-logs.sh postgres

# Stop development environment
./scripts/dev-stop.sh

# Reset everything (when things break)
./scripts/dev-reset.sh
```

### Database Management

```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U devuser -d devdb

# Connect to MongoDB
mongosh mongodb://devuser:devpass123@localhost:27017/devdb

# Connect to Redis
redis-cli -h localhost -p 6379

# Access database GUIs
open http://localhost:8080  # Adminer (PostgreSQL/MongoDB)
open http://localhost:8081  # Redis Commander
```

### Testing Your Setup

```bash
# Test database connections
docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U devuser
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose -f docker-compose.dev.yml exec redis redis-cli ping

# Test HTTP endpoints
curl -I http://localhost/health
curl -I http://localhost:8080
curl -I http://localhost:8081
```

## 🔧 Troubleshooting

### Common Issues

**Docker services won't start:**
```bash
# Check Docker is running
docker info

# Reset Docker if needed
docker system prune -a
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :5432  # PostgreSQL
lsof -i :27017 # MongoDB  
lsof -i :6379  # Redis
lsof -i :8080  # Adminer

# Kill processes if needed
sudo kill -9 <PID>
```

**Database connection issues:**
```bash
# Check service logs
./scripts/dev-logs.sh postgres
./scripts/dev-logs.sh mongodb
./scripts/dev-logs.sh redis

# Reset databases
./scripts/dev-reset.sh
```

## 🎯 Next Steps

Once your local environment is running:

1. **Clone Your Project Repositories**
   ```bash
   cd /Users/tiaastor/Github/tiation-repos
   git clone git@github.com:your-org/RiggerConnect-web.git
   git clone git@github.com:your-org/RiggerHub-web.git
   git clone git@github.com:your-org/RiggerBackend.git
   ```

2. **Configure Project-Specific Environment**
   ```bash
   # Copy environment templates to your projects
   cp local-development/configs/env-templates/.env.local RiggerConnect-web/.env.local
   cp local-development/configs/env-templates/.env.rigger RiggerBackend/.env.local
   ```

3. **Start Developing**
   - Use the database URLs from your `.env.local` files
   - Run your frontend development servers on ports 3000, 3001, etc.
   - Run your backend APIs on ports 5000, 5001, etc.
   - Access everything through the Nginx proxy at http://localhost

---

> **Ready for staging?** Check out the [Staging Environment Setup Guide](../staging/README.md)
