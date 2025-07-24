# Docker Setup and Troubleshooting Guide

## Overview

This comprehensive guide covers advanced Docker deployment scenarios, troubleshooting techniques, and best practices for enterprise-grade containerized applications. It addresses complex orchestration challenges, cross-platform compatibility issues, and debugging strategies for production environments.

## Table of Contents

1. [Multi-Container Orchestration Issues](#multi-container-orchestration-issues)
2. [Volume Mounting Across Operating Systems](#volume-mounting-across-operating-systems)
3. [Docker Network Modes and Cross-Host Networking](#docker-network-modes-and-cross-host-networking)
4. [Container Debugging and Log Management](#container-debugging-and-log-management)
5. [Environment Variable Conflicts Resolution](#environment-variable-conflicts-resolution)
6. [Production Best Practices](#production-best-practices)

---

## Multi-Container Orchestration Issues

### Circular Dependencies

Circular dependencies occur when containers depend on each other to start, creating a deadlock situation.

#### Common Scenarios

```yaml
# Problem: Database depends on app for initialization, app depends on database
version: '3.8'
services:
  app:
    image: myapp:latest
    depends_on:
      - database
    environment:
      - DATABASE_URL=postgresql://user:pass@database:5432/myapp
  
  database:
    image: postgres:15
    depends_on:
      - app  # CIRCULAR DEPENDENCY!
    volumes:
      - ./init-scripts:/docker-entrypoint-initdb.d
```

#### Solution Strategies

**1. Use Health Checks and Wait Scripts**

```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    depends_on:
      database:
        condition: service_healthy
    command: ["./wait-for-db.sh", "database:5432", "--", "npm", "start"]
    environment:
      - DATABASE_URL=postgresql://user:pass@database:5432/myapp
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - db_data:/var/lib/postgresql/data
```

**2. Implement Retry Logic in Applications**

```javascript
// wait-for-db.js
const { Client } = require('pg');

async function waitForDatabase(retries = 30, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      });
      await client.connect();
      await client.end();
      console.log('Database connection successful');
      return;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

waitForDatabase().then(() => {
  require('./app.js');
}).catch(console.error);
```

### Startup Order Management

#### Using Docker Compose Profiles

```yaml
version: '3.8'
services:
  # Core infrastructure services
  database:
    image: postgres:15
    profiles: ["core", "full"]
    environment:
      - POSTGRES_DB=rigger_db
      - POSTGRES_USER=rigger_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rigger_user -d rigger_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    profiles: ["core", "full"]
    command: redis-server --requirepass ${REDIS_PASSWORD}
    environment:
      - REDIS_PASSWORD=redis_secure_pass
    volumes:
      - redis_data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Application services
  backend:
    image: rigger-backend:latest
    profiles: ["full"]
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://rigger_user:secure_password@database:5432/rigger_db
      - REDIS_URL=redis://:redis_secure_pass@redis:6379
    networks:
      - backend
      - frontend
    ports:
      - "3000:3000"

  frontend:
    image: rigger-frontend:latest
    profiles: ["full"]
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3000
    networks:
      - frontend
    ports:
      - "80:80"

volumes:
  postgres_data:
  redis_data:

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge
```

#### Staged Startup Script

```bash
#!/bin/bash
# staged-startup.sh

set -e

echo "Starting core infrastructure services..."
docker-compose --profile core up -d

echo "Waiting for core services to be healthy..."
docker-compose exec database pg_isready -U rigger_user -d rigger_db
docker-compose exec redis redis-cli ping

echo "Starting application services..."
docker-compose --profile full up -d

echo "All services started successfully!"
```

---

## Volume Mounting Across Operating Systems

### Linux Volume Mounting

#### Standard Bind Mounts

```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    volumes:
      # Absolute path bind mount
      - /home/user/app-data:/app/data
      # Relative path bind mount  
      - ./config:/app/config:ro
      # Named volume
      - app_logs:/app/logs
      # Tmpfs mount for temporary files
      - type: tmpfs
        target: /app/tmp
        tmpfs:
          size: 100M
```

#### Permission Management on Linux

```bash
# Set proper ownership before mounting
sudo chown -R 1000:1000 /home/user/app-data

# Or use Docker's user namespace remapping
echo "user:1000:1" | sudo tee -a /etc/subuid
echo "user:1000:1" | sudo tee -a /etc/subgid

# Configure daemon.json
sudo tee /etc/docker/daemon.json << EOF
{
  "userns-remap": "user"
}
EOF

sudo systemctl restart docker
```

### macOS Volume Mounting

#### Performance Optimizations

```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    volumes:
      # Use cached mount for better performance
      - ./src:/app/src:cached
      # Use delegated mount for write-heavy operations
      - ./logs:/app/logs:delegated
      # Use consistent mount for critical data
      - ./config:/app/config:consistent
      # Use tmpfs for temporary files
      - type: tmpfs
        target: /app/tmp
```

#### macOS-Specific Mount Options

```yaml
# docker-compose.mac.yml
version: '3.8'
services:
  development:
    image: node:18-alpine
    working_dir: /app
    volumes:
      # Optimized for macOS development
      - .:/app:cached
      - node_modules:/app/node_modules
      - /app/node_modules/.cache
    environment:
      - CHOKIDAR_USEPOLLING=true  # For file watching
      - WATCHPACK_POLLING=true    # For webpack dev server
```

### Windows Volume Mounting

#### Windows Path Handling

```yaml
# docker-compose.windows.yml
version: '3.8'
services:
  app:
    image: myapp:latest
    volumes:
      # Windows paths - use forward slashes
      - c:/Users/username/app-data:/app/data
      # Or use drive letters with forward slashes
      - /c/projects/myapp:/app/src
      # Named volumes work the same
      - app_data:/app/data
```

#### Windows Container Specifics

```dockerfile
# Dockerfile.windows
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Set up PowerShell as default shell
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';"]

# Create application directory
RUN New-Item -ItemType Directory -Path C:\app

# Copy application files
COPY . C:\app\

# Set working directory
WORKDIR C:\app

# Expose port
EXPOSE 8080

# Run application
CMD ["powershell", "-File", "start.ps1"]
```

### Cross-Platform Volume Solutions

#### Docker Volume Plugins

```yaml
version: '3.8'
services:
  app:
    image: myapp:latest
    volumes:
      - shared_data:/app/data

volumes:
  shared_data:
    driver: nfs
    driver_opts:
      share: "nfs.example.com:/shared/data"
      o: "addr=nfs.example.com,rw"
```

#### Synchronization Tools

```yaml
# Using docker-sync for development
version: '3.8'
services:
  app:
    image: myapp:latest
    volumes:
      - app-sync:/app/src:nocopy
    depends_on:
      - app-sync

  app-sync:
    image: eugenmayer/unison
    environment:
      - UNISON_DIR1=/host_data
      - UNISON_DIR2=/app_data
      - UNISON_UID=1000
      - UNISON_GID=1000
    volumes:
      - ./src:/host_data
      - app-sync:/app_data

volumes:
  app-sync:
    external: true
```

---

## Docker Network Modes and Cross-Host Networking

### Bridge Network Mode

#### Default Bridge Network

```yaml
version: '3.8'
services:
  web:
    image: nginx:alpine
    networks:
      - default  # Uses bridge network
    ports:
      - "80:80"
  
  api:
    image: myapi:latest
    networks:
      - default
    # No ports exposed externally
```

#### Custom Bridge Networks

```yaml
version: '3.8'
services:
  frontend:
    image: react-app:latest
    networks:
      - frontend_network
    ports:
      - "3000:3000"
  
  backend:
    image: express-api:latest
    networks:
      - frontend_network
      - backend_network
    environment:
      - DATABASE_URL=postgresql://user:pass@database:5432/app
  
  database:
    image: postgres:15
    networks:
      - backend_network
    volumes:
      - db_data:/var/lib/postgresql/data

networks:
  frontend_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  backend_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
    internal: true  # No external access

volumes:
  db_data:
```

### Host Network Mode

#### When to Use Host Mode

```yaml
version: '3.8'
services:
  monitoring:
    image: node-exporter:latest
    network_mode: host
    # Inherits all host network interfaces
    # Useful for system monitoring
    pid: host
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
```

#### Host Mode Limitations

```bash
# Host mode doesn't work with:
# - Port mapping (ports are ignored)
# - Network aliases
# - Service discovery within compose
# - Network isolation

# Example of what NOT to do:
version: '3.8'
services:
  app:
    image: myapp:latest
    network_mode: host
    ports:
      - "8080:8080"  # THIS IS IGNORED!
```

### Cross-Host Networking for Staging/Production

#### Docker Swarm Overlay Networks

```yaml
# docker-compose.swarm.yml
version: '3.8'
services:
  web:
    image: rigger-web:latest
    networks:
      - webnet
    ports:
      - "80:80"
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == worker
          - node.labels.type == web

  api:
    image: rigger-api:latest
    networks:
      - webnet
      - backnet
    deploy:
      replicas: 5
      placement:
        constraints:
          - node.role == worker

  database:
    image: postgres:15
    networks:
      - backnet
    volumes:
      - db_data:/var/lib/postgresql/data
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
          - node.labels.type == database

networks:
  webnet:
    driver: overlay
    attachable: true
  backnet:
    driver: overlay
    internal: true

volumes:
  db_data:
    driver: local
```

#### Multi-Host Deployment Script

```bash
#!/bin/bash
# deploy-swarm.sh

# Initialize swarm on manager node (docker.sxc.codes)
echo "Initializing Docker Swarm on manager node..."
ssh root@145.223.22.7 'docker swarm init --advertise-addr 145.223.22.7'

# Get join tokens
WORKER_TOKEN=$(ssh root@145.223.22.7 'docker swarm join-token worker -q')
MANAGER_TOKEN=$(ssh root@145.223.22.7 'docker swarm join-token manager -q')

# Join worker nodes
echo "Adding worker nodes to swarm..."
ssh root@145.223.22.9 "docker swarm join --token $WORKER_TOKEN 145.223.22.7:2377"
ssh root@89.116.191.60 "docker swarm join --token $WORKER_TOKEN 145.223.22.7:2377"

# Label nodes for placement constraints
ssh root@145.223.22.7 'docker node update --label-add type=web docker.tiation.net'
ssh root@145.223.22.7 'docker node update --label-add type=database ubuntu.sxc.codes'

# Deploy stack
echo "Deploying application stack..."
ssh root@145.223.22.7 'docker stack deploy -c docker-compose.swarm.yml rigger-stack'

echo "Deployment complete!"
```

#### External Load Balancer Configuration

```yaml
# nginx.conf for load balancing across swarm nodes
upstream rigger_backend {
    server 145.223.22.7:3000 weight=3;
    server 145.223.22.9:3000 weight=2;
    server 89.116.191.60:3000 weight=1;
}

upstream rigger_frontend {
    server 145.223.22.7:80 weight=3;
    server 145.223.22.9:80 weight=2;
    server 89.116.191.60:80 weight=1;
}

server {
    listen 443 ssl http2;
    server_name riggerconnect.com;
    
    ssl_certificate /etc/ssl/certs/riggerconnect.crt;
    ssl_certificate_key /etc/ssl/private/riggerconnect.key;
    
    location /api/ {
        proxy_pass http://rigger_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location / {
        proxy_pass http://rigger_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Container Debugging and Log Management

### Container Log Analysis

#### Basic Log Commands

```bash
# View logs from all containers in compose
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# View logs with timestamps
docker-compose logs -t backend

# View last N lines
docker-compose logs --tail=100 backend

# View logs since specific time
docker-compose logs --since="2024-01-01T12:00:00" backend
```

#### Advanced Log Filtering

```bash
# Filter logs by log level
docker-compose logs backend | grep ERROR

# Filter logs using jq for JSON logs
docker-compose logs backend | jq 'select(.level == "error")'

# Export logs to file
docker-compose logs --no-color backend > backend-logs.txt

# Real-time log monitoring with grep
docker-compose logs -f backend | grep -E "(ERROR|WARN|FATAL)"
```

### Structured Logging Configuration

#### Application-Level Logging

```javascript
// logger.js - Node.js structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'rigger-backend',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: '/app/logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: '/app/logs/combined.log' 
    })
  ]
});

// Usage
logger.info('User login successful', { 
  userId: user.id, 
  ip: req.ip,
  userAgent: req.get('User-Agent')
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  dbHost: process.env.DB_HOST
});

module.exports = logger;
```

#### Docker Logging Drivers

```yaml
version: '3.8'
services:
  backend:
    image: rigger-backend:latest
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    environment:
      - LOG_LEVEL=info

  frontend:
    image: rigger-frontend:latest
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://elastic.sxc.codes:514"
        tag: "rigger-frontend"

  database:
    image: postgres:15
    logging:
      driver: "fluentd"
      options:
        fluentd-address: "elastic.sxc.codes:24224"
        tag: "rigger.database"
```

### ELK Stack Integration

#### Logstash Configuration

```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
  
  tcp {
    port => 5000
    codec => json_lines
  }
}

