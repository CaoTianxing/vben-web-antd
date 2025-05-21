const restrictedImportIgnores = [
  '**/vite.config.mts',
  '**/tailwind.config.mjs',
  '**/postcss.config.mjs',
];

module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'vue/require-default-prop': 'off',
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['**/**.vue'],
      rules: {
        'perfectionist/sort-objects': 'off',
      },
    },
    {
      files: ['**/**/playwright.config.ts'],
      rules: {
        'n/prefer-global/buffer': 'off',
        'n/prefer-global/process': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['internal/**/**', 'scripts/**/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: restrictedImportIgnores,
};
