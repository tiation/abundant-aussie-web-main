# Multi-stage build for React app
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
COPY packages/riggerconnect/package*.json ./packages/riggerconnect/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci && npm cache clean --force

# Build the application
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build -w riggerconnect

# Production image with nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/packages/riggerconnect/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server { \
    listen 3001; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