filter {
  if [fields][service] == "rigger-backend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    if [level] == "ERROR" {
      mutate {
        add_tag => [ "error", "alert" ]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elastic.sxc.codes:9200"]
    index => "rigger-logs-%{+YYYY.MM.dd}"
  }
  
  if "alert" in [tags] {
    email {
      to => ["tiatheone@protonmail.com", "garrett@sxc.codes"]
      from => "alerts@riggerconnect.com"
      subject => "Rigger Application Error Alert"
      body => "Error occurred: %{message}"
    }
  }
}
```

#### Filebeat Configuration

```yaml
# filebeat.yml
filebeat.inputs:
- type: docker
  containers.ids:
    - "*"
  containers.path: "/var/lib/docker/containers"
  containers.stream: "all"

processors:
- add_docker_metadata:
    host: "unix:///var/run/docker.sock"

- decode_json_fields:
    fields: ["message"]
    target: ""
    overwrite_keys: true

output.logstash:
  hosts: ["elastic.sxc.codes:5044"]

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
```

### Container Health Monitoring

#### Health Check Implementation

```dockerfile
# Dockerfile with health check
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Install curl for health checks
RUN apk add --no-cache curl

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "server.js"]
```

#### Health Check Endpoint

```javascript
// health.js - Express health check endpoint
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const router = express.Router();

