# ==========================================================================
# RiggerBackend - Enterprise-Grade Docker Container
# ChaseWhiteRabbit NGO Initiative
# 
# Multi-stage build for optimized production deployment
# Includes security hardening and performance optimization
# ==========================================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

LABEL maintainer="ChaseWhiteRabbit NGO <tech@chasewhiterabbit.org>"
LABEL version="1.0.0"
LABEL description="RiggerBackend - Core API Services for Blue-Collar Excellence"

# Set working directory
WORKDIR /app

# Install build dependencies (Alpine Linux)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    ca-certificates

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY config/ ./config/ 2>/dev/null || true
COPY migrations/ ./migrations/ 2>/dev/null || true

# Build TypeScript if needed
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

# ---- Production Stage ----
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S rigger -u 1001

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache \
    dumb-init \
    ca-certificates \
    tzdata && \
    rm -rf /var/cache/apk/*

# Copy production files from builder
COPY --from=builder --chown=rigger:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=rigger:nodejs /app/package*.json ./
COPY --from=builder --chown=rigger:nodejs /app/src ./src
COPY --from=builder --chown=rigger:nodejs /app/config ./config 2>/dev/null || true
COPY --from=builder --chown=rigger:nodejs /app/migrations ./migrations 2>/dev/null || true

# Copy additional files if they exist
COPY --chown=rigger:nodejs .env.example ./ 2>/dev/null || true
COPY --chown=rigger:nodejs docs/ ./docs/ 2>/dev/null || true

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV TZ=UTC

# Security hardening
RUN chown -R rigger:nodejs /app && \
    chmod -R 755 /app && \
    chmod -R 644 /app/src

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1) \
    }).on('error', () => process.exit(1))"

# Switch to non-root user
USER rigger

# Expose port
EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]

# ==========================================================================
# Build Instructions:
# 
# Development:
#   docker build -t rigger-backend:dev .
#   docker run -p 3000:3000 --env-file .env rigger-backend:dev
#
# Production:
#   docker build -t rigger-backend:latest .
#   docker run -d -p 3000:3000 --env-file .env.production rigger-backend:latest
#
# Security scan:
#   docker scan rigger-backend:latest
# ==========================================================================
