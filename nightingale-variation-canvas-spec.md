# Spec: `nightingale-variation-canvas`

## Purpose
Create a canvas-backed variant of `nightingale-variation` that preserves the existing public API and behavior, following the pattern established by `nightingale-track-canvas`. Benchmark both implementations to quantify the improvement.

## Non-Goals
- No changes to `nightingale-variation` (or any other package).
- No changes to data models or API responses.
- No new public attributes, events, or methods beyond what `nightingale-variation` already exposes.
- No new visual features — canvas is a pure rendering-backend swap.
- No promotion of shared utilities to `nightingale-new-core` as part of this work (tracked separately as future cleanup).

## Context: Why a second package and not an option on the existing one?
Same rationale `nightingale-track-canvas` used: shipping a sibling package keeps the SVG path untouched (zero risk to existing consumers), keeps the canvas-specific code paths isolated, and lets downstream users opt in by swapping the tag name.

---

## Package Structure
Mirror `nightingale-track-canvas` exactly:

```
packages/nightingale-variation-canvas/
├── README.md
├── package.json          # depends on nightingale-new-core + nightingale-variation + d3
├── tsconfig.json
├── src/
│   ├── index.ts          # re-exports from nightingale-variation + default-exports the canvas class
│   ├── nightingale-variation-canvas.ts
│   └── utils/
│       └── hit-test.ts   # position-indexed lookup + pixel-radius circle test
└── tests/
    └── nightingale-variation-canvas.test.ts
```

`package.json` fields to copy from `nightingale-track-canvas/package.json` and adapt:
- `name`: `@nightingale-elements/nightingale-variation-canvas`
- `description`: "Variation track type of the viewer, implemented via HTML canvas."
- `version`: match the monorepo's current version
- `dependencies`: `@nightingale-elements/nightingale-new-core`, `@nightingale-elements/nightingale-variation`, `d3`

---

## Class Design

```ts
@customElementOnce("nightingale-variation-canvas")
export default class NightingaleVariationCanvas extends withCanvas(NightingaleVariation) { ... }
```

### render()
Return a container with a `<canvas>` underlay and an `<svg>` overlay. The SVG keeps the axes, the `withSVGHighlight` overlay, and serves as the mouse-event capture surface.

```html
<div class="container">
  <div style="position: relative; z-index: 0;">
    <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
    <svg><g class="sequence-features" /></svg>
  </div>
</div>
```

### createFeatures() — override
Mirror the existing method but skip the circle-drawing bit:
- Still build the `series` selection, left/right axes, and `chartArea` scaffolding (axes and highlight stay in SVG).
- Do **not** append any circles in SVG.
- Build a spatial index for hit-testing (see below).
- Bind click / mousemove / mouseout on the SVG (or container) for event dispatch.

### zoomRefreshed() — override
- Call `updateScale()` (as today, for axes).
- Call `this.updateHighlight()`.
- Call `this.requestDraw()` instead of `series.call(variationPlot.drawVariationPlot, this)`.

### refresh() — override
- Call `super.refresh()` then `this.requestDraw()`.

### firstUpdated() — override
Same as parent but end with a `requestDraw()`.

### onCanvasScaleChange() — override
Call `super.onCanvasScaleChange()` then `this.refresh()` (matches track-canvas).

### Draw pipeline
```ts
private readonly _drawStamp = new Stamp(() => ({
  data: this.processedData,
  canvasCtx: this.canvasCtx,
  width: this.width,
  height: this.height,
  canvasScale: this.canvasScale,
  length: this.length,
  "display-start": this["display-start"],
  "display-end": this["display-end"],
  "margin-left": this["margin-left"],
  "margin-right": this["margin-right"],
  "margin-top": this["margin-top"],
  "margin-bottom": this["margin-bottom"],
  condensedView: this.condensedView,
  rowHeight: this.rowHeight,
}));

private requestDraw = () => this._drawer.requestRefresh();
private readonly _drawer = Refresher(() => this._draw());
private _draw() {
  if (!this._drawStamp.update().changed) return;
  this.adjustCanvasCtxLogicalSize();
  this.drawCanvasContent();
}
```

### drawCanvasContent()
```text
clear canvas
compute visible seq range from display-start/display-end (or via getSeqPositionFromX of canvas edges)
for each position in processedData.mutationArray where position is in the visible range AND has variants:
  for each variant at that position:
    cx = scale * (getXFromSeqPosition(variant.start) + halfBaseWidth)
    cy = scale * yScale(variant.variant.charAt(0))
    r  = scale * (variant.size ?? 5)
    ctx.fillStyle = variant.color ?? colorConfig(variant)
    ctx.globalAlpha = 0.6   // matches existing CSS baseline; hover affordance dropped (D1)
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*PI); ctx.fill()
```

