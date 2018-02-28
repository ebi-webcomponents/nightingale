import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  name: 'DataLoader',
  sourceMap: true,
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve({jsnext: true}),
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
