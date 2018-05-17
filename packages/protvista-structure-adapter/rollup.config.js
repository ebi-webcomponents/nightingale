import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/ProtVistaStructureAdapter.js',
        format: 'iife',
        name: 'ProtVistaStructureAdapter',
        sourcemap: true,
        globals: {
            'uniprot-entry-data-adapter': 'UniProtEntryDataAdapter'
        }
    },
    external: ['uniprot-entry-data-adapter'],
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};