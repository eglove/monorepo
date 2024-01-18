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
    'arrow-body-style': ['error', 'always'],
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
    'unicorn/no-null': 'off',
  },
};
