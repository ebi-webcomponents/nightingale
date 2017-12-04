import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  name: 'ProtVistaInterproTrack',
  sourcemap: true,
  output: {
      file: 'dist/protvista-interpro-track.js',
      format: 'iife',
  },
  external: ['d3'],
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
