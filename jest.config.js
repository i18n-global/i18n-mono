module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/scripts"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        types: ["jest", "node"],
      },
    },
  },
};

