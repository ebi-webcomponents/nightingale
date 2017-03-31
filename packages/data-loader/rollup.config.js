import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
// const process = require('process');

// const PROD = process.env.NODE_ENV === 'production';

export default {
  entry: 'src/index.js',
  format: 'iife',
  dest: 'dist/index.js',
  sourceMap: true,
  moduleName: 'DataLoader',
  plugins: [
    nodeResolve({jsnext: true}),
    eslint(),
    babel({
      babelrc: false,
      plugins: ['transform-es2015-for-of'],
      presets: ['es2016', 'es2017'],
      env: {
        production: {
          presets: ['babili'],
        }
      }
    }),
  ],
};
