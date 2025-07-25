# Common Deployment Scenarios

This guide provides detailed instructions for various deployment scenarios using the Tiation infrastructure. Each scenario is designed to be enterprise-grade, ethical, and following DevOps best practices.

## Table of Contents

1. [Single VPS with Docker Compose](#single-vps-with-docker-compose)
2. [Multi-VPS Setup](#multi-vps-setup)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [CI/CD Pipeline Examples](#cicd-pipeline-examples)
5. [Environment Variables and Secrets](#environment-variables-and-secrets)
6. [Monitoring and Logging](#monitoring-and-logging)

---

## Single VPS with all services running Docker Compose

### Prerequisites

- Ubuntu 24.04 LTS server
- Docker and Docker Compose installed
- Domain name pointed to your VPS
- SSL certificate (Let's Encrypt recommended)

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p /opt/rigger-platform
cd /opt/rigger-platform
```

### 2. Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Reverse Proxy & SSL
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=tiatheone@protonmail.com
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"

  # Database
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: rigger_platform
      POSTGRES_USER: rigger_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - backend

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - backend

  # Backend API
  rigger-backend:
    image: rigger-backend:latest
    container_name: rigger-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://rigger_user:${DB_PASSWORD}@postgres:5432/rigger_platform
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - backend
      - frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.yourdomain.com`)"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend.loadbalancer.server.port=3000"

  # Frontend Web App
  rigger-web:
    image: rigger-web:latest
    container_name: rigger-web
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    networks:
      - frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`,`www.yourdomain.com`)"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.frontend.loadbalancer.server.port=3000"

  # Worker Hub
  rigger-hub:
    image: rigger-hub:latest
    container_name: rigger-hub
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    networks:
      - frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.hub.rule=Host(`hub.yourdomain.com`)"
      - "traefik.http.routers.hub.tls.certresolver=letsencrypt"
      - "traefik.http.services.hub.loadbalancer.server.port=3000"

volumes:
  postgres_data:
  redis_data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### 3. Environment Configuration

Create `.env` file:

```bash
# Database
DB_PASSWORD=your_secure_db_password_here

# Redis
REDIS_PASSWORD=your_secure_redis_password_here

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Monitoring
GRAFANA_PASSWORD=your_grafana_password_here
```

### 4. Deployment Commands

```bash
# Set correct permissions for acme.json
touch acme.json
chmod 600 acme.json

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services if needed
docker-compose up -d --scale rigger-backend=2

# Update services
docker-compose pull
docker-compose up -d --force-recreate
```

---

## Multi-VPS Setup using docker.sxc.codes for production and docker.tiation.net for staging

### Infrastructure Overview

- **Production**: docker.sxc.codes (145.223.22.7)
- **Staging**: docker.tiation.net (145.223.22.9)
- **Monitoring**: grafana.sxc.codes (153.92.214.1)
- **Logs**: elastic.sxc.codes (145.223.22.14)

### 1. Production Environment (docker.sxc.codes)

SSH into production server:

```bash
ssh root@145.223.22.7
```

#### Production Docker Compose Configuration

Create `/opt/rigger-production/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik-prod
    restart: unless-stopped
    command:
      - --api.dashboard=false  # Disabled in production
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=tiatheone@protonmail.com
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --log.level=WARN
      - --accesslog=true
      - --metrics.prometheus=true
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json
    networks:
      - traefik

  postgres:
    image: postgres:15-alpine
    container_name: postgres-prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: rigger_platform_prod
      POSTGRES_USER: rigger_prod
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    networks:
      - backend
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'

  redis:
    image: redis:7-alpine
    container_name: redis-prod
    restart: unless-stopped
    command: |
      redis-server 
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
    volumes:
      - redis_data:/data
    networks:
      - backend

  rigger-backend:
    image: registry.gitlab.com/chasewhiterabbit/rigger-backend:latest
    container_name: rigger-backend-prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://rigger_prod:${DB_PASSWORD}@postgres-prod:5432/rigger_platform_prod
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis-prod:6379
      - JWT_SECRET=${JWT_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - LOG_LEVEL=warn
    depends_on:
      - postgres
      - redis
    networks:
      - backend
      - traefik
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend-prod.rule=Host(`api.riggerconnect.com`)"
      - "traefik.http.routers.backend-prod.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend-prod.loadbalancer.server.port=3000"
      - "traefik.docker.network=traefik"

  rigger-web:
    image: registry.gitlab.com/chasewhiterabbit/rigger-web:latest
    container_name: rigger-web-prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.riggerconnect.com
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web-prod.rule=Host(`riggerconnect.com`,`www.riggerconnect.com`)"
      - "traefik.http.routers.web-prod.tls.certresolver=letsencrypt"
      - "traefik.http.services.web-prod.loadbalancer.server.port=3000"

volumes:
  postgres_data:
  redis_data:

networks:
  traefik:
    external: true
  backend:
    driver: bridge
```

### 2. Staging Environment (docker.tiation.net)

SSH into staging server:

```bash
ssh root@145.223.22.9
```

Create `/opt/rigger-staging/docker-compose.staging.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik-staging
    restart: unless-stopped
    command:
      - --api.dashboard=true
      - --api.insecure=true  # Only for staging
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=tiatheone@protonmail.com
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --log.level=DEBUG
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/acme.json
    networks:
      - traefik

  postgres:
    image: postgres:15-alpine
    container_name: postgres-staging
    restart: unless-stopped
    environment:
      POSTGRES_DB: rigger_platform_staging
      POSTGRES_USER: rigger_staging
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

  redis:
    image: redis:7-alpine
    container_name: redis-staging
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - backend

  rigger-backend:
    image: registry.gitlab.com/chasewhiterabbit/rigger-backend:staging
    container_name: rigger-backend-staging
    restart: unless-stopped
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=postgresql://rigger_staging:${DB_PASSWORD}@postgres-staging:5432/rigger_platform_staging
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis-staging:6379
      - JWT_SECRET=${JWT_SECRET}
      - SUPABASE_URL=${SUPABASE_STAGING_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_STAGING_ANON_KEY}
      - LOG_LEVEL=debug
    depends_on:
      - postgres
      - redis
    networks:
      - backend
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend-staging.rule=Host(`api-staging.riggerconnect.com`)"
      - "traefik.http.routers.backend-staging.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend-staging.loadbalancer.server.port=3000"

volumes:
  postgres_data:
  redis_data:

networks:
  traefik:
    external: true
  backend:
    driver: bridge
```

### 3. Deployment Scripts

Create deployment script `/opt/deploy.sh`:

```bash
#!/bin/bash

ENVIRONMENT=${1:-staging}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

echo "Deploying to ${ENVIRONMENT} environment..."

# Pull latest images
docker-compose -f ${COMPOSE_FILE} pull

# Stop and recreate containers
docker-compose -f ${COMPOSE_FILE} up -d --force-recreate

# Clean up unused images
docker image prune -f

# Show status
docker-compose -f ${COMPOSE_FILE} ps

echo "Deployment to ${ENVIRONMENT} completed!"
```

---

## Kubernetes on helm.sxc.codes with Helm charts

### Prerequisites

SSH into Kubernetes server:

```bash
ssh root@145.223.21.248
```

### 1. Kubernetes Cluster Setup

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install k3s (lightweight Kubernetes)
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

# Setup kubectl config
mkdir -p ~/.kube
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
```

### 2. Helm Chart Structure

Create Helm chart directory structure:

```bash
mkdir -p /opt/helm-charts/rigger-platform
cd /opt/helm-charts/rigger-platform

# Create chart structure
helm create rigger-platform
```

### 3. Helm Chart Values

Create `values.yaml`:

```yaml
# Global settings
global:
  imageRegistry: "registry.gitlab.com/chasewhiterabbit"
  imagePullSecrets:
    - name: gitlab-registry-secret
  
# Ingress configuration
ingress:
  enabled: true
  className: "traefik"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    traefik.ingress.kubernetes.io/router.middlewares: "default-redirect-https@kubernetescrd"
  hosts:
    - host: api.riggerconnect.com
      paths:
        - path: /
          pathType: Prefix
          service: rigger-backend
    - host: riggerconnect.com
      paths:
        - path: /
          pathType: Prefix
          service: rigger-web
    - host: hub.riggerconnect.com
      paths:
        - path: /
          pathType: Prefix
          service: rigger-hub
  tls:
    - secretName: rigger-platform-tls
      hosts:
        - api.riggerconnect.com
        - riggerconnect.com
        - hub.riggerconnect.com

# Backend service
riggerBackend:
  enabled: true
  image:
    repository: rigger-backend
    tag: "latest"
    pullPolicy: Always
  
  replicaCount: 2
  
  service:
    type: ClusterIP
    port: 3000
  
  resources:
    limits:
      cpu: 500m
      memory: 1Gi
    requests:
      cpu: 250m
      memory: 512Mi
  
  env:
    NODE_ENV: "production"
    LOG_LEVEL: "warn"
  
  secrets:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: rigger-secrets
          key: database-url
    - name: REDIS_URL
      valueFrom:
        secretKeyRef:
          name: rigger-secrets
          key: redis-url
    - name: JWT_SECRET
      valueFrom:
        secretKeyRef:
          name: rigger-secrets
          key: jwt-secret

# Frontend web service
riggerWeb:
  enabled: true
  image:
    repository: rigger-web
    tag: "latest"
    pullPolicy: Always
  
  replicaCount: 2
  
  service:
    type: ClusterIP
    port: 3000
  
  resources:
    limits:
      cpu: 250m
      memory: 512Mi
    requests:
      cpu: 125m
      memory: 256Mi
  
  env:
    NODE_ENV: "production"
    NEXT_PUBLIC_API_URL: "https://api.riggerconnect.com"

# Hub service
riggerHub:
  enabled: true
  image:
    repository: rigger-hub
    tag: "latest"
    pullPolicy: Always
  
  replicaCount: 1
  
  service:
    type: ClusterIP
    port: 3000
  
  resources:
    limits:
      cpu: 250m
      memory: 512Mi
    requests:
      cpu: 125m
      memory: 256Mi

# PostgreSQL database
postgresql:
  enabled: true
  auth:
    postgresPassword: "changeme"
    username: "rigger"
    password: "changeme"
    database: "rigger_platform"
  
  primary:
    persistence:
      enabled: true
      size: 20Gi
      storageClass: "local-path"
    
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 1Gi

# Redis cache
redis:
  enabled: true
  auth:
    enabled: true
    password: "changeme"
  
  master:
    persistence:
      enabled: true
      size: 8Gi
      storageClass: "local-path"
    
    resources:
      limits:
        cpu: 250m
        memory: 512Mi
      requests:
        cpu: 125m
        memory: 256Mi

# Monitoring
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    namespace: monitoring
    labels:
      app: rigger-platform
```

### 4. Environment-Specific Values

Create `values-production.yaml`:

```yaml
# Production overrides
riggerBackend:
  replicaCount: 3
  image:
    tag: "v1.0.0"
  
  resources:
    limits:
      cpu: 1000m
      memory: 2Gi
    requests:
      cpu: 500m
      memory: 1Gi

riggerWeb:
  replicaCount: 3
  image:
    tag: "v1.0.0"

postgresql:
  primary:
    persistence:
      size: 100Gi
    resources:
      limits:
        cpu: 2000m
        memory: 4Gi
      requests:
        cpu: 1000m
        memory: 2Gi

redis:
  master:
    persistence:
      size: 20Gi
```

Create `values-staging.yaml`:

```yaml
# Staging overrides
ingress:
  hosts:
    - host: api-staging.riggerconnect.com
      paths:
        - path: /
          pathType: Prefix
          service: rigger-backend
    - host: staging.riggerconnect.com
      paths:
        - path: /
          pathType: Prefix
          service: rigger-web

riggerBackend:
  image:
    tag: "staging"
  env:
    NODE_ENV: "staging"
    LOG_LEVEL: "debug"

riggerWeb:
  image:
    tag: "staging"
  env:
    NEXT_PUBLIC_API_URL: "https://api-staging.riggerconnect.com"
```

### 5. Deployment Commands

```bash
# Create namespace
kubectl create namespace rigger-platform

# Create secrets
kubectl create secret generic rigger-secrets \
  --from-literal=database-url="postgresql://rigger:secure_password@postgresql:5432/rigger_platform" \
  --from-literal=redis-url="redis://:secure_password@redis-master:6379" \
  --from-literal=jwt-secret="your-jwt-secret-here" \
  --namespace rigger-platform

# Install/upgrade production
helm upgrade --install rigger-platform ./rigger-platform \
  --namespace rigger-platform \
  --values ./rigger-platform/values.yaml \
  --values ./rigger-platform/values-production.yaml

# Install/upgrade staging
helm upgrade --install rigger-platform-staging ./rigger-platform \
  --namespace rigger-staging \
  --values ./rigger-platform/values.yaml \
  --values ./rigger-platform/values-staging.yaml

# Check deployment status
kubectl get pods -n rigger-platform
helm status rigger-platform -n rigger-platform

# Rolling update
helm upgrade rigger-platform ./rigger-platform \
  --namespace rigger-platform \
  --set riggerBackend.image.tag=v1.1.0 \
  --reuse-values
```

---

## CI/CD Pipeline Examples using GitLab

### 1. GitLab CI/CD Configuration

Create `.gitlab-ci.yml` in your repository root:

```yaml
stages:
  - build
  - test
  - security
  - deploy-staging
  - deploy-production

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  REGISTRY: registry.gitlab.com/chasewhiterabbit
  IMAGE_NAME: rigger-backend
  STAGING_HOST: docker.tiation.net
  PRODUCTION_HOST: docker.sxc.codes
  KUBE_HOST: helm.sxc.codes

# Build Stage
build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build -t $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA .
    - docker build -t $REGISTRY/$IMAGE_NAME:latest .
    - docker push $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA
    - docker push $REGISTRY/$IMAGE_NAME:latest
    # Build staging image
    - docker build -t $REGISTRY/$IMAGE_NAME:staging .
    - docker push $REGISTRY/$IMAGE_NAME:staging
  only:
    - main
    - develop

# Test Stage  
test:
  stage: test
  image: node:18-alpine
  cache:
    paths:
      - node_modules/
  before_script:
    - npm ci
  script:
    - npm run test:unit
    - npm run test:integration
    - npm run lint
    - npm run type-check
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: junit.xml
  only:
    - merge_requests
    - main
    - develop

# Security Scanning
security_scan:
  stage: security
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA
  allow_failure: true
  only:
    - main
    - develop

# Deploy to Staging
deploy_staging:
  stage: deploy-staging
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$STAGING_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $STAGING_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - |
      ssh root@$STAGING_HOST << EOF
        cd /opt/rigger-staging
        echo "$STAGING_ENV_FILE" > .env
        docker-compose -f docker-compose.staging.yml pull
        docker-compose -f docker-compose.staging.yml up -d --force-recreate
        docker image prune -f
      EOF
  environment:
    name: staging
    url: https://staging.riggerconnect.com
  only:
    - develop
  when: manual

# Deploy to Production
deploy_production:
  stage: deploy-production
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$PRODUCTION_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $PRODUCTION_HOST >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
  script:
    - |
      ssh root@$PRODUCTION_HOST << EOF
        cd /opt/rigger-production
        echo "$PRODUCTION_ENV_FILE" > .env
        docker-compose -f docker-compose.prod.yml pull
        docker-compose -f docker-compose.prod.yml up -d --force-recreate
        docker image prune -f
        # Health check
        sleep 30
        curl -f https://api.riggerconnect.com/health || exit 1
      EOF
  environment:
    name: production
    url: https://riggerconnect.com
  only:
    - main
  when: manual

# Deploy to Kubernetes
deploy_kubernetes:
  stage: deploy-production
  image: alpine/helm:3.10.0
  before_script:
    - apk add --no-cache openssh-client kubectl
    - eval $(ssh-agent -s)
    - echo "$KUBE_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $KUBE_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh root@$KUBE_HOST << EOF
        export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
        helm upgrade --install rigger-platform /opt/helm-charts/rigger-platform \
          --namespace rigger-platform \
          --set riggerBackend.image.tag=$CI_COMMIT_SHA \
          --set riggerWeb.image.tag=$CI_COMMIT_SHA \
          --reuse-values
        kubectl rollout status deployment/rigger-backend -n rigger-platform
        kubectl rollout status deployment/rigger-web -n rigger-platform
      EOF
  environment:
    name: kubernetes
    url: https://riggerconnect.com
  only:
    - main
  when: manual
```

### 2. GitLab Variables Configuration

Set these variables in GitLab CI/CD settings:

```bash
# Registry credentials (automatically set by GitLab)
CI_REGISTRY_USER
CI_REGISTRY_PASSWORD

# SSH Keys for deployment servers
STAGING_SSH_PRIVATE_KEY
PRODUCTION_SSH_PRIVATE_KEY
KUBE_SSH_PRIVATE_KEY

# Environment files
STAGING_ENV_FILE
PRODUCTION_ENV_FILE

# Notification webhooks
SLACK_WEBHOOK_URL
DISCORD_WEBHOOK_URL
```

### 3. Advanced Pipeline Features

Create `.gitlab-ci-advanced.yml` with additional features:

```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml

stages:
  - build
  - test
  - security
  - review
  - deploy-staging
  - performance
  - deploy-production
  - monitor

# Review Apps
review:
  stage: review
  script:
    - |
      ssh root@$STAGING_HOST << EOF
        cd /opt/rigger-review
        export COMPOSE_PROJECT_NAME=review-$CI_MERGE_REQUEST_IID
        docker-compose -f docker-compose.review.yml up -d
      EOF
  environment:
    name: review/$CI_COMMIT_REF_NAME
    url: https://review-$CI_MERGE_REQUEST_IID.riggerconnect.com
    on_stop: stop_review
  only:
    - merge_requests

stop_review:
  stage: review
  script:
    - |
      ssh root@$STAGING_HOST << EOF
        cd /opt/rigger-review
        export COMPOSE_PROJECT_NAME=review-$CI_MERGE_REQUEST_IID
        docker-compose -f docker-compose.review.yml down -v
      EOF
  environment:
    name: review/$CI_COMMIT_REF_NAME
    action: stop
  when: manual
  only:
    - merge_requests

# Performance Testing
performance:
  stage: performance
  image: sitespeedio/sitespeed.io
  script:
    - sitespeed.io --budget budget.json https://staging.riggerconnect.com
  artifacts:
    paths:
      - sitespeed-result/
    expire_in: 1 week
  only:
    - develop

# Notification
notify_success:
  stage: monitor
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - |
      curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ Deployment successful: $CI_PROJECT_NAME v$CI_COMMIT_SHA deployed to production\"}" \
        $SLACK_WEBHOOK_URL
  only:
    - main
  when: on_success

notify_failure:
  stage: monitor
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - |
      curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"❌ Deployment failed: $CI_PROJECT_NAME v$CI_COMMIT_SHA failed to deploy\"}" \
        $SLACK_WEBHOOK_URL
  only:
    - main
  when: on_failure
```

---

## Environment Variables and Secrets

### 1. Environment Variables Management

Create `env-template.sh`:

```bash
#!/bin/bash

# Generate secure environment files
generate_env() {
    local environment=$1
    local env_file=".env.${environment}"
    
    echo "# Generated environment file for ${environment}" > $env_file
    echo "NODE_ENV=${environment}" >> $env_file
    echo "" >> $env_file
    
    # Database
    echo "# Database Configuration" >> $env_file
    echo "DB_PASSWORD=$(openssl rand -base64 32)" >> $env_file
    echo "DATABASE_URL=postgresql://rigger_${environment}:\${DB_PASSWORD}@postgres:5432/rigger_platform_${environment}" >> $env_file
    echo "" >> $env_file
    
    # Redis
    echo "# Redis Configuration" >> $env_file
    echo "REDIS_PASSWORD=$(openssl rand -base64 32)" >> $env_file
    echo "REDIS_URL=redis://:\${REDIS_PASSWORD}@redis:6379" >> $env_file
    echo "" >> $env_file
    
    # JWT
    echo "# JWT Configuration" >> $env_file
    echo "JWT_SECRET=$(openssl rand -base64 64)" >> $env_file
    echo "JWT_EXPIRES_IN=7d" >> $env_file
    echo "" >> $env_file
    
    # Supabase
    echo "# Supabase Configuration" >> $env_file
    echo "SUPABASE_URL=https://your-${environment}-project.supabase.co" >> $env_file
    echo "SUPABASE_ANON_KEY=your_supabase_anon_key_here" >> $env_file
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here" >> $env_file
    echo "" >> $env_file
    
    # Monitoring
    echo "# Monitoring Configuration" >> $env_file
    echo "GRAFANA_URL=https://grafana.sxc.codes" >> $env_file
    echo "ELASTICSEARCH_URL=https://elastic.sxc.codes" >> $env_file
    echo "" >> $env_file
    
    # Email
    echo "# Email Configuration" >> $env_file
    echo "SMTP_HOST=smtp.gmail.com" >> $env_file
    echo "SMTP_PORT=587" >> $env_file
    echo "SMTP_USER=noreply@riggerconnect.com" >> $env_file
    echo "SMTP_PASSWORD=your_smtp_password_here" >> $env_file
    echo "" >> $env_file
    
    # API Keys
    echo "# External API Keys" >> $env_file
    echo "GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here" >> $env_file
    echo "STRIPE_SECRET_KEY=your_stripe_secret_key_here" >> $env_file
    echo "STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here" >> $env_file
    
    chmod 600 $env_file
    echo "Environment file created: $env_file"
}

# Generate for all environments
generate_env "development"
generate_env "staging"
generate_env "production"
```

### 2. Kubernetes Secrets Management

Create `k8s-secrets.sh`:

```bash
#!/bin/bash

# Create Kubernetes secrets
create_k8s_secrets() {
    local namespace=$1
    local environment=$2
    
    kubectl create namespace $namespace --dry-run=client -o yaml | kubectl apply -f -
    
    # Database secrets
    kubectl create secret generic database-secrets \
        --from-literal=host="postgresql.${namespace}.svc.cluster.local" \
        --from-literal=port="5432" \
        --from-literal=database="rigger_platform_${environment}" \
        --from-literal=username="rigger_${environment}" \
        --from-literal=password="$(openssl rand -base64 32)" \
        --namespace=$namespace \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Redis secrets
    kubectl create secret generic redis-secrets \
        --from-literal=host="redis-master.${namespace}.svc.cluster.local" \
        --from-literal=port="6379" \
        --from-literal=password="$(openssl rand -base64 32)" \
        --namespace=$namespace \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Application secrets
    kubectl create secret generic app-secrets \
        --from-literal=jwt-secret="$(openssl rand -base64 64)" \
        --from-literal=supabase-url="https://your-${environment}-project.supabase.co" \
        --from-literal=supabase-anon-key="your_supabase_anon_key_here" \
        --from-literal=supabase-service-role-key="your_supabase_service_role_key_here" \
        --namespace=$namespace \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Image pull secrets
    kubectl create secret docker-registry gitlab-registry-secret \
        --docker-server=registry.gitlab.com \
        --docker-username=$GITLAB_USERNAME \
        --docker-password=$GITLAB_TOKEN \
        --namespace=$namespace \
        --dry-run=client -o yaml | kubectl apply -f -
}

# Create secrets for all environments
create_k8s_secrets "rigger-production" "production"
create_k8s_secrets "rigger-staging" "staging"
```

---

## Monitoring and Logging

### 1. Grafana Dashboard Setup

Connect to Grafana server:

```bash
ssh root@153.92.214.1
```

Create Grafana configuration:

```yaml
# docker-compose-monitoring.yml
version: '3.8'

services:
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SMTP_ENABLED=true
      - GF_SMTP_HOST=smtp.gmail.com:587
      - GF_SMTP_USER=alerts@riggerconnect.com
      - GF_SMTP_PASSWORD=${SMTP_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./dashboards:/var/lib/grafana/dashboards
      - ./provisioning:/etc/grafana/provisioning
    networks:
      - monitoring

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - monitoring

volumes:
  grafana_data:
  prometheus_data:

networks:
  monitoring:
    driver: bridge
```

### 2. ELK Stack Setup

Connect to Elasticsearch server:

```bash
ssh root@145.223.22.14
```

Create ELK configuration:

```yaml
# docker-compose-elk.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    container_name: elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    container_name: logstash
    restart: unless-stopped
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
    environment:
      LS_JAVA_OPTS: "-Xmx512m -Xms512m"
    networks:
      - elk
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    container_name: kibana
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    networks:
      - elk
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:

networks:
  elk:
    driver: bridge
```

---

## Maintenance and Backup Scripts

### 1. Automated Backup Script

Create `/opt/scripts/backup.sh`:

```bash
#!/bin/bash

# Automated backup script for Rigger Platform
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Database backup
backup_database() {
    local environment=$1
    local container_name="postgres-${environment}"
    
    echo "Backing up database for ${environment}..."
    
    docker exec $container_name pg_dump -U rigger_${environment} rigger_platform_${environment} > \
        "${BACKUP_DIR}/db_${environment}_${DATE}.sql"
    
    # Compress backup
    gzip "${BACKUP_DIR}/db_${environment}_${DATE}.sql"
    
    echo "Database backup completed: db_${environment}_${DATE}.sql.gz"
}

# Volume backup
backup_volumes() {
    local environment=$1
    
    echo "Backing up volumes for ${environment}..."
    
    # Create volume backup
    docker run --rm -v rigger-${environment}_postgres_data:/data -v ${BACKUP_DIR}:/backup \
        alpine tar czf /backup/volumes_${environment}_${DATE}.tar.gz -C /data .
    
    echo "Volume backup completed: volumes_${environment}_${DATE}.tar.gz"
}

# Configuration backup
backup_configs() {
    local environment=$1
    
    echo "Backing up configurations for ${environment}..."
    
    tar czf "${BACKUP_DIR}/configs_${environment}_${DATE}.tar.gz" \
        "/opt/rigger-${environment}/"
    
    echo "Configuration backup completed: configs_${environment}_${DATE}.tar.gz"
}

# Cleanup old backups
cleanup_old_backups() {
    echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find $BACKUP_DIR -name "*.gz" -type f -mtime +$RETENTION_DAYS -delete
    echo "Cleanup completed"
}

# Upload to remote storage (optional)
upload_to_remote() {
    local backup_file=$1
    
    # Upload to S3, Google Cloud, or other remote storage
    # aws s3 cp $backup_file s3://rigger-backups/$(basename $backup_file)
    
    echo "Remote upload completed for $(basename $backup_file)"
}

# Main execution
main() {
    local environment=${1:-production}
    
    mkdir -p $BACKUP_DIR
    
    backup_database $environment
    backup_volumes $environment  
    backup_configs $environment
    cleanup_old_backups
    
    # Send notification
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ Backup completed for ${environment} environment\"}" \
        $SLACK_WEBHOOK_URL
    
    echo "Backup process completed for ${environment}"
}

# Execute main function
main $@
```

### 2. Health Check Script

Create `/opt/scripts/health-check.sh`:

```bash
#!/bin/bash

# Health check script for Rigger Platform
check_service_health() {
    local service_name=$1
    local health_endpoint=$2
    local expected_status=${3:-200}
    
    echo "Checking health for ${service_name}..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$health_endpoint")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo "✅ ${service_name} is healthy (HTTP ${response})"
        return 0
    else
        echo "❌ ${service_name} is unhealthy (HTTP ${response})"
        return 1
    fi
}

# Check database connectivity
check_database() {
    local environment=$1
    local container_name="postgres-${environment}"
    
    echo "Checking database connectivity for ${environment}..."
    
    if docker exec $container_name pg_isready -U rigger_${environment} >/dev/null 2>&1; then
        echo "✅ Database is healthy"
        return 0
    else
        echo "❌ Database is unhealthy"
        return 1
    fi
}

# Check Redis connectivity
check_redis() {
    local environment=$1
    local container_name="redis-${environment}"
    
    echo "Checking Redis connectivity for ${environment}..."
    
    if docker exec $container_name redis-cli ping | grep -q "PONG"; then
        echo "✅ Redis is healthy"
        return 0
    else
        echo "❌ Redis is unhealthy"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    echo "Checking disk space..."
    
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 85 ]; then
        echo "✅ Disk space is healthy (${usage}% used)"
        return 0
    else
        echo "⚠️ Disk space warning (${usage}% used)"
        return 1
    fi
}

# Main health check
main() {
    local environment=${1:-production}
    local failed_checks=0
    
    echo "Starting health check for ${environment} environment..."
    echo "=========================================="
    
    # Service health checks
    check_service_health "Backend API" "https://api.riggerconnect.com/health" || ((failed_checks++))
    check_service_health "Frontend Web" "https://riggerconnect.com" || ((failed_checks++))
    check_service_health "Worker Hub" "https://hub.riggerconnect.com" || ((failed_checks++))
    
    # Infrastructure checks
    check_database $environment || ((failed_checks++))
    check_redis $environment || ((failed_checks++))
    check_disk_space || ((failed_checks++))
    
    echo "=========================================="
    
    if [ $failed_checks -eq 0 ]; then
        echo "✅ All health checks passed!"
        
        # Send success notification
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ Health check passed for ${environment} environment\"}" \
            $SLACK_WEBHOOK_URL
        
        exit 0
    else
        echo "❌ ${failed_checks} health check(s) failed!"
        
        # Send failure notification
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"❌ Health check failed for ${environment} environment - ${failed_checks} issues detected\"}" \
            $SLACK_WEBHOOK_URL
        
        exit 1
    fi
}

# Execute main function
main $@
```

### 3. Cron Jobs Setup

Add to crontab (`crontab -e`):

```bash
# Rigger Platform Maintenance Jobs

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup.sh production >> /var/log/backup.log 2>&1

# Hourly health checks
0 * * * * /opt/scripts/health-check.sh production >> /var/log/health-check.log 2>&1

# Weekly cleanup of Docker images
0 3 * * 0 docker system prune -f >> /var/log/docker-cleanup.log 2>&1

# Daily log rotation
0 4 * * * docker-compose -f /opt/rigger-production/docker-compose.prod.yml logs --tail=1000 > /var/log/application.log && docker-compose -f /opt/rigger-production/docker-compose.prod.yml logs --tail=0 -f >> /var/log/application.log &
```

---

This comprehensive deployment guide covers all major scenarios for the Rigger platform deployment using your VPS infrastructure. Each section provides production-ready configurations with proper security, monitoring, and maintenance procedures.

<citations>
<document>
<document_type>RULE</document_type>
<document_id>1qLDN127vaPUoeLkjjjW48</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>9l90dfmYtqP1wWNHeqmb5F</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>TLfD0SQfuwLaG50afOqhTr</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>RTFQs0ZQfRawqGJFADKPuo</document_id>
</document>
<document>
<document_type>RULE</document_type>
<document_id>V5EFLR4twkCwA6GInUtsmB</document_id>
</document>
</citations>
