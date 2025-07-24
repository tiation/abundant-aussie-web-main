# Production Environment Setup

> **Easily transition from staging to a scalable production environment!** 🌟

This guide ensures your production environment is robust and prepared to handle real-traffic demands on `docker.sxc.codes` (145.223.22.7).

## 📋 Set Up Overview

- **High-Availability Docker Environment** - Efficient container orchestration
- **SSL/TLS Encryption** - Properly configured with Let's Encrypt
- **Performance Tuning** - Optimized databases and caching
- **Monitoring and Logging** - Integrated observability and alerting
- **CI/CD Workflows** - Set up for automated deployment

## Infrastructure Details

**Production Server**: docker.sxc.codes
- **IP**: 145.223.22.7
- **OS**: Ubuntu 24.04 with Docker
- **Role**: Primary CI/CD runner and container build host
- **SSL**: Managed Let's Encrypt certificates
- **Monitoring**: Grafana integration for dashboards and alerts
- **Logs**: ELK stack integration

## 🔧 Prerequisites

1. **SSH Access Configured**
   ```bash
   # Test SSH connection
   ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7
   ```

2. **Domain DNS Configuration**
   - Ensure production domain points to 145.223.22.7
   - Confirm DNS settings propagation

3. **CI/CD Prepared**
   - Ensure GitLab CI/CD setup is completed

## 🚀 Deployment Steps

### 1. Ensure VPS Security

- **Update System**:
  ```bash
  ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7
  sudo apt update && sudo apt upgrade -y
  ```

- **Docker Installation**:
  ```bash
  curl -fsSL https://get.docker.com | sh
  sudo systemctl start docker
  sudo systemctl enable docker
  ```

### 2. SSL/TLS Configuration

- **Certbot with Nginx**:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d your-production-domain.com
  sudo certbot renew --dry-run
  ```

### 3. Docker Configuration

- **Service Management**:
  Ensure services are defined in `docker-compose.production.yml` and start:
  ```bash
  docker-compose -f docker-compose.production.yml up -d
  docker-compose -f docker-compose.production.yml ps
  ```

### 4. Monitoring and Logging

- **Grafana Integration**:
  Connect with grafana.sxc.codes for monitoring.

- **Log Management**:
  Ensure log forwarding to elastic.sxc.codes.

### 5. Optimize Performance

- **Nginx Worker Config**:
  Adjust worker connections in `/etc/nginx/nginx.conf`.

- **Database Indexes and Cache**:
  Review indexes for queries, ensure Redis is caching frequently accessed data.

## 🛠️ Troubleshooting

- **SSL Issue Handling**:
  Check nginx error logs if Certbot fails.

- **Service Downtime**:
  Verify services with `docker-compose logs` to identify issues.

## 🎯 Final Pre-Launch Checklist

- [ ] Daily backups configured
- [ ] Health checks for all services
- [ ] Comprehensive alerting configured
- [ ] End-to-end testing complete

> **All set for production?** Maintain this setup for robust application delivery.

