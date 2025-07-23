# Deployment Guide: docker.tiation.net

**Server Details:**
- Host: docker.tiation.net
- IP: 145.223.22.9
- OS: Ubuntu 24.04 with Docker
- Role: Secondary runner or staging container host

## Prerequisites

### Server Setup
```bash
# SSH into server
ssh -i /Users/tiaastor/.ssh/hostinger_key.pub root@145.223.22.9

# Update system
apt update && apt upgrade -y

# Install additional packages (Docker already installed)
apt install -y docker-compose git curl htop fail2ban ufw nginx-light

# Configure Docker for production
systemctl enable docker
systemctl start docker

# Add Docker daemon configuration for security
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "userland-proxy": false,
  "experimental": false,
  "live-restore": true,
  "icc": false,
  "default-address-pools": [
    {
      "base": "172.30.0.0/16",
      "size": 24
    }
  ]
}
EOF

systemctl restart docker

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 2376/tcp  # Docker daemon (if needed for remote access)
ufw --force enable
```

## Container Registry Setup

### Private Registry (Optional)
```bash
# Create registry directory
mkdir -p /var/lib/registry

# Run private Docker registry
docker run -d \
  --name registry \
  --restart unless-stopped \
  -p 5000:5000 \
  -v /var/lib/registry:/var/lib/registry \
  registry:2

# Test registry
docker tag lovable-clone:latest localhost:5000/lovable-clone:latest
docker push localhost:5000/lovable-clone:latest
```

## Deployment Methods

### Method 1: Staging Environment

#### 1. Staging Setup
```bash
# Create staging directory
mkdir -p /var/www/staging/lovable-clone
cd /var/www/staging/lovable-clone

# Clone repository
git clone -b develop https://github.com/tiation-repos/lovable-clone.git .

# Create staging environment
cat > .env.staging << 'EOF'
NODE_ENV=staging
PORT=3001
NEXT_PUBLIC_API_URL=https://staging.lovable-clone.tiation.net/api
NEXT_PUBLIC_ENVIRONMENT=staging
EOF
```

#### 2. Staging Docker Compose
```bash
cat > docker-compose.staging.yml << 'EOF'
version: '3.8'

services:
  web-staging:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: lovable-clone-staging
    restart: unless-stopped
    ports:
      - "3001:80"
    environment:
      - NODE_ENV=staging
      - NEXT_PUBLIC_API_URL=https://staging.lovable-clone.tiation.net/api
      - NEXT_PUBLIC_ENVIRONMENT=staging
    volumes:
      - staging_logs:/var/log/nginx
    networks:
      - staging-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "com.docker.compose.project=lovable-clone-staging"
      - "traefik.enable=true"
      - "traefik.http.routers.staging.rule=Host(`staging.lovable-clone.tiation.net`)"

  # Traefik reverse proxy
  traefik:
    image: traefik:v2.10
    container_name: traefik-staging
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik:/etc/traefik:ro
      - traefik_certs:/etc/letsencrypt
    networks:
      - staging-network
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=tiatheone@protonmail.com
      - --certificatesresolvers.letsencrypt.acme.storage=/etc/letsencrypt/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web

networks:
  staging-network:
    driver: bridge

volumes:
  staging_logs:
  traefik_certs:
EOF

# Deploy staging
docker-compose -f docker-compose.staging.yml up -d
```

### Method 2: Production with Blue-Green Deployment

#### 1. Blue-Green Setup
```bash
# Create production directory
mkdir -p /var/www/production/lovable-clone/{blue,green}

# Blue environment
cd /var/www/production/lovable-clone/blue
git clone https://github.com/tiation-repos/lovable-clone.git .

# Green environment  
cd /var/www/production/lovable-clone/green
git clone https://github.com/tiation-repos/lovable-clone.git .

# Shared production environment
cat > /var/www/production/lovable-clone/.env.production << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://lovable-clone.tiation.net/api
NEXT_PUBLIC_ENVIRONMENT=production
EOF
```

