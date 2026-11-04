/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  bail: 1,
  verbose: true,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",

  // Transpile only — do NOT type-check during tests.
  //
  // ts-jest type-checks every file it transforms, and because nothing is
  // excluded from transformation (see transformIgnorePatterns below) that means
  // running one 5-assertion test used to type-check ~1300 files: a cold cache
  // cost ~62s for that single suite and ~95s for the whole run. Transpiling
  // instead makes the full suite ~8s cold.
  //
  // Types are still checked, just not here: `pnpm build` compiles every package
  // through @rollup/plugin-typescript with `noEmitOnError`, and `pnpm lint`
  // runs eslint and lit-analyzer. Note this leaves the *test* files themselves
  // unchecked.
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { isolatedModules: true }],
  },

  // Deliberately empty: everything, including node_modules, is transformed.
  // Much of the dependency tree ships ESM that jest cannot load as-is —
  // lit and lit-html declare "type": "module", and d3 (plus all its d3-*
  // subpackages) and lodash-es use ESM syntax in .js files without declaring
  // it — so excluding node_modules breaks them. This is cheap now that the
  // transform above only transpiles.
  transformIgnorePatterns: [],

  moduleNameMapper: {
    // nightingale-structure's dependency is the whole of molstar behind a WebGL
    // canvas; neither survives jsdom, so its tests run against stand-ins.
    "^pdbe-molstar/build/.*\\.css$":
      "<rootDir>/packages/nightingale-structure/tests/stubs/pdbe-molstar-css.js",
    "^pdbe-molstar/lib/viewer$":
      "<rootDir>/packages/nightingale-structure/tests/stubs/pdbe-molstar-viewer.js",
    "^pdbe-molstar/lib/sifts-mapping$":
      "<rootDir>/packages/nightingale-structure/tests/stubs/pdbe-molstar-sifts-mapping.js",
    "^molstar/lib/extensions/model-archive/quality-assessment/behavior$":
      "<rootDir>/packages/nightingale-structure/tests/stubs/molstar-ma-quality-assessment.js",
  },
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["./setupJest.js"],
};
