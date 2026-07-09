import NightingaleElement, {
  customElementOnce,
  withSVGHighlight,
  withManager,
} from "@nightingale-elements/nightingale-new-core";
import { select, Selection } from "d3";
import { html, PropertyValues } from "lit";

const NUCLEOTIDE_COLORS: Record<string, string> = {
  A: "#00CC00",
  C: "#0000CC",
  G: "#FFB300",
  U: "#CC0000",
};

// WebLogo chemistry color scheme grouped by biochemical property
const AMINO_ACID_COLORS: Record<string, string> = {
  // Hydrophobic (nonpolar)
  A: "#FF8C00", G: "#FF8C00", V: "#FF8C00", L: "#FF8C00",
  I: "#FF8C00", P: "#FF8C00", F: "#FF8C00", M: "#FF8C00", W: "#FF8C00",
  // Polar uncharged
  S: "#00CC00", T: "#00CC00", C: "#00CC00", Y: "#00CC00",
  N: "#00CC00", Q: "#00CC00",
  // Positively charged
  K: "#0000CC", R: "#0000CC", H: "#0000CC",
  // Negatively charged
  D: "#CC0000", E: "#CC0000",
};

const TRACKED_NUCLEOTIDES = ["A", "C", "G", "U"];
const TRACKED_AMINO_ACIDS = ["A", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "Y"];
/** Characters that appear in protein sequences but not in RNA/DNA */
const AMINO_ACID_ONLY_CHARS = new Set(["D", "E", "F", "H", "I", "K", "L", "M", "N", "P", "Q", "R", "S", "V", "W", "Y"]);

/** Maximum information content for a 4-letter alphabet (log2(4) = 2 bits) */
const LOG2_4 = 2;
/** Maximum information content for a 20-letter alphabet (log2(20) ≈ 4.32 bits) */
const LOG2_20 = Math.log2(20);
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

type RenderedLetter = {
  key: string;
  centerX: number;
  baselineY: number;
  scaleX: number;
  scaleY: number;
  color: string;
  residue: string;
};

type SeqType = "rna" | "protein";

export interface MsaSequence {
  name: string;
  sequence: string;
}

@customElementOnce("nightingale-logo-track")
export default class NightingaleLogoTrack extends withManager(
  withSVGHighlight(NightingaleElement)
) {
  private _sequences: MsaSequence[] = [];
  private _seqType: SeqType = "rna";

  private _lettersGroup?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  private _margins?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;

  get sequences(): MsaSequence[] {
    return this._sequences;
  }
  set sequences(value: MsaSequence[]) {
    this._sequences = value;
    this._seqType = this.detectSeqType(value);
    this.refresh();
  }

  private detectSeqType(sequences: MsaSequence[]): SeqType {
    let nonNucCount = 0;
    let totalCount = 0;
    for (const seq of sequences) {
      for (const char of seq.sequence.toUpperCase()) {
        if (char === "-" || char === "." || char === " ") continue;
        totalCount++;
        if (AMINO_ACID_ONLY_CHARS.has(char)) nonNucCount++;
      }
    }
    return totalCount > 0 && nonNucCount / totalCount > 0.05 ? "protein" : "rna";
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

    this.createHighlightGroup();
    this._lettersGroup = this.svg.append("g").attr("class", "logo-letters");
    this._margins = this.svg.append("g").attr("class", "margin");
  }

  refresh() {
    this.renderLogo();
    this.updateHighlight();
    this.renderMarginOnGroup(this._margins);
  }

  /** Compute per-residue stacked heights for one alignment column. */
  private computeColumnData(pos: number): LetterData[] {
    const isProtein = this._seqType === "protein";
    const alphabet = isProtein ? TRACKED_AMINO_ACIDS : TRACKED_NUCLEOTIDES;
    const maxBits = isProtein ? LOG2_20 : LOG2_4;
    const colIndex = pos - 1;
    const counts: Record<string, number> = {};
    for (const a of alphabet) counts[a] = 0;
    let total = 0;

    for (const seq of this._sequences) {
      if (colIndex < seq.sequence.length) {
        let char = seq.sequence[colIndex].toUpperCase();
        if (!isProtein && char === "T") char = "U";
        if (char in counts) {
          counts[char]++;
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
    for (const res of alphabet) {
      const f = counts[res] / total;
      if (f > 0) H -= f * Math.log2(f);
    }
    const IC = Math.max(0, maxBits - H) * coverage;

    const letters: LetterData[] = [];
    for (const res of alphabet) {
      const f = counts[res] / total;
      if (f > 0) {
        letters.push({ nucleotide: res, heightFraction: (f * IC) / maxBits });
      }
    }

    // Ascending sort: smallest letters at the bottom, largest (most-conserved) at the top.
    letters.sort((a, b) => a.heightFraction - b.heightFraction);
    return letters;
  }

  private renderLogo(): void {
    if (!this._lettersGroup) return;

    const width = this.width;
    const height = this.height;
    if (!width || !height) return;

    const marginTop = this["margin-top"];
    const trackHeight = height - marginTop - this["margin-bottom"];
    if (trackHeight <= 0) return;

    const rawEnd = this["display-end"];
    const start = Math.round(this["display-start"] ?? 1);
    const end = Math.round(rawEnd && rawEnd !== -1 ? rawEnd : (this.length ?? start));
    if (end < start) return;

    const colorMap = this._seqType === "protein" ? AMINO_ACID_COLORS : NUCLEOTIDE_COLORS;
    const colWidth = this.getSingleBaseWidth();

    // Pre-compute all letter positions so we can hand them to the d3 join in one pass.
    const allLetters: RenderedLetter[] = [];
    for (let pos = start; pos <= end; pos++) {
      const colData = this.computeColumnData(pos);
      const centerX = this.getXFromSeqPosition(pos) + colWidth / 2;
      let stackY = marginTop + trackHeight;

      for (const item of colData) {
        const letterHeight = item.heightFraction * trackHeight;
        if (letterHeight < MIN_LETTER_HEIGHT) continue;
        stackY -= letterHeight;
        allLetters.push({
          key: `${pos}-${item.nucleotide}`,
          centerX,
          // Anchor at the alphabetic baseline = bottom of the allocated slot.
          // The cap then extends exactly up to stackY with no gap.
          baselineY: stackY + letterHeight,
          scaleX: colWidth / CHAR_BASE_WIDTH,
          // Scale so the visible cap height fills letterHeight rather than the full em-box.
          scaleY: letterHeight / (FONT_SIZE * CAP_RATIO),
          color: colorMap[item.nucleotide] || "#999",
          residue: item.nucleotide,
        });
      }
    }

    this._lettersGroup
      .selectAll<SVGTextElement, RenderedLetter>("text")
      .data(allLetters, (d) => d.key)
      .join("text")
      .attr(
        "transform",
        (d) =>
          `translate(${d.centerX.toFixed(2)},${d.baselineY.toFixed(2)}) scale(${d.scaleX.toFixed(3)},${d.scaleY.toFixed(3)})`,
      )
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial,Helvetica,sans-serif")
      .attr("font-size", FONT_SIZE)
      .attr("font-weight", "bold")
      .attr("fill", (d) => d.color)
      .text((d) => d.residue);
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
