module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  globalSetup: './jest.global-setup.ts',
  globalTeardown: './jest.global-teardown.ts',
};