#### 2. Blue-Green Docker Compose
```bash
cd /var/www/production/lovable-clone

cat > docker-compose.blue-green.yml << 'EOF'
version: '3.8'

services:
  web-blue:
    build:
      context: ./blue
      dockerfile: Dockerfile
    container_name: lovable-clone-blue
    restart: unless-stopped
    ports:
      - "3002:80"
    env_file:
      - .env.production
    volumes:
      - blue_logs:/var/log/nginx
    networks:
      - production-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "deployment.slot=blue"

  web-green:
    build:
      context: ./green  
      dockerfile: Dockerfile
    container_name: lovable-clone-green
    restart: unless-stopped
    ports:
      - "3003:80"
    env_file:
      - .env.production
    volumes:
      - green_logs:/var/log/nginx
    networks:
      - production-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "deployment.slot=green"

  nginx-lb:
    image: nginx:alpine
    container_name: lovable-clone-lb
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - lb_logs:/var/log/nginx
    depends_on:
      - web-blue
      - web-green
    networks:
      - production-network

networks:
  production-network:
    driver: bridge

volumes:
  blue_logs:
  green_logs:
  lb_logs:
EOF
```

#### 3. Load Balancer Configuration
```bash
mkdir -p nginx

cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        # Start with blue active, green as backup
        server web-blue:80 weight=100;
        server web-green:80 weight=0 backup;
    }

    server {
        listen 80;
        server_name lovable-clone.tiation.net docker.tiation.net;
        
        # Health check endpoint
        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }

        # Main application
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Admin endpoint for deployment switches
        location /admin/switch {
            allow 127.0.0.1;
            deny all;
            proxy_pass http://127.0.0.1:9000;
        }
    }
}
EOF
```

## CI/CD Integration

### Method 1: GitHub Actions Integration
```bash
# Create webhook endpoint
mkdir -p /var/www/webhooks

cat > /var/www/webhooks/deploy.php << 'EOF'
<?php
// Webhook for GitHub Actions
$headers = getallheaders();
$payload = file_get_contents('php://input');

// Verify GitHub webhook signature
$signature = 'sha256=' . hash_hmac('sha256', $payload, getenv('GITHUB_WEBHOOK_SECRET'));

if (!hash_equals($signature, $headers['X-Hub-Signature-256'])) {
    http_response_code(401);
    exit('Unauthorized');
}

$data = json_decode($payload, true);

// Trigger deployment based on branch
if ($data['ref'] === 'refs/heads/main') {
    // Production deployment
    exec('/var/www/scripts/deploy-production.sh > /var/log/deploy.log 2>&1 &');
} elseif ($data['ref'] === 'refs/heads/develop') {
    // Staging deployment
    exec('/var/www/scripts/deploy-staging.sh > /var/log/deploy-staging.log 2>&1 &');
}

http_response_code(200);
echo 'Deployment triggered';
?>
EOF
```

### Method 2: Automated Deployment Scripts
```bash
mkdir -p /var/www/scripts

# Production deployment script
cat > /var/www/scripts/deploy-production.sh << 'EOF'
#!/bin/bash
set -e

DEPLOY_DIR="/var/www/production/lovable-clone"
CURRENT_SLOT=$(curl -s http://localhost/admin/current-slot || echo "blue")
NEW_SLOT=$([ "$CURRENT_SLOT" = "blue" ] && echo "green" || echo "blue")

echo "$(date): Starting deployment to $NEW_SLOT slot"

# Update code in inactive slot
cd $DEPLOY_DIR/$NEW_SLOT
git pull origin main

# Build new image
docker-compose -f ../docker-compose.blue-green.yml build web-$NEW_SLOT

# Health check new deployment
echo "Testing $NEW_SLOT deployment..."
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' lovable-clone-$NEW_SLOT)

# Wait for health check
for i in {1..30}; do
    if curl -f http://$CONTAINER_IP:80/health; then
        echo "$NEW_SLOT deployment healthy"
        break
    fi
    echo "Waiting for $NEW_SLOT to be healthy... ($i/30)"
    sleep 10
done

# Switch traffic
echo "Switching traffic to $NEW_SLOT"
/var/www/scripts/switch-slot.sh $NEW_SLOT

echo "$(date): Deployment to $NEW_SLOT completed successfully"
EOF

# Traffic switching script
cat > /var/www/scripts/switch-slot.sh << 'EOF'
#!/bin/bash
NEW_SLOT=$1

# Update nginx upstream configuration
sed -i "s/server web-.*:80 weight=100;/server web-$NEW_SLOT:80 weight=100;/" /var/www/production/lovable-clone/nginx/nginx.conf
sed -i "s/server web-.*:80 weight=0 backup;/server web-$([ "$NEW_SLOT" = "blue" ] && echo "green" || echo "blue"):80 weight=0 backup;/" /var/www/production/lovable-clone/nginx/nginx.conf

# Reload nginx
docker exec lovable-clone-lb nginx -s reload

echo "Traffic switched to $NEW_SLOT"
EOF

chmod +x /var/www/scripts/*.sh
```

