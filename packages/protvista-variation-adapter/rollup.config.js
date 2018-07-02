import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/protvista-variation-adapter.js',
        format: 'iife',
        name: 'ProtvistaVariationAdapter',
        sourcemap: true,
        globals: {
            'protvista-uniprot-entry-adapter': 'ProtVistaUniProtEntryAdapter'
        }
    },
    external: ['protvista-uniprot-entry-adapter'],
    plugins: [
        postcss({ extensions: ['.css'] }),
        nodeResolve({ jsnext: true }),
        babel({ exclude: 'node_modules/**' })
    ]
};
