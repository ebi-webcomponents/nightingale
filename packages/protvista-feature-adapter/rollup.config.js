import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    name: 'ProtVistaFeatureAdapter',
    sourcemap: true,
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
