module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:eslint-comments/recommended',
    '@react-native-community',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'testing-library'],
  rules: {
    'prettier/prettier': 0,
    'prefer-user-event': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-quotes': ['warn', 'prefer-single'],
    'curly': 'off',
    'keyword-spacing': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
  },
};
