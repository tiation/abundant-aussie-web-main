/** @type {import('jest').Config} */
module.exports = {
  // Preset configurations
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // Module configurations
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  
  // Test matching patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}'
  ],
  
  // Module path mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@rigger/shared$': '<rootDir>/node_modules/@rigger/shared',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.ts'
  ],
  
  // Transform configurations
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Transform node_modules ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(isows|@supabase|@capacitor)/)',
  ],
  
  // Coverage configurations
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/index.css',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Global configurations
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Treat these extensions as ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // Test timeout
  testTimeout: 15000,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Projects for multi-platform testing
  projects: [
    {
      displayName: 'web',
      testMatch: ['<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom'
    },
    {
      displayName: 'capacitor',
      testMatch: ['<rootDir>/tests/capacitor/**/*.(test|spec).{js,jsx,ts,tsx}'],
      testEnvironment: 'node'
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.(test|spec).{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      testTimeout: 30000
    }
  ]
};
