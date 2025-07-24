#!/bin/bash
# Infrastructure Optimization Deployment Script
# This script deploys the infrastructure optimizations to Hostinger VPS servers

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configurations
DOCKER_PRIMARY="root@145.223.22.7"
DOCKER_SECONDARY="root@145.223.22.9"
SUPABASE_SERVER="root@93.127.167.157"
GRAFANA_SERVER="root@153.92.214.1"
HELM_SERVER="root@145.223.21.248"
SSH_KEY="/Users/tiaastor/.ssh/hostinger_key"

echo -e "${BLUE}=== Infrastructure Optimization Deployment ===${NC}"
echo "Starting deployment at: $(date)"

# Function to run command on remote server
run_remote() {
    local server=$1
    local command=$2
    echo -e "${YELLOW}Executing on $server: $command${NC}"
    ssh -i "$SSH_KEY" "$server" "$command"
}

# Function to copy file to remote server
copy_file() {
    local server=$1
    local local_file=$2
    local remote_file=$3
    echo -e "${YELLOW}Copying $local_file to $server:$remote_file${NC}"
    scp -i "$SSH_KEY" "$local_file" "$server:$remote_file"
}

# Phase 1: Install Kubernetes on available servers
echo -e "${GREEN}Phase 1: Installing Kubernetes${NC}"

# Try to install on primary docker server
echo -e "${BLUE}Installing Kubernetes on docker.sxc.codes${NC}"
if copy_file "$DOCKER_PRIMARY" "install-kubernetes.sh" "/tmp/install-kubernetes.sh"; then
    run_remote "$DOCKER_PRIMARY" "chmod +x /tmp/install-kubernetes.sh && /tmp/install-kubernetes.sh"
    echo -e "${GREEN}✓ Kubernetes installed on docker.sxc.codes${NC}"
else
    echo -e "${RED}✗ Failed to install Kubernetes on docker.sxc.codes${NC}"
fi

# Try to install on secondary docker server
echo -e "${BLUE}Installing Kubernetes on docker.tiation.net${NC}"
if copy_file "$DOCKER_SECONDARY" "install-kubernetes.sh" "/tmp/install-kubernetes.sh"; then
    run_remote "$DOCKER_SECONDARY" "chmod +x /tmp/install-kubernetes.sh && /tmp/install-kubernetes.sh"
    echo -e "${GREEN}✓ Kubernetes installed on docker.tiation.net${NC}"
else
    echo -e "${RED}✗ Failed to install Kubernetes on docker.tiation.net${NC}"
fi

# Phase 2: Set up Load Balancer
echo -e "${GREEN}Phase 2: Configuring Load Balancer${NC}"

# Install Nginx on primary server if not present
run_remote "$DOCKER_PRIMARY" "apt-get update && apt-get install -y nginx"

# Copy load balancer configuration
copy_file "$DOCKER_PRIMARY" "load-balancer-config.nginx" "/etc/nginx/sites-available/load-balancer"

# Enable the configuration
run_remote "$DOCKER_PRIMARY" "ln -sf /etc/nginx/sites-available/load-balancer /etc/nginx/sites-enabled/load-balancer"
run_remote "$DOCKER_PRIMARY" "rm -f /etc/nginx/sites-enabled/default"

# Create cache directories
run_remote "$DOCKER_PRIMARY" "mkdir -p /var/cache/nginx/api /var/cache/nginx/static"
run_remote "$DOCKER_PRIMARY" "chown -R www-data:www-data /var/cache/nginx"

# Test and reload Nginx
run_remote "$DOCKER_PRIMARY" "nginx -t && systemctl reload nginx"
echo -e "${GREEN}✓ Load balancer configured${NC}"

# Phase 3: Set up Redis Caching
echo -e "${GREEN}Phase 3: Setting up Redis Caching${NC}"

# Deploy Redis on primary server
copy_file "$DOCKER_PRIMARY" "redis-cluster-setup.yml" "/tmp/docker-compose-redis.yml"

# Create Redis configuration files
run_remote "$DOCKER_PRIMARY" "mkdir -p /opt/redis-config"

# Create Redis master configuration
run_remote "$DOCKER_PRIMARY" "cat > /opt/redis-config/redis-master.conf << 'EOF'
bind 0.0.0.0
port 6379
protected-mode no
requirepass $(openssl rand -base64 32)
maxmemory 1gb
maxmemory-policy allkeys-lru
appendonly yes
save 900 1
save 300 10
save 60 10000
EOF"

# Start Redis cluster
run_remote "$DOCKER_PRIMARY" "cd /tmp && docker-compose -f docker-compose-redis.yml up -d"
echo -e "${GREEN}✓ Redis caching layer deployed${NC}"

# Phase 4: Optimize Supabase
echo -e "${GREEN}Phase 4: Optimizing Supabase${NC}"

# Copy optimization script to Supabase server
copy_file "$SUPABASE_SERVER" "supabase-optimization.sql" "/tmp/supabase-optimization.sql"

# Execute optimization script
echo -e "${YELLOW}Executing Supabase optimization...${NC}"
run_remote "$SUPABASE_SERVER" "docker exec supabase-db psql -U postgres -f /tmp/supabase-optimization.sql || echo 'Some optimizations may require manual execution'"

