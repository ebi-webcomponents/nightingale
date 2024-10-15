import { createEvent, customElementOnce } from "@nightingale-elements/nightingale-new-core";
import NightingaleTrack, { Feature, FeatureLocation, Shapes } from "@nightingale-elements/nightingale-track";
import { BaseType, select, Selection } from "d3";
import { html } from "lit";
import { drawRange, drawSymbol, drawUnknown, shapeCategory } from "./utils/draw-shapes";
import { last, RangeCollection, Refresher } from "./utils/utils";


type Fragment = FeatureLocation["fragments"][number]
type ExtendedFragment = Fragment & { featureIndex: number, location: FeatureLocation };


@customElementOnce("nightingale-track-canvas")
export default class NightingaleTrackCanvas extends NightingaleTrack {
  private canvas?: Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;
  private canvasCtx?: CanvasRenderingContext2D;
  /** Ratio of canvas logical size versus canvas display size */
  private canvasScale: number = 1;
  /** Feature fragments, stored in a data structure for fast range queries */
  private fragmentCollection?: RangeCollection<ExtendedFragment>;


  override connectedCallback(): void {
    super.connectedCallback();
    // Correctly adjust canvasScale on resize:
    select(window).on(`resize.NightingaleTrackCanvas-${this.id}`, () => {
      const devicePixelRatio = getDevicePixelRatio();
      if (devicePixelRatio !== this.canvasScale) {
        this.canvasScale = devicePixelRatio;
        this.refresh();
      }
    });
  }

  override disconnectedCallback(): void {
    select(window).on(`resize.NightingaleTrackCanvas-${this.id}`, null);
    super.disconnectedCallback();
  }

  override onDimensionsChange(): void {
    super.onDimensionsChange();
    if (this.canvas && !this.canvas.empty()) {
      this.canvas.style("width", `${this.width}px`);
      this.canvas.style("height", `${this.height}px`);
      this.canvasScale = getDevicePixelRatio();
    }
  }

  protected override createTrack() {
    if (this.svg) {
      this.svg.selectAll("g").remove();
      this.unbindEvents(this.svg);
    }
    if (!this.data) return;
    this.layoutObj?.init(this.data);
    this.svg = select(this).selectAll<SVGSVGElement, unknown>("svg");
    this.canvas = select(this).selectAll<HTMLCanvasElement, unknown>("canvas");
    this.canvasCtx = this.canvas.node()?.getContext("2d") ?? undefined;
    this.onDimensionsChange();
    this.fragmentCollection = getFragmentCollection(this.data);
    if (this.svg) { // this check is necessary because `svg` setter does not always set
      this.bindEvents(this.svg);
      this.highlighted = this.svg.append("g").attr("class", "highlighted");
    }
  }

  override refresh() {
    super.refresh();
    this.requestDraw();
  }

  override render() {
    return html`
      <div class="container">
        <div style="position: relative; z-index: 0;">
          <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
          <svg></svg>
        </div>
      </div>
    `;
  }


  private _drawStamp: { data?: Feature[], canvas?: CanvasRenderingContext2D, extent?: string } = {};
  /** If `_drawStamp` has become outdated since the last call to this function, update `_drawStamp` and return true.
   * Otherwise return false. */
  private needsRedraw(): boolean {
    const stamp = {
      data: this.data,
      canvas: this.canvasCtx,
      extent: `${this.width}x${this.height}@${this.canvasScale}/${this.getSeqPositionFromX(0)}:${this.getSeqPositionFromX(this.width)}`,
    };
    if (stamp.data === this._drawStamp.data && stamp.canvas === this._drawStamp.canvas && stamp.extent === this._drawStamp.extent) {
      return false;
    } else {
      this._drawStamp = stamp;
      return true;
    }
  }

  /** Request canvas redraw. */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
  private _draw(): void {
    if (!this.needsRedraw()) return;
    this.adjustCanvasLogicalSize();
    this.drawCanvasContent();
  }

