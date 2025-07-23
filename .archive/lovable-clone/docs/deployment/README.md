# Deployment Guide

This comprehensive guide covers all deployment options for the Lovable Clone enterprise web application across our Hostinger VPS fleet.

## 🏗️ Deployment Architecture Overview

Our deployment strategy leverages a distributed VPS infrastructure for maximum reliability, scalability, and performance:

```
┌─────────────────────────────────────────────────────────────┐
│                    Hostinger VPS Fleet                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🐳 Docker Hosts        🔧 Traditional        ⚙️ Services   │
│  ├─ docker.sxc.codes   ├─ ubuntu.sxc.codes   ├─ GitLab     │
│  └─ docker.tiation.net └─ LEMP Stack         ├─ Grafana    │
│                                              ├─ Elastic    │
│  🚀 Kubernetes         📊 Monitoring         └─ Supabase   │
│  └─ helm.sxc.codes     ├─ grafana.sxc.codes               │
│                        └─ elastic.sxc.codes               │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 VPS Infrastructure Specifications

### Primary Deployment Hosts

| Hostname | IPv4 | IPv6 | OS | Primary Role |
|----------|------|------|----|-----------| 
| `docker.sxc.codes` | 145.223.22.7 | 2a02:4780:12:3edf::1 | Ubuntu 24.04 + Docker | Primary CI/CD runner |
| `docker.tiation.net` | 145.223.22.9 | - | Ubuntu 24.04 + Docker | Secondary/Staging |
| `ubuntu.sxc.codes` | 89.116.191.60 | - | Ubuntu 24.04 LTS | LEMP Stack |
| `helm.sxc.codes` | 145.223.21.248 | - | Ubuntu 24.04 LTS | Kubernetes Manager |

### Supporting Services

| Hostname | IPv4 | IPv6 | OS | Service Role |
|----------|------|------|----|-----------| 
| `gitlab.sxc.codes` | 145.223.22.10 | 2a02:4780:12:3ef1::1 | Ubuntu 22.04 | CI/CD Orchestration |
| `grafana.sxc.codes` | 153.92.214.1 | 2a02:4780:10:bfb9::1 | Ubuntu 24.04 | Monitoring Dashboard |
| `elastic.sxc.codes` | 145.223.22.14 | 2a02:4780:12:3f31::1 | Ubuntu 22.04 | Log Aggregation |
| `supabase.sxc.codes` | 93.127.167.157 | 2a02:4780:12:123a::1 | Ubuntu 24.04 | Backend Services |

## 🚀 Deployment Methods

### Method 1: Docker Deployment (Recommended)

Docker deployment provides containerization benefits including consistency, scalability, and easy rollbacks.

#### Prerequisites
- Docker and Docker Compose installed
- SSH access to Docker hosts
- Valid SSL certificates (Let's Encrypt recommended)

#### Quick Start

```bash
# Clone the repository
git clone git@github.com:tiation/lovable-clone.git
cd lovable-clone

# Build and deploy to primary Docker host
./scripts/deploy-docker.sh production docker.sxc.codes

# Or deploy to staging
./scripts/deploy-docker.sh staging docker.tiation.net
```

#### Manual Docker Deployment

**Step 1: Connect to Docker Host**
```bash
# Primary host (production)
ssh root@145.223.22.7

# Secondary host (staging)
ssh root@145.223.22.9
```

**Step 2: Prepare Application**
```bash
# Clone the repository
git clone git@github.com:tiation/lovable-clone.git
cd lovable-clone

# Create environment file
cp .env.example .env.production
nano .env.production  # Configure production variables
```

**Step 3: Build and Deploy**
```bash
# Build the Docker image
docker build -t lovable-clone:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker ps
curl -I http://localhost
```

### Method 2: LEMP Stack Deployment

Traditional web server deployment using Linux, Nginx, MySQL, and PHP/Node.js.

#### Prerequisites
- LEMP stack installed on ubuntu.sxc.codes
- Node.js and npm installed
- SSL certificates configured

#### Deployment Steps

**Step 1: Connect to LEMP Host**
```bash
ssh root@89.116.191.60
```

**Step 2: Prepare Application**
```bash
# Navigate to web root
cd /var/www

# Clone repository
git clone git@github.com:tiation/lovable-clone.git
cd lovable-clone

# Install dependencies
npm install

# Build for production
npm run build
```

**Step 3: Configure Nginx**
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/lovable-clone

# Enable the site
ln -s /etc/nginx/sites-available/lovable-clone /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

**Step 4: Setup Process Manager**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### Method 3: Kubernetes with Helm

Enterprise-grade orchestration for high availability and scaling.

#### Prerequisites
- Kubernetes cluster access
- Helm 3.x installed
- kubectl configured

#### Deployment Steps

**Step 1: Connect to Helm Host**
```bash
ssh root@145.223.21.248
```

**Step 2: Deploy with Helm**
```bash
# Add Helm repository (if not already added)
helm repo add lovable-clone ./helm