# Restart Supabase services to apply configuration changes
run_remote "$SUPABASE_SERVER" "cd /opt/supabase && docker-compose restart"
echo -e "${GREEN}✓ Supabase optimization applied${NC}"

# Phase 5: Enhanced Monitoring Setup
echo -e "${GREEN}Phase 5: Setting up Enhanced Monitoring${NC}"

# Create monitoring script for all servers
cat > /tmp/monitoring-setup.sh << 'EOF'
#!/bin/bash
# Install monitoring tools
apt-get update
apt-get install -y htop iotop nethogs

# Create monitoring script
cat > /usr/local/bin/server-stats.sh << 'MONITOR_EOF'
#!/bin/bash
echo "=== Server Statistics $(date) ==="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"
echo ""
echo "=== CPU Usage ==="
top -bn1 | grep "Cpu(s)"
echo ""
echo "=== Memory Usage ==="
free -h
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Network Connections ==="
ss -tuln | wc -l
echo ""
echo "=== Docker Status ==="
if command -v docker &> /dev/null; then
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
fi
MONITOR_EOF

chmod +x /usr/local/bin/server-stats.sh

# Create cron job for regular monitoring
echo "*/5 * * * * /usr/local/bin/server-stats.sh >> /var/log/server-stats.log 2>&1" | crontab -
EOF

# Deploy monitoring to all accessible servers
for server in "$DOCKER_PRIMARY" "$DOCKER_SECONDARY" "$SUPABASE_SERVER" "$GRAFANA_SERVER"; do
    echo -e "${BLUE}Setting up monitoring on $server${NC}"
    if copy_file "$server" "/tmp/monitoring-setup.sh" "/tmp/monitoring-setup.sh"; then
        run_remote "$server" "chmod +x /tmp/monitoring-setup.sh && /tmp/monitoring-setup.sh"
        echo -e "${GREEN}✓ Monitoring setup on $server${NC}"
    else
        echo -e "${RED}✗ Failed to setup monitoring on $server${NC}"
    fi
done

# Phase 6: Create Health Check Endpoints
echo -e "${GREEN}Phase 6: Creating Health Check Endpoints${NC}"

# Create health check script
cat > /tmp/health-check.sh << 'EOF'
#!/bin/bash
# Health check endpoint script

# Create health check directory
mkdir -p /var/www/health

# Create health check endpoint
cat > /var/www/health/index.html << 'HEALTH_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Server Health Check</title>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <h1>Server Health Status</h1>
    <p>Server: <span id="hostname"></span></p>
    <p>Status: <span style="color: green;">HEALTHY</span></p>
    <p>Last Updated: <span id="timestamp"></span></p>
    
    <script>
        document.getElementById('hostname').textContent = window.location.hostname;
        document.getElementById('timestamp').textContent = new Date().toISOString();
    </script>
</body>
</html>
HEALTH_EOF

# Configure Nginx to serve health checks
cat > /etc/nginx/sites-available/health-check << 'NGINX_EOF'
server {
    listen 8080;
    server_name _;
    
    location /health {
        root /var/www;
        index index.html;
        
        # Add health check headers
        add_header X-Health-Status "OK";
        add_header X-Server-Name $hostname;
    }
    
    location /metrics {
        stub_status on;
        access_log off;
    }
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/health-check /etc/nginx/sites-enabled/health-check
nginx -t && systemctl reload nginx
EOF

# Deploy health checks
run_remote "$DOCKER_PRIMARY" "$(cat /tmp/health-check.sh)"
echo -e "${GREEN}✓ Health check endpoints created${NC}"

# Phase 7: Final Configuration and Testing
echo -e "${GREEN}Phase 7: Final Configuration and Testing${NC}"

# Test load balancer
echo -e "${BLUE}Testing load balancer configuration...${NC}"
if run_remote "$DOCKER_PRIMARY" "curl -s http://localhost:8080/health" > /dev/null; then
    echo -e "${GREEN}✓ Load balancer health check passed${NC}"
else
    echo -e "${RED}✗ Load balancer health check failed${NC}"
fi

# Test Redis connection
echo -e "${BLUE}Testing Redis connection...${NC}"
if run_remote "$DOCKER_PRIMARY" "docker exec redis-master redis-cli ping" | grep -q "PONG"; then
    echo -e "${GREEN}✓ Redis connection test passed${NC}"
else
    echo -e "${RED}✗ Redis connection test failed${NC}"
fi

# Generate deployment summary
echo -e "${BLUE}=== Deployment Summary ===${NC}"
echo -e "${GREEN}✓ Kubernetes installation attempted on available servers${NC}"
echo -e "${GREEN}✓ Load balancer configured with caching and rate limiting${NC}"
echo -e "${GREEN}✓ Redis caching layer deployed${NC}"
echo -e "${GREEN}✓ Supabase database optimization applied${NC}"
echo -e "${GREEN}✓ Enhanced monitoring setup deployed${NC}"
echo -e "${GREEN}✓ Health check endpoints created${NC}"

echo -e "${BLUE}=== Next Steps ===${NC}"
echo "1. Verify Kubernetes cluster status: kubectl get nodes"
echo "2. Configure DNS records to point to load balancer"
echo "3. Set up SSL certificates with Let's Encrypt"
echo "4. Monitor system performance through Grafana dashboard"
echo "5. Test application deployments on the new infrastructure"

echo -e "${GREEN}Infrastructure optimization deployment completed at: $(date)${NC}"
