# LEMP Stack Deployment Guide

This guide provides comprehensive instructions for deploying the Lovable Clone application using the traditional LEMP (Linux, Nginx, MySQL, PHP/Node.js) stack on ubuntu.sxc.codes.

## 🏭 LEMP Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                ubuntu.sxc.codes (89.116.191.60)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Nginx    │  │   Node.js   │  │   Process   │         │
│  │ Load Balaner│  │ Application │  │   Manager   │         │
│  │   & Proxy   │  │   Server    │  │    (PM2)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                 │                 │              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ SSL/TLS     │  │   Redis     │  │   System    │         │
│  │ Termination │  │   Cache     │  │  Services   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  External Services:                                         │
│  ├─ Database: supabase.sxc.codes                           │
│  ├─ Monitoring: grafana.sxc.codes                          │
│  └─ Logging: elastic.sxc.codes                             │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Server Preparation

### Initial Server Setup

```bash
# Connect to the LEMP server
ssh root@89.116.191.60

# Update system packages
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### Install Node.js

```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node --version
npm --version

# Install global packages
npm install -g pm2 yarn
```

### Install Nginx

```bash
# Install Nginx
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# Check status
systemctl status nginx
```

### Install Redis

```bash
# Install Redis
apt install -y redis-server

# Configure Redis for production
nano /etc/redis/redis.conf

# Key configuration changes:
# bind 127.0.0.1
# maxmemory 256mb
# maxmemory-policy allkeys-lru
# save 900 1
# save 300 10
# save 60 10000

# Restart Redis
systemctl restart redis-server
systemctl enable redis-server
```

### Configure Firewall

```bash
# Configure UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 3000  # Node.js application port
ufw --force enable

# Check firewall status
ufw status
```

## 📁 Application Deployment

### Directory Structure Setup

```bash
# Create application directories
mkdir -p /var/www/lovable-clone
mkdir -p /var/log/lovable-clone
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Set proper ownership
chown -R www-data:www-data /var/www/lovable-clone
chown -R www-data:www-data /var/log/lovable-clone
```

### Clone and Setup Application

```bash
# Navigate to web directory
cd /var/www/lovable-clone

# Clone the repository
git clone git@github.com:tiation/lovable-clone.git .

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
nano .env.production
```

### Environment Configuration

```bash
# Production environment variables (.env.production)
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://user:pass@supabase.sxc.codes:5432/lovable_clone_prod

# Redis Configuration  
REDIS_URL=redis://127.0.0.1:6379

# Application URLs
API_BASE_URL=https://lovable-clone.com
NEXTAUTH_URL=https://lovable-clone.com
NEXTAUTH_SECRET=your-super-secure-nextauth-secret

# External Services
GRAFANA_ENDPOINT=https://grafana.sxc.codes
ELASTIC_ENDPOINT=https://elastic.sxc.codes:9200

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# Monitoring
LOG_LEVEL=info
LOG_FILE=/var/log/lovable-clone/app.log
```

### Build Application

```bash
# Build for production
npm run build

# Test the build
npm run start &
curl http://localhost:3000
kill %1  # Stop the test process
```

## ⚙️ Process Management with PM2

### PM2 Configuration

Create `/var/www/lovable-clone/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'lovable-clone',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/lovable-clone',
      instances: 2, // Number of CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: '/var/log/lovable-clone/combined.log',
      out_file: '/var/log/lovable-clone/out.log',
      error_file: '/var/log/lovable-clone/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      max_memory_restart: '512M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Environment file
      env_file: '.env.production'
    }
  ]
};
```

### Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup systemd

# Enable PM2 to start on boot
systemctl enable pm2-root
```

### PM2 Management Commands

```bash
# View running processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs lovable-clone

# Restart application
pm2 restart lovable-clone

# Reload application (zero-downtime)
pm2 reload lovable-clone

# Stop application
pm2 stop lovable-clone

# Delete application from PM2
pm2 delete lovable-clone
```

