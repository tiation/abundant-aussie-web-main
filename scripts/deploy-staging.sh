#!/bin/bash

# scripts/deploy-staging.sh

echo "🚀 Deploying Rigger Ecosystem - Staging"

# Build and push images
docker build -t rigger/backend:staging ./RiggerBackend
docker build -t rigger/connect-web:staging ./RiggerConnect-web
docker build -t rigger/hub-web:staging ./RiggerHub-web

# Deploy to Kubernetes staging namespace
kubectl apply -f k8s/staging/ -n rigger-staging

# Wait for deployments
kubectl rollout status deployment/rigger-backend -n rigger-staging
kubectl rollout status deployment/rigger-connect-web -n rigger-staging
kubectl rollout status deployment/rigger-hub-web -n rigger-staging

echo "✅ Staging deployment complete!"
