import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import conditional from "rollup-plugin-conditional";

const isProduction = process.env.NODE_ENV === "production";

export default {
    input: 'src/main.js',
    name: 'ProtvistaVariation',
    sourcemap: true,
    output: {
        file: 'dist/protvista-variation.js',
        format: 'iife'
    },
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        conditional(isProduction, [
            minify()
        ])
    ]
};