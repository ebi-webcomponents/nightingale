import { createRequire } from "module";

// Load `typescript` via createRequire so we get the package's CJS module
// object (it isn't ESM-friendly via a default import in some Node versions).
const require = createRequire(import.meta.url);
const ts = require("typescript");

const PACKAGE_PREFIX = "@nightingale-elements/";

/*
 * Resolves bare imports of `@nightingale-elements/<name>` to that package's
 * source entry point in this monorepo, so `dev/` and `dev/benchmarks/` pages
 * can run without a `yarn build` step. The dev server compiles TypeScript on
 * the fly and serves source directly from each package's `src/index.ts`.
 */
const nightingaleSrcResolver = {
  name: "nightingale-src-resolver",
  resolveImport({ source }) {
    if (!source.startsWith(PACKAGE_PREFIX)) return;
    const name = source.slice(PACKAGE_PREFIX.length);
    return `/packages/${name}/src/index.ts`;
  },
};

/**
 * Per-request TypeScript → JavaScript transpile using `ts.transpileModule`.
 * Single-file transpile (no cross-file type checking) is exactly what the
 * dev server needs — fast, no rollup dependency, no native binaries.
 */
const typescriptTranspilePlugin = {
  name: "typescript-transpile",
  transform(context) {
    if (!context.path.endsWith(".ts") && !context.path.endsWith(".tsx")) return;
    const source =
      typeof context.body === "string"
        ? context.body
        : context.body?.toString("utf8") ?? "";
    const result = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ES2020,
        experimentalDecorators: true,
        useDefineForClassFields: false,
        esModuleInterop: false,
        allowSyntheticDefaultImports: true,
        importHelpers: false,
        inlineSources: true,
        inlineSourceMap: true,
        jsx: context.path.endsWith(".tsx") ? ts.JsxEmit.Preserve : undefined,
      },
      fileName: context.path,
    });
    return { body: result.outputText };
  },
};

export default {
  nodeResolve: true,
  watch: true,
  mimeTypes: {
    "**/*.ts": "js",
    "**/*.tsx": "js",
  },
  plugins: [nightingaleSrcResolver, typescriptTranspilePlugin],
};
