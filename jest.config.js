/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(lit-element|lit-html|lodash-es)/)",
  ],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
  setupFilesAfterEnv: ["<rootDir>/setupJest.js"],
};
