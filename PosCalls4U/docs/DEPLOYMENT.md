# PosCalls4U Deployment Guide

## Overview

This guide covers deploying PosCalls4U to production environments with enterprise-grade security, scalability, and reliability. The platform supports various deployment strategies from single-server setups to distributed microservices architectures.

## Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04+ LTS, CentOS 8+, or similar
- **Memory**: Minimum 4GB RAM (8GB+ recommended for production)
- **CPU**: 2+ cores (4+ cores recommended)
- **Storage**: 50GB+ SSD storage
- **Network**: Stable internet connection with adequate bandwidth

### Software Dependencies
- **Node.js**: 18.0.0 or higher
- **MongoDB**: 6.0 or higher
- **Redis**: 6.0 or higher (optional but recommended)
- **Nginx**: Latest stable version (for reverse proxy)
- **SSL Certificates**: Valid SSL certificates for HTTPS
- **Process Manager**: PM2 or similar for process management

## Environment Setup

### Production Environment Variables

Create a secure `.env` file with production configurations:

```bash
# Core Application Settings
NODE_ENV=production
PORT=5000
APP_NAME=PosCalls4U
APP_VERSION=1.4.0

# Security Configuration
JWT_SECRET=your-super-strong-production-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poscalls4u?retryWrites=true&w=majority
MONGODB_OPTIONS='{"useUnifiedTopology":true,"useNewUrlParser":true,"maxPoolSize":20,"minPoolSize":5}'

# Redis Configuration (Recommended)
REDIS_URL=redis://username:password@your-redis-host:6379
REDIS_OPTIONS='{"maxRetriesPerRequest":3,"retryDelayOnFailover":100}'

# Client Configuration
CLIENT_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://api.your-domain.com

# Email Service (Production)
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=PosCalls4U <noreply@your-domain.com>
EMAIL_REPLY_TO=support@your-domain.com

# OAuth Configuration
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

FACEBOOK_CLIENT_ID=your-production-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-production-facebook-app-secret
FACEBOOK_CALLBACK_URL=https://your-domain.com/api/auth/facebook/callback

# Monitoring and Logging
LOG_LEVEL=info
LOG_FILE=/var/log/poscalls4u/app.log
LOG_MAX_SIZE=100MB
LOG_MAX_FILES=5
ERROR_REPORTING_URL=https://your-monitoring-service.com/api/errors

# Performance Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=300
SESSION_TTL=604800

# Feature Flags
ENABLE_SOCIAL_LOGIN=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_RATE_LIMITING=true
ENABLE_CACHING=true

# External Services
PBX_HOST=your-pbx-host.com
PBX_PORT=5060
PBX_USERNAME=your-pbx-username
PBX_PASSWORD=your-pbx-password

# Health Check Configuration
HEALTH_CHECK_TIMEOUT=5000
DB_HEALTH_CHECK_TIMEOUT=3000
REDIS_HEALTH_CHECK_TIMEOUT=2000
```

### Environment Security

#### Secure Environment Variables
```bash
# Create secure environment file
sudo mkdir -p /etc/poscalls4u
sudo touch /etc/poscalls4u/.env
sudo chmod 600 /etc/poscalls4u/.env
sudo chown poscalls4u:poscalls4u /etc/poscalls4u/.env

# Use environment variable management service
# AWS Systems Manager Parameter Store
aws ssm put-parameter --name "/poscalls4u/JWT_SECRET" --value "your-secret" --type "SecureString"

# Azure Key Vault
az keyvault secret set --vault-name "poscalls4u-vault" --name "JWT-SECRET" --value "your-secret"

# HashiCorp Vault
vault kv put secret/poscalls4u JWT_SECRET="your-secret"
```

## Database Setup

### MongoDB Production Configuration

#### MongoDB Atlas (Recommended)
```javascript
// Connection with production options
const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  maxPoolSize: 20,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  w: 'majority'
};
```

#### Self-Hosted MongoDB
```bash
# Install MongoDB on Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Configure MongoDB for production
sudo nano /etc/mongod.conf
```

MongoDB Production Configuration (`/etc/mongod.conf`):
```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1,your-server-ip

# Security
security:
  authorization: enabled
  keyFile: /etc/mongod-keyfile

# Storage
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2

# Replication (for production)
replication:
  replSetName: "poscalls4u-rs"

# Logging
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
  logRotate: rename

# Process management
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
```

