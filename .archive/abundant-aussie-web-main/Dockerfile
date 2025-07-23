# Multi-stage build for Abundant Aussie Web
# ChaseWhiteRabbit NGO - Enterprise Grade Application

# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json bun.lockb* ./
RUN npm install -g bun && bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set proper permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Labels for metadata
LABEL maintainer="ChaseWhiteRabbit NGO <support@chasewhiterabbit.org>"
LABEL description="Abundant Aussie Web - Enterprise Grade Application"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/ChaseWhiteRabbit/abundant-aussie-web"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
