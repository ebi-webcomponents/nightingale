import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index.js',
    dest: 'dist/StructureDataParser.js',
    format: 'iife',
    moduleName: 'StructureDataParser',
    sourceMap: true,
    external: ['_'],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ],
};