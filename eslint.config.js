import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import eslintJs from '@eslint/js';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      'build/',
      '.next/',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      '*.setup.js',
    ],
  },

  // Base configs
  eslintJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // React config
  {
    ...react.configs.flat.recommended,
    files: ['**/*.{ts,tsx,js,jsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Custom rules and plugins
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, __dirname: true },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      'no-case-declarations': 'off',
      'no-fallthrough': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next', '^@?\\w'],
            ['^@/features'],
            ['^@/lib/sdk'],
            ['^@/lib'],
            ['^@/app', '^@/styles'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-cycle': ['warn', { maxDepth: '∞' }],
    },
  },
);
