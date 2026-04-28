import NightingaleVariation from "./nightingale-variation";
export { NightingaleVariation as default };
// Marked as `export type` so per-file transpilers (e.g. the dev server's
// `ts.transpileModule` path) drop these from the JS output entirely. A plain
// `export { … }` re-export forces TS to keep them as runtime bindings, which
// then fails at module-link time in the browser because the source uses
// `export type` for the underlying declarations.
export type { VariationDatum, VariationData } from "./nightingale-variation";
export * from "./proteinAPI";
