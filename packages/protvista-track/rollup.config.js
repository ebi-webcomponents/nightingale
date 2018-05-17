import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
      file: 'dist/protvista-track.js',
      format: 'iife',
      sourcemap: true,
      name: 'ProtVistaTrack',
      globals: {
        'd3': 'd3',
        'provista-zoomable': 'ProtvistaZoomable'
      }
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
