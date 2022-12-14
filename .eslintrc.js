module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'testing-library'],
  rules: {
    'prefer-user-event': 'off',
    'react/react-in-jsx-scope': 'off',
  }
}
