import request from 'supertest';
import { app } from '../../app';
import { setupDatabase, userOne, userTwo, teamOne, teamTwo } from '../fixtures/db';

beforeEach(setupDatabase);

describe('Teams API', () => {
  describe('GET /api/teams', () => {
    it('should get all teams for authenticated user', async () => {
      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        name: teamOne.name,
        members: expect.any(Array),
      });
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/teams')
        .expect(401);
    });

    it('should filter teams by user role', async () => {
      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`) // Agent user
        .expect(200);

      // Agent should only see their own team
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/teams/:id', () => {
    it('should get team by id with detailed information', async () => {
      const response = await request(app)
        .get(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: teamOne.name,
        members: expect.any(Array),
        stats: expect.any(Object),
      });
    });

    it('should return 404 for non-existent team', async () => {
      const response = await request(app)
        .get('/api/teams/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require team access permissions', async () => {
      await request(app)
        .get(`/api/teams/${teamTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`) // User not in team
        .expect(403);
    });
  });

  describe('POST /api/teams', () => {
    it('should create new team for supervisor', async () => {
      const teamData = {
        name: 'New Team',
        description: 'A new support team',
        members: [userTwo._id],
      };

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`) // Supervisor
        .send(teamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: teamData.name,
        description: teamData.description,
        supervisor: userOne._id.toString(),
      });
    });

    it('should require supervisor role', async () => {
      const teamData = {
        name: 'New Team',
        description: 'A new support team',
      };

      await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`) // Agent
        .send(teamData)
        .expect(403);
    });

    it('should validate team data', async () => {
      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({}) // Empty data
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Team name is required');
    });
  });

  describe('PUT /api/teams/:id', () => {
    it('should update team details', async () => {
      const updateData = {
        name: 'Updated Team Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should require supervisor permissions', async () => {
      await request(app)
        .put(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`)
        .send({ name: 'Unauthorized Update' })
        .expect(403);
    });
  });

  describe('DELETE /api/teams/:id', () => {
    it('should delete team', async () => {
      await request(app)
        .delete(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      // Verify team is deleted
      await request(app)
        .get(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(404);
    });

    it('should require supervisor permissions', async () => {
      await request(app)
        .delete(`/api/teams/${teamOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`)
        .expect(403);
    });
  });

  describe('POST /api/teams/:id/members', () => {
    it('should add member to team', async () => {
      const response = await request(app)
        .post(`/api/teams/${teamOne._id}/members`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({ userId: userTwo._id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.members).toContain(userTwo._id.toString());
    });

    it('should prevent duplicate members', async () => {
      // Add member first
      await request(app)
        .post(`/api/teams/${teamOne._id}/members`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({ userId: userTwo._id });

      // Try to add same member again
      const response = await request(app)
        .post(`/api/teams/${teamOne._id}/members`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({ userId: userTwo._id })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already a member');
    });
  });

  describe('DELETE /api/teams/:id/members/:userId', () => {
    it('should remove member from team', async () => {
      // First add member
      await request(app)
        .post(`/api/teams/${teamOne._id}/members`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({ userId: userTwo._id });

      // Then remove member
      const response = await request(app)
        .delete(`/api/teams/${teamOne._id}/members/${userTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.members).not.toContain(userTwo._id.toString());
    });

    it('should require supervisor permissions', async () => {
      await request(app)
        .delete(`/api/teams/${teamOne._id}/members/${userTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`)
        .expect(403);
    });
  });
});
