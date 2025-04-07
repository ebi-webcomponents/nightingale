import { createEvent, customElementOnce, Refresher, Stamp, withCanvas } from "@nightingale-elements/nightingale-new-core";
import NightingaleTrack, { Feature, FeatureLocation, getColorByType, Shapes } from "@nightingale-elements/nightingale-track";
import { BaseType, select, Selection } from "d3";
import { html } from "lit";
import { drawRange, drawSymbol, drawUnknown, shapeCategory } from "./utils/draw-shapes";
import { last, RangeCollection } from "./utils/utils";

type Fragment = FeatureLocation["fragments"][number]
type ExtendedFragment = Fragment & { featureIndex: number, isResidue?: boolean };


@customElementOnce("nightingale-track-canvas")
export default class NightingaleTrackCanvas extends withCanvas(NightingaleTrack) {
  /** Feature fragments, stored in a data structure for fast range queries */
  private fragmentCollection?: RangeCollection<ExtendedFragment>;

  protected override createTrack() {
    if (this.svg) {
      this.svg.selectAll("g").remove();
      this.unbindEvents(this.svg);
    }
    if (!this.data) return;
    this.layoutObj?.init(this.data);
    this.svg = select(this).selectAll<SVGSVGElement, unknown>("svg");
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

  override onCanvasScaleChange() {
    super.onCanvasScaleChange();
    this.refresh();
  }

  private readonly _drawStamp = new Stamp(() => ({
    "data": this["data"],
    "canvasCtx": this["canvasCtx"],
    "width": this["width"],
    "height": this["height"],
    "canvasScale": this["canvasScale"],
    "length": this["length"],
    "display-start": this["display-start"],
    "display-end": this["display-end"],
    "margin-color": this["margin-color"],
    "margin-left": this["margin-left"],
    "margin-right": this["margin-right"],
    "margin-top": this["margin-top"],
    "margin-bottom": this["margin-bottom"],
  }));

  /** Request canvas redraw. */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
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
    if (!this.fragmentCollection) return;

    const scale = this.canvasScale;
    ctx.lineWidth = scale * LINE_WIDTH;
    const baseWidth = scale * this.getSingleBaseWidth();
    const height = scale * Math.max(0, this.layoutObj?.getFeatureHeight() ?? 0); // Yes, sometimes `getFeatureHeight` returns negative numbers ¯\_(ツ)_/¯
    const optXPadding = Math.min(scale * 1.5, 0.25 * baseWidth); // To avoid overlap/touch for certain shapes (line, bridge, helix, strand)
    const leftEdgeSeq = this.getSeqPositionFromX(0 - SYMBOL_RADIUS - 0.5 * LINE_WIDTH) ?? -Infinity;
    const rightEdgeSeq = this.getSeqPositionFromX(canvasWidth / scale + SYMBOL_RADIUS + 0.5 * LINE_WIDTH) ?? Infinity;
    // This is better than this["display-start"], this["display-end"]+1, because it considers margins and symbol size

    // Draw features
    const fragments = this.fragmentCollection.overlappingItems(leftEdgeSeq, rightEdgeSeq);
    for (const fragment of fragments) {
      const iFeature = fragment.featureIndex;
      let fragmentLength = Number(fragment.end ?? fragment.start) - Number(fragment.start) + 1;
      let x = scale * this.getXFromSeqPosition(fragment.start);
      let width = fragmentLength * baseWidth;
      const y = scale * (this.layoutObj?.getFeatureYPos(this.data[iFeature]) ?? 0);
      const shape = this.getShape(this.data[iFeature]);

      if (fragment.isResidue) {
        // fragmentLength is 1 for residue. Below logic is to show it prominent for longer proteins until the point where fragmentLength is enough to be visible on itself.
        const optimalWidth = 6;
        const widthDifference = optimalWidth - baseWidth;
        if (baseWidth < optimalWidth && widthDifference > fragmentLength) {
          fragmentLength = widthDifference;
        }
        x += baseWidth / 4; // To place the residue in the middle of a single basewidth
        width = fragmentLength * baseWidth / 2; // Halve the width to distinguish between residues if one follows next closely
        ctx.fillStyle = getColorByType("RESIDUE");
      } else {
        ctx.fillStyle = this.getFeatureFillColor(this.data[iFeature]);
      }

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

  private getFragmentAt(svgX: number, svgY: number): ExtendedFragment | undefined {
    if (!this.fragmentCollection) return undefined;
    const halfLineWidth = 0.5 * LINE_WIDTH;
    const seqStart = this.getSeqPositionFromX(svgX - SYMBOL_RADIUS - halfLineWidth);
    const seqEnd = this.getSeqPositionFromX(svgX + SYMBOL_RADIUS + halfLineWidth);
    if (seqStart === undefined || seqEnd === undefined) return undefined;

    const fragments = this.fragmentCollection.overlappingItems(seqStart, seqEnd);
    const baseWidth = this.getSingleBaseWidth();
    const featureHeight = this.layoutObj?.getFeatureHeight() ?? 0;

    const isPointed = (fragment: ExtendedFragment) => {
      const feature = this.data[fragment.featureIndex];
      const y = this.layoutObj?.getFeatureYPos(feature) ?? 0;
      const yOK = (y - halfLineWidth <= svgY) && (svgY <= y + featureHeight + halfLineWidth);
      if (!yOK) return false;
      const fragmentLength = (fragment.end ?? fragment.start) + 1 - fragment.start;
      const xStart = this.getXFromSeqPosition(fragment.start);
      const xEnd = xStart + fragmentLength * baseWidth;
      if ((xStart - halfLineWidth <= svgX) && (svgX <= xEnd + halfLineWidth)) return true; // pointing at range (for symbol and range shapes)
      if (shapeCategory(this.getShape(feature)) !== "range") {
        // Symbol shapes
        const xMid = xStart + 0.5 * fragmentLength * baseWidth;
        if ((xMid - SYMBOL_RADIUS - halfLineWidth <= svgX) && (svgX <= xMid + SYMBOL_RADIUS + halfLineWidth)) return true; // pointing at symbol (for symbol shapes only)
      }
      return false;
    };

    return last(fragments, isPointed);
  }

  private bindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleTrackCanvas", (event: MouseEvent) => this.handleClick(event));
    target.on("mousemove.NightingaleTrackCanvas", (event: MouseEvent) => this.handleMousemove(event));
    target.on("mouseout.NightingaleTrackCanvas", (event: MouseEvent) => this.handleMouseout(event));
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
      return this.handleMouseout(event);
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

  private handleMouseout(event: MouseEvent): void {
    const withHighlight = this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseout",
      null,
      withHighlight,
      undefined,
      undefined,
      undefined,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this
    );
    this.dispatchEvent(customEvent);
  }
}


function getAllFragments(data: Feature[]): ExtendedFragment[] {
  const out: ExtendedFragment[] = [];
  const nFeatures = data.length;
  for (let i = 0; i < nFeatures; i++) {
    const feature = data[i];
    if (!feature.locations) continue;
    for (const location of feature.locations) {
      for (const fragment of location.fragments) {
        out.push({ ...fragment, featureIndex: i });
      }
    }
    if (feature.start && feature.residuesToHighlight) {
      for (const residue of feature.residuesToHighlight) {
        const positionInSequence = Number(feature.start) + Number(residue.position) - 1;
        out.push({ start: positionInSequence, end: positionInSequence, featureIndex: i, isResidue: true });
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
const LINE_WIDTH = 1;
