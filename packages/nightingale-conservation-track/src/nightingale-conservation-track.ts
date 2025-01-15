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
import { Refresher } from "@nightingale-elements/nightingale-track-canvas/src/utils/utils"; // TODO move Refresher to shared lib
import { select, Selection } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";


// TODO: height is not triggering a full redrawn when is changed after first render
const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];

/** Order of amino acids in a column (top-to-bottom) */
const AMINO_ACID_ORDER = Array.from("HYSTQNAVLIMFWDEPKRCG"); // TODO create more meaningful order?
/** Color to be used for unknown amino acids */
const DEFAULT_COLOR = "#AAAAAA";
/** Colors for amino acid groups */
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
/** Colors for individual amino acids */
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


/** Amino acid probability for each amino acid for each position */
interface Probabilities { [letter: string]: number[] }

/** Vertical position for each amino acid for each position */
interface YPositions {
  start: { [letter: string]: number[] },
  end: { [letter: string]: number[] },
}

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
  #conservationData?: SequenceConservationData;
  private positions?: YPositions;

  protected seqG?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  protected highlighted?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;

  connectedCallback() {
    super.connectedCallback();
    if (this.data) this.createTrack();
  }

  set data(data: SequenceConservationData | undefined) {
    this.#conservationData = data;
    this.positions = data ? computePositions(data.probabilities, AMINO_ACID_ORDER) : undefined;
    this.createTrack();
  }
  get data() {
    return this.#conservationData;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name) ||
      name.startsWith("margin-")
    ) {
      this.createTrack();
    }
  }

  protected createTrack() {
    console.log("createTrack", this.data);

    this.svg?.selectAll("g").remove();

    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    if (!this.svg) return;
    this.seqG = this.svg.append("g").attr("class", "sequence-features");
    this.highlighted = this.svg.append("g").attr("class", "highlighted");
  }

  refresh() {
    this.requestDraw();
    this.updateHighlight();
  }


  /** Request canvas redraw. */
  private requestDraw = () => this._drawer.requestRefresh();
  private readonly _drawer = Refresher(() => this._draw());
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
  private _draw(): void {
    // if (!this.needsRedraw()) return;
    this.adjustCanvasCtxLogicalSize();
    this.drawCanvasContent();
  }

  private drawCanvasContent() {
    const ctx = this.canvasCtx;
    if (!ctx) return;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const scale = this.canvasScale;
    ctx.lineWidth = scale * LINE_WIDTH;
    ctx.strokeStyle = "rgb(211,211,211)";
    ctx.globalAlpha = 1;
    const baseWidth = scale * this.getSingleBaseWidth();
    const leftEdgeSeq = this.getSeqPositionFromX(0 - 0.5 * LINE_WIDTH) ?? -Infinity;
    const rightEdgeSeq = this.getSeqPositionFromX(canvasWidth / scale + 0.5 * LINE_WIDTH) ?? Infinity;
    // TODO test edge cases for above
    // This is better than this["display-start"], this["display-end"]+1, because it considers margins and symbol size

    console.log("drawCanvasContent", leftEdgeSeq, rightEdgeSeq)
    // Draw features
    if (this.data) {
      for (let i = 0; i < this.data.index.length; i++) {
        const seqId = this.data.index[i];
        if (seqId + 1 < leftEdgeSeq) continue;
        if (seqId > rightEdgeSeq) continue;
        // TODO use binary search or similar to select range
        const x = scale * this.getXFromSeqPosition(seqId);
        for (const letter in this.positions?.start) {
          const start = Math.min(this.positions.start[letter][i], 1) * scale * canvasHeight;
          const end = Math.min(this.positions.end[letter][i], 1) * scale * canvasHeight;
          // TODO top and bottom margin
          const height = end - start;
          ctx.fillStyle = AMINO_ACID_COLOR[letter as keyof typeof AMINO_ACID_COLOR] ?? DEFAULT_COLOR;
          ctx.fillRect(x, start, baseWidth, height);
          ctx.strokeRect(x, start, baseWidth, height);
        }
      }
    }

    // Draw margins
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


  /** Inverse of `this.getXFromSeqPosition`. */
  getSeqPositionFromX(x: number): number | undefined {
    return this.xScale?.invert(x - this["margin-left"]);
  }

  protected updateHighlight() {
    if (!this.highlighted) return;
    const highlights = this.highlighted
      .selectAll<
        SVGRectElement,
        {
          start: number;
          end: number;
        }[]
      >("rect")
      .data(this.highlightedRegion.segments);

    highlights
      .enter()
      .append("rect")
      .style("pointer-events", "none")
      .merge(highlights)
      .attr("fill", this["highlight-color"])
      .attr("height", this.height)
      .attr("x", (d) => this.getXFromSeqPosition(d.start))
      .attr("width", (d) =>
        Math.max(0, this.getSingleBaseWidth() * (d.end - d.start + 1))
      );

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
}

export default NightingaleConservationTrack;


const LINE_WIDTH = 1;

function computePositions(probabilities: Probabilities, order: string[]): YPositions {
  const normalizedOrder = normalizeOrder(Object.keys(probabilities), order);
  console.log(computePositions, normalizedOrder)
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
      cum += probabilities[letter][i];
      end[letter].push(cum);
    }
  }
  return { start, end };
}
// TODO implement probability-based ordering

function normalizeOrder(present: string[], order: string[]) {
  const presentSet = new Set(present);
  const orderSet = new Set(order);
  const ordered = order.filter(s => presentSet.has(s));
  const rest = present.filter(s => !orderSet.has(s));
  return ordered.concat(rest);
}
