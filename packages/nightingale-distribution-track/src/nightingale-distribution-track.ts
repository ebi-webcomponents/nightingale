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
import { BaseType, select, Selection, color, scaleLinear, randomNormal, randomUniform, randomLcg } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";


const ATTRIBUTES_THAT_TRIGGER_REFRESH: string[] = [
  "length", "width", "height",
  "margin-top", "margin-bottom", "margin-left", "margin-right", "margin-color",
  "font-family", "min-font-size", "fade-font-size", "max-font-size",
  "y-min", "y-max", "hide-outliers",
] satisfies (keyof NightingaleDistributionTrack)[];
const ATTRIBUTES_THAT_TRIGGER_DATA_RESET: string[] = [] satisfies (keyof NightingaleDistributionTrack)[];


/** Color for rectangle stroke */
const STROKE_COLOR = "#D3D3D3";
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
    this.preprocessedData = data ? preprocessData(data) : undefined;
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
    this.clearCanvas();
    this.drawBoxplot();
    this.drawMargins();
  }

  private clearCanvas() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private drawBoxplot() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    if (!this.data || !this.preprocessedData) return;

    const nData = this.data.length;

    const scale = this.canvasScale;
    const baseWidthInCss = this.getSingleBaseWidth();
    const baseWidth = scale * baseWidthInCss;
    const columnOffset = scale * this["margin-top"];
    const columnHeight = scale * (this["height"] - this["margin-top"] - this["margin-bottom"]);
    const xColumnOffset = baseWidth * 0.5 * COLUMN_GAP;
    const xColumnWidth = baseWidth * (1 - COLUMN_GAP);
    const xBoxWidth = xColumnWidth / nData * (1 - BOX_GAP);
    const yScale = scaleLinear(this.getYLimits(), [columnOffset + columnHeight, columnOffset]);
    const outlierRadius = scale * OUTLIER_RADIUS;

    const yMedianExtra = scale * 1;

    ctx.lineWidth = scale * Math.min(LINE_WIDTH, MAX_REL_LINE_WIDTH * baseWidthInCss);
    ctx.strokeStyle = STROKE_COLOR;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const start = Math.floor(this.getSeqPositionFromX(0) ?? 1);
    const end = Math.floor(this.getSeqPositionFromX(this.width) ?? 1);
    for (let iData = 0; iData < nData; iData++) {
      const dataset = this.preprocessedData.datasets[iData];
      if (!dataset) continue;

      const dataColor = this.data[iData].color ?? DEFAULT_DATA_COLOR;
      const boxFill = dataColor;
      const boxStroke = color(boxFill)!.darker(2).formatHex();

      const xBoxOffset = xColumnOffset + xColumnWidth * (iData + 0.5 * BOX_GAP) / nData;
      const xCenter = xBoxOffset + 0.5 * xBoxWidth;
      const xWhiskerHalfWidth = 0.5 * WHISKER_REL_WIDTH * xBoxWidth;
      const xWhiskerOffset = xCenter - xWhiskerHalfWidth;
      const xWhiskerEnd = xCenter + xWhiskerHalfWidth;
      const xJitterHalfWidth = 0.5 * JITTER_REL_WIDTH * xBoxWidth;

      for (let i = start; i <= end; i++) {
        const datum = dataset[i];
        if (!datum) continue;

        const x = scale * this.getXFromSeqPosition(i);
        const yMedian = yScale(datum.median);
        const yBoxLow = yScale(datum.boxLow);
        const yBoxHigh = yScale(datum.boxHigh);
        const yWhiskerLow = yScale(datum.whiskerLow);
        const yWhiskerHigh = yScale(datum.whiskerHigh);

        ctx.globalAlpha = 1;

        // Whiskers
        ctx.strokeStyle = boxStroke;
        ctx.beginPath();
        ctx.moveTo(x + xWhiskerOffset, yWhiskerHigh);
        ctx.lineTo(x + xWhiskerEnd, yWhiskerHigh);
        ctx.moveTo(x + xWhiskerOffset, yWhiskerLow);
        ctx.lineTo(x + xWhiskerEnd, yWhiskerLow);
        ctx.moveTo(x + xCenter, yWhiskerHigh);
        ctx.lineTo(x + xCenter, yWhiskerLow);
        ctx.stroke();

        // Box
        ctx.fillStyle = boxFill;
        ctx.strokeStyle = boxStroke;
        ctx.fillRect(x + xBoxOffset, yBoxHigh, xBoxWidth, yBoxLow - yBoxHigh);
        ctx.strokeRect(x + xBoxOffset, yBoxHigh, xBoxWidth, yBoxLow - yBoxHigh);

        // Median
        ctx.fillStyle = boxStroke;
        ctx.strokeStyle = boxStroke;
        ctx.fillRect(x + xBoxOffset, yMedian - yMedianExtra, xBoxWidth, 2 * yMedianExtra);
        ctx.strokeRect(x + xBoxOffset, yMedian - yMedianExtra, xBoxWidth, 2 * yMedianExtra);

        // Outliers
        if (!this["hide-outliers"]) {
          const xJitter = xJitterHalfWidth !== 0 ?
            randomUniform.source(randomLcg(i * nData + iData))(xCenter - xJitterHalfWidth, xCenter + xJitterHalfWidth)
            : () => xCenter;
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = boxStroke;
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

  private drawMargins() {
    const ctx = this.canvasCtx;
    if (!ctx) return;

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

  private getPointedDatum(svgX: number, svgY: number): { position: number, datum: PreprocessedDatum | undefined } | undefined {
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
  for (const datum of dataset.positions) {
    out[datum.position] = preprocessDatum(datum);
  }
  return out;
}

interface PreprocessedDatum {
  position: number,
  values: number[],
  median: number,
  boxLow: number,
  boxHigh: number,
  whiskerLow: number,
  whiskerHigh: number,
  outliersLow: number[],
  outliersHigh: number[],
  minimum: number,
  maximum: number,
}

function preprocessDatum(datum: Distribution): PreprocessedDatum {
  const sorted = datum.values.slice().sort((a, b) => a - b);
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
    median,
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

export function getQuantile(sortedValues: number[], p: number) {
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
