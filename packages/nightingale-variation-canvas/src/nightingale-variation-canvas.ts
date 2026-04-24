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
// `@nightingale-elements/nightingale-variation`'s public entry point, and the
// spec forbids modifying that package. Keep this shape in sync with
// `packages/nightingale-variation/src/nightingale-variation.ts`.
type ProcessedVariationData = {
  type: string;
  normal: string;
  pos: number;
  variants: VariationDatum[];
};

/** Default circle radius if `VariationDatum.size` is not provided. Mirrors SVG default in `variationPlot.ts`. */
const DEFAULT_RADIUS = 5;

/** Upper bound used when determining hit-test candidate positions; real `datum.size` values are typically ≤ 10. */
const MAX_HIT_RADIUS = 10;

/** Opacity at which variant circles are drawn. Matches `circle { opacity: 0.6 }` in SVG variation CSS. */
const VARIANT_ALPHA = 0.6;

@customElementOnce("nightingale-variation-canvas")
export default class NightingaleVariationCanvas extends withCanvas(
  NightingaleVariation,
) {
  /** Variants indexed by sequence position for fast hit-testing. */
  private variantIndex?: Map<number, VariationDatum[]>;

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
          <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
          <svg>
            <g class="sequence-features" />
          </svg>
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
    this.requestDraw();
  }

  override onCanvasScaleChange() {
    super.onCanvasScaleChange();
    this.refresh();
  }

  private readonly _drawStamp = new Stamp(() => ({
    "processedData": this["processedData"],
    "canvasCtx": this["canvasCtx"],
    "width": this["width"],
    "height": this["height"],
    "canvasScale": this["canvasScale"],
    "length": this["length"],
    "display-start": this["display-start"],
    "display-end": this["display-end"],
    "margin-left": this["margin-left"],
    "margin-right": this["margin-right"],
    "margin-top": this["margin-top"],
    "margin-bottom": this["margin-bottom"],
    "condensedView": this["condensedView"],
    "rowHeight": this["rowHeight"],
    "colorConfig": this["colorConfig"],
  }));

  /** Request canvas redraw (debounced). */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());
  /** Do not call directly — call `requestDraw` instead to avoid blocking the main thread. */
  private _draw(): void {
    if (!this._drawStamp.update().changed) return;
    this.adjustCanvasCtxLogicalSize();
    this.drawCanvasContent();
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
    const leftEdgeSeq =
      this.getSeqPositionFromX(-MAX_HIT_RADIUS) ?? -Infinity;
    const rightEdgeSeq =
      this.getSeqPositionFromX(canvasWidth / scale + MAX_HIT_RADIUS) ?? Infinity;
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
      variant as unknown as Parameters<typeof createEvent>["1"],
      withHighlight,
      true,
      variant.start,
      undefined,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMousemove(event: MouseEvent): void {
    const coords = this.getLocalCoords(event);
    if (!coords) return;
    const variant = this.getVariantAt(coords.x, coords.y);
    if (!variant) {
      this.handleMouseout(event);
      return;
    }
    const withHighlight =
      this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseover",
      variant as unknown as Parameters<typeof createEvent>["1"],
      withHighlight,
      false,
      variant.start,
      undefined,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMouseout(event: MouseEvent): void {
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

function buildVariantIndex(
  mutationArray: ProcessedVariationData[] | undefined,
): Map<number, VariationDatum[]> {
  const index = new Map<number, VariationDatum[]>();
  if (!mutationArray) return index;
  for (const entry of mutationArray) {
    if (entry.variants.length === 0) continue;
    index.set(entry.pos, entry.variants);
  }
  return index;
}
