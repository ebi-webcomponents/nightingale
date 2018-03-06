import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";

export default {
    input : 'src/main.js',
    name : 'ProtvistaVariation',
    sourcemap : true,
    output : {
        file: 'dist/protvista-variation.js',
        format: 'iife'
    },
    external: ['d3','protvista-track'],
    plugins : [
        postcss({extensions: ['.css']}),
        nodeResolve({jsnext: true}),
        babel({exclude: 'node_modules/**'})
    ]
};