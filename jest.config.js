/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': 'ts-jest',
  },
}
