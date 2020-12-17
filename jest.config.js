module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!(lit-element|lit-html|lodash-es)/)",
  ],
  transform: {
    "^.+\\.(tsx|js|ts)?$": "babel-jest",
  },
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
};
