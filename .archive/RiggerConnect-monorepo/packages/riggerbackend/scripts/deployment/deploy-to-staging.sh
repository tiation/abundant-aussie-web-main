#!/bin/bash
# Deploy to staging environment
# Usage: ./deploy-to-staging.sh
set -e

# Load environment variables
source .env.local

# Build Docker image
DOCKER_IMAGE="rigger-backend:staging"
echo "Building Docker image: $DOCKER_IMAGE"
docker build -t $DOCKER_IMAGE .

# Tag the image for the staging registry
STAGING_REGISTRY="docker-staging-registry.tiation.net"
docker tag $DOCKER_IMAGE $STAGING_REGISTRY/$DOCKER_IMAGE

# Push the image to the staging registry
echo "Pushing image to $STAGING_REGISTRY"
docker push $STAGING_REGISTRY/$DOCKER_IMAGE

# Deploy with Helm
HELM_RELEASE="rigger-backend-staging"
NAMESPACE="staging"

echo "Deploying $HELM_RELEASE to Kubernetes in namespace $NAMESPACE"
helm upgrade --install $HELM_RELEASE ./helm-charts/rigger-backend \
  --namespace $NAMESPACE \
  --set image.repository=$STAGING_REGISTRY/$DOCKER_IMAGE \
  --set image.tag=staging

echo "Deployment to staging completed."