## Monitoring and Observability

### Container Metrics with Prometheus
```bash
cat > docker-compose.monitoring.yml << 'EOF'
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - monitoring-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - monitoring-network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    networks:
      - monitoring-network

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring-network

networks:
  monitoring-network:
    driver: bridge

volumes:
  prometheus_data:
  grafana_data:
EOF

# Deploy monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d
```

## Backup and Disaster Recovery

```bash
# Automated backup script
cat > /root/backup-docker-tiation.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups/docker-tiation"

mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/code_$DATE.tar.gz -C /var/www .

# Backup Docker volumes
docker run --rm \
  -v production_blue_logs:/source:ro \
  -v $BACKUP_DIR:/backup \
  busybox tar -czf /backup/volumes_$DATE.tar.gz -C /source .

# Backup Docker images
docker save $(docker images --format "table {{.Repository}}:{{.Tag}}" | grep lovable-clone) | gzip > $BACKUP_DIR/images_$DATE.tar.gz

# Backup configurations
tar -czf $BACKUP_DIR/configs_$DATE.tar.gz /etc/nginx /etc/docker

# Clean old backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /root/backup-docker-tiation.sh

# Schedule backup
echo "0 3 * * * /root/backup-docker-tiation.sh >> /var/log/backup.log 2>&1" | crontab -
```

## Security Hardening

