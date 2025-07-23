import 'dotenv/config';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';

import { config } from '@/config/environment';
import { logger } from '@/config/logger';
import { supabaseClient } from '@/config/supabase';
import { redisClient } from '@/config/redis';

// Import route modules
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import jobRoutes from '@/routes/jobs';
import applicationRoutes from '@/routes/applications';
import paymentRoutes from '@/routes/payments';
import agentRoutes from '@/routes/agents';
import worksafeRoutes from '@/routes/worksafe';

// Import middleware
import { authMiddleware } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';
import { requestLogger } from '@/middleware/requestLogger';

/**
 * Build and configure the Fastify application
 */
async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: config.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : undefined,
    },
    requestIdLogLabel: 'reqId',
    requestIdHeader: 'x-request-id',
    disableRequestLogging: false,
  });

  // Register security plugins
  await app.register(helmet, {
    contentSecurityPolicy: config.NODE_ENV === 'production',
  });

  // Register CORS
  await app.register(cors, {
    origin: (origin, callback) => {
      const allowedOrigins = config.ALLOWED_ORIGINS;
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });

  // Register rate limiting
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW_MS,
    redis: redisClient,
  });

  // Register multipart support for file uploads
  await app.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5,
    },
  });

  // Register static file serving
  await app.register(staticFiles, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  // Register Swagger documentation
  if (config.NODE_ENV !== 'production') {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Rigger Backend API',
          description: 'Unified backend services for Rigger ecosystem applications',
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://localhost:${config.PORT}`,
            description: 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: header => header,
    });
  }

  // Global middleware
  app.addHook('onRequest', requestLogger);
  app.addHook('preHandler', authMiddleware);

  // Health check endpoint
  app.get('/health', async (request, reply) => {
    try {
      // Check Supabase connection
      const { data, error } = await supabaseClient.from('users').select('count').limit(1);
      if (error) throw error;

      // Check Redis connection
      await redisClient.ping();

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        services: {
          supabase: 'connected',
          redis: 'connected',
        },
      };
    } catch (error) {
      app.log.error('Health check failed:', error);
      reply.status(503);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service dependencies unavailable',
      };
    }
  });

  // API routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });
  await app.register(jobRoutes, { prefix: '/api/v1/jobs' });
  await app.register(applicationRoutes, { prefix: '/api/v1/applications' });
  await app.register(paymentRoutes, { prefix: '/api/v1/payments' });
  await app.register(agentRoutes, { prefix: '/api/v1/agents' });
  await app.register(worksafeRoutes, { prefix: '/api/v1/worksafe' });

  // API documentation endpoint
  app.get('/api/v1', async () => {
    return {
      message: 'Welcome to Rigger Backend API',
      version: '1.0.0',
      documentation: config.NODE_ENV !== 'production' ? '/docs' : 'Contact administrator',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        jobs: '/api/v1/jobs',
        applications: '/api/v1/applications',
        payments: '/api/v1/payments',
        agents: '/api/v1/agents',
        worksafe: '/api/v1/worksafe',
        health: '/health',
      },
    };
  });

  // Global error handler
  app.setErrorHandler(errorHandler);

  // 404 handler
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      reply.status(404).send({
        error: 'Route not found',
        message: `Cannot ${request.method} ${request.url}`,
        statusCode: 404,
      });
    } else {
      // Serve SPA for frontend routes
      reply.status(404).send({
        error: 'Not Found',
        message: 'The requested resource was not found',
        statusCode: 404,
      });
    }
  });

  return app;
}

/**
 * Start the server
 */
async function start(): Promise<void> {
  try {
    const app = await buildApp();

    // Test database connection
    const { error: dbError } = await supabaseClient.from('users').select('count').limit(1);
    if (dbError) {
      throw new Error(`Database connection failed: ${dbError.message}`);
    }

    // Test Redis connection
    await redisClient.ping();
    
    // Start server
    await app.listen({
      port: config.PORT,
      host: config.HOST,
    });

    logger.info(`🚀 Rigger Backend server started successfully`);
    logger.info(`📍 Server running on http://${config.HOST}:${config.PORT}`);
    logger.info(`🔍 Health check: http://${config.HOST}:${config.PORT}/health`);
    logger.info(`📚 API docs: http://${config.HOST}:${config.PORT}/docs`);
    logger.info(`🌍 Environment: ${config.NODE_ENV}`);

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
process.on('SIGINT', async () => {
  logger.info('🔄 Received SIGINT. Graceful shutdown initiated...');
  
  try {
    await redisClient.quit();
    logger.info('✅ Redis connection closed');
    
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  logger.info('🔄 Received SIGTERM. Graceful shutdown initiated...');
  
  try {
    await redisClient.quit();
    logger.info('✅ Redis connection closed');
    
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export { buildApp, start };
export default buildApp;
