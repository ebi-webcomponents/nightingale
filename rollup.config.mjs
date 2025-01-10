import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
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
    // Replace terser with esbuild for minification
    esbuild({
      target: "es2021", // Set the output target for minification
      minify: true, // Enable minification
    }),
  ],
  external: (id) => /@nightingale-elements/.test(id),
};