### Hit-testing
Variation data is point-like (one position per variant), so no range-overlap index is needed. Build a `Map<number, ProcessedVariationData>` keyed by `pos`, rebuilt once per data change. On `mousemove`/`click`:
1. Convert `event.offsetX` → sequence position via `getSeqPositionFromX`.
2. `O(1)` lookup in the position map.
3. Convert `event.offsetY` → candidate amino-acid row (invert `yScale`).
4. Circle-test the 1–2 variants at that (pos, aa) cell against `(event.offsetX, event.offsetY)` with radius `datum.size ?? 5`.
5. Dispatch via `createEvent(...)` to match `bindEvents`' existing event shape — so downstream consumers see the same `change` custom events with the same `detail` structure.

---

## API Surface to Preserve
Inherited via `NightingaleVariation`, so these come for free as long as we don't break the base class:

- Attributes: `protein-api`, `condensed-view`, `row-height`, plus everything from `withManager` (`width`, `height`, `length`, `display-start`, `display-end`, `highlight`, `margin-*`, `highlight-event`, etc.).
- Property setter: `data`
- Public: `processData()`, `updateData()`, `colorConfig`
- Events: same `change` CustomEvent shape as today (`click`, `mouseover`, `mouseout`, `reset`).

---

## Resolved Decisions

**D1 — Hover opacity affordance: DROPPED.**
Existing CSS applies `opacity: 0.6` to all circles and `opacity: 1` on `:hover`. Canvas draws all circles at `globalAlpha = 0.6` unconditionally. The `:hover` affordance is not replicated. Document this in the README as a known parity gap.

**D2 — `internalId`: NOT SET in canvas path.**
`d.internalId` is written as a side effect inside the existing `drawVariationPlot`. Nothing in the repo reads it. Canvas draw path does not set it. Document this in the README as a known parity gap. The field remains declared on `VariationDatum` (unchanged) and consumers that set it manually still see it preserved.

**D3 — Benchmark methodology: two curves.**
- X axis: number of annotations (variants).
- Y axis A: initial load time (ms) — measured from `data =` setter call to first `_draw()` completion.
- Y axis B: refresh time (ms) — measured as the time for a single `refresh()` → canvas redraw cycle after `display-start`/`display-end` change.
- Sweep range: 100, 500, 1k, 2k, 5k, 10k, 20k variants (adjust after a first pass if curves are uninformative).
- One harness page under `dev/benchmarks/` that instantiates both components, runs the sweep, and outputs a table (page + console).
- Use a seeded RNG so runs are reproducible.
- FPS, memory, and interaction latency intentionally out of scope for this round.

**D4 — Shared utilities: DUPLICATE locally, no `new-core` changes.**
Variation's point-like data means no `RangeCollection`-style spatial index is needed. Hit-testing uses a local `Map<number, ProcessedVariationData>`. If any small helper from `nightingale-track-canvas/src/utils/utils.ts` proves useful (e.g. `last()`), duplicate it under `nightingale-variation-canvas/src/utils/`. Promotion to `new-core` is tracked as a future cleanup, out of scope here.

---

## Acceptance Criteria

### Functional parity
- [ ] `nightingale-variation-canvas` registers as custom element `nightingale-variation-canvas`.
- [ ] All attributes listed under "API Surface" behave identically to `nightingale-variation`.
- [ ] `click`, `mouseover`, `mouseout` events fire with the same `detail` payload shape and at the same logical trigger points.
- [ ] `highlight-event="onclick"` and `highlight-event="onmouseover"` both work.
- [ ] Highlight overlay (`withSVGHighlight`) renders correctly over canvas content.
- [ ] Axes render identically to SVG version (same labels, same placement).
- [ ] `condensed-view` hides empty amino-acid rows; `row-height` resizes rows.
- [ ] Component responds to `display-start` / `display-end` / `length` changes and `zoomRefreshed()`.

