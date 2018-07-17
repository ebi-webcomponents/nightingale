import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    name: 'ProtVistaUniProtEntryAdapter',
    sourcemap: true,
    output: {
        file: 'dist/ProtVistaUniProtEntryAdapter.js',
        format: 'iife',
    },
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};
