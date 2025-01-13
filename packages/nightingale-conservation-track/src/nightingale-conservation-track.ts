import { select, Selection } from "d3";
import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withHighlight,
  withManager,
  withZoom,
  bindEvents,
  customElementOnce,
} from "@nightingale-elements/nightingale-new-core";

// import _includes from "lodash-es/includes";
// import _groupBy from "lodash-es/groupBy";
// import _union from "lodash-es/union";
// import _intersection from "lodash-es/intersection";

import { html } from "lit";
import { property } from "lit/decorators.js";

import FeatureShape, { Shapes } from "./FeatureShape";
import NonOverlappingLayout from "./NonOverlappingLayout";
import DefaultLayout from "./DefaultLayout";
import { getShapeByType, getColorByType } from "./ConfigHelper";

export type FeatureLocation = {
  fragments: Array<{
    start: number;
    end: number;
  }>;
};

type PTM = {
  name: string;
  position: number;
  sources: string[];
  dbReferences: DBReference[];
};

type DBReference = {
  id: string;
  properties: Properties;
};

type Properties = {
  "Pubmed ID": string;
  "PSM Score": string;
  "Dataset ID": string;
  "Site q value": string;
  "Universal Spectrum Id": string;
  "PSM Count (0.05 gFLR)": string;
  "Confidence score": "Gold" | "Silver" | "Bronze";
  "Final site probability": string;
  "Organism part": string;
  Proforma: string;
};

export type Feature = {
  accession: string;
  color?: string;
  fill?: string;
  shape?: Shapes;
  tooltipContent?: string;
  type?: string;
  locations?: Array<FeatureLocation>;
  feature?: Feature;
  start?: number;
  end?: number;
  opacity?: number;
  ptms?: Array<PTM>;
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
class NightingaleConservationTrack extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement)))
      )
    )
  )
) {
  @property({ type: String })
  color?: string | null;
  @property({ type: String })
  shape?: string | null;
  @property({ type: String })
  layout?: "non-overlapping" | "default";

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

  static normalizeLocations(data: Feature[]) {
    return data.map(feature => {
      if (feature.locations) {
        // Add missing `start`/`end` based on `locations`
        feature.start ??= getStartFromLocations(feature.locations);
        feature.end ??= getEndFromLocations(feature.locations);
      } else {
        // Add missing `locations` based on `start`/`end`
        feature.start ??= 1;
        feature.end ??= feature.start;
        feature.locations = [{ fragments: [{ start: feature.start, end: feature.end }] }];
      }
      return feature;
    });
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

  protected getFeatureColor(f: Feature | { feature: Feature }): string {
    const defaultColor = "gray";
    if ((f as Feature).color) {
      return (f as Feature).color || defaultColor;
    }
    if ((f as { feature: Feature })?.feature?.color) {
      return (f as { feature: Feature })?.feature?.color || defaultColor;
    }
    if (this.color) {
      return this.color;
    }
    if ((f as Feature).type) {
      return getColorByType((f as Feature).type as string);
    }
    if ((f as { feature: Feature })?.feature?.type) {
      return getColorByType((f as { feature: Feature }).feature.type as string);
    }
    return defaultColor;
  }

  protected getFeatureFillColor(f: Feature | { feature: Feature }) {
    const defaultColor = "gray";
    if ((f as Feature).fill) {
      return (f as Feature).fill || defaultColor;
    }
    if ((f as { feature: Feature })?.feature?.fill) {
      return (f as { feature: Feature }).feature.fill || defaultColor;
    }
    return this.getFeatureColor(f);
  }

  protected getShape(f: Feature | { feature: Feature }): Shapes {
    const defaultShape = "rectangle";
    if ((f as Feature).shape) {
      return (f as Feature).shape || defaultShape;
    }
    if ((f as { feature: Feature })?.feature?.shape) {
      return (f as { feature: Feature }).feature.shape || defaultShape;
    }
    if (this.shape) {
      return this.shape as Shapes;
    }
    if ((f as Feature).type) {
      return getShapeByType((f as Feature).type as string) as Shapes;
    }
    if ((f as { feature: Feature }).feature?.type) {
      return getShapeByType(
        (f as { feature: Feature }).feature.type as string
      ) as Shapes;
    }
    return defaultShape;
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

  firstUpdated() {
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

export { DefaultLayout };
export { getColorByType };


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
