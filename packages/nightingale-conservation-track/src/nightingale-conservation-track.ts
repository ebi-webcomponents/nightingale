import NightingaleElement, {
  customElementOnce,
  withCanvas,
  withDimensions,
  withHighlight,
  withManager,
  withMargin,
  withPosition,
  withResizable,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";
import { firstGteqIndex, Refresher } from "@nightingale-elements/nightingale-track-canvas/src/utils/utils"; // TODO move Refresher to shared lib
import { select, Selection } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";


const ATTRIBUTES_THAT_TRIGGER_REFRESH: string[] = [
  "length", "width", "height",
  "margin-top", "margin-bottom", "margin-left", "margin-right", "margin-color",
  "font-family", "min-font-size", "fade-font-size", "max-font-size",
] satisfies (keyof NightingaleConservationTrack)[];
const ATTRIBUTES_THAT_TRIGGER_DATA_RESET: string[] = ["letter-order"] satisfies (keyof NightingaleConservationTrack)[];

/** Order of amino acids in a column (top-to-bottom) */
const AMINO_ACID_ORDER = Array.from("HYSTQNAVLIMFWDEPKRCG"); // TODO create more meaningful order?
/** Color to be used for unknown amino acids */
const DEFAULT_COLOR = "#AAAAAA";
/** Colors for amino acid groups, based on Clustal (https://www.jalview.org/help/html/colourSchemes/clustal.html) */
const AMINO_GROUP_COLOR = {
  aromatic: "#15A4A4",
  polar: "#15C015",
  hydrophobic: "#80A0F0",
  negative: "#C048C0",
  proline: "#C0C000",
  positive: "#F01505",
  cysteine: "#F08080",
  glycine: "#F09048",
};
/** Colors for individual amino acids, based on Clustal (https://www.jalview.org/help/html/colourSchemes/clustal.html) */
const AMINO_ACID_COLOR = {
  H: AMINO_GROUP_COLOR.aromatic,
  Y: AMINO_GROUP_COLOR.aromatic,
  S: AMINO_GROUP_COLOR.polar,
  T: AMINO_GROUP_COLOR.polar,
  N: AMINO_GROUP_COLOR.polar,
  Q: AMINO_GROUP_COLOR.polar,
  A: AMINO_GROUP_COLOR.hydrophobic,
  V: AMINO_GROUP_COLOR.hydrophobic,
  L: AMINO_GROUP_COLOR.hydrophobic,
  I: AMINO_GROUP_COLOR.hydrophobic,
  M: AMINO_GROUP_COLOR.hydrophobic,
  F: AMINO_GROUP_COLOR.hydrophobic,
  W: AMINO_GROUP_COLOR.hydrophobic,
  D: AMINO_GROUP_COLOR.negative,
  E: AMINO_GROUP_COLOR.negative,
  P: AMINO_GROUP_COLOR.proline,
  K: AMINO_GROUP_COLOR.positive,
  R: AMINO_GROUP_COLOR.positive,
  C: AMINO_GROUP_COLOR.cysteine,
  G: AMINO_GROUP_COLOR.glycine,
};
/** Color for rectangle stroke */
const STROKE_COLOR = "#D3D3D3";
/** Line width for rectangle stroke */
const LINE_WIDTH = 1;
/** Maximum line width relative to column width (overrides `LINE_WIDTH` when zoomed out too much) */
const MAX_REL_LINE_WIDTH = 0.2;


/** Amino acid probability for each amino acid for each position */
interface Probabilities { [letter: string]: number[] }

/** Vertical position for each amino acid for each position */
interface YPositions {
  start: { [letter: string]: number[] },
  end: { [letter: string]: number[] },
}

type LetterOrder = "property" | "probability";

export interface SequenceConservationData {
  /** Sequence number for each position */
  index: number[],
  /** Conservation score for each position */
  conservation_score: number[], // TODO find out if needed, remove otherwise
  /** Amino acid probability for each amino acid for each position */
  probabilities: Probabilities,
}

@customElementOnce("nightingale-conservation-track")
class NightingaleConservationTrack extends withCanvas(
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
  /** Order of amino acids within a column (top-to-bottom) */
  @property({ type: String })
  "letter-order": LetterOrder = "property";

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


  #conservationData?: SequenceConservationData;
  private yPositions?: YPositions;
  protected highlighted?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;


  connectedCallback() {
    super.connectedCallback();
    if (this.data) this.createTrack();
  }

  get data(): SequenceConservationData | undefined {
    return this.#conservationData;
  }
  set data(data: SequenceConservationData | undefined) {
    this.#conservationData = data;
    if (data) {
      if (this["letter-order"] === "probability") {
        this.yPositions = computeYPositions_ProbabilityOrder(data.probabilities);
      } else {
        this.yPositions = computeYPositions_FixedOrder(data.probabilities, AMINO_ACID_ORDER);
      }
    } else {
      this.yPositions = undefined
    }
    this.createTrack();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
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
    this.svg?.selectAll("g").remove();

    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    if (!this.svg) return;
    this.highlighted = this.svg.append("g").attr("class", "highlighted");
  }

  refresh() {
    this.requestDraw();
    this.updateHighlight();
  }

  private _drawStamp: Record<string, unknown> = {};
  /** If `_drawStamp` has become outdated since the last call to this function, update `_drawStamp` and return true. Otherwise return false. */
  private needsRedraw(): boolean {
    const stamp: typeof this._drawStamp = {
      data: this.data,
      canvas: this.canvasCtx,
      extent: `${this.width}x${this.height}@${this.canvasScale}/${this.getSeqPositionFromX(0)}:${this.getSeqPositionFromX(this.width)}`,
    };
    for (const attr of ATTRIBUTES_THAT_TRIGGER_DATA_RESET) {
      stamp[attr] = this.getAttribute(attr);
    }
    for (const attr of ATTRIBUTES_THAT_TRIGGER_REFRESH) {
      stamp[attr] = this.getAttribute(attr);
    }

    if (objectShallowEquals(stamp, this._drawStamp)) {
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
    this.adjustCanvasCtxLogicalSize();
    this.clearCanvas();
    this.drawColumns();
    this.drawMargins();
  }

  private clearCanvas() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  private drawColumns() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    if (!this.data) return;

    const scale = this.canvasScale;
    const baseWidthInCss = this.getSingleBaseWidth();
    const baseWidth = scale * baseWidthInCss;
    const fontOpacity = this.getFontOpacity(baseWidthInCss);
    const columnOffset = scale * this["margin-top"];
    const columnHeight = scale * (this["height"] - this["margin-top"] - this["margin-bottom"]);

    ctx.lineWidth = scale * Math.min(LINE_WIDTH, MAX_REL_LINE_WIDTH * baseWidthInCss);
    ctx.strokeStyle = STROKE_COLOR;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const leftEdgeSeq = this.getSeqPositionFromX(0 - 0.5 * LINE_WIDTH) ?? -Infinity;
    const rightEdgeSeq = this.getSeqPositionFromX(this.width + 0.5 * LINE_WIDTH) ?? Infinity;
    const iFrom = Math.max(0, firstGteqIndex(this.data.index, leftEdgeSeq - 1, x => x));
    const iTo = Math.min(this.data.index.length, firstGteqIndex(this.data.index, rightEdgeSeq, x => x));

    for (let i = iFrom; i < iTo; i++) {
      const x = scale * this.getXFromSeqPosition(this.data.index[i]);
      const textX = x + 0.5 * baseWidth;

      for (const letter in this.yPositions?.start) {
        const relStart = Math.min(this.yPositions.start[letter][i], 1);
        const relEnd = Math.min(this.yPositions.end[letter][i], 1);
        const start = relStart * columnHeight + columnOffset;
        const end = relEnd * columnHeight + columnOffset;
        const height = end - start;

        // Draw rectangle
        ctx.globalAlpha = 1;
        ctx.fillStyle = AMINO_ACID_COLOR[letter as keyof typeof AMINO_ACID_COLOR] ?? DEFAULT_COLOR;
        ctx.fillRect(x, start, baseWidth, height);
        ctx.strokeRect(x, start, baseWidth, height);

        // Draw letter
        if (fontOpacity === 0) continue;
        const fontSize = Math.min(baseWidth, height, scale * this["max-font-size"]);
        if (fontSize < scale * this["min-font-size"]) continue;
        const textY = start + 0.5 * height;
        ctx.globalAlpha = fontOpacity;
        ctx.fillStyle = "black";
        ctx.font = `${fontSize}px ${this["font-family"]}`;
        ctx.fillText(letter, textX, textY);
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

  private getFontOpacity(baseWidthInCss: number): number {
    if (baseWidthInCss < this["min-font-size"]) {
      return 0;
    } else if (baseWidthInCss < this["fade-font-size"]) {
      return (baseWidthInCss - this["min-font-size"]) / (this["fade-font-size"] - this["min-font-size"]);
    } else {
      return 1;
    }
  }

  /** Inverse of `this.getXFromSeqPosition`. */
  getSeqPositionFromX(x: number): number | undefined {
    return this.xScale?.invert(x - this["margin-left"]);
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

  zoomRefreshed() {
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
}

export default NightingaleConservationTrack;


function computeYPositions_FixedOrder(probabilities: Probabilities, order: string[]): YPositions {
  const normalizedOrder = normalizeOrder(Object.keys(probabilities), order);
  const start: { [letter: string]: number[] } = {};
  const end: { [letter: string]: number[] } = {};
  for (const letter of normalizedOrder) {
    start[letter] = [];
    end[letter] = [];
  }
  const n = Math.max(0, ...normalizedOrder.map(letter => probabilities[letter].length));
  for (let i = 0; i < n; i++) {
    let cum = 0;
    for (const letter of normalizedOrder) {
      start[letter].push(cum);
      cum += probabilities[letter][i] ?? 0;
      end[letter].push(cum);
    }
  }
  return { start, end };
}

function computeYPositions_ProbabilityOrder(probabilities: Probabilities): YPositions {
  const alphabet = Object.keys(probabilities);
  const start: { [letter: string]: number[] } = {};
  const end: { [letter: string]: number[] } = {};
  for (const letter of alphabet) {
    start[letter] = [];
    end[letter] = [];
  }
  const n = Math.max(0, ...alphabet.map(letter => probabilities[letter].length));
  for (let i = 0; i < n; i++) {
    let cum = 0;
    alphabet.sort((a, b) => (probabilities[b][i] ?? 0) - (probabilities[a][i] ?? 0));
    for (const letter of alphabet) {
      start[letter].push(cum);
      cum += probabilities[letter][i] ?? 0;
      end[letter].push(cum);
    }
  }
  return { start, end };
}

function normalizeOrder(present: string[], order: string[]) {
  const presentSet = new Set(present);
  const orderSet = new Set(order);
  const ordered = order.filter(s => presentSet.has(s));
  const rest = present.filter(s => !orderSet.has(s));
  return ordered.concat(rest);
}

function objectShallowEquals(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  for (const key in a) {
    if (a[key] !== b[key]) return false;
  }
  for (const key in b) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}
