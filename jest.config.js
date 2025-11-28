/**
 * Root Jest Configuration for Turborepo Monorepo
 * 
 * This configuration enables Cursor/VSCode Jest extension to recognize
 * and run tests in all packages with their individual Jest configurations.
 * 
 * Each package maintains its own jest.config.js with specific settings
 * (ts-jest transforms, test patterns, etc.)
 */
module.exports = {
  projects: [
    "<rootDir>/packages/*/jest.config.js",
  ],
  // Optional: Prevent Jest from running at root level directly
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
};

