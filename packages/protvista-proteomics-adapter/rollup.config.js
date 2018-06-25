import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/ProtVistaProteomicsAdapter.js',
        format: 'iife',
        name: 'ProtVistaProteomicsAdapter',
        sourcemap: true,
        globals: {
            'protvista-uniprot-entry-adapter': 'ProtVistaUniProtEntryAdapter'
        }
    },
    external: ['protvista-uniprot-entry-adapter'],
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};