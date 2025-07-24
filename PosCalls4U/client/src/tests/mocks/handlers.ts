import { http, HttpResponse } from 'msw';

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'agent',
          team: 'support',
        },
        token: 'mock-jwt-token',
      },
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'agent',
        team: 'support',
      },
    });
  }),

  // Team management endpoints
  http.get('/api/teams', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          name: 'Support Team',
          members: ['1', '2', '3'],
          supervisor: '1',
        },
        {
          id: '2',
          name: 'Sales Team',
          members: ['4', '5', '6'],
          supervisor: '4',
        },
      ],
    });
  }),

  http.get('/api/teams/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      data: {
        id,
        name: 'Support Team',
        members: ['1', '2', '3'],
        supervisor: '1',
        stats: {
          totalCalls: 150,
          avgCallDuration: 300,
          resolution_rate: 0.85,
        },
      },
    });
  }),

  // Call statistics endpoints
  http.get('/api/stats/calls', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalCalls: 1250,
        avgDuration: 280,
        peakHours: ['09:00', '14:00', '16:00'],
        resolution_rate: 0.78,
        satisfaction_score: 4.2,
      },
    });
  }),

  http.get('/api/stats/agent/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      data: {
        agentId: id,
        totalCalls: 45,
        avgCallDuration: 320,
        resolution_rate: 0.82,
        satisfaction_score: 4.1,
        status: 'available',
      },
    });
  }),

  // Schedule endpoints
  http.get('/api/schedule', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: '1',
          agentId: '1',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '17:00',
          break_times: ['12:00-13:00', '15:00-15:15'],
        },
        {
          id: '2',
          agentId: '2',
          date: '2024-01-15',
          startTime: '10:00',
          endTime: '18:00',
          break_times: ['13:00-14:00', '16:00-16:15'],
        },
      ],
    });
  }),

  // Error handling
  http.get('/api/error', () => {
    return HttpResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }),
];
