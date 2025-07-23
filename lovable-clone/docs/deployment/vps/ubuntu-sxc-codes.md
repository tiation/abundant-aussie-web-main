# Deployment Guide: ubuntu.sxc.codes

**Server Details:**
- Host: ubuntu.sxc.codes
- IP: 89.116.191.60
- OS: Ubuntu 24.04 LTS
- Role: General-purpose node for scripting, agents, backups

## Prerequisites

### Server Setup
```bash
# SSH into server
ssh -i /Users/tiaastor/.ssh/hostinger_key.pub root@89.116.191.60

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y docker.io docker-compose nginx git curl htop fail2ban ufw

# Enable and start services
systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
```

## Deployment Methods

### Method 1: Direct Docker Deployment

#### 1. Application Setup
```bash
# Create application directory
mkdir -p /var/www/lovable-clone
cd /var/www/lovable-clone

# Clone repository (using HTTPS for server)
git clone https://github.com/tiation-repos/lovable-clone.git .

# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://lovable-clone.sxc.codes/api
EOF
```

#### 2. Docker Build and Run
```bash
# Build production image
docker build -t lovable-clone:latest .

# Run container with production settings
docker run -d \
  --name lovable-clone-prod \
  --restart unless-stopped \
  -p 3000:80 \
  --env-file .env.production \
  lovable-clone:latest

# Verify container is running
docker ps | grep lovable-clone
docker logs lovable-clone-prod
```

#### 3. Nginx Reverse Proxy
```bash
# Create nginx configuration
cat > /etc/nginx/sites-available/lovable-clone << 'EOF'
server {
    listen 80;
    server_name lovable-clone.sxc.codes ubuntu.sxc.codes;

    # Redirect HTTP to HTTPS (optional)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lovable-clone.sxc.codes ubuntu.sxc.codes;

    # SSL configuration (add your certificates)
    # ssl_certificate /etc/letsencrypt/live/lovable-clone.sxc.codes/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/lovable-clone.sxc.codes/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss text/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/lovable-clone /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Method 2: Docker Compose Deployment

#### 1. Create Production Docker Compose
```bash
cd /var/www/lovable-clone

# Create production docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: lovable-clone-prod
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://lovable-clone.sxc.codes/api
    volumes:
      - app_logs:/var/log/nginx
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    labels:
      - "com.docker.compose.project=lovable-clone"
      - "com.docker.compose.service=web"

  # Optional: Add monitoring
  watchtower:
    image: containrrr/watchtower
    container_name: lovable-clone-watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=86400
    command: lovable-clone-prod
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  app_logs:
    driver: local
EOF

# Deploy with compose
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
```

## SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d lovable-clone.sxc.codes -d ubuntu.sxc.codes

# Auto-renewal setup (already included in certbot installation)
# Test renewal
certbot renew --dry-run
```

## Monitoring and Logs

```bash
# Application logs
docker logs -f lovable-clone-prod

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System monitoring
htop
df -h
free -h
systemctl status docker nginx
```

## Backup Strategy

```bash
# Create backup script
cat > /root/backup-lovable-clone.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups/lovable-clone"
APP_DIR="/var/www/lovable-clone"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Backup docker images
docker save lovable-clone:latest | gzip > $BACKUP_DIR/image_$DATE.tar.gz

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /root/backup-lovable-clone.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /root/backup-lovable-clone.sh >> /var/log/backup.log 2>&1" | crontab -
```

## Update and Maintenance

```bash
# Update application
cd /var/www/lovable-clone
git pull origin main
docker build -t lovable-clone:latest .
docker stop lovable-clone-prod
docker rm lovable-clone-prod
docker run -d \
  --name lovable-clone-prod \
  --restart unless-stopped \
  -p 3000:80 \
  --env-file .env.production \
  lovable-clone:latest

# Clean up old images
docker image prune -f
```

## Troubleshooting

### Common Issues
1. **Container won't start**: Check logs with `docker logs lovable-clone-prod`
2. **502 Bad Gateway**: Ensure container is running and port 3000 is accessible
3. **SSL issues**: Verify certificates with `certbot certificates`
4. **High resource usage**: Monitor with `htop` and `docker stats`

### Health Checks
```bash
# Test application health
curl -f http://localhost:3000/health

# Test external access
curl -f https://lovable-clone.sxc.codes/health

# Container health
docker inspect lovable-clone-prod | grep -A 10 Health
```

## Performance Optimization

```bash
# Nginx tuning
cat >> /etc/nginx/nginx.conf << 'EOF'
# Add to http block
client_max_body_size 50M;
client_body_timeout 60s;
client_header_timeout 60s;
keepalive_timeout 65s;
send_timeout 60s;
worker_connections 1024;
worker_processes auto;
EOF

# Restart nginx
systemctl restart nginx
```

## Security Hardening

```bash
# Fail2ban for nginx
cat > /etc/fail2ban/jail.d/nginx.conf << 'EOF'
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 5
EOF

systemctl restart fail2ban
```
