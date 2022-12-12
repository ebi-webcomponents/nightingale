/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],

  env: {
    browser: true,
    "jest/globals": true,
  },

  rules: {
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
