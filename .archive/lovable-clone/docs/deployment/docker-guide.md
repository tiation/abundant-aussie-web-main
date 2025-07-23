# Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Lovable Clone application using Docker containers across our VPS infrastructure.

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Deployment                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Production (docker.sxc.codes)    Staging (docker.tiation.net) │
│  ├─ Load Balancer (Nginx)         ├─ Load Balancer (Nginx)     │
│  ├─ App Container (Node.js)       ├─ App Container (Node.js)   │
│  ├─ Redis Cache                   ├─ Redis Cache               │
│  └─ Health Checks                 └─ Health Checks             │
│                                                             │
│  Shared Services                                            │
│  ├─ Database (supabase.sxc.codes)                          │
│  ├─ Monitoring (grafana.sxc.codes)                         │
│  └─ Logging (elastic.sxc.codes)                            │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Container Configuration

### Dockerfile

Create a production-optimized Dockerfile:

```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

### Docker Compose Configuration

#### Production (docker-compose.prod.yml)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: lovable-clone:latest
    container_name: lovable-clone-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - API_BASE_URL=${API_BASE_URL}
      - GRAFANA_ENDPOINT=${GRAFANA_ENDPOINT}
      - ELASTIC_ENDPOINT=${ELASTIC_ENDPOINT}
    env_file:
      - .env.production
    volumes:
      - app-logs:/app/logs
    networks:
      - app-network
    depends_on:
      - redis
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        tag: "lovable-clone-app"

  nginx:
    image: nginx:alpine
    container_name: lovable-clone-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled:ro
      - ./ssl:/etc/ssl/certs:ro
      - nginx-logs:/var/log/nginx
    networks:
      - app-network
    depends_on:
      - app
    logging:
      driver: "json-file"
      options:
        max-size: "5m"
        max-file: "3"
        tag: "lovable-clone-nginx"

  redis:
    image: redis:7-alpine
    container_name: lovable-clone-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    logging:
      driver: "json-file"
      options:
        max-size: "5m"
        max-file: "2"
        tag: "lovable-clone-redis"

  watchtower:
    image: containrrr/watchtower
    container_name: lovable-clone-watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=3600
      - WATCHTOWER_INCLUDE_STOPPED=true
    command: lovable-clone-app lovable-clone-nginx lovable-clone-redis

volumes:
  redis-data:
  app-logs:
  nginx-logs:

networks:
  app-network:
    driver: bridge
```

#### Staging (docker-compose.staging.yml)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: lovable-clone:staging
    container_name: lovable-clone-staging-app
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - API_BASE_URL=${API_BASE_URL}
    env_file:
      - .env.staging
    volumes:
      - staging-logs:/app/logs
    networks:
      - staging-network
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    container_name: lovable-clone-staging-redis
    restart: unless-stopped
    ports:
      - "6380:6379"
    volumes:
      - staging-redis-data:/data
    networks:
      - staging-network
    command: redis-server --appendonly yes --maxmemory 128mb --maxmemory-policy allkeys-lru

volumes:
  staging-redis-data:
  staging-logs:

networks:
  staging-network:
    driver: bridge
```

## 🚀 Deployment Procedures

### Production Deployment

#### Step 1: Initial Setup on docker.sxc.codes

```bash
# Connect to production Docker host
ssh root@145.223.22.7

# Create application directory
mkdir -p /opt/lovable-clone
cd /opt/lovable-clone

# Clone repository
git clone git@github.com:tiation/lovable-clone.git .

# Create production environment file
cp .env.example .env.production
nano .env.production
```

#### Step 2: Configure Environment Variables

```bash
# Production environment (.env.production)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@supabase.sxc.codes:5432/lovable_clone_prod
REDIS_URL=redis://localhost:6379
API_BASE_URL=https://api.lovable-clone.com
GRAFANA_ENDPOINT=https://grafana.sxc.codes
ELASTIC_ENDPOINT=https://elastic.sxc.codes:9200
NEXTAUTH_SECRET=your-super-secure-secret-here
NEXTAUTH_URL=https://lovable-clone.com
JWT_SECRET=your-jwt-secret-here
```

#### Step 3: Deploy Application

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app
```

#### Step 4: Configure Nginx

Create `/opt/lovable-clone/nginx/sites-enabled/lovable-clone.conf`:

```nginx
upstream app {
    server app:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name lovable-clone.com www.lovable-clone.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lovable-clone.com www.lovable-clone.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/lovable-clone.com.pem;
    ssl_certificate_key /etc/ssl/certs/lovable-clone.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @proxy;
    }

    # API Routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Login endpoint with stricter rate limiting
    location /api/auth/signin {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Main application
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://app/api/health;
        access_log off;
    }
}
```

### Staging Deployment

#### Step 1: Setup on docker.tiation.net

