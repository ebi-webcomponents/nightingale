import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

export default {
    input : 'src/main.js',
    name : 'ProtvistaStructure',
    sourcemap : true,
    output : {
        file: 'dist/protvista-structure.js',
        format: 'iife'
    },
    plugins : [
        nodeResolve({jsnext: true}),
        postcss({}),
        babel({exclude: 'node_modules/**'}),
        copy({
            "litemol-dist-2.4.1/js/LiteMol-plugin.min.js": "dist/LiteMol-plugin.min.js", 
            "litemol-dist-2.4.1/css/LiteMol-plugin.min.css": "dist/LiteMol-plugin.min.css"
        })
    ]
};