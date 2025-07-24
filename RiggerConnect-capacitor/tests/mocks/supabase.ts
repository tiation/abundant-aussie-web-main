import { createMockUser, createMockJob, createMockProfile } from '../utils/test-utils';

// Mock Supabase Auth
export const mockAuth = {
  getSession: jest.fn(() => Promise.resolve({
    data: { session: null },
    error: null,
  })),
  
  getUser: jest.fn(() => Promise.resolve({
    data: { user: null },
    error: null,
  })),

  signUp: jest.fn(({ email, password }) => Promise.resolve({
    data: {
      user: createMockUser({ email }),
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: createMockUser({ email }),
      },
    },
    error: null,
  })),

  signInWithPassword: jest.fn(({ email, password }) => Promise.resolve({
    data: {
      user: createMockUser({ email }),
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: createMockUser({ email }),
      },
    },
    error: null,
  })),

  signOut: jest.fn(() => Promise.resolve({
    error: null,
  })),

  resetPasswordForEmail: jest.fn(() => Promise.resolve({
    data: {},
    error: null,
  })),

  updateUser: jest.fn((updates) => Promise.resolve({
    data: {
      user: createMockUser(updates),
    },
    error: null,
  })),

  onAuthStateChange: jest.fn((callback) => {
    // Simulate initial auth state
    setTimeout(() => {
      callback('INITIAL_SESSION', null);
    }, 0);
    
    return {
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    };
  }),
};

// Mock Supabase Database Query Builder
const createMockQueryBuilder = (tableName: string) => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  
  from: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  gt: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  like: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  is: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  contains: jest.fn().mockReturnThis(),
  containedBy: jest.fn().mockReturnThis(),
  rangeLt: jest.fn().mockReturnThis(),
  rangeGt: jest.fn().mockReturnThis(),
  rangeGte: jest.fn().mockReturnThis(),
  rangeLte: jest.fn().mockReturnThis(),
  rangeAdjacent: jest.fn().mockReturnThis(),
  overlaps: jest.fn().mockReturnThis(),
  textSearch: jest.fn().mockReturnThis(),
  match: jest.fn().mockReturnThis(),
  not: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  filter: jest.fn().mockReturnThis(),
  
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  abortSignal: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockReturnThis(),
  csv: jest.fn().mockReturnThis(),
  geojson: jest.fn().mockReturnThis(),
  explain: jest.fn().mockReturnThis(),
  rollback: jest.fn().mockReturnThis(),
  returns: jest.fn().mockReturnThis(),

  // Execute the query and return mock data based on table
  then: jest.fn((callback) => {
    let mockData;
    
    switch (tableName) {
      case 'profiles':
        mockData = { data: [createMockProfile()], error: null };
        break;
      case 'jobs':
        mockData = { data: [createMockJob()], error: null };
        break;
      case 'job_applications':
        mockData = { data: [], error: null };
        break;
      default:
        mockData = { data: [], error: null };
    }
    
    return Promise.resolve(callback(mockData));
  }),
});

// Mock Supabase Storage
export const mockStorage = {
  from: jest.fn((bucket: string) => ({
    upload: jest.fn(() => Promise.resolve({
      data: {
        path: 'mock/file/path.jpg',
        id: 'mock-file-id',
        fullPath: `${bucket}/mock/file/path.jpg`,
      },
      error: null,
    })),
    
    download: jest.fn(() => Promise.resolve({
      data: new Blob(['mock file content'], { type: 'image/jpeg' }),
      error: null,
    })),
    
    list: jest.fn(() => Promise.resolve({
      data: [
        {
          name: 'mock-file.jpg',
          id: 'mock-file-id',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          metadata: { size: 1024 },
        },
      ],
      error: null,
    })),
    
    remove: jest.fn(() => Promise.resolve({
      data: [{ name: 'mock-file.jpg' }],
      error: null,
    })),
    
    move: jest.fn(() => Promise.resolve({
      data: { message: 'Successfully moved' },
      error: null,
    })),
    
    copy: jest.fn(() => Promise.resolve({
      data: { path: 'new/mock/file/path.jpg' },
      error: null,
    })),
    
    createSignedUrl: jest.fn(() => Promise.resolve({
      data: {
        signedURL: 'https://mock-signed-url.com/file.jpg',
      },
      error: null,
    })),
    
    createSignedUrls: jest.fn(() => Promise.resolve({
      data: [
        {
          path: 'mock/file/path.jpg',
          signedURL: 'https://mock-signed-url.com/file.jpg',
        },
      ],
      error: null,
    })),
    
    getPublicUrl: jest.fn((path: string) => ({
      data: {
        publicURL: `https://mock-public-url.com/${path}`,
      },
    })),
  })),
  
  listBuckets: jest.fn(() => Promise.resolve({
    data: [
      {
        id: 'mock-bucket-id',
        name: 'avatars',
        owner: 'mock-owner-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        public: true,
      },
    ],
    error: null,
  })),
  
  getBucket: jest.fn(() => Promise.resolve({
    data: {
      id: 'mock-bucket-id',
      name: 'avatars',
      owner: 'mock-owner-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      public: true,
    },
    error: null,
  })),
};

// Mock Supabase Realtime
export const mockRealtime = {
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(() => Promise.resolve('ok')),
    unsubscribe: jest.fn(() => Promise.resolve('ok')),
    send: jest.fn().mockReturnThis(),
  })),
  
  removeChannel: jest.fn(),
  removeAllChannels: jest.fn(),
  disconnect: jest.fn(),
  connect: jest.fn(),
  
  getChannels: jest.fn(() => []),
};

// Main Supabase client mock
export const mockSupabaseClient = {
  auth: mockAuth,
  storage: mockStorage,
  realtime: mockRealtime,
  
  from: jest.fn((table: string) => createMockQueryBuilder(table)),
  
  rpc: jest.fn((functionName: string, params?: any) => Promise.resolve({
    data: `Mock result for ${functionName}`,
    error: null,
  })),
  
  // Functions
  functions: {
    invoke: jest.fn((functionName: string, options?: any) => Promise.resolve({
      data: `Mock function result for ${functionName}`,
      error: null,
    })),
  },
};

// Mock the Supabase client creation
export const createClient = jest.fn(() => mockSupabaseClient);
