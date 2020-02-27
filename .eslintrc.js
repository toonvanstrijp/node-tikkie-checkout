module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'quotes': ['error', 'single'],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'sort-imports': 'off',
    'max-len': [ 'error', { 'code': 150 } ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'arrow-parens': 'off',
    'object-literal-sort-keys': 'off',
    'no-console': 'off',
    'max-classes-per-file': 'off',
    'no-unused-expressions': 'error'
  }
};
