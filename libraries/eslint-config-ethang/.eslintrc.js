/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-call,unicorn/prefer-module */
require('@rushstack/eslint-patch/modern-module-resolution');

// eslint-disable-next-line functional/immutable-data
module.exports = {
  'extends': [
    'plugin:@typescript-eslint/strict',
    'plugin:unicorn/all',
    'xo',
    'xo-space',
    'xo-react/space',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:typescript-sort-keys/recommended',
    'plugin:functional/external-vanilla-recommended',
    'plugin:functional/external-typescript-recommended',
    'plugin:tailwindcss/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  'plugins': [
    'functional',
    'simple-import-sort',
    'sort-keys-fix',
    'unused-imports',
    'prettier',
  ],
  'env': {
    'es2024': true,
  },
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.json',
  },
  'ignorePatterns': [
    '*.config.ts',
    '*.config.js',
    '*.d.ts',
    'dist',
    'node_modules',
  ],
  'rules': {
    camelcase: 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          null: false,
        },
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'arrow-body-style': ['error', 'always'],
    'capitalized-comments': 'off',
    'max-params': 'error',
    'new-cap': 'off',
    'no-console': [
      'error',
      {
        allow: ['debug', 'info', 'warn', 'error', 'table'],
      },
    ],
    'no-empty-static-block': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-undef': 'off',
    'prettier/prettier': [
      'error',
      {
        'arrowParens': 'avoid',
        'endOfLine': 'crlf',
        'printWidth': 80,
        'singleQuote': true,
        'trailingComma': 'all',
      },
    ],
    'react/no-array-index-key': 'error',
    'react/no-multi-comp': 'error',
    'react/no-unknown-property': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-set-has': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' },
    ],
  },
};
