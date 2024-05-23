import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";

export default {
  input: "src/index.ts",
  output: {
    dir: "./dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    css(),
    nodeResolve(),
    commonjs(),
    typescript(),
    json(),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
  ],
  external: (id) => /@nightingale-elements/.test(id),
};
