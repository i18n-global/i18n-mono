module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/scripts"],
  testMatch: ["**/*.test.ts", "**/*.e2e.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          types: ["jest", "node"],
        },
      },
    ],
  },
  collectCoverageFrom: [
    "scripts/**/*.ts",
    "!scripts/**/*.test.ts",
    "!scripts/**/*.e2e.test.ts",
    "!scripts/**/*.d.ts",
    "!scripts/__tests__/**",
    "!scripts/t-wrapper-rust/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // E2E 테스트는 더 긴 타임아웃 필요
  testTimeout: 60000,
  setupFilesAfterEnv: ["<rootDir>/scripts/__tests__/setup.ts"],
};