router.get('/health', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    service: 'rigger-backend',
    version: process.env.APP_VERSION || '1.0.0',
    checks: {}
  };

  try {
    // Database health check
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    await pool.query('SELECT 1');
    checks.checks.database = { status: 'healthy', latency: Date.now() };
    await pool.end();
  } catch (error) {
    checks.checks.database = { 
      status: 'unhealthy', 
      error: error.message 
    };
  }

  try {
    // Redis health check
    const client = redis.createClient({ url: process.env.REDIS_URL });
    await client.connect();
    await client.ping();
    checks.checks.redis = { status: 'healthy' };
    await client.quit();
  } catch (error) {
    checks.checks.redis = { 
      status: 'unhealthy', 
      error: error.message 
    };
  }

  // Memory usage check
  const memUsage = process.memoryUsage();
  checks.checks.memory = {
    status: memUsage.heapUsed / memUsage.heapTotal < 0.9 ? 'healthy' : 'warning',
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  };

  const isHealthy = Object.values(checks.checks)
    .every(check => check.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json(checks);
});

module.exports = router;
```

### Container Restart Strategies

#### Restart Policies

```yaml
version: '3.8'
services:
  # Critical service - always restart
  database:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=rigger_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Application service - restart unless stopped
  backend:
    image: rigger-backend:latest
    restart: unless-stopped
    depends_on:
      - database
    environment:
      - NODE_ENV=production

  # Development service - no restart
  debug:
    image: rigger-debug:latest
    restart: "no"
    profiles: ["debug"]

  # Batch job - restart on failure only
  migration:
    image: rigger-migrations:latest
    restart: on-failure:3
    depends_on:
      - database
    profiles: ["migration"]