  private adjustCanvasLogicalSize() {
    if (!this.canvasCtx) return;
    const newWidth = Math.floor(this.width * this.canvasScale);
    const newHeight = Math.floor(this.height * this.canvasScale);
    if (this.canvasCtx.canvas.width !== newWidth) {
      this.canvasCtx.canvas.width = newWidth;
    }
    if (this.canvasCtx.canvas.height !== newHeight) {
      this.canvasCtx.canvas.height = newHeight;
    }
  }

  private drawCanvasContent() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (!this.fragmentCollection) return;

    const scale = this.canvasScale;
    ctx.lineWidth = scale * 1;
    const baseWidth = scale * this.getSingleBaseWidth();
    const height = scale * Math.max(1, this.layoutObj?.getFeatureHeight() ?? 0); // Yes, sometimes `getFeatureHeight` returns negative numbers ¯\_(ツ)_/¯
    const optXPadding = Math.min(scale * 1.5, 0.25 * baseWidth); // To avoid overlap/touch for certain shapes (line, bridge, helix, strand)
    const leftEdgeSeq = this.getSeqPositionFromX(0 - SYMBOL_RADIUS) ?? -Infinity;
    const rightEdgeSeq = this.getSeqPositionFromX(canvasWidth / scale + SYMBOL_RADIUS) ?? Infinity;
    // This is better than this["display-start"], this["display-end"]+1, because it considers margins and symbol size

    // Draw features
    const fragments = this.fragmentCollection.overlappingItems(leftEdgeSeq, rightEdgeSeq);
    for (const fragment of fragments) {
      const iFeature = fragment.featureIndex;
      const fragmentLength = (fragment.end ?? fragment.start) + 1 - fragment.start;
      const x = scale * this.getXFromSeqPosition(fragment.start);
      const width = fragmentLength * baseWidth;
      const y = scale * (this.layoutObj?.getFeatureYPos(this.data[iFeature]) ?? 0);
      const shape = this.getShape(this.data[iFeature]);
      ctx.fillStyle = this.getFeatureFillColor(this.data[iFeature]);
      ctx.strokeStyle = this.getFeatureColor(this.data[iFeature]);
      ctx.globalAlpha = (this.data[iFeature].opacity ?? 0.9);

      const rangeDrawn = drawRange(ctx, shape, x, y, width, height, optXPadding, fragmentLength);
      if (!rangeDrawn) {
        const cx = x + 0.5 * width;
        const cy = y + 0.5 * height;
        const r = scale * SYMBOL_RADIUS;
        const symbolDrawn = drawSymbol(ctx, shape, cx, cy, r);
        if (!symbolDrawn) {
          this.printUnknownShapeWarning(shape);
          drawUnknown(ctx, cx, cy, r);
        }
        if (fragmentLength > 1) {
          drawRange(ctx, "line", x, y, width, height, optXPadding, fragmentLength);
        }
      }
    }

