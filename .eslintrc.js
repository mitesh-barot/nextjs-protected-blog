module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    // unused import removal
    'unused-imports/no-unused-imports': 'error',
    // unused vars control (allow underscore-prefix)
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // prefer @typescript-eslint versions
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],

    // stylistic / best-practices you can tune
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['.next/', 'node_modules/', 'dist/'],
};
