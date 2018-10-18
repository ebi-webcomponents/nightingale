import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";
import postcssInlineSvg from "postcss-inline-svg";
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'iife',
        name: 'wc',
        sourcemap: true,
        globals: {
            'protvista-uniprot-entry-adapter': 'ProtVistaUniProtEntryAdapter',
            'd3': 'd3',
            'protvista-zoomable': 'ProtvistaZoomable',
            'protvista-track': 'ProtvistaTrack',
            'resize-observer-polyfill': 'ResizeObserver'
        }
    },
    external: ['protvista-zoomable', 'protvista-track', 'protvista-uniprot-entry-adapter', 'd3'],
    plugins: [
        postcss({
            extensions: ['.css'],
            plugins: [postcssInlineSvg]
        }),
        nodeResolve({
            jsnext: true
        }),
        //Required for LiteMol
        commonjs({
            include: 'node_modules/**',
            exclude: 'node_modules/style-inject/**'
        }),
        babel({
            exclude: 'node_modules/**'
        })
    ],
};