#### Database Security Setup
```bash
# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure-admin-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create application user
use poscalls4u
db.createUser({
  user: "poscalls4u",
  pwd: "secure-app-password",
  roles: ["readWrite"]
})

# Create indexes for performance
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "resetPasswordToken": 1 })
db.users.createIndex({ "emailVerificationToken": 1 })
db.teams.createIndex({ "name": 1 }, { unique: true })
db.teams.createIndex({ "members.userId": 1 })
```

### Redis Configuration

#### Redis Production Setup
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
```

Redis Production Configuration:
```bash
# Network
bind 127.0.0.1 your-server-ip
port 6379
protected-mode yes

# Security
requirepass your-redis-password
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

## Application Deployment

### Server Preparation

#### Create Application User
```bash
# Create dedicated user
sudo useradd -m -s /bin/bash poscalls4u
sudo mkdir -p /opt/poscalls4u
sudo chown poscalls4u:poscalls4u /opt/poscalls4u

# Create log directory
sudo mkdir -p /var/log/poscalls4u
sudo chown poscalls4u:poscalls4u /var/log/poscalls4u
```

#### Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u poscalls4u --hp /home/poscalls4u
```

### Application Build and Deployment

#### Automated Deployment Script
```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

# Configuration
APP_DIR="/opt/poscalls4u"
REPO_URL="git@github.com:your-org/PosCalls4U.git"
BRANCH="main"
USER="poscalls4u"

echo "Starting deployment to production..."

# Switch to application user
sudo -u $USER bash << EOF
cd $APP_DIR

# Backup current version
if [ -d "current" ]; then
    mv current backup-$(date +%Y%m%d-%H%M%S)
fi

# Clone latest code
git clone -b $BRANCH $REPO_URL current
cd current

# Install dependencies
npm ci --production

# Build applications
npm run build

# Install PM2 configuration
cp deployment/ecosystem.config.js .

# Restart application
pm2 reload ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
EOF

echo "Deployment completed successfully!"
```

#### PM2 Configuration (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [{
    name: 'poscalls4u-api',
    script: 'dist/index.js',
    cwd: '/opt/poscalls4u/current/server',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: '/var/log/poscalls4u/combined.log',
    out_file: '/var/log/poscalls4u/out.log',
    error_file: '/var/log/poscalls4u/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

## Web Server Configuration

### Nginx Setup

#### Install and Configure Nginx
```bash
# Install Nginx
sudo apt-get install nginx

# Create configuration
sudo nano /etc/nginx/sites-available/poscalls4u
```

Nginx Configuration (`/etc/nginx/sites-available/poscalls4u`):
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Upstream servers
upstream poscalls4u_api {
    least_conn;
    server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;
    # Add more servers for load balancing
    # server 127.0.0.1:5001 max_fails=3 fail_timeout=30s;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "no-referrer-when-downgrade";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";

    # Client-side routing
    location / {
        root /opt/poscalls4u/current/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Static file caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Routes
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        limit_req_status 429;
        
        proxy_pass http://poscalls4u_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Authentication endpoints with stricter rate limiting
    location /api/auth/ {
        limit_req zone=auth burst=10 nodelay;
        limit_req_status 429;
        
        proxy_pass http://poscalls4u_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://poscalls4u_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://poscalls4u_api;
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

#### Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/poscalls4u /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL certificate with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Security Configuration

### Firewall Setup
```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### SSL/TLS Configuration
```bash
# Generate strong DH parameters
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Add to Nginx configuration
ssl_dhparam /etc/nginx/dhparam.pem;
```

### Security Hardening
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt-get install fail2ban

# Configure fail2ban for Nginx
sudo nano /etc/fail2ban/jail.local
```

Fail2ban Configuration:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
```

## Monitoring and Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit

# Configure log rotation
pm2 set pm2-logrotate:max_size 100MB
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
```

### Health Monitoring Script
```bash
#!/bin/bash
# health-check.sh - Automated health monitoring

HEALTH_URL="https://your-domain.com/health"
ALERT_EMAIL="admin@your-domain.com"

response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $response != "200" ]; then
    echo "Health check failed with status: $response" | mail -s "PosCalls4U Health Alert" $ALERT_EMAIL
    # Restart application if needed
    sudo -u poscalls4u pm2 restart poscalls4u-api
