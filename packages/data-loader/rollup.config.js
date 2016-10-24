import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
const process = require('process');

const PROD = process.env.NODE_ENV === 'production';

export default {
  entry: 'src/index.js',
  format: 'iife',
  dest: 'dist/index.js',
  sourceMap: true,
  moduleName: 'DataLoader',
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**',
      presets: ['es2017'],
      env: {
        production: {
          presets: ['babili'],
        }
      }
    }),
  ],
  intro: PROD ? '' : `
    const livereloadScript = document.createElement('script');
    livereloadScript.type = 'text/javascript';
    livereloadScript.async = true;
    livereloadScript.src = (
      '//' + location.hostname + ':35729/livereload.js?snipver=1'
    );
    document.head.appendChild(livereloadScript);
  `.trim(),
};
