import {
  createEvent,
  customElementOnce,
  Refresher,
  Stamp,
  withCanvas,
} from "@nightingale-elements/nightingale-new-core";
import NightingaleVariation, {
  VariationDatum,
} from "@nightingale-elements/nightingale-variation";
import { BaseType, Selection } from "d3";
import { html } from "lit";

// Re-declared locally because `ProcessedVariationData` is not exported from
// `@nightingale-elements/nightingale-variation`'s public entry point. Keep
// this shape in sync with `packages/nightingale-variation/src/nightingale-variation.ts`.
// Eventually `@nightingale-elements/nightingale-variation` will become obsolete.
type ProcessedVariationData = {
  type: string;
  normal: string;
  pos: number;
  variants: VariationDatum[];
};

/** Default circle radius if `VariationDatum.size` is not provided. Mirrors SVG default in `variationPlot.ts`. */
const DEFAULT_RADIUS = 5;

/** Upper bound used when determining hit-test candidate positions; real `datum.size` values are typically ≤ 10.
 * Variants with `size > MAX_HIT_RADIUS` still render, but their outer ring won't be hit-testable —
 * `buildVariantIndex` warns once on the console when this is detected. */
const MAX_HIT_RADIUS = 10;

/** Base opacity for variant circles. Matches `circle { opacity: 0.6 }` in SVG variation CSS. */
const VARIANT_ALPHA = 0.6;

