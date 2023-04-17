import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import webWorkerLoader from "rollup-plugin-web-worker-loader";

export default {
  input: "src/index.ts",
  output: {
    dir: "./dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs(),
    // rollupImportMapPlugin("../../dev/import-map.json"),
    webWorkerLoader({
      pattern: /(.+\.worker\..+)/,
    }),
    json(),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
  ],
  external: (id) => /@nightingale-elements/.test(id),
};
