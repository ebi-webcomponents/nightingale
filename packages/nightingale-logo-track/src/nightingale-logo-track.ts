import NightingaleElement, {
  customElementOnce,
  withHighlight,
  withManager,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";
import { select } from "d3";
import { html, PropertyValues } from "lit";

const NUCLEOTIDE_COLORS: Record<string, string> = {
  A: "#00CC00",
  C: "#0000CC",
  G: "#FFB300",
  U: "#CC0000",
};

const TRACKED_NUCLEOTIDES = ["A", "C", "G", "U"];
/** Maximum information content for a 4-letter alphabet (log2(4) = 2 bits) */
const LOG2_4 = 2;
const FONT_SIZE = 12;
const CHAR_BASE_WIDTH = 8;
const MIN_LETTER_HEIGHT = 1;
/** Fraction of FONT_SIZE occupied by uppercase cap height (Arial/Helvetica ~0.72) */
const CAP_RATIO = 0.72;

interface LetterData {
  nucleotide: string;
  /** Fraction of total track height this letter should occupy (0–1) */
  heightFraction: number;
}

export interface MsaSequence {
  name: string;
  sequence: string;
}

@customElementOnce("nightingale-logo-track")
export default class NightingaleLogoTrack extends withManager(
  withZoom(withHighlight(NightingaleElement))
) {
  private _sequences: MsaSequence[] = [];

  get sequences(): MsaSequence[] {
    return this._sequences;
  }
  set sequences(value: MsaSequence[]) {
    this._sequences = value;
    this.refresh();
  }

  override zoomRefreshed() {
    super.zoomRefreshed();
    if (this.getWidthWithMargins() > 0) this.refresh();
  }

  protected createTrack() {
    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  refresh() {
    this.renderLogo();
  }

  /** Compute per-nucleotide stacked heights for one alignment column. */
  private computeColumnData(pos: number): LetterData[] {
    const colIndex = pos - 1;
    const counts: Record<string, number> = { A: 0, C: 0, G: 0, U: 0 };
    let total = 0;

    for (const seq of this._sequences) {
      if (colIndex < seq.sequence.length) {
        const char = seq.sequence[colIndex].toUpperCase();
        // Treat DNA thymine as RNA uracil
        const key = char === "T" ? "U" : char;
        if (key in counts) {
          counts[key]++;
          total++;
        }
      }
    }

    if (total === 0) return [];

    // Scale IC by coverage so gap-heavy columns don't produce misleadingly
    // tall logos from a small subset of sequences that happen to agree.
    const coverage = total / this._sequences.length;

    // Shannon entropy
    let H = 0;
    for (const nuc of TRACKED_NUCLEOTIDES) {
      const f = counts[nuc] / total;
      if (f > 0) H -= f * Math.log2(f);
    }
    const IC = Math.max(0, LOG2_4 - H) * coverage;

    const letters: LetterData[] = [];
    for (const nuc of TRACKED_NUCLEOTIDES) {
      const f = counts[nuc] / total;
      if (f > 0) {
        letters.push({ nucleotide: nuc, heightFraction: (f * IC) / LOG2_4 });
      }
    }

    // Most-conserved nucleotide at the bottom of the stack
    letters.sort((a, b) => b.heightFraction - a.heightFraction);
    return letters;
  }

  private renderLogo(): void {
    const svgEl = this.querySelector("svg");
    if (!svgEl) return;

    const width = this.width;
    const height = this.height;
    if (!width || !height) return;

    const marginTop = this["margin-top"];
    const marginBottom = this["margin-bottom"];
    const marginLeft = this["margin-left"];
    const marginRight = this["margin-right"];
    const marginColor = this["margin-color"];
    const trackHeight = height - marginTop - marginBottom;

    if (trackHeight <= 0) return;

    const start = Math.round(this["display-start"] ?? 1);
    const end = Math.round(this["display-end"] ?? this.length ?? start);

    if (end < start) return;

    svgEl.setAttribute("width", String(width));
    svgEl.setAttribute("height", String(height));

    const colWidth = this.getSingleBaseWidth();
    const parts: string[] = [];

    for (let pos = start; pos <= end; pos++) {
      const colData = this.computeColumnData(pos);
      const xLeft = this.getXFromSeqPosition(pos);
      const centerX = xLeft + colWidth / 2;
      let stackY = marginTop + trackHeight;

      for (const item of colData) {
        const letterHeight = item.heightFraction * trackHeight;
        if (letterHeight < MIN_LETTER_HEIGHT) continue;

        stackY -= letterHeight;
        const scaleX = colWidth / CHAR_BASE_WIDTH;
        // Scale so the visible cap height fills letterHeight rather than the full em-box.
        const scaleY = letterHeight / (FONT_SIZE * CAP_RATIO);
        const color = NUCLEOTIDE_COLORS[item.nucleotide] || "#999";
        // Anchor at the alphabetic baseline = bottom of the allocated slot.
        const baselineY = stackY + letterHeight;

        parts.push(
          `<text ` +
            `transform="translate(${centerX.toFixed(2)},${baselineY.toFixed(2)}) scale(${scaleX.toFixed(3)},${scaleY.toFixed(3)})" ` +
            `text-anchor="middle" ` +
            `font-family="Arial,Helvetica,sans-serif" font-size="${FONT_SIZE}" font-weight="bold" ` +
            `fill="${color}">${item.nucleotide}</text>`
        );
      }
    }

    // Draw margin overlays to mask letters that extend into margin areas
    parts.push(
      `<rect x="0" y="0" width="${marginLeft}" height="${height}" fill="${marginColor}" pointer-events="none"/>`,
      `<rect x="${width - marginRight}" y="0" width="${marginRight}" height="${height}" fill="${marginColor}" pointer-events="none"/>`,
      `<rect x="${marginLeft}" y="0" width="${width - marginLeft - marginRight}" height="${marginTop}" fill="${marginColor}" pointer-events="none"/>`,
      `<rect x="${marginLeft}" y="${height - marginBottom}" width="${width - marginLeft - marginRight}" height="${marginBottom}" fill="${marginColor}" pointer-events="none"/>`
    );

    svgEl.innerHTML = parts.join("");
  }

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.createTrack();
    if (this._sequences.length > 0) this.refresh();
  }

  override render() {
    return html`<svg style="display:block;"></svg>`;
  }
}