volumes:
  postgres_data:
```

#### Automated Recovery Scripts

```bash
#!/bin/bash
# recovery-monitor.sh

COMPOSE_FILE="docker-compose.yml"
ALERT_EMAIL="tiatheone@protonmail.com"
LOG_FILE="/var/log/docker-recovery.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

check_container_health() {
    local service=$1
    local health_url=$2
    
    if ! curl -sf "$health_url" > /dev/null 2>&1; then
        log_message "UNHEALTHY: $service failed health check"
        return 1
    fi
    return 0
}

restart_service() {
    local service=$1
    log_message "RESTARTING: $service"
    
    docker-compose restart "$service"
    sleep 30
    
    if docker-compose ps "$service" | grep -q "Up"; then
        log_message "SUCCESS: $service restarted successfully"
        return 0
    else
        log_message "FAILED: $service restart failed"
        return 1
    fi
}

send_alert() {
    local subject=$1
    local message=$2
    
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    log_message "ALERT SENT: $subject"
}

# Main monitoring loop
while true; do
    # Check backend health
    if ! check_container_health "backend" "http://localhost:3000/health"; then
        if restart_service "backend"; then
            send_alert "Rigger Backend Recovered" "Backend service was unhealthy and has been restarted successfully."
        else
            send_alert "Rigger Backend Recovery Failed" "Backend service restart failed. Manual intervention required."
        fi
    fi
    
    # Check frontend health
    if ! check_container_health "frontend" "http://localhost/health"; then
        restart_service "frontend"
    fi
    
    # Check database connectivity
    if ! docker-compose exec -T database pg_isready -U rigger_user > /dev/null 2>&1; then
        log_message "DATABASE: Connection check failed"
        send_alert "Rigger Database Issue" "Database connectivity check failed."
    fi
    
    sleep 60
