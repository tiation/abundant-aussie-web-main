# Multi-stage build for RiggerConnect Capacitor App
# Stage 1: Build dependencies
FROM node:18-alpine AS deps

# Add build dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --frozen-lockfile --only=production && npm cache clean --force

# Stage 2: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Install dev dependencies for build
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build the app with optimizations
ENV NODE_ENV=production
RUN npm run build && \
    # Remove source maps in production
    find dist -name '*.map' -delete && \
    # Remove unnecessary files
    rm -rf src && \
    rm -rf node_modules

# Stage 3: Production runtime
FROM nginx:alpine AS runtime

# Install security updates and curl for health checks
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built assets from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY --chown=nextjs:nodejs nginx.conf /etc/nginx/conf.d/default.conf

# Add environment variable support
COPY --chown=nextjs:nodejs docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create directory for runtime environment variables
RUN mkdir -p /usr/share/nginx/html/config && \
    chown -R nextjs:nodejs /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf.orig 2>/dev/null || true

# Expose port
EXPOSE 80

# Enhanced health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Security: Use non-root user
USER nextjs

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
