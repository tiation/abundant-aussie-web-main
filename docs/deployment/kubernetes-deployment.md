# Kubernetes Deployment Guide

## Overview

This document provides detailed instructions for deploying the Rigger Platform on Kubernetes infrastructure hosted on `helm.sxc.codes` (145.223.21.248).

## Prerequisites

- Kubernetes cluster access
- Helm 3.x installed
- Docker images built and pushed to `docker.sxc.codes`
- kubectl configured for cluster access

## Infrastructure Setup

### Hostinger VPS Servers

| Server | IP Address | Role | OS |
|--------|------------|------|-----|
| helm.sxc.codes | 145.223.21.248 | Kubernetes cluster | Ubuntu 24.04 LTS |
| docker.sxc.codes | 145.223.22.7 | Container registry | Ubuntu 24.04 with Docker |
| gitlab.sxc.codes | 145.223.22.10 | CI/CD pipeline | Ubuntu 22.04 with GitLab |
| grafana.sxc.codes | 153.92.214.1 | Monitoring | Ubuntu 24.04 with Grafana |
| elastic.sxc.codes | 145.223.22.14 | Log aggregation | Ubuntu 22.04 with ElasticSearch |
| supabase.sxc.codes | 93.127.167.157 | Database services | Ubuntu 24.04 with Supabase |

## Deployment Steps

### 1. Namespace Creation

```bash
kubectl create namespace rigger-production
kubectl create namespace rigger-staging
kubectl create namespace rigger-development
```

### 2. Secrets Configuration

```bash
# Database credentials
kubectl create secret generic database-credentials \
  --from-literal=username=rigger_user \
  --from-literal=password=secure_password \
  --from-literal=host=supabase.sxc.codes \
  --namespace=rigger-production

# Docker registry credentials
kubectl create secret docker-registry docker-registry-secret \
  --docker-server=docker.sxc.codes \
  --docker-username=registry_user \
  --docker-password=registry_password \
  --namespace=rigger-production
```

### 3. Helm Deployment

```bash
# Add Helm repository
helm repo add rigger-charts https://helm.sxc.codes/rigger

# Deploy RiggerBackend
helm upgrade --install rigger-backend rigger-charts/rigger-backend \
  --namespace rigger-production \
  --values values-prod.yaml \
  --set image.tag=v1.0.0

# Deploy RiggerConnect Web
helm upgrade --install rigger-web rigger-charts/rigger-web \
  --namespace rigger-production \
  --values values-prod.yaml \
  --set image.tag=v1.0.0

# Deploy RiggerHub Web
helm upgrade --install rigger-hub rigger-charts/rigger-hub \
  --namespace rigger-production \
  --values values-prod.yaml \
  --set image.tag=v1.0.0
```

## Configuration Files

### values-prod.yaml

```yaml
global:
  environment: production
  domain: riggerconnect.com
  registry: docker.sxc.codes

riggerBackend:
  image:
    repository: docker.sxc.codes/rigger-backend
    tag: "v1.0.0"
    pullPolicy: IfNotPresent
  
  replicas: 3
  
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 4Gi
  
  service:
    type: ClusterIP
    port: 3000
  
  ingress:
    enabled: true
    hostname: api.riggerconnect.com
    tls: true
  
  env:
    NODE_ENV: production
    DATABASE_URL: postgresql://user:pass@supabase.sxc.codes/rigger_prod
    REDIS_URL: redis://redis-service:6379
    
  monitoring:
    enabled: true
    serviceMonitor: true

riggerWeb:
  image:
    repository: docker.sxc.codes/rigger-web
    tag: "v1.0.0"
  
  replicas: 2
  
  service:
    type: ClusterIP
    port: 80
  
  ingress:
    enabled: true
    hostname: connect.riggerconnect.com
    tls: true

riggerHub:
  image:
    repository: docker.sxc.codes/rigger-hub
    tag: "v1.0.0"
  
  replicas: 2
  
  service:
    type: ClusterIP
    port: 80
  
  ingress:
    enabled: true
    hostname: hub.riggerconnect.com
    tls: true
```

## Monitoring and Health Checks

### Health Check Endpoints

- **Backend Health**: `https://api.riggerconnect.com/health`
- **Web Health**: `https://connect.riggerconnect.com/health`
- **Hub Health**: `https://hub.riggerconnect.com/health`

### Monitoring Commands

```bash
# Check deployment status
kubectl get deployments -n rigger-production

# View pod logs
kubectl logs -f deployment/rigger-backend -n rigger-production

# Check service endpoints
kubectl get services -n rigger-production

# Monitor resource usage
kubectl top pods -n rigger-production
```

## Scaling Operations

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: rigger-backend-hpa
  namespace: rigger-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: rigger-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment rigger-backend --replicas=5 -n rigger-production

# Scale web frontend
kubectl scale deployment rigger-web --replicas=3 -n rigger-production
```

## Troubleshooting

### Common Issues

1. **Pod Startup Failures**
   ```bash
   kubectl describe pod <pod-name> -n rigger-production
   kubectl logs <pod-name> -n rigger-production
   ```

2. **Database Connection Issues**
   ```bash
   kubectl exec -it <backend-pod> -n rigger-production -- ping supabase.sxc.codes
   ```

3. **Image Pull Errors**
   ```bash
   kubectl get events -n rigger-production --sort-by='.lastTimestamp'
   ```

### Recovery Procedures

```bash
# Rollback deployment
helm rollback rigger-backend 1 -n rigger-production

# Restart deployment
kubectl rollout restart deployment/rigger-backend -n rigger-production

# Check rollout status
kubectl rollout status deployment/rigger-backend -n rigger-production
```

## Security Considerations

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: rigger-backend-network-policy
  namespace: rigger-production
spec:
  podSelector:
    matchLabels:
      app: rigger-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
  - to: []
    ports:
    - protocol: TCP
      port: 5432  # PostgreSQL
    - protocol: TCP
      port: 6379  # Redis
```

### Pod Security Standards

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: rigger-backend
  namespace: rigger-production
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: backend
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

## Maintenance

### Backup Procedures

```bash
# Database backup
kubectl exec -it postgres-pod -n rigger-production -- \
  pg_dump -U postgres rigger_prod > backup-$(date +%Y%m%d).sql

# Configuration backup
helm get values rigger-backend -n rigger-production > rigger-backend-values-backup.yaml
```

### Update Procedures

```bash
# Update application
helm upgrade rigger-backend rigger-charts/rigger-backend \
  --namespace rigger-production \
  --set image.tag=v1.1.0 \
  --reuse-values

# Update Kubernetes cluster
# (Follow Kubernetes cluster upgrade procedures)
```

## Performance Optimization

### Resource Tuning

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi

# JVM tuning for Node.js
env:
- name: NODE_OPTIONS
  value: "--max-old-space-size=3072"
```

### Database Optimization

```sql
-- PostgreSQL optimization
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_jobs_created_at ON jobs(created_at);
CREATE INDEX CONCURRENTLY idx_applications_status ON applications(status);
```

---

**Maintained by**: ChaseWhiteRabbit NGO DevOps Team  
**Last Updated**: 2024  
**Next Review**: Monthly
