import {default as config} from '@dfinity/eslint-config-oisy-wallet';

export default [
  ...config,
  {
    rules: {
      'prefer-arrow/prefer-arrow-functions': ['off'],
      'func-style': ['off']
    }
  },
  {
    files: ['src/**/*'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    ignores: ['eslint-local-rules.cjs']
  }
];
