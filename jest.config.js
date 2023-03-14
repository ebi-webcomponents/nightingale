/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// lodash-es: uncomment corresponding lines if a package uses it...

const transformIgnoreModules = [
  "lit",
  // "lodash-es",
].join("|");

module.exports = {
  bail: 1,
  verbose: true,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    `<rootdir>/node_modules/(?!(${transformIgnoreModules}))/`,
  ],
  // moduleNameMapper: {
  //   "^lodash-es$": "lodash",
  // },
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["./setupJest.js"],
};