done
```

---

## Environment Variable Conflicts Resolution

### Docker Compose Override Files

#### Base Configuration

```yaml
# docker-compose.yml (base configuration)
version: '3.8'
services:
  backend:
    image: rigger-backend:latest
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
      - PORT=3000
    ports:
      - "3000:3000"
    networks:
      - app-network

  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=rigger_prod
      - POSTGRES_USER=rigger_user
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

#### Development Override

```yaml
# docker-compose.override.yml (automatically loaded)
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - ./src:/app/src:cached
      - ./node_modules:/app/node_modules
    environment:
      - NODE_ENV=development  # Overrides production
      - LOG_LEVEL=debug       # Overrides info
      - DEBUG=rigger:*
      - HOT_RELOAD=true
    command: ["npm", "run", "dev"]

  database:
    environment:
      - POSTGRES_DB=rigger_dev  # Overrides rigger_prod
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"  # Expose for development tools

  # Additional development services
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    networks:
      - app-network
```

#### Staging Override

```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  backend:
    image: rigger-backend:staging
    environment:
      - NODE_ENV=staging
      - LOG_LEVEL=warn
      - API_URL=https://api-staging.riggerconnect.com
      - DATABASE_URL=postgresql://rigger_user:${STAGING_DB_PASSWORD}@supabase.sxc.codes:5432/rigger_staging
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  database:
    # Use external database in staging
    image: postgres:15
    environment:
      - POSTGRES_DB=rigger_staging
      - POSTGRES_PASSWORD=${STAGING_DB_PASSWORD}
    volumes:
      - staging_postgres_data:/var/lib/postgresql/data

volumes:
  staging_postgres_data:
```

### Environment Variable Precedence

#### Variable Resolution Order

```bash
# Docker Compose variable precedence (highest to lowest):
# 1. Shell environment variables
# 2. Environment variables in .env file
# 3. Variables defined in docker-compose.yml
# 4. Variables defined in Dockerfile
# 5. Default values in application

export NODE_ENV=production  # Highest precedence
```

#### Environment File Management

```bash
# .env (default environment file)
NODE_ENV=production
LOG_LEVEL=info
DB_HOST=supabase.sxc.codes
DB_PORT=5432
DB_NAME=rigger_prod
DB_USER=rigger_user
DB_PASSWORD=secure_production_password

# API Configuration
API_PORT=3000
API_HOST=0.0.0.0
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# External Services
REDIS_URL=redis://redis:6379
ELASTICSEARCH_URL=http://elastic.sxc.codes:9200
```

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rigger_dev
DB_USER=postgres
DB_PASSWORD=postgres

# Development overrides
API_PORT=3001
DEBUG=rigger:*
HOT_RELOAD=true
```

```bash
# .env.staging
NODE_ENV=staging
LOG_LEVEL=warn
DB_HOST=staging-db.sxc.codes
DB_NAME=rigger_staging
DB_PASSWORD=${STAGING_DB_PASSWORD}

# Staging-specific settings
API_URL=https://api-staging.riggerconnect.com
SENTRY_ENV=staging
```

### Conflict Resolution Strategies

#### Variable Validation Script

```bash
#!/bin/bash
# validate-env.sh

set -e

REQUIRED_VARS=(
    "NODE_ENV"
    "DATABASE_URL"
    "JWT_SECRET"
    "REDIS_URL"
)

ENVIRONMENT=${1:-production}
ENV_FILE=".env.${ENVIRONMENT}"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Error: Environment file $ENV_FILE not found"
    exit 1
fi

echo "Validating environment variables for: $ENVIRONMENT"
source "$ENV_FILE"

# Check required variables
for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "Error: Required variable $var is not set"
        exit 1
    fi
    echo "✓ $var is set"
done

