// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^mongoose$': '<rootDir>/__mocks__/mongoose.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^@panva/hkdf$': '<rootDir>/__mocks__/panva-hkdf.js',
    '^preact-render-to-string$': '<rootDir>/__mocks__/preact-render-to-string.js',
    '^preact$': '<rootDir>/__mocks__/preact.js',
  },
};

// CommonJS export (required by Jest)
module.exports = createJestConfig(config);
