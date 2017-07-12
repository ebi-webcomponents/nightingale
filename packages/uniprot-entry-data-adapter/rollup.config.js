import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    dest: 'dist/UniProtEntryDataAdapter.js',
    format: 'iife',
    moduleName: 'UniProtEntryDataAdapter',
    sourceMap: true,
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};