import babel from 'rollup-plugin-babel';
// import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'ProtVistaTrack',
  dest: 'dist/protvista-track.js',
  sourceMap: true,
  external: ['d3'],
  // paths: {
  //   d3: 'https://d3js.org/d3.v4.min.js'
  // },
  plugins: [
    // nodeResolve({jsnext: true}),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
