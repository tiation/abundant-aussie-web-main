import { FastifyInstance, FastifyPluginAsync } from 'fastify';

/**
 * Demo route plugin for Fastify - demonstrates working API endpoint
 */
const demoRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Demo health endpoint
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      message: 'RiggerBackend Demo API is running',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3001,
      environment: process.env.NODE_ENV || 'development',
    };
  });

  // Demo jobs endpoint
  fastify.get('/jobs', async (request, reply) => {
    return {
      message: 'Jobs endpoint working',
      data: [
        {
          id: '1',
          title: 'Construction Worker',
          company: 'ABC Construction',
          location: 'Perth, WA',
          type: 'Full-time',
        },
        {
          id: '2',
          title: 'Mining Equipment Operator',
          company: 'XYZ Mining Co.',
          location: 'Kalgoorlie, WA',
          type: 'Contract',
        },
      ],
    };
  });

  // Demo user endpoint
  fastify.get('/users/demo', async (request, reply) => {
    return {
      message: 'User demo endpoint working',
      user: {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@rigger.com',
        role: 'worker',
      },
    };
  });

  // Demo POST endpoint
  fastify.post('/test', async (request, reply) => {
    return {
      message: 'POST endpoint working',
      received: request.body,
      timestamp: new Date().toISOString(),
    };
  });
};

export default demoRoutes;
