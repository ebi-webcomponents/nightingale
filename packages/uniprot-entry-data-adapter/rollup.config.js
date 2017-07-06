import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    dest: 'dist/EntryDataAdapter.js',
    format: 'iife',
    moduleName: 'EntryDataAdapter',
    sourceMap: true,
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};