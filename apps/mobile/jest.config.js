/**
 * Tests unitaires du mobile : preset officiel d'Expo, rendu avec Testing Library.
 * @type {import("jest").Config}
 */
module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/src/**/*.spec.{ts,tsx}"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.spec.{ts,tsx}"],
  coverageThreshold: {
    global: { lines: 80, branches: 80, functions: 80, statements: 80 },
  },
};
