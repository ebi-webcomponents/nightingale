import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

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
      presets: ['es2016', 'es2017'],
      env: {
        production: {
          presets: ['babili'],
        }
      }
    }),
  ],
};
