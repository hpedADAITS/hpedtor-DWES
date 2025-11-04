import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        'unit-tests/',
        '*.config.{js,ts}',
        'coverage/',
        'dist/',
        'suma.js',
      ],
      all: true,
      include: ['src/**/*.{js,ts}'],
      reportsDirectory: './coverage',
    },
  },
});
