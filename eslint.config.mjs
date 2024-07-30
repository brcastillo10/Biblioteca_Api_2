import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';

export default [
  {
    ignores: ['node_modules/'],
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      }
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    }
  }
];