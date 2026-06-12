import NightingaleElement, {
  BinarySearch,
  createEvent,
  customElementOnce,
  Refresher,
  Stamp,
  withCanvas,
  withDimensions,
  withHighlight,
  withManager,
  withMargin,
  withPosition,
  withResizable,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";
import { BaseType, color, randomLcg, randomUniform, scaleLinear, select, Selection, TypedArray } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";


const ATTRIBUTES_THAT_TRIGGER_REFRESH: string[] = [
  "length", "width", "height",
  "margin-top", "margin-bottom", "margin-left", "margin-right", "margin-color",
  "font-family", "min-font-size", "fade-font-size", "max-font-size",
  "y-min", "y-max", "hide-outliers",
] satisfies (keyof NightingaleDistributionTrack)[];
const ATTRIBUTES_THAT_TRIGGER_DATA_RESET: string[] = [] satisfies (keyof NightingaleDistributionTrack)[];


/** Line width for rectangle stroke */
const LINE_WIDTH = 1;
/** Maximum line width relative to column width (overrides `LINE_WIDTH` when zoomed out too much) */
const MAX_REL_LINE_WIDTH = 0.2;

/** Default fill color for boxes (stroke color will be derived from this) */
const DEFAULT_DATA_COLOR = "#cccccc";
/** Gap between columns relative to base width */
const COLUMN_GAP = 0.2;
/** Gap between boxes within a column relative to box width */
const BOX_GAP = 0.1;
/** Whisker width relative to box width */
const WHISKER_REL_WIDTH = 0.6;
/** Outlier jitter width relative to box width */
const JITTER_REL_WIDTH = 0.4;
/** Radius for the circles representing outliers */
const OUTLIER_RADIUS = 2;
/** Column widths in CSS pixels, between which transition from "background" to "foreground" visualization happens */
const FG_BG_TRANSITION_BASE_WIDTHS = [4, 5];

function makeStrokeColor(dataColor: string): string | undefined {
  return color(dataColor)?.darker(2).formatHex();
}


interface Distribution {
  position: number,
  values: number[],
}

export interface DistributionDataset {
  name: string,
  color?: string,
  positions: Distribution[],
}

/** Type for `NightingaleDistributionTrack.data`` */
export type DistributionData = DistributionDataset[];

const OptionalNumber = (str: string | null) => {
  if (str) return Number(str);
  return undefined;
};

@customElementOnce("nightingale-distribution-track")
export default class NightingaleDistributionTrack extends withCanvas(
  withManager(
    withZoom(
      withResizable(
        withMargin(
          withPosition(withDimensions(withHighlight(NightingaleElement)))
        )
      )
    )
  )
) {
  /** Font family for labels (can be a list of multiple font families separated by comma, like in CSS) */
  @property({ type: String })
  "font-family": string = "Helvetica,sans-serif";

  /** Font size below which labels are hidden */
  @property({ type: Number })
  "min-font-size": number = 6;

  /** Column width below which labels are shown with lower opacity */
  @property({ type: Number })
  "fade-font-size": number = 12;

  /** Maximum font size for labels */
  @property({ type: Number })
  "max-font-size": number = 24;

  /** Bottom limit for Y-axis (default: minimum computed from data) */
  @property({ converter: OptionalNumber })
  "y-min"?: number;

  /** Top limit for Y-axis (default: maximum computed from data) */
  @property({ converter: OptionalNumber })
  "y-max"?: number;

  /** Turns off rendering of outliers */
  @property({ type: Boolean })
  "hide-outliers"?: boolean;


  #data?: DistributionData;
  private preprocessedData?: PreprocessedData;
  protected highlighted?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;


  override connectedCallback() {
    super.connectedCallback();
    if (this.data) this.createTrack();
  }

  get data(): DistributionData | undefined {
    return this.#data;
  }
  set data(data: DistributionData | undefined) {
    this.#data = data;
    console.time('preprocessData')
    this.preprocessedData = data ? preprocessData(data) : undefined;
    console.timeEnd('preprocessData')
    this.createTrack();
  }
  /** Return the range of Y values corresponding to bottom and top of the viewport (excluding margins) */
  getYLimits(): [yMin: number, yMax: number] {
    const yMin = this["y-min"] ?? this.preprocessedData?.yLimits.min ?? 0;
    const yMax = this["y-max"] ?? this.preprocessedData?.yLimits.max ?? 100;
    return [yMin, yMax];
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (ATTRIBUTES_THAT_TRIGGER_DATA_RESET.includes(name)) {
      // Calling `this.data` setter to recompute `this.positions` and run `this.createTrack()`
      this.data = this.data; // eslint-disable-line no-self-assign
    } else if (ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name)) {
      this.onDimensionsChange();
      this.createTrack();
    }
  }

  protected createTrack() {
    if (this.svg) {
      this.svg.selectAll("g").remove();
      this.unbindEvents(this.svg);
    }
    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    if (this.svg) { // this check is necessary because `svg` setter does not always set
      this.bindEvents(this.svg);
      this.highlighted = this.svg.append("g").attr("class", "highlighted");
    }
  }

  refresh() {
    this.requestDraw();
    this.updateHighlight();
  }

  private readonly _drawStamp = new Stamp(() => {
    const stamp: Record<string, unknown> = {
      "data": this["data"],
      "canvasCtx": this["canvasCtx"],
      "canvasWidth": this["width"],
      "canvasHeight": this["height"],
      "canvasScale": this["canvasScale"],
      "display-start": this["display-start"],
      "display-end": this["display-end"],
    };
    for (const attr of ATTRIBUTES_THAT_TRIGGER_DATA_RESET) {
      stamp[attr] = this.getAttribute(attr);
    }
    for (const attr of ATTRIBUTES_THAT_TRIGGER_REFRESH) {
      stamp[attr] = this.getAttribute(attr);
    }
    return stamp;
  });

  /** Request canvas redraw. */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
  private _draw(): void {
    if (!this._drawStamp.update().changed) return;
    this.adjustCanvasCtxLogicalSize();
    if (!this.canvasCtx) return;
    console.time('draw distr')
    this.clearCanvas(this.canvasCtx);
    this.drawData(this.canvasCtx);
    this.drawMargins(this.canvasCtx);
    console.timeEnd('draw distr')
  }

  private getOffscreenCanvas(): [canvas: HTMLCanvasElement, canvasContext?: CanvasRenderingContext2D] {
    this._offscreenCanvas ??= document.createElement("canvas");
    const width = this.canvasCtx?.canvas.width ?? 1;
    const height = this.canvasCtx?.canvas.height ?? 1;
    if (this._offscreenCanvas.width !== width) {
      this._offscreenCanvas.width = width;
    }
    if (this._offscreenCanvas.height !== height) {
      this._offscreenCanvas.height = height;
    }
    const ctx = this._offscreenCanvas.getContext('2d') ?? undefined;
    return [this._offscreenCanvas, ctx];
  }
  private _offscreenCanvas?: HTMLCanvasElement;

  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private drawData(ctx: CanvasRenderingContext2D) {
    const [fgAlpha, bgAlpha] = this.getFgBgOpacity();

    // Draw background (zoomed-out) visualization
    if (bgAlpha > 0) {
      this.drawSimplifiedVisualization(ctx, bgAlpha);
    }

    // Draw foreground (zoomed-in) visualization
    if (fgAlpha === 1) {
      // Draw foreground visualization directly
      this.drawBoxplotVisualization(ctx);
    } else if (fgAlpha > 0) {
      // Draw foreground visualization via an auxiliary canvas (cannot be drawn directly to the main canvas, because overlapping outliers would create opacity > fgAlpha)
      const [auxCanvas, auxCtx] = this.getOffscreenCanvas();
      if (auxCtx) {
        this.clearCanvas(auxCtx);
        this.drawBoxplotVisualization(auxCtx);
        ctx.globalAlpha = fgAlpha;
        ctx.drawImage(auxCanvas, 0, 0);
      }
    }
  }

  /** Draw full boxplot visualization ("foreground" / zoomed-in) */
  private drawBoxplotVisualization(ctx: CanvasRenderingContext2D) {
    if (!this.data || !this.preprocessedData) return;

    const { xColumnLeft, xColumnWidth, xScale, yScale, yMedianExtra, lineWidth, outlierRadius, start, stop } = this.getDrawingMeasurements();
    ctx.lineWidth = lineWidth;

    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    for (let iDataset = 0; iDataset < nDatasets; iDataset++) {
      const dataset = this.preprocessedData.datasets[iDataset];
      if (!dataset) continue;

      const dataColor = this.data[iDataset].color ?? DEFAULT_DATA_COLOR;
      const fillColor = dataColor;
      const strokeColor = makeStrokeColor(dataColor)!;

      const xBoxOffset = xColumnLeft + (iDataset + 0.5 * BOX_GAP) * xColumnWidth / nDatasets;
      const xBoxWidth = (1 - BOX_GAP) * xColumnWidth / nDatasets;
      const xCenter = xBoxOffset + 0.5 * xBoxWidth;
      const xWhiskerLeft = xCenter - 0.5 * WHISKER_REL_WIDTH * xBoxWidth;
      const xWhiskerRight = xCenter + 0.5 * WHISKER_REL_WIDTH * xBoxWidth;
      const xJitterHalfwidth = 0.5 * JITTER_REL_WIDTH * xBoxWidth;

      for (let i = start; i < stop; i++) {
        const datum = dataset[i];
        if (!datum) continue;

        const x = xScale(i);
        const yMedian = yScale(datum.median);
        const yBoxLow = yScale(datum.boxLow);
        const yBoxHigh = yScale(datum.boxHigh);
        const yWhiskerLow = yScale(datum.whiskerLow);
        const yWhiskerHigh = yScale(datum.whiskerHigh);

        ctx.globalAlpha = 1;

        // Whiskers
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(x + xWhiskerLeft, yWhiskerHigh);
        ctx.lineTo(x + xWhiskerRight, yWhiskerHigh);
        ctx.moveTo(x + xWhiskerLeft, yWhiskerLow);
        ctx.lineTo(x + xWhiskerRight, yWhiskerLow);
        ctx.moveTo(x + xCenter, yWhiskerHigh);
        ctx.lineTo(x + xCenter, yWhiskerLow);
        ctx.stroke();

        // Box
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.fillRect(x + xBoxOffset, yBoxHigh, xBoxWidth, yBoxLow - yBoxHigh);
        ctx.strokeRect(x + xBoxOffset, yBoxHigh, xBoxWidth, yBoxLow - yBoxHigh);

        // Median
        ctx.fillStyle = strokeColor;
        ctx.strokeStyle = strokeColor;
        ctx.fillRect(x + xBoxOffset, yMedian - yMedianExtra, xBoxWidth, 2 * yMedianExtra);
        ctx.strokeRect(x + xBoxOffset, yMedian - yMedianExtra, xBoxWidth, 2 * yMedianExtra);

        // Outliers
        if (!this["hide-outliers"]) {
          const xJitter = xJitterHalfwidth !== 0 ?
            randomUniform.source(randomLcg(i * nDatasets + iDataset))(xCenter - xJitterHalfwidth, xCenter + xJitterHalfwidth)
            : () => xCenter;
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = strokeColor;
          for (const outlier of datum.outliersHigh) {
            ctx.beginPath();
            ctx.arc(x + xJitter(), yScale(outlier), outlierRadius, 0, 2 * Math.PI);
            ctx.fill();
          }
          for (const outlier of datum.outliersLow) {
            ctx.beginPath();
            ctx.arc(x + xJitter(), yScale(outlier), outlierRadius, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    }
  }

  /** Draw simplified visualization ("background" / zoomed-out) */
  private drawSimplifiedVisualization(ctx: CanvasRenderingContext2D, alpha: number) {
    if (!this.data || !this.preprocessedData) return;

    const { xColumnLeft, xColumnRight, xScale, yScale, yMedianExtra, lineWidth, start, stop } = this.getDrawingMeasurements();
    ctx.lineWidth = lineWidth;

    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    for (let iDataset = 0; iDataset < nDatasets; iDataset++) {
      const dataset = this.preprocessedData.datasets[iDataset];
      if (!dataset) continue;

      const dataColor = this.data[iDataset].color ?? DEFAULT_DATA_COLOR;
      const fillColor = dataColor;
      const strokeColor = makeStrokeColor(dataColor)!;

      // const yMin = (i: number) => yScale(dataset[i].minimum);
      // const yMax = (i: number) => yScale(dataset[i].maximum);
      const yWhiskerLow = (i: number) => yScale(dataset[i].whiskerLow);
      const yWhiskerHigh = (i: number) => yScale(dataset[i].whiskerHigh);
      // const yBoxLow = (i: number) => yScale(dataset[i].boxLow);
      // const yBoxHigh = (i: number) => yScale(dataset[i].boxHigh);
      const yMedianLow = (i: number) => yScale(dataset[i].median + yMedianExtra);
      const yMedianHigh = (i: number) => yScale(dataset[i].median - yMedianExtra);

      const segments = getContiguousSegments(start, stop, i => i in dataset);
      for (const segment of segments) {
        ctx.globalAlpha = 0.25 * alpha;
        ctx.fillStyle = fillColor;
        // drawSilhouette(ctx, segment, xScale, yMin, yMax, [xColumnLeft, xColumnRight], 'fill');
        drawSilhouette(ctx, segment, xScale, yWhiskerLow, yWhiskerHigh, [xColumnLeft, xColumnRight], 'fill');
        // drawSilhouette(ctx, segment, xScale, yBoxLow, yBoxHigh, [xColumnLeft, xColumnRight], 'fill');

        ctx.globalAlpha = 0.5 * alpha;
        ctx.fillStyle = strokeColor;
        ctx.strokeStyle = strokeColor;
        drawSilhouette(ctx, segment, xScale, yMedianLow, yMedianHigh, [xColumnLeft, xColumnRight], 'fill+stroke');
      }
    }
  }

  private drawMargins(ctx: CanvasRenderingContext2D) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const marginLeft = this["margin-left"] * this.canvasScale;
    const marginRight = this["margin-right"] * this.canvasScale;
    const marginTop = this["margin-top"] * this.canvasScale;
    const marginBottom = this["margin-bottom"] * this.canvasScale;

    ctx.globalAlpha = 1;
    ctx.fillStyle = this["margin-color"];
    ctx.fillRect(0, 0, marginLeft, canvasHeight);
    ctx.fillRect(canvasWidth - marginRight, 0, marginRight, canvasHeight);
    ctx.fillRect(marginLeft, 0, canvasWidth - marginLeft - marginRight, marginTop);
    ctx.fillRect(marginLeft, canvasHeight - marginBottom, canvasWidth - marginLeft - marginRight, marginBottom);
  }

  private getDrawingMeasurements() {
    const canvasScale = this.canvasScale;
    const xBaseWidthInCss = this.getSingleBaseWidth();
    const xBaseWidth = canvasScale * xBaseWidthInCss;
    const xColumnLeft = xBaseWidth * 0.5 * COLUMN_GAP;
    const xColumnWidth = xBaseWidth * (1 - COLUMN_GAP);
    const xColumnRight = xColumnLeft + xColumnWidth;
    const xScale = (i: number) => canvasScale * this.getXFromSeqPosition(i);

    const yColumnOffset = canvasScale * this["margin-top"];
    const yColumnHeight = canvasScale * (this["height"] - this["margin-top"] - this["margin-bottom"]);
    const yScale = scaleLinear(this.getYLimits(), [yColumnOffset + yColumnHeight, yColumnOffset]);
    const yMedianExtra = canvasScale * 1;

    const lineWidth = canvasScale * Math.min(LINE_WIDTH, MAX_REL_LINE_WIDTH * xBaseWidthInCss);
    const outlierRadius = canvasScale * OUTLIER_RADIUS;

    const start = Math.floor(this.getSeqPositionFromX(0) ?? 1);
    const stop = Math.floor(this.getSeqPositionFromX(this.width) ?? 1) + 1;

    return {
      /** Ratio of canvas logical size versus canvas display size */
      canvasScale,
      /** Horizontal offset of the displayed column from the beginning of the slot, in canvas space */
      xColumnLeft,
      /** Horizontal offset of the right edge of displayed column from the beginning of the slot, in canvas space */
      xColumnRight,
      /** Width of displayed column, in canvas space */
      xColumnWidth,
      /** Scale from sequence position to horizontal offset of the slot in canvas space (does not consider column gap) */
      xScale,
      /** Scale from value of independent variable to vertical position in canvas space */
      yScale,
      /** Amount for vertically thickening the median rectangle, in canvas space */
      yMedianExtra,
      /** Line width for strokes, in canvas space */
      lineWidth,
      /** Circle radius for drawing outliers, in canvas space */
      outlierRadius,
      /** Sequence position of the first rendered datapoint */
      start,
      /** Sequence position of the last rendered datapoint + 1 */
      stop,
    };
  }

  /** Compute opacity for the "foreground" (zoomed-in) and "background" (zoomed-out) visualization */
  private getFgBgOpacity(): [fgAlpha: number, bgAlpha: number] {
    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    /** Approximate boxplot box width, in CSS pixels. No need to consider column gap and box gap here. */
    const boxWidth = this.getSingleBaseWidth() / nDatasets;
    const [transitionMin, transitionMax] = FG_BG_TRANSITION_BASE_WIDTHS;

    if (boxWidth <= transitionMin) {
      return [0, 1];
    } else if (boxWidth >= transitionMax) {
      return [1, 0];
    } else {
      const fgAlpha = (boxWidth - transitionMin) / (transitionMax - transitionMin);
      return [fgAlpha, 1 - fgAlpha];
    }
  }

  protected updateHighlight() {
    if (!this.highlighted) return;
    const highlights = this.highlighted
      .selectAll<SVGRectElement, { start: number, end: number }[]>("rect")
      .data(this.highlightedRegion.segments);

    highlights
      .enter()
      .append("rect")
      .style("pointer-events", "none")
      .merge(highlights)
      .attr("fill", this["highlight-color"])
      .attr("height", this.height)
      .attr("x", d => this.getXFromSeqPosition(d.start))
      .attr("width", d => Math.max(0, this.getSingleBaseWidth() * (d.end - d.start + 1)));

    highlights.exit().remove();
  }

  override zoomRefreshed() {
    super.zoomRefreshed();
    if (this.getWidthWithMargins() > 0) this.refresh();
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.createTrack();
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


  private bindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleDistributionTrack", (event: MouseEvent) => this.handleClick(event));
    target.on("mousemove.NightingaleDistributionTrack", (event: MouseEvent) => this.handleMousemove(event));
    target.on("mouseout.NightingaleDistributionTrack", (event: MouseEvent) => this.handleMouseout(event));
  }

  private unbindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleDistributionTrack", null);
    target.on("mousemove.NightingaleDistributionTrack", null);
    target.on("mouseout.NightingaleDistributionTrack", null);
  }

  private handleClick(event: MouseEvent): void {
    const pointed = this.getPointedDatum(event.offsetX, event.offsetY);
    if (pointed === undefined) {
      return;
    }
    const withHighlight = this.getAttribute("highlight-event") === "onclick";
    const customEvent = createEvent(
      "click",
      null, // TODO: pass (pointed.datum ?? null),
      withHighlight,
      true,
      pointed.position,
      pointed.position,
      event.target instanceof HTMLElement ? event.target : undefined,
      event,
      this,
    );
    this.dispatchEvent(customEvent);
  }

  private handleMousemove(event: MouseEvent): void {
    const pointed = this.getPointedDatum(event.offsetX, event.offsetY);
    if (pointed === undefined) {
      return;
    }
    const withHighlight = this.getAttribute("highlight-event") === "onmouseover";
    const customEvent = createEvent(
      "mouseover",
      null, // TODO: pass (pointed.datum ?? null),
      withHighlight,
      false,
      pointed.position,
      pointed.position,
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

  private getPointedDatum(svgX: number, _svgY: number): { position: number, datum: PreprocessedDatum | undefined } | undefined {
    const continuousPosition = this.getSeqPositionFromX(svgX);
    if (continuousPosition === undefined) return undefined;
    const position = Math.floor(continuousPosition);
    const datum = this.preprocessedData?.datasets[0][position]; // TODO: consider multiple datasets
    return { position, datum };
  }
}


type PreprocessedData = ReturnType<typeof preprocessData>;

function preprocessData(data: DistributionData) {
  const preprocessedDatasets = data.map(preprocessDataset);
  return {
    datasets: preprocessedDatasets,
    yLimits: getExtremes(preprocessedDatasets),
  }
}

function preprocessDataset(dataset: DistributionDataset) {
  const out: { [position: number]: PreprocessedDatum } = {};

  // const flat = dataset.positions.flatMap(pos => pos.values);
  // console.time('flat sort')
  // flat.sort((a, b) => a - b)
  // console.timeEnd('flat sort')
  // multisort(dataset.positions.map(pos => pos.values))

  for (const datum of dataset.positions) {
    out[datum.position] = preprocessDatum(datum);
  }
  return out;
}

function multisort(arrays: number[][]) {
  const n = arrays.reduce((count, array) => count + array.length, 0);
  const indices = new Uint32Array(n);
  const sources = new Uint32Array(n);
  const values = new Float32Array(n);
  let target = 0;
  console.time('multisort fill')
  for (let iArray = 0, nArrays = arrays.length; iArray < nArrays; iArray++) {
    const array = arrays[iArray];
    for (let i = 0, m = array.length; i < m; i++) {
      indices[target] = target;
      sources[target] = iArray;
      values[target] = array[i];
      target++;
    }
  }
  console.timeEnd('multisort fill')

  console.time('multisort sort')
  // values.sort();
  indices.sort((i, j) => sources[i] - sources[j] || values[i] - values[j]);
  console.timeEnd('multisort sort')

  // const flat = dataset.positions.flatMap(pos => pos.values);
  // TODO: continue here
}

interface PreprocessedDatum {
  position: number,
  values: number[] | TypedArray,
  median: number,
  boxLow: number,
  boxHigh: number,
  whiskerLow: number,
  whiskerHigh: number,
  outliersLow: number[] | TypedArray,
  outliersHigh: number[] | TypedArray,
  minimum: number,
  maximum: number,
}

function preprocessDatum(datum: Distribution): PreprocessedDatum {
  const sorted = new Float32Array(datum.values).sort();
  const median = getQuantile(sorted, 0.5);
  const q1 = getQuantile(sorted, 0.25);
  const q3 = getQuantile(sorted, 0.75);

  const iqr = q3 - q1;
  /** Index of the first value >= q1 - 1.5 * IQR (low whisker) */
  const iWhiskerLow = BinarySearch.firstGteqIndex(sorted, q1 - 1.5 * iqr, x => x)
  const stop = BinarySearch.firstGteqIndex(sorted, q3 + 1.5 * iqr, x => x);
  /** Index of the last value <= q3 + 1.5 * IQR (high whisker) */
  const iWhiskerHigh = (stop >= sorted.length || sorted[stop] > q3 + 1.5 * iqr) ? stop - 1 : stop;

  return {
    position: datum.position,
    values: sorted,
    median: median,
    boxLow: q1,
    boxHigh: q3,
    whiskerLow: sorted[iWhiskerLow],
    whiskerHigh: sorted[iWhiskerHigh],
    outliersLow: sorted.slice(0, iWhiskerLow),
    outliersHigh: sorted.slice(iWhiskerHigh + 1, undefined),
    minimum: sorted[0],
    maximum: sorted[sorted.length - 1],
  };
}

export function getQuantile(sortedValues: ArrayLike<number>, p: number) {
  const i_ = (sortedValues.length - 1) * p;
  if (i_ >= sortedValues.length - 1) {
    return sortedValues[sortedValues.length - 1];
  }
  const i = Math.floor(i_);
  const q = i_ - i;
  return sortedValues[i] * (1 - q) + sortedValues[i + 1] * q;
}

/** Gets the Y-axis limits for the given preprocessed data */
function getExtremes(data: { [position: number]: PreprocessedDatum }[]) {
  let min = Infinity;
  let max = -Infinity;

  for (const dataset of data) {
    for (const position in dataset) {
      const datum = dataset[position];
      if (datum.minimum < min) min = datum.minimum;
      if (datum.maximum > max) max = datum.maximum;
    }
  }

  return {
    min: min === Infinity ? undefined : min,
    max: max === -Infinity ? undefined : max,
  };
}

function getContiguousSegments(start: number, stop: number, isPresent: (i: number) => boolean): [start: number, stop: number][] {
  const segments: [number, number][] = [];
  for (let i = start; i < stop; i++) {
    if (isPresent(i)) {
      if (i === segments[segments.length - 1]?.[1]) {
        segments[segments.length - 1][1]++;
      } else {
        segments.push([i, i + 1]);
      }
    }
  }
  return segments;
}

function drawSilhouette(ctx: CanvasRenderingContext2D, [sStart, sStop]: [number, number], getX: (i: number) => number, getYLow: (i: number) => number, getYHigh: (i: number) => number, [columnOffsetLeft, columnOffsetRight]: [number, number], style: 'fill' | 'stroke' | 'fill+stroke') {
  ctx.beginPath();
  for (let i = sStart; i < sStop; i++) {
    const x = getX(i);
    const yHigh = getYHigh(i);
    ctx.lineTo(x + columnOffsetLeft, yHigh);
    ctx.lineTo(x + columnOffsetRight, yHigh);
  }
  for (let i = sStop - 1; i >= sStart; i--) {
    const x = getX(i);
    const yLow = getYLow(i);
    ctx.lineTo(x + columnOffsetRight, yLow);
    ctx.lineTo(x + columnOffsetLeft, yLow);
  }
  if (style.includes('fill')) ctx.fill();
  if (style.includes('stroke')) ctx.stroke();
}
