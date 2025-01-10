import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    {
      ...css(),
      enforce: "post",
    },
    commonjs(),
    dts({
      outputDir: "dist/types",
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    sourcemap: true,
    rollupOptions: {
      external: (id) => /@nightingale-elements/.test(id),
      output: {
        dir: "./dist",
      },
    },
  },
});