    // Draw margins
    ctx.globalAlpha = 1;
    ctx.fillStyle = this["margin-color"];
    const marginLeft = this["margin-left"] * scale;
    const marginRight = this["margin-right"] * scale;
    const marginTop = this["margin-top"] * scale;
    const marginBottom = this["margin-bottom"] * scale;
    ctx.fillRect(0, 0, marginLeft, canvasHeight);
    ctx.fillRect(canvasWidth - marginRight, 0, marginRight, canvasHeight);
    ctx.fillRect(marginLeft, 0, canvasWidth - marginLeft - marginRight, marginTop);
    ctx.fillRect(marginLeft, canvasHeight - marginBottom, canvasWidth - marginLeft - marginRight, marginBottom);
  }

  private _unknownShapeWarningPrinted = new Set<Shapes>();
  private printUnknownShapeWarning(shape: Shapes): void {
    if (!this._unknownShapeWarningPrinted.has(shape)) {
      console.warn(`NightingaleTrackCanvas: Drawing shape "${shape}" is not implemented. Will draw question marks instead ¯\\_(ツ)_/¯`);
      this._unknownShapeWarningPrinted.add(shape);
    }
  }

  /** Inverse of `this.getXFromSeqPosition`. */
  getSeqPositionFromX(x: number): number | undefined {
    return this.xScale?.invert(x - this["margin-left"]);
  }

  private getFragmentAt(svgX: number, svgY: number): ExtendedFragment | undefined {
    if (!this.fragmentCollection) return undefined;
    const seqStart = this.getSeqPositionFromX(svgX - SYMBOL_RADIUS);
    const seqEnd = this.getSeqPositionFromX(svgX + SYMBOL_RADIUS);
    if (seqStart === undefined || seqEnd === undefined) return undefined;

    const fragments = this.fragmentCollection.overlappingItems(seqStart, seqEnd);
    const baseWidth = this.getSingleBaseWidth();
    const featureHeight = this.layoutObj?.getFeatureHeight() ?? 0;

    const isPointed = (fragment: ExtendedFragment) => {
      const feature = this.data[fragment.featureIndex];
      const y = this.layoutObj?.getFeatureYPos(feature) ?? 0;
      const yOK = y <= svgY && svgY <= y + featureHeight;
      if (!yOK) return false;
      const fragmentLength = (fragment.end ?? fragment.start) + 1 - fragment.start;
      const xStart = this.getXFromSeqPosition(fragment.start);
      const xEnd = xStart + fragmentLength * baseWidth;
      if (xStart <= svgX && svgX <= xEnd) return true; // pointing at range (for symbol and range shapes)
      if (shapeCategory(this.getShape(feature)) !== "range") {
        // Symbol shapes
        const xMid = xStart + 0.5 * fragmentLength * baseWidth;
        if (xMid - SYMBOL_RADIUS <= svgX && svgX <= xMid + SYMBOL_RADIUS) return true; // pointing at symbol (for symbol shapes only)
      }
      return false;
    };

    return last(fragments, isPointed);
  }

  private bindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleTrackCanvas", (event: MouseEvent) => this.handleClick(event));
    target.on("mousemove.NightingaleTrackCanvas", (event: MouseEvent) => this.handleMousemove(event));
    target.on("mouseout.NightingaleTrackCanvas", () => this.handleMouseout());
  }

  private unbindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleTrackCanvas", null);
    target.on("mousemove.NightingaleTrackCanvas", null);
    target.on("mouseout.NightingaleTrackCanvas", null);
  }

  private handleClick(event: MouseEvent): void {
    const fragment = this.getFragmentAt(event.offsetX, event.offsetY);
    if (!fragment) {
      return; // This is not optimal, but trying to mimic NightingaleTrack behavior
    }
    const feature = this.data[fragment.featureIndex];
    const withHighlight = this.getAttribute("highlight-event") === "onclick";
    const customEvent = createEvent(
      "click",
      feature as unknown as Parameters<(typeof createEvent)>["1"],
      withHighlight,
      true,
      fragment.start,
      fragment.end ?? fragment.start,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMousemove(event: MouseEvent): void {
    const fragment = this.getFragmentAt(event.offsetX, event.offsetY);
    if (!fragment) {
      return this.handleMouseout();
    }
    const feature = this.data[fragment.featureIndex];
    const withHighlight = this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseover",
      feature as unknown as Parameters<(typeof createEvent)>["1"],
      withHighlight,
      false,
      fragment.start,
      fragment.end ?? fragment.start,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMouseout(): void {
    const withHighlight = this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent("mouseout", null, withHighlight);
    this.dispatchEvent(customEvent);
  }
}


function getDevicePixelRatio(): number {
  return window?.devicePixelRatio ?? 1;
}

function getAllFragments(data: Feature[]): ExtendedFragment[] {
  const out: ExtendedFragment[] = [];
  const nFeatures = data.length;
  for (let i = 0; i < nFeatures; i++) {
    const feature = data[i];
    if (!feature.locations) continue;
    for (const location of feature.locations) {
      for (const fragment of location.fragments) {
        out.push({ ...fragment, featureIndex: i, location });
      }
    }
  }
  return out;
}

function getFragmentCollection(data: Feature[]): RangeCollection<ExtendedFragment> {
  const fragments = getAllFragments(data);
  return new RangeCollection(fragments, { start: f => f.start, stop: f => (f.end ?? f.start) + 1 });
}


// Magic number from packages/nightingale-track/src/FeatureShape.ts:
const SYMBOL_SIZE = 10;
const SYMBOL_RADIUS = 0.5 * SYMBOL_SIZE;
