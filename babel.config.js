/* eslint-env node */
// Only used by babel-jest for unit tests
// Using this file instead of `.babelrc` to have this config globally, and this
// way process also the files in `node_modules` that we have explicitely
// included in `jest.config.js`
module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            targets: { node: '8' },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
      ],
    },
  },
};
