import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import postcssInlineSvg from "postcss-inline-svg";
import commonjs from "rollup-plugin-commonjs";
import path from "path";
import camelCase from "camelcase";

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

export default {
  input: "src/index.js",
  output: {
    file: "dist/" + PKG_JSON.name + ".js",
    format: "iife",
    name: camelCase(PKG_JSON.name, { pascalCase: true }),
    sourcemap: true,
    globals: {
      "uniprot-entry-data-adapter": "UniProtEntryDataAdapter",
      "protvista-uniprot-entry-adapter": "ProtVistaUniProtEntryAdapter",
      d3: "d3",
      "protvista-zoomable": "ProtvistaZoomable",
      "protvista-track": "ProtvistaTrack",
      "resize-observer-polyfill": "ResizeObserver",
      litemol: "Litemol"
    }
  },
  external: [
    "protvista-zoomable",
    "protvista-track",
    "protvista-uniprot-entry-adapter",
    "d3",
    "litemol"
  ],
  plugins: [
    postcss({
      extensions: [".css"],
      plugins: [postcssInlineSvg]
    }),
    nodeResolve({
      jsnext: true
    }),
    babel({
      babelrc: false,
      exclude: "node_modules/**",
      plugins: ["@babel/external-helpers"],
      externalHelpers: true,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              ie: 11
            },
            modules: false
          }
        ]
      ]
    })
  ]
};
