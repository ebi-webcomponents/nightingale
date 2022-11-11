import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: {
    dir: "./dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    typescript({ target: "es2015", experimentalDecorators: true }),
    nodeResolve(),
    commonjs(),
    rollupImportMapPlugin("../../dev/import-map.json"),
    json(),
  ],
};
