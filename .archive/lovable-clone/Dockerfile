# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application source
COPY . .

# Run build process
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/ /usr/share/nginx/html/

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nextjs:nodejs /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 80

# Labels for metadata
LABEL org.opencontainers.image.title="Lovable Clone" \
      org.opencontainers.image.description="Enterprise-grade static web application" \
      org.opencontainers.image.vendor="ChaseWhiteRabbit NGO" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
