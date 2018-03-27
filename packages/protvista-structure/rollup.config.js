import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/main.js',
    name: 'ProtvistaStructure',
    sourcemap: true,
    output: {
        file: 'dist/protvista-structure.js',
        format: 'iife'
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**',
            exclude: 'node_modules/style-inject/**'
        }),
        postcss(),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
};
