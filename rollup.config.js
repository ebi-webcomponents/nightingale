import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
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
    typescript(),
    nodeResolve(),
    rollupImportMapPlugin("../../dev/import-map.json"),
    json(),
  ],
};