## 🌐 Nginx Configuration

### Main Nginx Configuration

Edit `/etc/nginx/nginx.conf`:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging Settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json
               application/xml application/rss+xml 
               application/atom+xml image/svg+xml;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
    
    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Include virtual host configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Site-Specific Configuration

Create `/etc/nginx/sites-available/lovable-clone`:

```nginx
# Upstream configuration
upstream lovable_clone_backend {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

# Rate limiting maps
map $request_uri $limit_key {
    ~*/api/auth/signin login;
    ~*/api/ api;
    default "";
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name lovable-clone.com www.lovable-clone.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lovable-clone.com www.lovable-clone.com;
    
    root /var/www/lovable-clone/public;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/lovable-clone.com.pem;
    ssl_certificate_key /etc/ssl/private/lovable-clone.com.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Logs
    access_log /var/log/nginx/lovable-clone-access.log main;
    error_log /var/log/nginx/lovable-clone-error.log;
    
    # Security headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.lovable-clone.com;" always;
    
    # Rate limiting
    limit_conn conn_limit_per_ip 20;
    
    # Static assets with long expiration
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        try_files $uri @proxy;
    }
    
    # API routes with rate limiting
    location /api/auth/signin {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://lovable_clone_backend;
        include /etc/nginx/proxy_params;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://lovable_clone_backend;
        include /etc/nginx/proxy_params;
    }
    
    # Health check (no rate limiting)
    location /api/health {
        proxy_pass http://lovable_clone_backend;
        include /etc/nginx/proxy_params;
        access_log off;
    }
    
    # Next.js specific routes
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://lovable_clone_backend;
        include /etc/nginx/proxy_params;
    }
    
    # Main application
    location / {
        try_files $uri @proxy;
    }
    
    # Proxy to Node.js application
    location @proxy {
        proxy_pass http://lovable_clone_backend;
        include /etc/nginx/proxy_params;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|json|yml|yaml|conf)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

Create `/etc/nginx/proxy_params`:

```nginx
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;
proxy_redirect off;
proxy_buffering off;
```

### Enable Site and Test Configuration

```bash
# Enable the site
ln -s /etc/nginx/sites-available/lovable-clone /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## 🔐 SSL/TLS Configuration

### Install Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
certbot --nginx -d lovable-clone.com -d www.lovable-clone.com

# Test automatic renewal
certbot renew --dry-run

# Set up automatic renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet --nginx
```

### Manual SSL Setup (Alternative)

```bash
# Create SSL directory
mkdir -p /etc/ssl/private /etc/ssl/certs

# Generate private key
openssl genrsa -out /etc/ssl/private/lovable-clone.com.key 2048

# Generate certificate signing request
openssl req -new -key /etc/ssl/private/lovable-clone.com.key -out /etc/ssl/certs/lovable-clone.com.csr

# Set proper permissions
chmod 600 /etc/ssl/private/lovable-clone.com.key
chmod 644 /etc/ssl/certs/lovable-clone.com.csr
```

## 📊 System Monitoring

### Log Management

```bash
# Configure log rotation
nano /etc/logrotate.d/lovable-clone

# Add configuration:
/var/log/lovable-clone/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/nginx/lovable-clone-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data adm
    postrotate
        systemctl reload nginx
    endscript
}
```

### System Health Monitoring

Create `/usr/local/bin/health-check.sh`:

```bash
#!/bin/bash

LOG_FILE="/var/log/lovable-clone/health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Function to log messages
log_message() {
    echo "[$TIMESTAMP] $1" >> $LOG_FILE
}

# Check Nginx
if ! systemctl is-active --quiet nginx; then
    log_message "ERROR: Nginx is not running"
    systemctl restart nginx
fi

# Check PM2 processes
if ! pm2 list | grep -q "lovable-clone.*online"; then
    log_message "ERROR: PM2 process is not running"
    pm2 restart lovable-clone
