import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    dest: 'dist/StructureAdapterComponent.js',
    format: 'iife',
    moduleName: 'StructureAdapterComponent',
    sourceMap: true,
    plugins: [
        nodeResolve({jsnext: true}),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};