# Validate NODE_ENV
if [[ "$NODE_ENV" != "development" && "$NODE_ENV" != "staging" && "$NODE_ENV" != "production" ]]; then
    echo "Error: NODE_ENV must be development, staging, or production"
    exit 1
fi

# Check for conflicting ports
if [[ "$NODE_ENV" == "development" && "$API_PORT" == "3000" ]]; then
    echo "Warning: API_PORT 3000 might conflict with React development server"
fi

# Validate database connection
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    echo "Warning: Cannot connect to database at $DB_HOST:$DB_PORT"
fi

echo "Environment validation completed successfully"
```

#### Docker Compose with Environment Selection

```yaml
# docker-compose.env.yml
version: '3.8'
services:
  backend:
    image: rigger-backend:latest
    env_file:
      - .env.${ENVIRONMENT:-production}
    environment:
      # These will override env_file values
      - CONTAINER_NAME=backend-${ENVIRONMENT:-production}
      - DEPLOYED_AT=${DEPLOYMENT_TIMESTAMP}
    networks:
      - app-network

  database:
    image: postgres:15
    env_file:
      - .env.${ENVIRONMENT:-production}
    environment:
      # Database-specific overrides
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    networks:
      - app-network

networks:
  app-network:
    name: rigger-${ENVIRONMENT:-production}
```

#### Deployment Script with Environment Validation

```bash
#!/bin/bash
# deploy.sh

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILES="-f docker-compose.yml"

# Add environment-specific overrides
case $ENVIRONMENT in
    development)
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.override.yml"
        ;;
    staging)
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.staging.yml"
        ;;
    production)
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.prod.yml"
        ;;
    *)
        echo "Error: Invalid environment '$ENVIRONMENT'"
        echo "Valid environments: development, staging, production"
        exit 1
        ;;
esac

# Validate environment
./validate-env.sh "$ENVIRONMENT"

# Set deployment timestamp
export DEPLOYMENT_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export ENVIRONMENT

echo "Deploying to $ENVIRONMENT environment..."
echo "Using compose files: $COMPOSE_FILES"

# Pull latest images (production only)
if [[ "$ENVIRONMENT" == "production" ]]; then
    docker-compose $COMPOSE_FILES pull
fi

# Deploy with zero-downtime strategy
if [[ "$ENVIRONMENT" == "production" ]]; then
    # Blue-green deployment
    docker-compose $COMPOSE_FILES up -d --no-deps --scale backend=4 backend
    sleep 30
    docker-compose $COMPOSE_FILES up -d --no-deps --scale backend=2 backend
else
    # Direct deployment for dev/staging
    docker-compose $COMPOSE_FILES up -d
fi

# Health check
echo "Performing health checks..."
for i in {1..30}; do
    if curl -sf http://localhost:3000/health > /dev/null; then
        echo "✓ Application is healthy"
        break
    fi
    echo "Waiting for application to be ready... ($i/30)"
    sleep 10
done

echo "Deployment to $ENVIRONMENT completed successfully!"
```

---

## Production Best Practices

### Security Hardening

#### Secure Container Configuration

```dockerfile
# Dockerfile.secure
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

#### Resource Limits and Monitoring

```yaml
version: '3.8'
services:
  backend:
    image: rigger-backend:latest
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '0.5'
          memory: 1G
    environment:
      - NODE_OPTIONS=--max-old-space-size=3072
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

### Multi-Environment CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Environments

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          echo "${{ secrets.STAGING_SSH_KEY }}" > staging_key
          chmod 600 staging_key
          scp -i staging_key -o StrictHostKeyChecking=no \
            docker-compose.staging.yml root@145.223.22.9:/app/
          ssh -i staging_key root@145.223.22.9 \
            "cd /app && ./deploy.sh staging"

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          echo "${{ secrets.PRODUCTION_SSH_KEY }}" > prod_key
          chmod 600 prod_key
          scp -i prod_key -o StrictHostKeyChecking=no \
            docker-compose.prod.yml root@145.223.22.7:/app/
          ssh -i prod_key root@145.223.22.7 \
            "cd /app && ./deploy.sh production"
```

---

**Maintained by**: ChaseWhiteRabbit NGO DevOps Team  
**Last Updated**: 2024  
**Next Review**: Quarterly  
**Related Documentation**: 
- [Kubernetes Deployment Guide](kubernetes-deployment.md)
- [API Documentation](../API.md)
- [Setup Guide](../SETUP.md)