fi

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
    log_message "ERROR: Redis is not responding"
    systemctl restart redis-server
fi

# Check application health
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_message "ERROR: Application health check failed"
    pm2 restart lovable-clone
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    log_message "WARNING: Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEMORY_USAGE -gt 85 ]; then
    log_message "WARNING: Memory usage is ${MEMORY_USAGE}%"
fi

log_message "Health check completed"
```

```bash
# Make script executable
chmod +x /usr/local/bin/health-check.sh

# Add to crontab
crontab -e
# Add: */5 * * * * /usr/local/bin/health-check.sh
```

## 🔄 Deployment Automation

### Deployment Script

Create `/usr/local/bin/deploy-lovable-clone.sh`:

```bash
#!/bin/bash

set -e

APP_DIR="/var/www/lovable-clone"
BACKUP_DIR="/var/backups/lovable-clone"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment of Lovable Clone..."

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
cp -r $APP_DIR $BACKUP_DIR/backup_$TIMESTAMP

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build application
echo "🏗️  Building application..."
npm run build

# Restart PM2 processes
echo "🔄 Restarting application..."
pm2 reload lovable-clone --update-env

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🔍 Performing health check..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    
    # Clean old backups (keep last 5)
    ls -t $BACKUP_DIR | tail -n +6 | xargs -r -I {} rm -rf $BACKUP_DIR/{}
    
else
    echo "❌ Health check failed! Rolling back..."
    
    # Rollback
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -1)
    rm -rf $APP_DIR
    cp -r $BACKUP_DIR/$LATEST_BACKUP $APP_DIR
    pm2 restart lovable-clone
    
    exit 1
fi

echo "🎉 Deployment completed successfully!"
```

```bash
# Make script executable
chmod +x /usr/local/bin/deploy-lovable-clone.sh
```

## 🔧 Troubleshooting

### Common Issues

**1. Application won't start:**
```bash
# Check PM2 logs
pm2 logs lovable-clone

# Check system logs
journalctl -u pm2-root -f

# Check Node.js version compatibility
node --version
npm --version
```

**2. Nginx configuration errors:**
```bash
# Test configuration
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/lovable-clone-error.log

# Reload configuration
systemctl reload nginx
```

**3. SSL certificate issues:**
```bash
# Check certificate validity
openssl x509 -in /etc/ssl/certs/lovable-clone.com.pem -text -noout

# Check certificate expiration
certbot certificates

# Renew certificates
certbot renew --nginx
```

**4. Database connection issues:**
```bash
# Test database connectivity
psql -h supabase.sxc.codes -U username -d database_name -c "SELECT 1;"

# Check environment variables
pm2 env lovable-clone
```

### Performance Issues

**1. High CPU usage:**
```bash
# Check process usage
htop
pm2 monit

# Optimize PM2 cluster mode
pm2 delete lovable-clone
pm2 start ecosystem.config.js --env production
```

**2. Memory leaks:**
```bash
# Monitor memory usage
pm2 monit

# Set memory restart limit
pm2 restart lovable-clone --max-memory-restart 512M
```

**3. Slow response times:**
```bash
# Check Nginx access logs
tail -f /var/log/nginx/lovable-clone-access.log

# Monitor application logs
pm2 logs lovable-clone --lines 100

# Check Redis performance
redis-cli info stats
```

## 📋 Maintenance Checklist

### Daily Tasks
- [ ] Check application health
- [ ] Review error logs
- [ ] Monitor disk space
- [ ] Check backup status

### Weekly Tasks
- [ ] Update system packages
- [ ] Review performance metrics
- [ ] Clean up old log files
- [ ] Test SSL certificate renewal

### Monthly Tasks
- [ ] Update Node.js/npm if needed
- [ ] Review security updates
- [ ] Optimize database queries
- [ ] Update deployment documentation

---

**LEMP deployment guide maintained by the ChaseWhiteRabbit Infrastructure team**
