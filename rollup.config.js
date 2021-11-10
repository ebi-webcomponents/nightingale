import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/my-element.ts",
  output: {
    dir: "./dist",
    format: "es",
  },
  plugins: [typescript(), nodeResolve()],
};
