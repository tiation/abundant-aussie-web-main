import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  
  if (NODE_ENV === 'development') {
    console.log('\n📋 Available endpoints:');
    console.log('   POST /api/auth/register           - Register new user');
    console.log('   POST /api/auth/login              - Login user');
    console.log('   POST /api/auth/logout             - Logout current session');
    console.log('   POST /api/auth/logout-all         - Logout all sessions');
    console.log('   POST /api/auth/forgot-password    - Request password reset');
    console.log('   POST /api/auth/reset-password     - Reset password with token');
    console.log('   POST /api/auth/verify-email       - Verify email address');
    console.log('   POST /api/auth/resend-verification - Resend verification email');
    console.log('   GET  /api/auth/google             - Google OAuth login');
    console.log('   GET  /api/auth/facebook           - Facebook OAuth login');
    console.log('   GET  /api/auth/profile            - Get user profile');
    console.log('   GET  /api/users                   - Get all users (admin only)');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});
