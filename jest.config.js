module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  // ignore node_modules and any __tests__ folders under src; discover tests by name anywhere in src/
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['js', 'json']
};
