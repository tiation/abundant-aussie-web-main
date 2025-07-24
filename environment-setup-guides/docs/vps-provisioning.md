# VPS Provisioning Guide

> **Complete guide for setting up new Hostinger VPS servers with enterprise-grade security** 🏗️

This guide walks through provisioning new VPS instances on Hostinger with Docker, security hardening, and proper configuration for your infrastructure.

## 📋 What This Guide Covers

- **VPS Creation & Initial Setup** - Hostinger control panel to first boot
- **Security Hardening** - SSH keys, firewall, fail2ban
- **Docker Installation** - Container runtime and compose
- **Monitoring Setup** - Integration with existing infrastructure
- **Backup Configuration** - Automated backup strategies

## 🌐 Your Current VPS Infrastructure

| Hostname | IP | IPv6 | OS | Role |
|----------|----|----|----|----|
| docker.sxc.codes | 145.223.22.7 | 2a02:4780:12:3edf::1 | Ubuntu 24.04 with Docker | Primary CI/CD runner |
| docker.tiation.net | 145.223.22.9 | - | Ubuntu 24.04 with Docker | Secondary/staging host |
| gitlab.sxc.codes | 145.223.22.10 | 2a02:4780:12:3ef1::1 | Ubuntu 22.04 with GitLab | CI/CD orchestration |
| grafana.sxc.codes | 153.92.214.1 | 2a02:4780:10:bfb9::1 | Ubuntu 24.04 with Grafana | Observability |
| elastic.sxc.codes | 145.223.22.14 | 2a02:4780:12:3f31::1 | Ubuntu 22.04 with ElasticSearch | Log aggregation |
| supabase.sxc.codes | 93.127.167.157 | 2a02:4780:12:123a::1 | Ubuntu 24.04 with Supabase | Backend as a service |
| ubuntu.sxc.codes | 89.116.191.60 | - | Ubuntu 24.04 LTS | General-purpose |
| helm.sxc.codes | 145.223.21.248 | - | Ubuntu 24.04 LTS | Helm chart hosting |

## 🚀 Step-by-Step VPS Provisioning

### 1. Create New VPS on Hostinger

```bash
# Access Hostinger control panel
# Navigate to VPS section
# Click "Create VPS"

# Recommended Configuration:
# - OS: Ubuntu 24.04 LTS
# - Plan: Minimum 2GB RAM, 2 CPU cores
# - Storage: 50GB+ SSD
# - Location: Choose closest to your users
# - IPv6: Enable if needed
```

### 2. Initial Server Access & Setup

```bash
# SSH into new VPS (replace IP with your new VPS IP)
ssh root@YOUR_NEW_VPS_IP

# Update system packages
apt update && apt upgrade -y

# Set timezone
timedatectl set-timezone UTC

# Configure hostname
hostnamectl set-hostname your-new-hostname.domain.com
echo "127.0.1.1 your-new-hostname.domain.com" >> /etc/hosts
```

### 3. Security Hardening

```bash
# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Configure SSH key authentication
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# Copy your public key (run this from your Mac)
# scp ~/.ssh/hostinger_key.pub root@YOUR_NEW_VPS_IP:/home/deploy/.ssh/authorized_keys

# Set proper permissions
chown -R deploy:deploy /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Configure SSH security
cat >> /etc/ssh/sshd_config << EOF
# Security hardening
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
Port 22
Protocol 2
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy
EOF

# Restart SSH service
systemctl restart sshd

# Install and configure fail2ban
apt install fail2ban -y
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban
```

### 4. Firewall Configuration

```bash
# Install and configure UFW
apt install ufw -y

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow essential services
ufw allow ssh
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# For specific roles, add additional ports:
# Docker/API servers: 
# ufw allow 3000:5000/tcp

# For databases (only if needed externally):
# ufw allow 5432/tcp   # PostgreSQL
# ufw allow 27017/tcp  # MongoDB
# ufw allow 6379/tcp   # Redis

# Enable firewall
ufw --force enable
ufw status verbose
```

### 5. Docker Installation & Configuration

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add deploy user to docker group
usermod -aG docker deploy

# Install Docker Compose
apt install docker-compose-plugin -y

# Configure Docker daemon
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "userland-proxy": false,
  "experimental": false,
  "metrics-addr": "127.0.0.1:9323",
  "features": {
    "buildkit": true
  }
}
EOF

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Verify installation
docker --version
docker compose version
```

### 6. System Monitoring Setup

```bash
# Install system monitoring tools
apt install htop iotop nethogs ncdu tree curl wget jq -y

# Configure log rotation
cat > /etc/logrotate.d/docker-containers << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Install Node Exporter for Prometheus monitoring
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
cp node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/
rm -rf node_exporter-1.7.0.linux-amd64*

# Create systemd service for Node Exporter
cat > /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=deploy
Group=deploy
Type=simple
ExecStart=/usr/local/bin/node_exporter
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable node_exporter
systemctl start node_exporter

# Allow monitoring port (for Grafana)
ufw allow from 153.92.214.1 to any port 9100
```

### 7. Automated Backups Configuration

```bash
# Create backup directory
mkdir -p /opt/backups/{daily,weekly,monthly}

# Create backup script
cat > /opt/backups/backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
HOSTNAME=$(hostname)

# Function to backup Docker volumes
backup_docker_volumes() {
    echo "Backing up Docker volumes..."
    mkdir -p "/opt/backups/daily/docker_volumes_${BACKUP_DATE}"
    
    for volume in $(docker volume ls -q); do
        echo "Backing up volume: $volume"
        docker run --rm -v "${volume}:/volume" -v "/opt/backups/daily/docker_volumes_${BACKUP_DATE}:/backup" \
            ubuntu tar czf "/backup/${volume}.tar.gz" -C /volume .
    done
}