```bash
# Docker security configuration
cat > /etc/docker/seccomp-default.json << 'EOF'
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": ["accept", "accept4", "access", "adjtimex", "alarm", "bind", "brk", "capget", "capset", "chdir", "chmod", "chown", "chroot", "clock_getres", "clock_gettime", "clock_nanosleep", "clone", "close", "connect", "creat", "dup", "dup2", "dup3", "epoll_create", "epoll_create1", "epoll_ctl", "epoll_pwait", "epoll_wait", "eventfd", "eventfd2", "execve", "exit", "exit_group", "faccessat", "fadvise64", "fallocate", "fanotify_mark", "fchdir", "fchmod", "fchmodat", "fchown", "fchownat", "fcntl", "fdatasync", "fgetxattr", "flistxattr", "flock", "fork", "fremovexattr", "fsetxattr", "fstat", "fstatfs", "fsync", "ftruncate", "futex", "getcwd", "getdents", "getdents64", "getegid", "geteuid", "getgid", "getgroups", "getitimer", "getpeername", "getpgid", "getpgrp", "getpid", "getppid", "getpriority", "getrandom", "getresgid", "getresuid", "getrlimit", "getrusage", "getsid", "getsockname", "getsockopt", "gettid", "gettimeofday", "getuid", "getxattr", "inotify_add_watch", "inotify_init", "inotify_init1", "inotify_rm_watch", "ioctl", "ioprio_get", "ioprio_set", "keyctl", "kill", "lgetxattr", "link", "linkat", "listen", "listxattr", "llistxattr", "lremovexattr", "lseek", "lsetxattr", "lstat", "madvise", "memfd_create", "mincore", "mkdir", "mkdirat", "mknod", "mknodat", "mlock", "mlock2", "mlockall", "mmap", "mount", "mprotect", "mq_getsetattr", "mq_notify", "mq_open", "mq_timedreceive", "mq_timedsend", "mq_unlink", "mremap", "msgctl", "msgget", "msgrcv", "msgsnd", "msync", "munlock", "munlockall", "munmap", "nanosleep", "newfstatat", "open", "openat", "pause", "pipe", "pipe2", "poll", "ppoll", "prctl", "pread64", "preadv", "prlimit64", "pselect6", "ptrace", "pwrite64", "pwritev", "read", "readahead", "readlink", "readlinkat", "readv", "recv", "recvfrom", "recvmmsg", "recvmsg", "rename", "renameat", "renameat2", "restart_syscall", "rmdir", "rt_sigaction", "rt_sigpending", "rt_sigprocmask", "rt_sigqueueinfo", "rt_sigreturn", "rt_sigsuspend", "rt_sigtimedwait", "rt_tgsigqueueinfo", "sched_getaffinity", "sched_getattr", "sched_getparam", "sched_get_priority_max", "sched_get_priority_min", "sched_getscheduler", "sched_setaffinity", "sched_setattr", "sched_setparam", "sched_setscheduler", "sched_yield", "seccomp", "select", "semctl", "semget", "semop", "semtimedop", "send", "sendfile", "sendmmsg", "sendmsg", "sendto", "setfsgid", "setfsuid", "setgid", "setgroups", "setitimer", "setpgid", "setpriority", "setregid", "setresgid", "setresuid", "setreuid", "setrlimit", "setsid", "setsockopt", "setuid", "setxattr", "shmat", "shmctl", "shmdt", "shmget", "shutdown", "sigaltstack", "signalfd", "signalfd4", "sigreturn", "socket", "socketcall", "socketpair", "splice", "stat", "statfs", "symlink", "symlinkat", "sync", "sync_file_range", "syncfs", "sysinfo", "tee", "tgkill", "time", "timer_create", "timer_delete", "timer_getoverrun", "timer_gettime", "timer_settime", "timerfd_create", "timerfd_gettime", "timerfd_settime", "times", "tkill", "truncate", "umask", "uname", "unlink", "unlinkat", "utime", "utimensat", "utimes", "vfork", "vmsplice", "wait4", "waitid", "waitpid", "write", "writev"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
EOF

# Update daemon.json to use seccomp
jq '.seccomp-profile = "/etc/docker/seccomp-default.json"' /etc/docker/daemon.json > /tmp/daemon.json && mv /tmp/daemon.json /etc/docker/daemon.json

systemctl restart docker
```

## Performance Tuning

```bash
# Optimize Docker for production
cat >> /etc/docker/daemon.json << 'EOF'
{
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "max-concurrent-downloads": 10,
  "max-concurrent-uploads": 5
}
EOF

# System optimizations
echo 'vm.max_map_count=262144' >> /etc/sysctl.conf
echo 'fs.file-max=2097152' >> /etc/sysctl.conf
echo 'net.core.somaxconn=32768' >> /etc/sysctl.conf

sysctl -p
systemctl restart docker
```

## Troubleshooting and Maintenance

```bash
# Container health monitoring script
cat > /root/health-check.sh << 'EOF'
#!/bin/bash

# Check container health
CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES)

echo "=== Container Health Check ==="
echo "$CONTAINERS"

# Check resource usage
echo -e "\n=== Resource Usage ==="
docker stats --no-stream

# Check logs for errors
echo -e "\n=== Recent Errors ==="
docker logs --since=1h lovable-clone-staging 2>&1 | grep -i error | tail -5

# Disk usage
echo -e "\n=== Disk Usage ==="
df -h | grep -E "(/$|/var)"

# Network connectivity
echo -e "\n=== Network Tests ==="
curl -f http://localhost:3001/health || echo "Staging health check failed"
EOF

chmod +x /root/health-check.sh

# Add to crontab for regular checks
echo "*/15 * * * * /root/health-check.sh >> /var/log/health-check.log 2>&1" | crontab -
```
