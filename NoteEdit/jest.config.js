export default {
  testEnvironment: 'node',
  testTimeout: 15000,
  transform: {},
  testMatch: ['**/src/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  forceExit: true,
  detectOpenHandles: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/core/views/**',
    '!src/tests/**',
  ],
};
