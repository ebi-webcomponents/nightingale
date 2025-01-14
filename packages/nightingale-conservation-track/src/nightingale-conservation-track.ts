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
import { select, Selection } from "d3";
import { html, PropertyValues } from "lit";
import { property } from "lit/decorators.js";


type FeatureLocation = {
  fragments: Array<{
    start: number;
    end: number;
  }>;
};


// TODO: height is not triggering a full redrawn when is changed after first render
const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];


export interface SequenceConservationData {
  // TODO revise data schema
  index: number[],
  conservation_score: number[],
  probability_A: number[],
  probability_C: number[],
  probability_D: number[],
  probability_E: number[],
  probability_F: number[],
  probability_G: number[],
  probability_H: number[],
  probability_I: number[],
  probability_K: number[],
  probability_L: number[],
  probability_M: number[],
  probability_N: number[],
  probability_P: number[],
  probability_Q: number[],
  probability_R: number[],
  probability_S: number[],
  probability_T: number[],
  probability_V: number[],
  probability_W: number[],
  probability_Y: number[],
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
  protected margins?: Selection<
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
    this.margins = this.svg.append("g").attr("class", "margin");
  }

  refresh() {
    if (this.xScale && this.seqG) {
    }
    this.updateHighlight();

    this.renderMarginOnGroup(this.margins);
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


/** Return leftmost start of fragment */
function getStartFromLocations(locations: FeatureLocation[]): number | undefined {
  let start: number | undefined = undefined;
  for (const location of locations) {
    for (const fragment of location.fragments) {
      if (start === undefined || fragment.start < start) {
        start = fragment.start;
      }
    }
  }
  return start;
}
/** Return rightmost end of fragment */
function getEndFromLocations(locations: FeatureLocation[]): number | undefined {
  let end: number | undefined = undefined;
  for (const location of locations) {
    for (const fragment of location.fragments) {
      if (end === undefined || fragment.end > end) {
        end = fragment.end;
      }
    }
  }
  return end;
}
