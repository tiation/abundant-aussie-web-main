#!/bin/bash

# scripts/deploy-dev.sh

echo "🚀 Deploying Rigger Ecosystem - Development"

# Start shared services
docker-compose -f docker-compose.dev.yml up -d postgres redis elasticsearch

# Deploy backend
cd RiggerBackend
npm run build
npm run dev:docker &

# Deploy web applications
cd ../RiggerConnect-web
npm run build
npm run dev:docker &

cd ../RiggerHub-web
npm run build
npm run dev:docker &

echo "✅ Development environment ready!"
echo "Backend: http://localhost:3001"
echo "RiggerConnect: http://localhost:3000"
echo "RiggerHub: http://localhost:3002"

