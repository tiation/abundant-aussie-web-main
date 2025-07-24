# Staging Environment Setup

> **Pre-production environment matching production with enterprise-grade security** 🔒

This guide sets up a comprehensive staging environment on `docker.tiation.net` (145.223.22.9) that mirrors your production setup for thorough testing before deployment.

## 📋 What You'll Set Up

- **Secure VPS Configuration** - Ubuntu 24.04 with Docker
- **SSL/TLS Encryption** - Let's Encrypt with auto-renewal
- **Database Stack** - PostgreSQL, MongoDB, Redis with persistence
- **Reverse Proxy** - Nginx with security headers
- **Monitoring Integration** - Connected to grafana.sxc.codes
- **Log Aggregation** - Forwarding to elastic.sxc.codes
- **Email Alerts** - Critical issue notifications

## 🏗️ Infrastructure Overview

**Staging Server**: docker.tiation.net
- **IP**: 145.223.22.9
- **OS**: Ubuntu 24.04 with Docker
- **Role**: Secondary runner or staging container host
- **SSL**: Let's Encrypt certificates
- **Monitoring**: Grafana integration
- **Logs**: ELK stack integration

## 🔧 Prerequisites

Before starting:

1. **SSH Access Configured**
   ```bash
   # Test SSH connection
   ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.9
   ```

2. **Domain DNS Configuration**
   - Point your staging domain to 145.223.22.9
   - Ensure DNS propagation is complete

3. **Email Alerts Ready**
   - tiatheone@protonmail.com
   - garrett@sxc.codes
   - garrett.dillman@gmail.com

## 🚀 Setup Steps

### 1. Provision Staging VPS

```bash
# SSH into Hostinger VPS
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.9

# Update and upgrade VPS
sudo apt update && sudo apt upgrade -y

# Install Docker components
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# Confirm Docker installation
docker --version
docker-compose --version
```

### 2. Configure Firewall

```bash
# Allow basic services
ufw allow OpenSSH
ufw allow http
ufw allow https

# Deny all other routes
echo "y" | ufw enable
ufw status
```

### 3. Setup Dockerized Environment

```bash
# Create project structure
mkdir -p /srv/staging/{databases,services,configs,logs,scripts}
cd /srv/staging

# Copy docker-compose file
scp -i ~/.ssh/hostinger_key.pub /Users/tiaastor/Github/tiation-repos/environment-setup-guides/local/docker-compose.dev.yml root@145.223.22.9:/srv/staging/docker-compose.staging.yml

# Create necessary directories for data
mkdir -p databases/postgres-init
mkdir -p databases/mongo-init
mkdir -p configs/nginx
mkdir -p configs/env-templates
...

# Optional: Copy initial data if needed
# scp -i ~/.ssh/hostinger_key.pub /path/to/local/data root@145.223.22.9:/srv/staging/databases
```

### 4. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-staging-domain.com
# Follow prompts to obtain the certificate

# Verify renewal process
sudo certbot renew --dry-run
```

### 5. Initialize Databases

```bash
# PostgreSQL setup
cat > databases/postgres-init/create-multiple-dbs.sh << 'EOF'
...
EOF
sudo chmod +x databases/postgres-init/create-multiple-dbs.sh

# MongoDB setup
cat > databases/mongo-init/create-users.js << 'EOF'
...
EOF
```

### 6. Start Services

```bash
# Start the environment
docker-compose -f docker-compose.staging.yml up -d

# Check service status
docker-compose -f docker-compose.staging.yml ps
```

## 🛠️ Monitoring & Alerts

Set up basic alerts so you're notified of any issues:

- **Email Alerts**: Ensure servers send alerts to:
  - tiatheone@protonmail.com
  - garrett@sxc.codes
  - garrett.dillman@gmail.com

- **Graphical Monitoring**: Use grafana.sxc.codes for dashboards.

## 🔧 Troubleshooting

**Failed to generate SSL certificate**

Ensure domain DNS is correctly pointed to VPS. Check /etc/nginx logs for errors.

**Docker services aren’t running**

Verify Docker is running with `sudo systemctl status docker`. Check log files in `/srv/staging/logs`.

## 🎯 Next Steps

Ready to move to production? Transition smoothly by following the [Production Environment Setup Guide](../production/README.md).