// TODO(deprecation): when `nightingale-variation` is removed, lift the shared
// data-side logic (types, processVariants, proteinAPI, AA list, axis/y-scale
// setup) into a base class or utility module rather than absorbing it
// directly here. The current `extends withCanvas(NightingaleVariation)` is a
// shortcut for the co-existence period; once the SVG version is gone, the
// inheritance has to be undone.
@customElementOnce("nightingale-variation-canvas")
export default class NightingaleVariationCanvas extends withCanvas(
  NightingaleVariation,
) {
  /** Variants indexed by sequence position for fast hit-testing. */
  private variantIndex?: Map<number, VariationDatum[]>;

  /** Variant currently under the mouse. Drawn at full opacity to mirror the
   * SVG `circle:hover { opacity: 1 }` affordance. */
  private hoveredVariant: VariationDatum | null = null;

  /** Variant most recently dispatched on a `mouseover` event. Tracked separately
   * from `hoveredVariant` so we only fire `mouseover` / `mouseout` on actual
   * boundary crossings, not on every `mousemove` over the same circle (which
   * would spam consumers — particularly anything bound via `highlight-event="onmouseover"`). */
  private lastDispatchedVariant: VariationDatum | null = null;

  /** Foreground canvas layered above the SVG (via `pointer-events: none`), used
   * to redraw the hovered variant at full opacity on top of the SVG highlight
   * band so the band doesn't tint the circle. */
  private foregroundCanvasCtx?: CanvasRenderingContext2D;

  override render() {
    return html`
      <style>
        nightingale-variation-canvas {
          display: flex;
          width: 100%;
        }
        nightingale-variation-canvas svg {
          background-color: transparent;
        }
        nightingale-variation-canvas .tick line,
        nightingale-variation-canvas .axis path {
          opacity: 0.1;
          pointer-events: none;
        }
        nightingale-variation-canvas .variation-y-right line,
        nightingale-variation-canvas .axis path {
          fill: none;
          stroke: none;
        }
      </style>
      <div class="container">
        <div style="position: relative; z-index: 0;">
          <canvas
            class="background"
            style="position: absolute; left: 0; top: 0; z-index: -1; pointer-events: none;"
          ></canvas>
          <svg>
            <g class="sequence-features" />
          </svg>
          <canvas
            class="foreground"
            style="position: absolute; left: 0; top: 0; z-index: 1; pointer-events: none;"
          ></canvas>
        </div>
      </div>
    `;
  }

  override createFeatures() {
    super.createFeatures();
    // updateScale (inside super.createFeatures) can mutate `this.height`.
    // Re-run onDimensionsChange so the canvas CSS size tracks it; otherwise
    // the oversized pixel buffer gets squashed into a stale CSS height.
    this.onDimensionsChange();
    this.variantIndex = buildVariantIndex(this.processedData?.mutationArray);
    if (this.svg) {
      this.unbindEvents(this.svg);
      this.bindEvents(this.svg);
    }
    this.requestDraw();
  }

  override zoomRefreshed() {
    if (this.series) {
      this.updateScale();
      this.onDimensionsChange();
      this.updateHighlight();
    }
    this.requestDraw();
  }

  refresh() {
    this.requestDraw();
  }

  override firstUpdated() {
    super.firstUpdated();
    const foreground =
      this.renderRoot.querySelector<HTMLCanvasElement>("canvas.foreground");
    this.foregroundCanvasCtx = foreground?.getContext("2d") ?? undefined;
    if (foreground) {
      foreground.style.width = `${this.width}px`;
      foreground.style.height = `${this.height}px`;
    }
    this.requestDraw();
  }

  override onCanvasScaleChange() {
    super.onCanvasScaleChange();
    this.refresh();
  }

  private readonly _backgroundStamp = new Stamp(() => ({
    processedData: this["processedData"],
    canvasCtx: this["canvasCtx"],
    width: this["width"],
    height: this["height"],
    canvasScale: this["canvasScale"],
    length: this["length"],
    "display-start": this["display-start"],
    "display-end": this["display-end"],
    "margin-left": this["margin-left"],
    "margin-right": this["margin-right"],
    "margin-top": this["margin-top"],
    "margin-bottom": this["margin-bottom"],
    condensedView: this["condensedView"],
    rowHeight: this["rowHeight"],
    colorConfig: this["colorConfig"],
  }));

  /** Request canvas redraw (debounced). */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());

  /** Resolvers for `whenDrawn()` promises waiting on the next `_draw` to finish. */
  private _drawCompleteResolvers: Array<() => void> = [];

  /** Returns a promise that resolves after the next `_draw` finishes. Useful
   * for tests and benchmarks that need to await actual draw completion rather
   * than guessing with `requestAnimationFrame`. The caller is expected to have
   * just triggered a redraw (e.g. via `data =` or a `display-start`/`display-end`
   * change); if no redraw is pending, the promise will not resolve until the
   * next one happens. */
  whenDrawn(): Promise<void> {
    return new Promise((resolve) => {
      this._drawCompleteResolvers.push(resolve);
    });
  }

  /** Do not call directly — call `requestDraw` instead to avoid blocking the main thread. */
  private _draw(): void {
    const backgroundChanged = this._backgroundStamp.update().changed;
    if (backgroundChanged) {
      this.adjustCanvasCtxLogicalSize();
      this.drawCanvasContent();
    }
    // Foreground is a single circle — cheap to redraw every tick, which covers
    // hover changes without forcing a full background redraw.
    this.adjustForegroundCtxLogicalSize();
    this.drawForegroundContent();

    if (this._drawCompleteResolvers.length > 0) {
      const resolvers = this._drawCompleteResolvers;
      this._drawCompleteResolvers = [];
      for (const resolve of resolvers) resolve();
    }
  }

  private adjustForegroundCtxLogicalSize() {
    const fg = this.foregroundCanvasCtx;
    if (!fg) return;
    const newWidth = Math.floor(this.width * this.canvasScale);
    const newHeight = Math.floor(this.height * this.canvasScale);
    if (fg.canvas.width !== newWidth) fg.canvas.width = newWidth;
    if (fg.canvas.height !== newHeight) fg.canvas.height = newHeight;
    fg.canvas.style.width = `${this.width}px`;
    fg.canvas.style.height = `${this.height}px`;
  }

  private drawForegroundContent(): void {
    const ctx = this.foregroundCanvasCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const hovered = this.hoveredVariant;
    if (!hovered || !this.yScale) return;
    const aa = hovered.variant?.charAt(0);
    if (!aa) return;
    const yRow = this.yScale(aa);
    if (yRow === undefined) return;

    const scale = this.canvasScale;
    const halfBaseWidth = 0.5 * this.getSingleBaseWidth();
    const cx =
      scale * (this.getXFromSeqPosition(hovered.start) + halfBaseWidth);
    const cy = scale * (this["margin-top"] + yRow);
    const r = scale * (hovered.size ?? DEFAULT_RADIUS);

    ctx.globalAlpha = 1;
    ctx.fillStyle = hovered.color ?? this.colorConfig(hovered);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();
  }

  private drawCanvasContent() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const mutations = this.processedData?.mutationArray;
    if (!mutations || !this.yScale) return;

    const scale = this.canvasScale;
    const halfBaseWidth = 0.5 * this.getSingleBaseWidth();
    const leftEdgeSeq = this.getSeqPositionFromX(-MAX_HIT_RADIUS) ?? -Infinity;
    const rightEdgeSeq =
      this.getSeqPositionFromX(canvasWidth / scale + MAX_HIT_RADIUS) ??
      Infinity;
    const marginTop = this["margin-top"];

    ctx.globalAlpha = VARIANT_ALPHA;

    for (const entry of mutations) {
      if (entry.pos < leftEdgeSeq || entry.pos > rightEdgeSeq) continue;
      if (entry.variants.length === 0) continue;

      const cx = scale * (this.getXFromSeqPosition(entry.pos) + halfBaseWidth);

      for (const variant of entry.variants) {
        const aa = variant.variant?.charAt(0);
        if (!aa) continue;
        const yRow = this.yScale(aa);
        if (yRow === undefined) continue;

        const cy = scale * (marginTop + yRow);
        const r = scale * (variant.size ?? DEFAULT_RADIUS);
        ctx.fillStyle = variant.color ?? this.colorConfig(variant);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  private setHoveredVariant(variant: VariationDatum | null): void {
    if (this.hoveredVariant === variant) return;
    this.hoveredVariant = variant;
    this.requestDraw();
  }

  private getVariantAt(
    offsetX: number,
    offsetY: number,
  ): VariationDatum | undefined {
    if (!this.variantIndex || !this.yScale) return undefined;
    const baseWidth = this.getSingleBaseWidth();
    if (!(baseWidth > 0)) return undefined;

    const halfBaseWidth = 0.5 * baseWidth;
    const seqMin = this.getSeqPositionFromX(offsetX - MAX_HIT_RADIUS);
    const seqMax = this.getSeqPositionFromX(offsetX + MAX_HIT_RADIUS);
    if (seqMin === undefined || seqMax === undefined) return undefined;

    const posMin = Math.max(1, Math.floor(seqMin));
    const posMax = Math.ceil(seqMax);

    const marginTop = this["margin-top"];
    let hit: VariationDatum | undefined;
    for (let pos = posMin; pos <= posMax; pos++) {
      const variants = this.variantIndex.get(pos);
      if (!variants) continue;
      const cx = this.getXFromSeqPosition(pos) + halfBaseWidth;
      for (const variant of variants) {
        const aa = variant.variant?.charAt(0);
        if (!aa) continue;
        const yRow = this.yScale(aa);
        if (yRow === undefined) continue;
        const cy = marginTop + yRow;
        const r = variant.size ?? DEFAULT_RADIUS;
        const dx = offsetX - cx;
        const dy = offsetY - cy;
        if (dx * dx + dy * dy <= r * r) {
          // Later-drawn variants appear on top; keep the last match.
          hit = variant;
        }
      }
    }
    return hit;
  }

  private bindEvents<T extends BaseType>(
    target: Selection<T, unknown, BaseType, unknown>,
  ): void {
    target.on("click.NightingaleVariationCanvas", (event: MouseEvent) =>
      this.handleClick(event),
    );
    target.on("mousemove.NightingaleVariationCanvas", (event: MouseEvent) =>
      this.handleMousemove(event),
    );
    target.on("mouseout.NightingaleVariationCanvas", (event: MouseEvent) =>
      this.handleMouseout(event),
    );
  }

  private unbindEvents<T extends BaseType>(
    target: Selection<T, unknown, BaseType, unknown>,
  ): void {
    target.on("click.NightingaleVariationCanvas", null);
    target.on("mousemove.NightingaleVariationCanvas", null);
    target.on("mouseout.NightingaleVariationCanvas", null);
  }

  private getLocalCoords(event: MouseEvent): { x: number; y: number } | null {
    const svgNode = this.svg?.node();
    if (!svgNode) return null;
    const rect = svgNode.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private handleClick(event: MouseEvent): void {
    const coords = this.getLocalCoords(event);
    if (!coords) return;
    const variant = this.getVariantAt(coords.x, coords.y);
    if (!variant) return;
    const withHighlight = this.getAttribute("highlight-event") === "onclick";
    const customEvent = createEvent(
      "click",
      variant,
      withHighlight,
      true,
      variant.start,
      getVariantEnd(variant),
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMousemove(event: MouseEvent): void {
    const coords = this.getLocalCoords(event);
    if (!coords) return;
    const variant = this.getVariantAt(coords.x, coords.y) ?? null;
    this.setHoveredVariant(variant);

    // Only dispatch on transitions: empty→variant, variant→variant', variant→empty.
    if (variant === this.lastDispatchedVariant) return;
    if (this.lastDispatchedVariant) {
      this.dispatchMouseout(event);
    }
    if (variant) {
      this.dispatchMouseover(event, variant);
    }
    this.lastDispatchedVariant = variant;
  }

  private handleMouseout(event: MouseEvent): void {
    this.setHoveredVariant(null);
    if (!this.lastDispatchedVariant) return;
    this.dispatchMouseout(event);
    this.lastDispatchedVariant = null;
  }

  private dispatchMouseover(event: MouseEvent, variant: VariationDatum): void {
    const withHighlight =
      this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseover",
      variant,
      withHighlight,
      false,
      variant.start,
      getVariantEnd(variant),
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private dispatchMouseout(event: MouseEvent): void {
    const withHighlight =
      this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseout",
      null,
      withHighlight,
      undefined,
      undefined,
      undefined,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }
}

/** Resolve a variant's end position for highlight-event dispatch. Protein-API
 * variants carry `end` as a string (spread from the raw Variant type); plain
 * VariationDatum objects have no `end` field — fall back to `start` so the
 * column highlight still fires. */
function getVariantEnd(variant: VariationDatum): number {
  const end = (variant as unknown as { end?: number | string }).end;
  if (end === undefined || end === null || end === "") return variant.start;
  const n = Number(end);
  return Number.isFinite(n) ? n : variant.start;
}

function buildVariantIndex(
  mutationArray: ProcessedVariationData[] | undefined,
): Map<number, VariationDatum[]> {
  const index = new Map<number, VariationDatum[]>();
  if (!mutationArray) return index;
  let warnedOversized = false;
  for (const entry of mutationArray) {
    if (entry.variants.length === 0) continue;
    index.set(entry.pos, entry.variants);
    if (!warnedOversized) {
      for (const v of entry.variants) {
        if ((v.size ?? 0) > MAX_HIT_RADIUS) {
          // eslint-disable-next-line no-console
          console.warn(
            `nightingale-variation-canvas: variant size ${v.size} exceeds MAX_HIT_RADIUS=${MAX_HIT_RADIUS}; the outer ring will render but may not be hit-testable.`,
          );
          warnedOversized = true;
          break;
        }
      }
    }
  }
  return index;
}
