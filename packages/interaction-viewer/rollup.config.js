import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import minify from 'rollup-plugin-babel-minify';

export default {
    input: 'src/main.js',
    name: 'InteractionViewer',
    sourcemap: true,
    output: {
        file: 'dist/interaction-viewer.js',
        format: 'iife'
    },
    plugins: [
        postcss({
            plugins: [
                cssnano()
            ],
            extensions: ['.css']
        }),
        nodeResolve({
            jsnext: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        minify()
    ]
};