# Function to backup configuration files
backup_configs() {
    echo "Backing up system configurations..."
    tar czf "/opt/backups/daily/configs_${HOSTNAME}_${BACKUP_DATE}.tar.gz" \
        /etc/nginx \
        /etc/docker \
        /etc/ssh/sshd_config \
        /etc/ufw \
        /etc/fail2ban \
        2>/dev/null || true
}

# Function to clean old backups
cleanup_old_backups() {
    echo "Cleaning up old backups..."
    find /opt/backups/daily -name "*.tar.gz" -mtime +7 -delete
    find /opt/backups/weekly -name "*.tar.gz" -mtime +30 -delete
    find /opt/backups/monthly -name "*.tar.gz" -mtime +90 -delete
}

# Run backups
backup_docker_volumes
backup_configs
cleanup_old_backups

echo "Backup completed: $BACKUP_DATE"
EOF

chmod +x /opt/backups/backup.sh

# Create cron job for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/backup.sh >> /var/log/backup.log 2>&1") | crontab -
```

### 8. Email Notifications Setup

```bash
# Install mail utilities
apt install mailutils ssmtp -y

# Configure SSMTP for sending alerts
cat > /etc/ssmtp/ssmtp.conf << EOF
root=tiatheone@protonmail.com
mailhub=smtp.gmail.com:587
UseSTARTTLS=YES
AuthUser=your-email@gmail.com
AuthPass=your-app-password
FromLineOverride=YES
EOF

# Set proper permissions
chmod 640 /etc/ssmtp/ssmtp.conf

# Create alert script
cat > /usr/local/bin/send-alert.sh << 'EOF'
#!/bin/bash
HOSTNAME=$(hostname)
MESSAGE="$1"
SUBJECT="Alert: $HOSTNAME - $2"

echo "$MESSAGE" | mail -s "$SUBJECT" \
    tiatheone@protonmail.com \
    garrett@sxc.codes \
    garrett.dillman@gmail.com
EOF

chmod +x /usr/local/bin/send-alert.sh

# Test email functionality
echo "VPS $HOSTNAME provisioning completed successfully" | \
    /usr/local/bin/send-alert.sh "Provisioning Complete"
```

## 🔧 Post-Provisioning Steps

### 1. Update SSH Configuration on Your Mac

```bash
# Add new VPS to your SSH config
cat >> ~/.ssh/config << EOF

Host your-new-hostname
    HostName YOUR_NEW_VPS_IP
    User deploy
    IdentityFile ~/.ssh/hostinger_key
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
```

### 2. Test Everything

```bash
# Test SSH connection with deploy user
ssh deploy@YOUR_NEW_VPS_IP

# Test Docker
docker run hello-world

# Test firewall
ufw status

# Test monitoring
curl http://localhost:9100/metrics

# Test backup script
sudo /opt/backups/backup.sh
```

### 3. Add to Monitoring & Logging

```bash
# On grafana.sxc.codes, add the new server to Prometheus targets
# On elastic.sxc.codes, configure log collection from the new VPS

# Update your infrastructure documentation
# Add the new VPS to your SSH config and inventory
```

## 📊 VPS Performance Optimization

### System Tuning

```bash
# Optimize system parameters
cat >> /etc/sysctl.conf << EOF
# Network performance
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216

# File system
fs.file-max = 65535
fs.inotify.max_user_watches = 524288

# Docker networking
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
EOF

sysctl -p
```

### Resource Monitoring Script

```bash
cat > /usr/local/bin/resource-monitor.sh << 'EOF'
#!/bin/bash

# Check system resources and alert if thresholds exceeded
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=85

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f"), $3/$2 * 100.0}')
DISK_USAGE=$(df / | awk 'NR==2 {printf("%.0f"), $5}' | sed 's/%//')

HOSTNAME=$(hostname)

if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
    /usr/local/bin/send-alert.sh "High CPU usage: ${CPU_USAGE}%" "High CPU Alert"
fi

if (( MEMORY_USAGE > MEMORY_THRESHOLD )); then
    /usr/local/bin/send-alert.sh "High memory usage: ${MEMORY_USAGE}%" "High Memory Alert"
fi

if (( DISK_USAGE > DISK_THRESHOLD )); then
    /usr/local/bin/send-alert.sh "High disk usage: ${DISK_USAGE}%" "High Disk Usage Alert"
fi
EOF

chmod +x /usr/local/bin/resource-monitor.sh

# Add to cron for hourly checks
(crontab -l 2>/dev/null; echo "0 * * * * /usr/local/bin/resource-monitor.sh") | crontab -
```

## 🎯 Verification Checklist

After provisioning, verify:

- [ ] SSH access with key authentication working
- [ ] Root login disabled
- [ ] Firewall configured and active
- [ ] Docker installed and running
- [ ] Fail2ban active and configured
- [ ] Monitoring agent reporting to Grafana
- [ ] Backup script functional
- [ ] Email alerts working
- [ ] System hardening complete
- [ ] Documentation updated

## 🔗 Next Steps

- **Configure specific services** based on VPS role (Docker, GitLab, Grafana, etc.)
- **Set up domain and SSL certificates** using the [SSL Certificate Guide](ssl-certificates.md)
- **Initialize databases** using the [Database Setup Guide](database-setup.md)
- **Configure monitoring** using the [Monitoring Setup Guide](monitoring-setup.md)

---

> **VPS provisioned and secured?** Continue with service-specific setup guides!
