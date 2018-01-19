import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  name: 'ProtVistaTrack',
  sourcemap: true,
  output: {
      file: 'dist/protvista-track.js',
      format: 'iife',
  },
  external: ['d3', 'protvista-zoomable'],
  // paths: {
  //   d3: 'https://d3js.org/d3.v4.min.js'
  // },
  plugins: [
    nodeResolve({jsnext: true}),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