```bash
# Connect to staging Docker host
ssh root@145.223.22.9

# Create application directory
mkdir -p /opt/lovable-clone-staging
cd /opt/lovable-clone-staging

# Clone repository
git clone -b develop git@github.com:tiation/lovable-clone.git .

# Create staging environment file
cp .env.example .env.staging
nano .env.staging
```

#### Step 2: Deploy Staging

```bash
# Deploy staging environment
docker-compose -f docker-compose.staging.yml up -d --build

# Verify deployment
docker-compose -f docker-compose.staging.yml ps
```

## 🔧 Container Management

### Essential Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# Check container logs
docker logs lovable-clone-app
docker logs -f lovable-clone-app  # Follow logs

# Execute commands in container
docker exec -it lovable-clone-app sh

# Check container resource usage
docker stats

# Restart specific service
docker-compose restart app

# Update and restart services
docker-compose pull
docker-compose up -d

# Clean up unused resources
docker system prune -f
```

### Database Migrations

```bash
# Run migrations in production
docker exec -it lovable-clone-app npm run migrate:prod

# Run seeds in staging
docker exec -it lovable-clone-staging-app npm run seed:staging
```

## 📊 Monitoring and Health Checks

### Application Health Checks

Create `/api/health` endpoint in your application:

```javascript
// pages/api/health.js
export default async function handler(req, res) {
  try {
    // Check database connectivity
    const dbHealth = await checkDatabase();
    
    // Check Redis connectivity
    const redisHealth = await checkRedis();
    
    // Check external services
    const servicesHealth = await checkExternalServices();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        redis: redisHealth,
        external: servicesHealth
      },
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Container Monitoring

```bash
# Monitor container health
docker inspect --format='{{.State.Health.Status}}' lovable-clone-app

# View container metrics
docker stats lovable-clone-app

# Export logs to monitoring system
docker logs lovable-clone-app 2>&1 | \
  curl -X POST "https://elastic.sxc.codes:9200/docker-logs/_doc" \
  -H "Content-Type: application/json" -d @-
```

## 🔄 CI/CD Integration

### Automated Deployment Script

Create `scripts/deploy-docker.sh`:

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
HOST=${2:-docker.tiation.net}

echo "🚀 Deploying to $ENVIRONMENT environment on $HOST"

# Set host-specific variables
case $HOST in
  "docker.sxc.codes")
    SSH_HOST="root@145.223.22.7"
    COMPOSE_FILE="docker-compose.prod.yml"
    ;;
  "docker.tiation.net")
    SSH_HOST="root@145.223.22.9"
    COMPOSE_FILE="docker-compose.staging.yml"
    ;;
  *)
    echo "❌ Unknown host: $HOST"
    exit 1
    ;;
esac

# Deploy to remote host
ssh $SSH_HOST << EOF
  cd /opt/lovable-clone${ENVIRONMENT:+-$ENVIRONMENT}
  
  echo "📥 Pulling latest changes..."
  git pull origin ${ENVIRONMENT == "production" ? "main" : "develop"}
  
  echo "🏗️  Building and deploying containers..."
  docker-compose -f $COMPOSE_FILE pull
  docker-compose -f $COMPOSE_FILE up -d --build
  
  echo "🧹 Cleaning up unused images..."
  docker image prune -f
  
  echo "✅ Deployment completed successfully!"
  
  echo "🔍 Verifying deployment..."
  docker-compose -f $COMPOSE_FILE ps
EOF

echo "🎉 Deployment to $ENVIRONMENT on $HOST completed!"
```

Make it executable:
```bash
chmod +x scripts/deploy-docker.sh
```

## 🛡️ Security Best Practices

### Container Security

```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Use read-only root filesystem
docker run --read-only --tmpfs /tmp lovable-clone

# Limit resources
docker run --memory=512m --cpus=0.5 lovable-clone
```

### Environment Security

```bash
# Use Docker secrets for sensitive data
echo "super-secret-password" | docker secret create db_password -

# In docker-compose.yml
secrets:
  db_password:
    external: true
```

### Network Security

```yaml
# Isolate containers in custom networks
networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 🔧 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check container logs
docker logs lovable-clone-app

# Check system resources
docker system df
df -h
free -h
```

**Database connection issues:**
```bash
# Test database connectivity from container
docker exec -it lovable-clone-app psql $DATABASE_URL -c "SELECT 1;"

# Check network connectivity
docker exec -it lovable-clone-app nslookup supabase.sxc.codes
```

**High memory usage:**
```bash
# Check container memory usage
docker stats --no-stream

# Adjust Node.js memory limits
docker run -e NODE_OPTIONS="--max-old-space-size=512" lovable-clone
```

### Performance Optimization

```bash
# Enable Docker buildkit for faster builds
export DOCKER_BUILDKIT=1

# Use multi-stage builds to reduce image size
# (Already implemented in our Dockerfile)

# Use .dockerignore to exclude unnecessary files
echo "node_modules\n.git\n*.log" > .dockerignore
```

---

**Docker deployment guide maintained by the ChaseWhiteRabbit DevOps team**
