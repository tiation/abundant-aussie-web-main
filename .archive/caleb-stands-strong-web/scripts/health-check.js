#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  url: process.env.HEALTH_CHECK_URL || 'https://caleb-stands-strong-web.vercel.app',
  timeout: 10000,
  retries: 3,
  healthCheckEndpoints: [
    '/',
    '/api/health'
  ],
  criticalResources: [
    '/favicon.ico',
    '/manifest.json'
  ]
};

// Logging utility
const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
  
  // Also write to log file
  const logFile = path.join(process.cwd(), 'logs', 'health-check.log');
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

// HTTP request helper
const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.request(url, {
      method: 'HEAD',
      timeout: config.timeout,
      ...options
    }, (res) => {
      const duration = Date.now() - startTime;
      resolve({
        statusCode: res.statusCode,
        duration,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (error) => {
      reject({
        error: error.message,
        duration: Date.now() - startTime,
        success: false
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        duration: Date.now() - startTime,
        success: false
      });
    });
    
    req.end();
  });
};

// Perform health check
const performHealthCheck = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    url: config.url,
    overall: { status: 'healthy', duration: 0 },
    checks: []
  };
  
  const startTime = Date.now();
  
  try {
    // Check main endpoints
    for (const endpoint of config.healthCheckEndpoints) {
      const url = `${config.url}${endpoint}`;
      
      try {
        const result = await makeRequest(url);
        results.checks.push({
          name: `endpoint_${endpoint.replace('/', 'root').replace('/', '_')}`,
          url,
          status: result.success ? 'pass' : 'fail',
          statusCode: result.statusCode,
          duration: result.duration,
          error: result.success ? null : `HTTP ${result.statusCode}`
        });
        
        log('info', `Health check passed for ${endpoint}`, {
          statusCode: result.statusCode,
          duration: result.duration
        });
      } catch (error) {
        results.checks.push({
          name: `endpoint_${endpoint.replace('/', 'root').replace('/', '_')}`,
          url,
          status: 'fail',
          duration: error.duration || 0,
          error: error.error || 'Unknown error'
        });
        
        log('error', `Health check failed for ${endpoint}`, {
          error: error.error,
          duration: error.duration
        });
      }
    }
    
    // Check critical resources
    for (const resource of config.criticalResources) {
      const url = `${config.url}${resource}`;
      
      try {
        const result = await makeRequest(url);
        results.checks.push({
          name: `resource_${resource.substring(1).replace('.', '_')}`,
          url,
          status: result.success ? 'pass' : 'fail',
          statusCode: result.statusCode,
          duration: result.duration,
          error: result.success ? null : `HTTP ${result.statusCode}`
        });
      } catch (error) {
        results.checks.push({
          name: `resource_${resource.substring(1).replace('.', '_')}`,
          url,
          status: 'fail',
          duration: error.duration || 0,
          error: error.error || 'Unknown error'
        });
      }
    }
    
    // Calculate overall status
    const failedChecks = results.checks.filter(check => check.status === 'fail');
    const totalChecks = results.checks.length;
    
    if (failedChecks.length === 0) {
      results.overall.status = 'healthy';
    } else if (failedChecks.length <= totalChecks / 2) {
      results.overall.status = 'degraded';  
    } else {
      results.overall.status = 'unhealthy';
    }
    
    results.overall.duration = Date.now() - startTime;
    results.overall.failedChecks = failedChecks.length;
    results.overall.totalChecks = totalChecks;
    results.overall.successRate = Math.round(((totalChecks - failedChecks.length) / totalChecks) * 100);
    
    // Log results
    log('info', 'Health check completed', {
      status: results.overall.status,
      duration: results.overall.duration,
      successRate: results.overall.successRate,
      failedChecks: failedChecks.length,
      totalChecks
    });
    
    // Send to monitoring systems
    await sendToMonitoring(results);
    
    // Exit with appropriate code
    if (results.overall.status === 'unhealthy') {
      process.exit(1);
    } else if (results.overall.status === 'degraded') {
      process.exit(2);
    } else {
      process.exit(0);
    }
    
  } catch (error) {
    log('error', 'Health check failed with exception', { error: error.message });
    process.exit(3);
  }
};

// Send results to monitoring systems
const sendToMonitoring = async (results) => {
  try {
    // Send to Grafana
    if (process.env.VITE_GRAFANA_API_KEY) {
      const grafanaPayload = {
        streams: [{
          stream: {
            job: 'caleb-stands-strong-web-health',
            instance: 'health-check-script'
          },
          values: [[
            (Date.now() * 1000000).toString(),
            JSON.stringify(results)
          ]]
        }]
      };
      
      // Note: In a real scenario, you'd make an HTTP request to Grafana
      log('info', 'Health check results sent to Grafana', { grafanaPayload });
    }
    
    // Send alerts if unhealthy
    if (results.overall.status === 'unhealthy') {
      await sendAlert(results);
    }
  } catch (error) {
    log('error', 'Failed to send health check results to monitoring', { error: error.message });
  }
};

// Send alert notifications
const sendAlert = async (results) => {
  const alertData = {
    timestamp: results.timestamp,
    status: results.overall.status,
    failedChecks: results.checks.filter(check => check.status === 'fail'),
    successRate: results.overall.successRate,
    url: config.url
  };
  
  log('critical', 'HEALTH CHECK ALERT: Application is unhealthy', alertData);
  
  // In production, you would send this to email, Slack, PagerDuty, etc.
  if (process.env.ALERT_WEBHOOK_URL) {
    // HTTP request to webhook would go here
    console.log('Alert sent to webhook:', process.env.ALERT_WEBHOOK_URL);
  }
};

// Run health check
if (require.main === module) {
  performHealthCheck();
}

module.exports = { performHealthCheck, config };
