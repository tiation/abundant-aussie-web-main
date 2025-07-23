#!/bin/bash

# Set essential environment variables for Vercel deployment
echo "Setting up environment variables for Abundant Aussie Web..."

# Basic app configuration
echo "Abundant Aussie Web" | vercel env add VITE_APP_NAME production
echo "1.0.0" | vercel env add VITE_APP_VERSION production
echo "https://api.sxc.codes" | vercel env add VITE_API_BASE_URL production

# NGO configuration
echo "ChaseWhiteRabbit" | vercel env add VITE_NGO_NAME production
echo "https://chasewhiterabbit.org" | vercel env add VITE_NGO_WEBSITE production
echo "support@chasewhiterabbit.org" | vercel env add VITE_NGO_EMAIL production

# Feature flags
echo "false" | vercel env add VITE_ENABLE_DEBUG production
echo "true" | vercel env add VITE_ENABLE_ANALYTICS production
echo "true" | vercel env add VITE_ENABLE_ERROR_REPORTING production

# API configuration
echo "10000" | vercel env add VITE_API_TIMEOUT production
echo "3" | vercel env add VITE_API_RETRY_ATTEMPTS production

# Social links
echo "https://github.com/ChaseWhiteRabbit" | vercel env add VITE_SOCIAL_GITHUB production

# Infrastructure
echo "https://grafana.sxc.codes" | vercel env add GRAFANA_URL production
echo "https://elastic.sxc.codes" | vercel env add ELASTICSEARCH_URL production
echo "https://supabase.sxc.codes" | vercel env add SUPABASE_URL production

echo "Environment variables setup complete!"
