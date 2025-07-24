import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createClient } from 'redis';

let mongoServer: MongoMemoryServer;
let redisClient: any;

// Setup test database and Redis before all tests
beforeAll(async () => {
  // Setup MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  
  // Setup Redis Mock
  const redis = require('redis-mock');
  redisClient = redis.createClient();
  
  // Override process.env for tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.PBX_HOST = '100.90.84.68';
  process.env.PBX_USERNAME = 'test';
  process.env.PBX_PASSWORD = 'test';
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Clear Redis
  await redisClient.flushall();
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  await redisClient.quit();
});

// Mock PBX connection
jest.mock('asterisk-manager', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    action: jest.fn().mockResolvedValue({ response: 'Success' }),
    on: jest.fn(),
    off: jest.fn(),
  })),
}));

// Mock Socket.IO
jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
  })),
}));
