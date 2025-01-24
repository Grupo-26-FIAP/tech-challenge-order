import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@Domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@Infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@Application/(.*)$': '<rootDir>/src/application/$1',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/features/',
    '/dist/',
    '/src/infrastructure/typeorm/',
    '/src/shared/',
    '/src/application/mappers/',
    '/src/application/dtos/',
    '/src/domain/repositories/',
    '/src/domain/entities/',
    '/src/presentation/controllers/',
    'app.module.ts',
    'main.ts',
    '.eslintrc.js',
    'jest.config.ts',
  ],
};

export default config;
