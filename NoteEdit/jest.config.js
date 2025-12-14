export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/src/test/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/views/**',
    '!src/test/**',
  ],
};
