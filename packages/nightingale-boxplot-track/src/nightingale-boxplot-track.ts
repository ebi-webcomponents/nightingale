import NightingaleElement, {
  BinarySearch,
  createEvent,
  customElementOnce,
  EnumAttributeConverter,
  OptionalNumberAttributeConverter,
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
import { axisLeft, BaseType, color, max, min, randomLcg, randomUniform, scaleLinear, select, Selection, TypedArray } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { Downsampler } from "./downsampling";


const ATTRIBUTES_THAT_TRIGGER_REFRESH: string[] = [
  "length", "width", "height",
  "margin-top", "margin-bottom", "margin-left", "margin-right", "margin-color",
  "y-min", "y-max", "show-axis", "zoomed-out-outline",
  "column-gap", "box-gap", "whisker-width", "outlier-jitter-width", "outlier-radius", "zoom-transition-range",
] satisfies (keyof NightingaleBoxplotTrack)[];
const ATTRIBUTES_THAT_TRIGGER_DATA_RESET: string[] = [] satisfies (keyof NightingaleBoxplotTrack)[];


/** Line width for rectangle stroke, in CSS pixels */
const LINE_WIDTH = 1;
/** Maximum line width relative to base width (width of one sequence position) (overrides `LINE_WIDTH` when zoomed out too much) */
const MAX_REL_LINE_WIDTH = 0.2;

/** Default fill color for boxes (stroke color will be derived from this) */
const DEFAULT_DATA_COLOR = "#cccccc";

/** Approximate width of a column in screen pixels, when showing downsampled data in "background" visualization.
 * (higher value means more responsive but lower-resolution visualization). */
const BG_DOWNSAMPLING_PIXELS_PER_COLUMN = 1;

/** Return stroke color matching a given fill color (darker version of the same color) */
function makeStrokeColor(dataColor: string): string | undefined {
  return color(dataColor)?.darker(2).formatHex();
}


/** Data for a single boxplot (subcolumn) in the visualization (i.e. a single sequence position for a single dataset) */
interface BoxplotDatum {
  /** Position in the sequence (1-based) */
  position: number,
  /** Array of values of the independent variable at the position */
  values: ArrayLike<number>,
}

/** Data for a single dataset in the visualization (i.e. all sequence positions for a single dataset) */
export interface BoxplotDataset {
  /** Name of the dataset */
  name: string,
  /** Color of the dataset visualization */
  color?: string,
  /** Array of boxplot data for individual positions in the sequence */
  positions: BoxplotDatum[],
}

/** Data for `NightingaleBoxplotTrack`.
 * A list of one or more datasets, where each dataset contains boxplot data for individual positions in the sequence.
 * In case of multiple datasets, the boxplots for each dataset will be shown side-by-side at each sequence position. */
export type BoxplotData = BoxplotDataset[];

/** Options for what kind of data can be shown as the shaded outline in zoomed-out visualization */
export const ZoomedOutOutlineOptions = ["extremes", "whiskers", "box", "none"] as const;
/** Options for what kind of data can be shown as the shaded outline in zoomed-out visualization */
export type ZoomedOutOutlineOption = typeof ZoomedOutOutlineOptions[number];


/** A Nightingale track for showing distribution of a variable on each residue position via boxplots */
@customElementOnce("nightingale-boxplot-track")
export default class NightingaleBoxplotTrack extends withCanvas(
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
  /** Bottom limit for Y-axis (default: minimum computed from data). */
  @property({ converter: OptionalNumberAttributeConverter })
  "y-min"?: number;

  /** Top limit for Y-axis (default: maximum computed from data). */
  @property({ converter: OptionalNumberAttributeConverter })
  "y-max"?: number;

  /** Turn on vertical axis. */
  @property({ type: Boolean })
  "show-axis"?: boolean;

  /** Turn on showing nested highlights, which indicate selected subcolumn within a column (in case of multiple datasets). */
  @property({ type: Boolean })
  "show-nested-highlights"?: boolean;

  /** Position of nested highlight in form "position/iDataset", or "" if none. */
  @property({ type: String, reflect: true }) // not using attribute converter here, because change detection would not work correctly
  private "nested-highlight": string = "";

  /** What kind of data should be shown as the shaded outline in zoomed-out visualization. */
  @property({ converter: EnumAttributeConverter(ZoomedOutOutlineOptions, "whiskers") })
  "zoomed-out-outline": ZoomedOutOutlineOption;

  /** Width of the gap between displayed columns, relative to the base width (width of one sequence position) (allowed range: 0-1, default: 0.2). */
  @property({ type: Number })
  "column-gap": number = 0.2;

  /** Width of the gap between boxes within a column, relative to the column width (allowed range: 0-1, default: 0.1). */
  @property({ type: Number })
  "box-gap": number = 0.1;

  /** Boxplot whisker width, relative to the box width (allowed range: 0-1, default: 0.6). */
  @property({ type: Number })
  "whisker-width": number = 0.6;

  /** Width of random noise (jitter) to be added to the X-position of the outliers, relative to the box width (allowed range: 0-1, default: 0.4). */
  @property({ type: Number })
  "outlier-jitter-width": number = 0.4;

  /** Radius for the circles representing outliers, in CSS pixels (default: 2). Set to 0 to supress outlier rendering. */
  @property({ type: Number })
  "outlier-radius": number = 2;

  /** Base width(s), in CSS pixels, where the transition from zoomed-out simplified visualization to zoomed-in boxplot visualization happens.
   * Can be either one number (for sharp transition) or a hyphen-separated range.
   * If there are multiple datasets, this width(s) will be multiplied by the number of datasets, to compensate for narrower space for each dataset.
   * Use "0" to always show zoomed-in visualization (or preferrably "0.5-1" to avoid perfomance issues).
   * Use "Infinity" to always show zoomed-out visualization.
   * (default: "4-5") */
  @property({ type: String })
  "zoom-transition-range": string = "4-5";


  #data?: BoxplotData;
  private preprocessedData?: PreprocessedData;
  /** D3 selection for SVG group for highlights (excluding nested highlights) */
  protected svgHighlights?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;
  /** D3 selection for SVG group for nested highlights */
  protected svgNestedHighlights?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;
  /** D3 selection for SVG group for margins */
  protected svgMargins?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;


  override connectedCallback() {
    super.connectedCallback();
    if (this.data) this.createTrack();
  }

  /** Get or set the data for the boxplot track */
  get data(): BoxplotData | undefined {
    return this.#data;
  }
  set data(data: BoxplotData | undefined) {
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
      this.svgHighlights = this.svg.append("g").attr("class", "highlighted");
      this.svgNestedHighlights = this.svg.append("g").attr("class", "nested-highlighted");
      this.svgMargins = this.svg.append("g").attr("class", "margin");
      if (this["show-axis"]) {
        const yScale = scaleLinear(this.getYLimits(), [this.height - this["margin-bottom"], this["margin-top"]]);
        this.svg.append("g").attr("class", "y-axis")
          .attr("transform", `translate(${this["margin-left"]},0)`)
          .call(axisLeft(yScale));
      }
    }
  }

  protected refresh() {
    this.requestDraw();
    this.updateHighlight();
    this.updateNestedHighlight();
    this.updateMargins();
  }

  /** Stamp for tracking changes to the drawing parameters (when the stamp changes, canvas redraw is needed) */
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
    this.clearCanvas(this.canvasCtx);
    this.drawData(this.canvasCtx);
  }

  /** Get a clean auxiliary offscreen canvas for drawing, of the same size as the main canvas.
   * Only one offscreen canvas can be use at any time, because it is reused. */
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
    const ctx = this._offscreenCanvas.getContext("2d") ?? undefined;
    this.clearCanvas(ctx);
    return [this._offscreenCanvas, ctx];
  }
  private _offscreenCanvas?: HTMLCanvasElement;

  /** Clear the canvas. */
  private clearCanvas(ctx: CanvasRenderingContext2D | undefined) {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /** Draw the data on the canvas. */
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
      // Draw foreground visualization via an auxiliary canvas (cannot be drawn directly to the main canvas, because overlapping outliers would add up and create opacity > fgAlpha)
      const [auxCanvas, auxCtx] = this.getOffscreenCanvas();
      if (auxCtx) {
        this.drawBoxplotVisualization(auxCtx);
        ctx.globalAlpha = fgAlpha;
        ctx.drawImage(auxCanvas, 0, 0);
      }
    }
  }

  /** Draw full boxplot visualization ("foreground" / zoomed-in) */
  private drawBoxplotVisualization(ctx: CanvasRenderingContext2D) {
    if (!this.preprocessedData) return;

    const { xColumnLeft, xColumnWidth, xScale, yScale, yMedianExtra, lineWidth, outlierRadius, start, stop } = this.getDrawingMeasurements();
    ctx.lineWidth = lineWidth;

    const nDatasets = this.preprocessedData.datasets.length;
    for (let iDataset = 0; iDataset < nDatasets; iDataset++) {
      const dataset = this.preprocessedData.datasets[iDataset];
      if (!dataset) continue;

      const dataColor = dataset.color ?? DEFAULT_DATA_COLOR;
      const fillColor = dataColor;
      const strokeColor = makeStrokeColor(dataColor)!;

      const xBoxOffset = xColumnLeft + (iDataset + 0.5 * this["box-gap"]) * xColumnWidth / nDatasets;
      const xBoxWidth = (1 - this["box-gap"]) * xColumnWidth / nDatasets;
      const xCenter = xBoxOffset + 0.5 * xBoxWidth;
      const xWhiskerLeft = xCenter - 0.5 * this["whisker-width"] * xBoxWidth;
      const xWhiskerRight = xCenter + 0.5 * this["whisker-width"] * xBoxWidth;
      const xJitterHalfwidth = 0.5 * this["outlier-jitter-width"] * xBoxWidth;

      for (let i = start; i < stop; i++) {
        const datum = dataset.positions[i];
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
        if (outlierRadius > 0) {
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

    const originalColumnWidth = (xScale(1) - xScale(0)) / BG_DOWNSAMPLING_PIXELS_PER_COLUMN;
    const downsamplingLevels = Downsampler.targetDownsamplingScalesForTransition(originalColumnWidth);

    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    for (let iDataset = 0; iDataset < nDatasets; iDataset++) {
      const dataset = this.preprocessedData.datasets[iDataset];
      if (!dataset) continue;

      const { offset, length, downsamplers } = dataset.downsampling;

      const dataColor = dataset.color ?? DEFAULT_DATA_COLOR;
      const fillColor = dataColor;
      const strokeColor = makeStrokeColor(dataColor)!;

      // Overlay two downsampling levels (e.g. 8x and 4x) to hide the transition between levels and create illusion of smooth zooming
      for (const { scale, weight } of downsamplingLevels) {
        ctx.lineWidth = (scale === 1) ? 1 : lineWidth;
        const medianLow = downsamplers.medianLow.getDownsampledByScale(scale);
        const medianHigh = downsamplers.medianHigh.getDownsampledByScale(scale);
        const exactScale = length / medianLow.length; // This might be slightly different from `scale` which is always a power of two.

        const yMedianLow = (j: number) => yScale(medianLow[j]) + yMedianExtra;
        const yMedianHigh = (j: number) => yScale(medianHigh[j]) - yMedianExtra;

        let yOutlineLow: ((j: number) => number) | undefined;
        let yOulineHigh: ((j: number) => number) | undefined;
        switch (this["zoomed-out-outline"]) {
          case "extremes": {
            const minimum = downsamplers.minimum.getDownsampledByScale(scale);
            const maximum = downsamplers.maximum.getDownsampledByScale(scale);
            yOutlineLow = (j: number) => yScale(minimum[j]);
            yOulineHigh = (j: number) => yScale(maximum[j]);
            break;
          }
          case "whiskers": {
            const whiskerLow = downsamplers.whiskerLow.getDownsampledByScale(scale);
            const whiskerHigh = downsamplers.whiskerHigh.getDownsampledByScale(scale);
            yOutlineLow = (j: number) => yScale(whiskerLow[j]);
            yOulineHigh = (j: number) => yScale(whiskerHigh[j]);
            break;
          }
          case "box": {
            const boxLow = downsamplers.boxLow.getDownsampledByScale(scale);
            const boxHigh = downsamplers.boxHigh.getDownsampledByScale(scale);
            yOutlineLow = (j: number) => yScale(boxLow[j]);
            yOulineHigh = (j: number) => yScale(boxHigh[j]);
            break;
          }
          case "none": {
            yOutlineLow = undefined;
            yOulineHigh = undefined;
            break;
          }
        }

        // j-prefixed variables refer to indices in the downsampled data
        const jStart = Math.max(0, Math.floor((start - offset) / exactScale));
        const jStop = Math.min(medianLow.length, Math.ceil((stop - offset) / exactScale));
        const jSegments = getContiguousSegments(jStart, jStop, j => !isNaN(medianLow[j]));

        const jXScale = (j: number) => xScale(offset + j * exactScale);

        // Shaded outline
        if (yOutlineLow && yOulineHigh) {
          for (const segment of jSegments) {
            ctx.globalAlpha = weightAlpha(0.25 * alpha, weight);
            ctx.fillStyle = fillColor;
            drawSilhouette(ctx, segment, jXScale, yOutlineLow, yOulineHigh, [xColumnLeft, xColumnRight], "fill");
          }
        }

        // Median
        for (const segment of jSegments) {
          ctx.globalAlpha = weightAlpha(0.5 * alpha, weight);
          ctx.fillStyle = strokeColor;
          ctx.strokeStyle = strokeColor;
          drawSilhouette(ctx, segment, jXScale, yMedianLow, yMedianHigh, [xColumnLeft, xColumnRight], "fill+stroke");
        }
      }
    }
  }

  /** Get a set of shared measurement variables for drawing the boxplot visualizations. */
  private getDrawingMeasurements() {
    const canvasScale = this.canvasScale;
    const xBaseWidthInCss = this.getSingleBaseWidth();
    const xBaseWidth = canvasScale * xBaseWidthInCss;
    const xColumnLeft = xBaseWidth * 0.5 * this["column-gap"];
    const xColumnWidth = xBaseWidth * (1 - this["column-gap"]);
    const xColumnRight = xColumnLeft + xColumnWidth;
    const xScale = (i: number) => canvasScale * this.getXFromSeqPosition(i);

    const yColumnOffset = canvasScale * this["margin-top"];
    const yColumnHeight = canvasScale * (this["height"] - this["margin-top"] - this["margin-bottom"]);
    const yScale = scaleLinear(this.getYLimits(), [yColumnOffset + yColumnHeight, yColumnOffset]);
    const yMedianExtra = canvasScale * 1;

    const lineWidth = canvasScale * Math.min(LINE_WIDTH, MAX_REL_LINE_WIDTH * xBaseWidthInCss);
    const outlierRadius = canvasScale * this["outlier-radius"];

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
      /** Scale from value of the independent variable to vertical position in canvas space */
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
    const [transitionMin, transitionMax] = this.getZoomTransitionRange();

    if (boxWidth <= transitionMin) {
      return [0, 1];
    } else if (boxWidth >= transitionMax) {
      return [1, 0];
    } else {
      const fgAlpha = (boxWidth - transitionMin) / (transitionMax - transitionMin);
      return [fgAlpha, 1 - fgAlpha];
    }
  }

  private getZoomTransitionRange(): [number, number] {
    const nums = this["zoom-transition-range"].split("-").map(Number);
    const [a, b] = nums.length >= 2 ? [nums[0], nums[1]] : [nums[0], nums[0]]
    if (isNaN(a) || isNaN(b)) return [0, 0];
    return [a, b];
  }

  /** Update the SVG highlights (excluding nested highlights) */
  protected updateHighlight() {
    if (!this.svgHighlights) return;
    const highlights = this.svgHighlights
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

  /** Update the SVG nested highlights (indicate the pointed subcolumn within the highlighted column) */
  protected updateNestedHighlight() {
    if (!this.svgNestedHighlights) return;
    const nestedHighlightLocation = NestedHighlight.parse(this["nested-highlight"]);
    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    const showNestedHighlight = this["show-nested-highlights"] && nDatasets > 1 && nestedHighlightLocation !== undefined;

    const highlights = this.svgNestedHighlights
      .selectAll<SVGRectElement, unknown>("rect")
      .data(showNestedHighlight ? [nestedHighlightLocation] : []);

    const baseWidth = this.getSingleBaseWidth();
    const columnOffset = baseWidth * 0.5 * this["column-gap"];
    const columnWidth = baseWidth * (1 - this["column-gap"]);
    const datumWidth = columnWidth / nDatasets;

    highlights
      .enter()
      .append("rect")
      .style("pointer-events", "none")
      .merge(highlights)
      .attr("fill", this["highlight-color"])
      .attr("opacity", this.getFgBgOpacity()[0])
      .attr("height", this.height)
      .attr("x", ([position, iDataset]) => this.getXFromSeqPosition(position) + columnOffset + iDataset * datumWidth)
      .attr("width", datumWidth);

    highlights.exit().remove();
  }

  /** Update the SVG margins */
  protected updateMargins() {
    this.renderMarginOnGroup(this.svgMargins);
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
    target.on("click.NightingaleBoxplotTrack", (event: MouseEvent) => this.handleClick(event));
    target.on("mousemove.NightingaleBoxplotTrack", (event: MouseEvent) => this.handleMousemove(event));
    target.on("mouseout.NightingaleBoxplotTrack", (event: MouseEvent) => this.handleMouseout(event));
  }

  private unbindEvents<T extends BaseType>(target: Selection<T, unknown, BaseType, unknown>): void {
    target.on("click.NightingaleBoxplotTrack", null);
    target.on("mousemove.NightingaleBoxplotTrack", null);
    target.on("mouseout.NightingaleBoxplotTrack", null);
  }

  private handleClick(event: MouseEvent): void {
    const pointed = this.getPointedDatum(event.offsetX, event.offsetY);
    if (pointed === undefined) {
      return;
    }

    const withHighlight = this.getAttribute("highlight-event") === "onclick";
    if (withHighlight) {
      const iDataset = pointed.feature?.datasetIndex;
      this["nested-highlight"] = NestedHighlight.format(iDataset !== undefined ? [pointed.position, iDataset] : undefined);
    }

    const customEvent = createEvent(
      "click",
      pointed.feature,
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
    if (withHighlight) {
      const iDataset = pointed.feature?.datasetIndex;
      this["nested-highlight"] = NestedHighlight.format(iDataset !== undefined ? [pointed.position, iDataset] : undefined);
    }

    const customEvent = createEvent(
      "mouseover",
      pointed.feature,
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
    if (withHighlight) {
      this["nested-highlight"] = NestedHighlight.format(undefined);
    }

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

  /** Get the datum pointed by the mouse cursor at the given SVG coordinates */
  private getPointedDatum(svgX: number, _svgY: number) {
    const continuousPosition = this.getSeqPositionFromX(svgX);
    if (continuousPosition === undefined) return undefined;
    const position = Math.floor(continuousPosition);
    const fractional = continuousPosition - position;
    const fractionalWithinColumn = (fractional - 0.5 * this["column-gap"]) / (1 - this["column-gap"]);
    const nDatasets = this.preprocessedData?.datasets.length ?? 1;
    const iDataset = Math.max(0, Math.min(nDatasets - 1, Math.floor(fractionalWithinColumn * nDatasets)));

    type EventFeatureData = Parameters<typeof createEvent>[1];
    const feature: EventFeatureData = {
      type: "boxplot",
      position: position,
      data: this.preprocessedData?.datasets.map(dataset => ({
        dataset: { name: dataset.name, color: dataset.color ?? DEFAULT_DATA_COLOR },
        datum: dataset?.positions[position],
      })) ?? [],
      datasetIndex: iDataset,
    };
    return { position, feature };
  }
}


/** Preprocessed data for the boxplot track */
type PreprocessedData = ReturnType<typeof preprocessData>;

/** Preprocess data for the boxplot track */
function preprocessData(data: BoxplotData) {
  const preprocessedDatasets = data.map(preprocessDataset);
  return {
    datasets: preprocessedDatasets,
    yLimits: getExtremes(preprocessedDatasets),
  }
}

/** Preprocessed data for a single dataset */
type PreprocessedDataset = ReturnType<typeof preprocessDataset>;

/** Preprocess data for a single dataset */
function preprocessDataset(dataset: BoxplotDataset) {
  const preprocessedPositions: PreprocessedPositions = {};

  for (const datum of dataset.positions) {
    preprocessedPositions[datum.position] = preprocessDatum(datum);
  }
  return {
    ...dataset,
    positions: preprocessedPositions,
    downsampling: getDownsamplersForDataset(preprocessedPositions),
  };
}

/** Preprocessed data for a single position in a single dataset */
interface PreprocessedDatum {
  /** Position in the sequence */
  position: number,
  /** All values at this position, sorted */
  values: Float32Array,
  /** Median value */
  median: number,
  /** Lower bound of the box (lower quartile) */
  boxLow: number,
  /** Upper bound of the box (upper quartile) */
  boxHigh: number,
  /** Lower bound of the whisker (lower quartile - 1.5 * IQR) */
  whiskerLow: number,
  /** Upper bound of the whisker (upper quartile + 1.5 * IQR) */
  whiskerHigh: number,
  /** Minimum value */
  minimum: number,
  /** Maximum value */
  maximum: number,
  /** Outliers below the whisker */
  outliersLow: Float32Array,
  /** Outliers above the whisker */
  outliersHigh: Float32Array,
}

type PreprocessedPositions = { [position: number]: PreprocessedDatum }

/** Preprocess data for a single position in a dataset */
function preprocessDatum(datum: BoxplotDatum): PreprocessedDatum {
  const sorted = sortIfNeeded(new Float32Array(datum.values));
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

/** Check whether `array` is sorted, sort if not. */
function sortIfNeeded<T extends TypedArray>(array: T): T {
  if (!arrayIsSorted(array)) {
    array.sort();
  }
  return array;
}

/** Decide whether `array` is sorted. */
function arrayIsSorted(array: TypedArray): boolean {
  for (let i = 1, n = array.length; i < n; i++) {
    if (array[i - 1] > array[i]) {
      return false;
    }
  }
  return true;
}

/** Get p-quantile of the dataset. Input values must be sorted for this to work. */
export function getQuantile(sortedValues: ArrayLike<number>, p: number) {
  const i_ = (sortedValues.length - 1) * p;
  if (i_ >= sortedValues.length - 1) {
    return sortedValues[sortedValues.length - 1];
  }
  const i = Math.floor(i_);
  const q = i_ - i;
  return sortedValues[i] * (1 - q) + sortedValues[i + 1] * q;
}

/** Get automatic Y-axis limits for the given preprocessed data (minimum and maximum value of the whole dataset). */
function getExtremes(data: PreprocessedDataset[]) {
  let min = Infinity;
  let max = -Infinity;

  for (const dataset of data) {
    for (const position in dataset.positions) {
      const datum = dataset.positions[position];
      if (datum.minimum < min) min = datum.minimum;
      if (datum.maximum > max) max = datum.maximum;
    }
  }

  return {
    min: min === Infinity ? undefined : min,
    max: max === -Infinity ? undefined : max,
  };
}

/** Get contiguous segments within the integer range [start, stop), where `isPresent` returns true for each index.
 * Return segments as an array of [start, stop) pairs. */
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

/** Draw a silhouette for the given segments. */
function drawSilhouette(
  ctx: CanvasRenderingContext2D, [sStart, sStop]: [number, number],
  getX: (i: number) => number, getYLow: (i: number) => number, getYHigh: (i: number) => number,
  [columnOffsetLeft, columnOffsetRight]: [number, number], style: "fill" | "stroke" | "fill+stroke"
) {
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
  if (style.includes("fill")) ctx.fill();
  if (style.includes("stroke")) ctx.stroke();
}

/** Convert preprocessed dataset from array of objects to object of arrays, for downsampling. */
function datasetToArrays(data: PreprocessedPositions) {
  const positions = Object.values(data).map(d => d.position);
  const offset = min(positions) ?? 1;
  const stop = (max(positions) ?? 0) + 1;
  const length = stop - offset;
  const median = new Float32Array(length).fill(NaN);
  const boxLow = new Float32Array(length).fill(NaN);
  const boxHigh = new Float32Array(length).fill(NaN);
  const whiskerLow = new Float32Array(length).fill(NaN);
  const whiskerHigh = new Float32Array(length).fill(NaN);
  const minimum = new Float32Array(length).fill(NaN);
  const maximum = new Float32Array(length).fill(NaN);
  for (const pos of Object.values(data)) {
    median[pos.position - offset] = pos.median;
    boxLow[pos.position - offset] = pos.boxLow;
    boxHigh[pos.position - offset] = pos.boxHigh;
    whiskerLow[pos.position - offset] = pos.whiskerLow;
    whiskerHigh[pos.position - offset] = pos.whiskerHigh;
    minimum[pos.position - offset] = pos.minimum;
    maximum[pos.position - offset] = pos.maximum;
  }
  return {
    offset,
    length,
    arrays: { median, boxLow, boxHigh, whiskerLow, whiskerHigh, minimum, maximum },
  };
}

/** Get a set of downsamplers for each data type (median, minimum, ...) for a preprocessed dataset */
function getDownsamplersForDataset(data: PreprocessedPositions) {
  const { offset, length, arrays } = datasetToArrays(data);
  return {
    offset,
    length,
    downsamplers: {
      medianLow: new Downsampler(arrays.median, "min"),
      medianHigh: new Downsampler(arrays.median, "max"),
      boxLow: new Downsampler(arrays.boxLow, "min"),
      boxHigh: new Downsampler(arrays.boxHigh, "max"),
      whiskerLow: new Downsampler(arrays.whiskerLow, "min"),
      whiskerHigh: new Downsampler(arrays.whiskerHigh, "max"),
      minimum: new Downsampler(arrays.minimum, "min"),
      maximum: new Downsampler(arrays.maximum, "max"),
    },
  };
}

/** Adjust opacity value (`alpha`) for rendering two overlaying visualizations.
 * This is done in such a way that overlaying of two visualizations with weights `weight` and `1-weight` will give the desired total opacity `alpha` in the overlapping area.
 * (Naive `alpha*weight` would result in overlapping areas being more transparent than intended). */
function weightAlpha(alpha: number, weight: number) {
  if (alpha === 1) {
    // Avoid ill-defined expressions (division by zero)
    return (weight > 0) ? 1 : 0;
  }
  const transpTotal = 1 - alpha;
  const transpW = 1 - alpha * weight;
  const transpWComplement = 1 - alpha * (1 - weight);
  const correctionFactor = Math.sqrt(transpTotal / (transpW * transpWComplement));
  const transpWCorrected = transpW * correctionFactor;
  return 1 - transpWCorrected;
}

/** Location of nested highlight (sequence position and 0-based dataset index within the position). */
type NestedHighlight = [position: number, iDataset: number] | undefined;
const NestedHighlight = {
  /** Format `NestedHighlight` in the form "position/iDataset", or "" if undefined. */
  format(value: NestedHighlight): string {
    if (!value) return "";
    return `${value[0]}/${value[1]}`;
  },
  /** Format `NestedHighlight` from the form "position/iDataset", or "" if undefined. */
  parse(str: string): NestedHighlight {
    if (str.trim() === "") return undefined;
    const [a, b] = str.split("/").map(Number);
    return [a, b];
  },
};