# Install or upgrade
helm upgrade --install lovable-clone ./helm/lovable-clone \
  --namespace production \
  --create-namespace \
  --values values.production.yaml

# Verify deployment
kubectl get pods -n production
kubectl get services -n production
```

## 🔧 Configuration Management

### Environment Variables

Create appropriate `.env` files for each environment:

```bash
# Production (.env.production)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@supabase.sxc.codes:5432/db
REDIS_URL=redis://docker.sxc.codes:6379
API_BASE_URL=https://api.lovable-clone.com
GRAFANA_ENDPOINT=https://grafana.sxc.codes
ELASTIC_ENDPOINT=https://elastic.sxc.codes:9200

# Staging (.env.staging)
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@supabase.sxc.codes:5432/db_staging
REDIS_URL=redis://docker.tiation.net:6379
API_BASE_URL=https://staging.lovable-clone.com
```

### SSL/TLS Configuration

#### Let's Encrypt Setup
```bash
# Install certbot
apt update && apt install certbot python3-certbot-nginx

# Obtain certificates
certbot --nginx -d lovable-clone.com -d www.lovable-clone.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Observability

### Grafana Dashboard Setup

**Access**: https://grafana.sxc.codes (153.92.214.1)

1. **Application Metrics**
   - Request rate and response times
   - Error rates and status codes
   - Database connection pool metrics
   - Memory and CPU usage

2. **Infrastructure Metrics**
   - Docker container health
   - Nginx performance metrics
   - Database performance
   - Disk and network I/O

### ELK Stack Integration

**Access**: https://elastic.sxc.codes (145.223.22.14)

```bash
# Configure log shipping
# In docker-compose.yml, add logging driver:
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        tag: "lovable-clone-{{.ImageName}}"

# Configure Filebeat to ship logs to Elasticsearch
```

## 🔄 CI/CD Pipeline

### GitLab CI Configuration

**GitLab Host**: https://gitlab.sxc.codes (145.223.22.10)

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy-staging
  - deploy-production

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build:
  stage: build
  script:
    - docker build -t lovable-clone:$CI_COMMIT_SHA .
    - docker tag lovable-clone:$CI_COMMIT_SHA lovable-clone:latest

deploy-staging:
  stage: deploy-staging
  script:
    - ssh root@145.223.22.9 "cd lovable-clone && docker-compose pull && docker-compose up -d"
  only:
    - develop

deploy-production:
  stage: deploy-production
  script:
    - ssh root@145.223.22.7 "cd lovable-clone && docker-compose pull && docker-compose up -d"
  only:
    - main
  when: manual
```

## 🛡️ Security Considerations

### SSH Key Management
```bash
# Use the configured SSH key
ssh-add ~/.ssh/hostinger_key

# Copy key to servers (if needed)
ssh-copy-id -i ~/.ssh/hostinger_key.pub root@145.223.22.7
```

### Firewall Configuration
```bash
# Configure UFW on each server
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3000  # Application port
ufw enable
```

### SSL/TLS Best Practices
- Use TLS 1.2 minimum
- Implement HSTS headers
- Configure secure cipher suites
- Regular certificate renewal

## 🔧 Troubleshooting

### Common Issues

**1. Docker Container Won't Start**
```bash
# Check logs
docker logs lovable-clone

# Check resource usage
docker stats

# Restart container
docker restart lovable-clone
```

**2. Nginx Configuration Issues**
```bash
# Test configuration
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log

# Reload configuration
systemctl reload nginx
```

**3. Database Connection Issues**
```bash
# Test database connectivity
psql -h supabase.sxc.codes -U username -d database_name

# Check connection pool
# Monitor in Grafana dashboard
```

### Performance Issues

**1. High Memory Usage**
```bash
# Check memory usage
free -h
docker stats

# Optimize Node.js memory
export NODE_OPTIONS="--max-old-space-size=2048"
```

**2. Slow Response Times**
```bash
# Check application logs for slow queries
# Monitor in Grafana dashboard
# Optimize database queries
# Implement caching strategies
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] Tests passing
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Database migrations ready
- [ ] Monitoring alerts configured

### During Deployment
- [ ] Create deployment backup
- [ ] Run database migrations
- [ ] Deploy application
- [ ] Verify health checks
- [ ] Check monitoring dashboards
- [ ] Test critical user journeys

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify log aggregation
- [ ] Update documentation
- [ ] Notify stakeholders

## 📞 Support

For deployment support:
- **Infrastructure**: tiatheone@protonmail.com
- **DevOps**: garrett@sxc.codes
- **Emergency**: garrett.dillman@gmail.com

---

**Deployment guides maintained by the ChaseWhiteRabbit DevOps team**
