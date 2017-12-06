import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    name: 'ProtVistaFeatureAdapter',
    sourceMap: true,
    output: {
        file: 'dist/ProtVistaFeatureAdapter.js',
        format: 'iife',
    },
    external: ['uniprot-entry-data-adapter'],
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};
