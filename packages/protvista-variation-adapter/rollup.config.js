import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/main.js',
    name: 'ProtvistaVariationAdapter',
    sourcemap: true,
    output: {
        file: 'dist/protvista-variation-adapter.js',
        format: 'iife'
    },
    external: ['uniprot-entry-data-adapter'],
    plugins: [
        postcss({ extensions: ['.css'] }),
        nodeResolve({ jsnext: true }),
        babel({ exclude: 'node_modules/**' })
    ]
};
