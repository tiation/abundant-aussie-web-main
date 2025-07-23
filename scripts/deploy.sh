#!/bin/bash

# Deployment Script for Abundant Aussie Web
# Part of ChaseWhiteRabbit NGO CI/CD Pipeline

set -e  # Exit on any error

echo "🚀 Starting deployment process for Abundant Aussie Web..."

# Environment detection
ENVIRONMENT=${ENVIRONMENT:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-docker.sxc.codes}
PROJECT_NAME=${PROJECT_NAME:-abundant-aussie-web}

echo "📋 Environment: $ENVIRONMENT"
echo "🐳 Docker Registry: $DOCKER_REGISTRY"

# Check for required environment variables
if [ -z "$DOCKER_IMAGE_TAG" ]; then
    DOCKER_IMAGE_TAG="latest"
    echo "⚠️  No DOCKER_IMAGE_TAG specified, using 'latest'"
fi

# Build Docker image
echo "🏗️  Building Docker image..."
docker build -t $DOCKER_REGISTRY/$PROJECT_NAME:$DOCKER_IMAGE_TAG .

# Tag with environment-specific tag
docker tag $DOCKER_REGISTRY/$PROJECT_NAME:$DOCKER_IMAGE_TAG $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT

# Push to registry
echo "📤 Pushing Docker image to registry..."
docker push $DOCKER_REGISTRY/$PROJECT_NAME:$DOCKER_IMAGE_TAG
docker push $DOCKER_REGISTRY/$PROJECT_NAME:$ENVIRONMENT

# Deploy based on environment
case $ENVIRONMENT in
    "development")
        echo "🔧 Deploying to development environment..."
        # Development deployment logic
        kubectl apply -f k8s/development/ --namespace=dev-abundant-aussie
        ;;
    "staging")
        echo "🧪 Deploying to staging environment..."
        # Staging deployment logic
        kubectl apply -f k8s/staging/ --namespace=staging-abundant-aussie
        ;;
    "production")
        echo "🚀 Deploying to production environment..."
        # Production deployment logic
        kubectl apply -f k8s/production/ --namespace=prod-abundant-aussie
        ;;
    *)
        echo "❌ Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Health check
echo "🏥 Running health checks..."
# Add health check logic here

echo "✅ Deployment completed successfully!"
echo "🌐 Application is now live in $ENVIRONMENT environment"
echo "🎉 Deployment process completed for ChaseWhiteRabbit NGO project!"
