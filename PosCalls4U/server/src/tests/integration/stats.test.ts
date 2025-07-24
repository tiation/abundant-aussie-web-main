import request from 'supertest';
import { app } from '../../app';
import { setupDatabase, userOne } from '../fixtures/db';

beforeEach(setupDatabase);

describe('Statistics API', () => {
  describe('GET /api/stats/calls', () => {
    it('should get call statistics', async () => {
      const response = await request(app)
        .get('/api/stats/calls')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        totalCalls: expect.any(Number),
        avgDuration: expect.any(Number),
        peakHours: expect.any(Array),
      });
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/stats/calls')
        .expect(401);
    });
  });

  describe('GET /api/stats/agent/:id', () => {
    it('should get agent statistics', async () => {
      const response = await request(app)
        .get(`/api/stats/agent/${userOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        agentId: userOne._id.toString(),
        totalCalls: expect.any(Number),
        avgCallDuration: expect.any(Number),
      });
    });

    it('should return 404 for non-existent agent', async () => {
      const response = await request(app)
        .get('/api/stats/agent/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require authorization', async () => {
      await request(app)
        .get(`/api/stats/agent/${userOne._id}`)
        .expect(401);
    });
  });
});

