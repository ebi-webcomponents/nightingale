import babel from 'rollup-plugin-babel';
// import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'ProtVistaManager',
  dest: 'dist/protvista-manager.js',
  sourceMap: true,
  plugins: [
    // nodeResolve({jsnext: true}),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
