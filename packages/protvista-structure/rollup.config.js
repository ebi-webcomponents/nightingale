import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/main.js',
    name: 'ProtvistaStructure',
    sourcemap: true,
    output: {
        file: 'dist/protvista-structure.js',
        format: 'iife'
    },
    plugins: [nodeResolve({ jsnext: true }), postcss({}), babel({ exclude: 'node_modules/**' })]
};
