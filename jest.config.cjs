module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  // setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '\\.(jpg|css|less|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    '<rootDir>/tests/mocks/styleMock.js',
  },
};