fi
```

### Log Aggregation
```bash
# Configure rsyslog for centralized logging
echo "*.* @@your-log-server:514" | sudo tee -a /etc/rsyslog.conf
sudo systemctl restart rsyslog
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup-db.sh - Database backup script

BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup
mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://user:pass@localhost/poscalls4u" --out="$BACKUP_DIR/backup_$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "backup_$DATE"
rm -rf "$BACKUP_DIR/backup_$DATE"

# Upload to cloud storage (AWS S3 example)
aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://your-backup-bucket/mongodb/

# Clean old backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
```

### Application Backup
```bash
#!/bin/bash
# backup-app.sh - Application backup script

BACKUP_DIR="/backup/application"
APP_DIR="/opt/poscalls4u/current"
DATE=$(date +%Y%m%d_%H%M%S)

# Create application backup
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" -C "$APP_DIR" .

# Upload to cloud storage
aws s3 cp "$BACKUP_DIR/app_backup_$DATE.tar.gz" s3://your-backup-bucket/application/
```

## Performance Optimization

### Node.js Optimization
```javascript
// server/src/config/performance.ts
export const performanceConfig = {
  // Cluster mode with PM2
  cluster: true,
  instances: 'max',
  
  // Memory management
  maxMemoryRestart: '1G',
  nodeArgs: '--max-old-space-size=1024',
  
  // Connection pooling
  mongooseOptions: {
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 30000
  },
  
  // Redis connection pooling
  redisOptions: {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true
  }
};
```

### Database Optimization
```javascript
// Create compound indexes for better query performance
db.users.createIndex({ "email": 1, "isEmailVerified": 1 })
db.teams.createIndex({ "members.userId": 1, "members.role": 1 })
db.calls.createIndex({ "timestamp": -1, "teamId": 1 })
db.calls.createIndex({ "agentId": 1, "status": 1, "timestamp": -1 })
```

### Caching Strategy
```javascript
// server/src/config/cache.ts
export const cacheConfig = {
  // Redis cache configuration
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: 0,
    keyPrefix: 'poscalls4u:',
    ttl: 300 // 5 minutes default TTL
  },
  
  // Cache keys and TTL
  keys: {
    userProfile: 'user:profile:{userId}',
    teamStats: 'team:stats:{teamId}',
    dashboardData: 'dashboard:{userId}',
    callStats: 'stats:calls:{date}'
  },
  
  // TTL values (in seconds)
  ttl: {
    userProfile: 900,      // 15 minutes
    teamStats: 300,        // 5 minutes
    dashboardData: 60,     // 1 minute
    callStats: 1800        // 30 minutes
  }
};
```

## Disaster Recovery

### Recovery Procedures
1. **Database Recovery**
   ```bash
   # Restore from backup
   mongorestore --uri="mongodb://user:pass@localhost/poscalls4u" /backup/mongodb/latest
   ```

2. **Application Recovery**
   ```bash
   # Restore application
   cd /opt/poscalls4u
   tar -xzf /backup/application/latest.tar.gz
   pm2 restart ecosystem.config.js
   ```

3. **Full System Recovery**
   - Restore from system snapshots
   - Reconfigure network settings
   - Verify all services are operational
   - Test critical functionality

### High Availability Setup
```yaml
# docker-compose.ha.yml - High availability setup
version: '3.8'
services:
  app:
    image: poscalls4u:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    networks:
      - poscalls4u-network
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - poscalls4u-network

networks:
  poscalls4u-network:
    driver: overlay
```

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured securely
- [ ] Database setup with proper authentication
- [ ] Redis configured with authentication
- [ ] SSL certificates installed and configured
- [ ] Firewall rules configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit completed

### Post-Deployment
- [ ] Health endpoints responding correctly
- [ ] Authentication flows working
- [ ] Database connectivity verified
- [ ] Email services functional
- [ ] OAuth providers configured
- [ ] Real-time features operational
- [ ] Performance metrics within acceptable ranges
- [ ] Security headers properly set
- [ ] Monitoring alerts configured
- [ ] Backup processes tested

### Rollback Plan
1. Stop current application
2. Restore previous version from backup
3. Verify database integrity
4. Restart services
5. Validate functionality
6. Update DNS if necessary

---

This deployment guide provides a comprehensive foundation for deploying PosCalls4U in production environments with enterprise-grade security, performance, and reliability considerations.
