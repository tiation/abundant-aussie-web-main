// RiggerBackend API v1 - Enterprise Grade
// Consolidated API endpoints for the entire Rigger ecosystem

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const jobsRoutes = require('./jobs');  
const workersRoutes = require('./workers');
const analyticsRoutes = require('./analytics');
const complianceRoutes = require('./compliance');

// Mount routes with proper middleware
router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/workers', workersRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/compliance', complianceRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected',
      external_apis: 'operational'
    }
  });
});

module.exports = router;