### Rendering fidelity
- [ ] Circles positioned at the same (seq, aa) coordinates as the SVG version.
- [ ] Circle radius matches `datum.size ?? 5`.
- [ ] Circle color matches `datum.color ?? colorConfig(datum)`.
- [ ] Visual output is sharp on HiDPI displays (relies on `withCanvas`'s `devicePixelRatio` handling).
- [ ] No visible stale content after rapid `display-start`/`display-end` changes.

### Performance
- [ ] Canvas version is not meaningfully slower than SVG version at 100 variants.
- [ ] Canvas version is **measurably faster** at ≥2k variants on both initial load time and refresh time.
- [ ] Canvas version **does not freeze the main thread** at 20k variants where SVG does.
- [ ] Both curves (initial load vs N, refresh vs N) are documented in the benchmark output.

Exact thresholds TBD once we run the benchmark once and see what numbers look like.

---

## Tests

### Unit
- Any new utility in `src/utils/` (spatial index, hit-test math) gets a test file modeled on `nightingale-track-canvas/tests/nightingale-track-canvas.test.ts`.

### Integration / rendering
- Render the component with a fixture (`tests/fixtures/P42336.variation.json` already exists in `nightingale-variation/tests/`) and assert:
  - Canvas element exists in the shadow DOM.
  - After `data` is set, `canvasCtx` has been written to (non-empty pixel buffer; or simpler: spy on the draw method and assert it was called).
  - `click` dispatches a `change` event with correct `detail.feature`.
  - `highlight` attribute wires through.

### Visual regression (optional, stretch)
- Canvas rendered output captured via `toBlob()` and snapshotted. Only if the repo already has a visual-snapshot setup — skip otherwise.

### Benchmark (reproducible)
- `dev/benchmarks/variation-canvas.html` (or similar) that produces a deterministic two-curve results table given a fixed RNG seed: annotations × initial-load-time and annotations × refresh-time.

---

## Storybook Story
Add a matching story under `stories/` that mirrors the existing variation story and the track-canvas story:

- Location: `stories/XX.NightingaleVariationCanvas/` (next available number).
- Files: `NightingaleVariationCanvas.stories.ts` and `NightingaleVariationCanvas.stories.mdx`.
- Content: mirror `stories/16.Variation/NightingaleVariation.stories.ts` exactly, swapping the tag name. Reuse the same fixtures so the story is a direct visual comparison.
- Purpose: lets reviewers eyeball parity during PR review and gives docs consumers a page to reference.

## README
Mirror the `nightingale-track-canvas/README.md` structure. Required sections:

- **Overview** — one-line summary and the tag name (`nightingale-variation-canvas`).
- **Usage** — minimal example snippet, effectively identical to `nightingale-variation`'s usage with the tag swapped.
- **API** — point readers at `nightingale-variation`'s README rather than duplicating the full attribute table; note that canvas version preserves the same API.
- **Parity gaps** — a short, explicit list:
  - Hover opacity affordance (`circle:hover { opacity: 1 }`) is not replicated. All circles render at `globalAlpha = 0.6`.
  - `VariationDatum.internalId` is not set as a side effect during rendering. The field remains on the type for consumers who set it themselves.
- **Performance** — link to the benchmark page; include a short summary of the two-curve results once we have numbers.

## Release / Versioning
This repo uses Lerna in **fixed-version mode** (single `version` in `lerna.json` applies to all packages). No per-package version bumps or changelog entries required for this PR:

- Set the new package's `version` in `package.json` to match `nightingale-variation`'s current version (currently `5.6.0`).
- Do **not** modify `lerna.json`.
- No `CHANGELOG.md` to update — this repo doesn't maintain one; git tags are the release record.
- PR title / description should explain the addition (standard repo convention based on recent history).

---

## Implementation Order (suggested)
1. Scaffold `packages/nightingale-variation-canvas/` with empty class, `render()`, and package.json.
2. Get it to mount with a data set and draw **any** circle on canvas.
3. Wire `createFeatures()` / `zoomRefreshed()` / `refresh()` correctly.
4. Implement `drawCanvasContent()` full fidelity.
5. Implement hit-testing + event dispatch.
6. Port/adapt the `Refresher`+`Stamp` debounce.
7. Handle `condensed-view`, `row-height`, `highlight`.
8. Benchmark harness.
9. Tests.
10. README.

---

## Risks & Mitigations
- **Hit-testing drift from SVG behavior.** Mitigation: event dispatch uses the same `createEvent()` helper, and hit-test geometry mirrors the draw geometry exactly.
- **HiDPI blurriness.** Mitigation: `withCanvas` already handles DPR; track-canvas is the reference implementation.
- **Event dispatch order / timing differences.** Canvas events go through `mousemove` sampling rather than per-circle SVG events — rapid mouse movement could skip entries. Mitigation: dispatch on every `mousemove`, and dispatch `mouseout` when the hit-test returns nothing.
- **a11y regression.** SVG circles are in the DOM; canvas circles are not. Variation already doesn't set ARIA attributes on circles, so parity is preserved. Out of scope to add.
