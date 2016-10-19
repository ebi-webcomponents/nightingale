import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
const process = require('process');

const PROD = process.env.NODE_ENV === 'production';
const DEV = !PROD;

export default {
  entry: 'src/index.js',
  format: 'iife',
  dest: 'dist/index.js',
  sourceMap: true,
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**',
      presets: ['es2017', 'stage-3']
    }),
  ],
  intro: `
    var DEV = ${DEV};
    var PROD = ${PROD};
  `.trim(),
};
