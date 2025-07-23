#!/bin/sh

# RiggerBackend Startup Script
# Enterprise-grade startup with proper error handling and logging

set -e

echo "🚀 Starting RiggerBackend..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-3000}"
echo "Host: ${HOST:-localhost}"

# Health check function
health_check() {
    echo "⚡ Performing health checks..."
    
    # Check if required environment variables are set
    if [ -z "$DATABASE_URL" ]; then
        echo "⚠️  Warning: DATABASE_URL not set"
    fi
    
    if [ -z "$REDIS_URL" ]; then
        echo "⚠️  Warning: REDIS_URL not set"
    fi
    
    # Check if required directories exist
    if [ ! -d "./dist" ]; then
        echo "❌ Error: dist directory not found"
        exit 1
    fi
    
    echo "✅ Health checks passed"
}

# Database migration function
run_migrations() {
    if [ "$NODE_ENV" = "production" ] && [ "$SKIP_MIGRATIONS" != "true" ]; then
        echo "🔄 Running database migrations..."
        if npm run migrate; then
            echo "✅ Migrations completed successfully"
        else
            echo "❌ Migration failed"
            exit 1
        fi
    else
        echo "⏭️  Skipping migrations (NODE_ENV=${NODE_ENV}, SKIP_MIGRATIONS=${SKIP_MIGRATIONS})"
    fi
}

# Graceful shutdown handler
shutdown() {
    echo "🛑 Received shutdown signal, gracefully shutting down..."
    kill -TERM "$child" 2>/dev/null
    wait "$child"
    echo "✅ RiggerBackend shutdown complete"
    exit 0
}

# Set up signal handlers
trap shutdown TERM INT

# Run startup checks
health_check

# Run migrations if needed
run_migrations

# Start the application
echo "🌟 Starting RiggerBackend server..."

if [ "$NODE_ENV" = "production" ]; then
    # Production: Start with PM2 or direct node
    if command -v pm2 >/dev/null 2>&1; then
        echo "🚀 Starting with PM2..."
        exec pm2-runtime start dist/index.js --name riggerbakend --max-memory-restart 512M
    else
        echo "🚀 Starting with Node.js..."
        exec node dist/index.js
    fi
else
    # Development: Start with nodemon if available
    if command -v nodemon >/dev/null 2>&1 && [ -f "src/index.ts" ]; then
        echo "🔧 Starting with nodemon for development..."
        exec nodemon src/index.ts
    else
        echo "🚀 Starting with Node.js..."
        exec node dist/index.js
    fi
fi &

child=$!
wait "$child"
