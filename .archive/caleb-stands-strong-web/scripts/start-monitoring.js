#!/usr/bin/env node

// Health check cron job trigger script
const { performHealthCheck } = require('./health-check');

// Trigger health check
performHealthCheck()
  .then(() => {
    console.log('Health check completed successfully');
  })
  .catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });

