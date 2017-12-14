import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    name: 'UniProtEntryDataAdapter',
    sourcemap: true,
    output: {
        file: 'dist/UniProtEntryDataAdapter.js',
        format: 'iife',
    },
    external: ['uniprot-entry-data-loader'],
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};
