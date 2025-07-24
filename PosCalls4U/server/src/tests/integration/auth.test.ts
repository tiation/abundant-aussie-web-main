import request from 'supertest';
import { app } from '../../app';

import { setupDatabase, userOne, userOneId } from '../fixtures/db';

beforeEach(setupDatabase);

describe('POST /api/auth/login', () => {
  it('should login existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    // Validate response body
    expect(response.body).toMatchObject({
      success: true,
      data: {
        user: {
          email: userOne.email
        },
        token: expect.any(String)
      }
    });
  });

  it('should not login with incorrect password', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: userOne.email,
        password: 'wrongpassword'
      })
      .expect(400);
  });

  it('should not login with unregistered email', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notregistered@example.com',
        password: 'password123'
      })
      .expect(404);
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout user', async () => {
    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${userOne.tokens[0]}`)
      .send()
      .expect(200);
  });
});

