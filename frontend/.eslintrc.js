module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'vue/no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
}