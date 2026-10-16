import { createRequire } from "module";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const require = createRequire(import.meta.url);

// molstar 5.x statically imports a few Node builtins. For a browser bundle we
// redirect them to browser polyfills (already installed as pdbe-molstar deps),
// and stub out the purely-Node ones (molstar only touches `fs` on Node paths).
function nodeBuiltinShims() {
  const polyfills = {
    path: "path-browserify",
    crypto: "crypto-browserify",
  };
  const stub = new Set([
    "fs",
    "os",
    "zlib",
    "http",
    "https",
    "net",
    "tls",
    "child_process",
    "worker_threads",
  ]);
  const STUB_ID = "\0node-builtin-stub";
  // molstar's MP4-export encoder is an emscripten *node* build pulling in
  // node-only requires. We don't expose MP4 export, so it gets its own stub
  // that declares the named export molstar destructures — otherwise rollup
  // reports a missing export and emits a binding that throws on access.
  const MP4_STUB_ID = "\0h264-mp4-encoder-stub";
  return {
    name: "node-builtin-shims",
    resolveId(source) {
      if (source === "h264-mp4-encoder") return MP4_STUB_ID;
      if (polyfills[source]) {
        try {
          return require.resolve(polyfills[source]);
        } catch {
          return STUB_ID;
        }
      }
      if (stub.has(source)) return STUB_ID;
      return null;
    },
    load(id) {
      if (id === STUB_ID) return "export default {};";
      if (id === MP4_STUB_ID) {
        return [
          "export function createH264MP4Encoder() {",
          "  throw new Error(",
          '    "MP4 export is not available in nightingale-structure."',
          "  );",
          "}",
          "export default { createH264MP4Encoder };",
        ].join("\n");
      }
      return null;
    },
  };
}

// Package-local rollup config.
//
// nightingale-structure bundles pdbe-molstar (which bundles molstar). Unlike the
// shared root config, it must import CSS as a *string* (not extract it to a file):
// pdbe-molstar's stylesheet is injected into document.head at runtime, so the
// canvas/viewport sizes correctly. Nightingale components render into the light
// DOM (NightingaleElement.createRenderRoot returns `this`), so there is no shadow
// boundary to scope the stylesheet to.
//
// `browser: true` / `preferBuiltins: false` make node-resolve pick pdbe-molstar's and
// molstar's browser builds / polyfills rather than node builtins.
function cssAsString() {
  return {
    name: "css-as-string",
    transform(code, id) {
      const path = id.split("?")[0];
      // pdbe-molstar imports its raw SCSS source as a side effect (for its own
      // webpack build). We inject the prebuilt build/pdbe-molstar.css instead,
      // so stub SCSS out to an empty module.
      if (path.endsWith(".scss") || path.endsWith(".sass")) {
        return { code: "export default '';", map: { mappings: "" } };
      }
      // Plain .css (e.g. pdbe-molstar's prebuilt stylesheet) is imported as a
      // string so it can be injected into the document.
      if (path.endsWith(".css")) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" },
        };
      }
      return null;
    },
  };
}

export default {
  input: "src/index.ts",
  output: {
    dir: "./dist",
    format: "es",
    sourcemap: "hidden",
  },
  plugins: [
    nodeBuiltinShims(),
    cssAsString(),
    nodeResolve({ browser: true, preferBuiltins: false }),
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
  // molstar/io-ts/fp-ts produce many benign circular-dependency and
  // top-level-`this` warnings (TS helper shims); silence just those.
  onwarn(warning, warn) {
    if (
      warning.code === "THIS_IS_UNDEFINED" ||
      warning.code === "CIRCULAR_DEPENDENCY" ||
      warning.code === "EVAL"
    ) {
      return;
    }
    warn(warning);
  },
};
