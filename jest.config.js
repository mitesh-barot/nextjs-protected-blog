// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  /**
   * IMPORTANT:
   * Override @/lib/mongodb AFTER next/jest merges defaults.
   */
  moduleNameMapper: {
    '^@/lib/mongodb$': '<rootDir>/__mocks__/mongodb.ts',
    '^mongoose$': '<rootDir>/__mocks__/mongoose.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^@panva/hkdf$': '<rootDir>/__mocks__/panva-hkdf.js',
    '^preact-render-to-string$': '<rootDir>/__mocks__/preact-render-to-string.js',
    '^preact$': '<rootDir>/__mocks__/preact.js',
  },
};

// next/jest merges first → then customConfig applies LAST.
module.exports = async () => {
  const nextConfig = await createJestConfig(customConfig)();
  return {
    ...nextConfig,
    moduleNameMapper: {
      ...nextConfig.moduleNameMapper,
      '^@/lib/mongodb$': '<rootDir>/__mocks__/mongodb.ts',
    },
  };
};
