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
} from "@nightingale-elements/nightingale-new-core";

// import _includes from "lodash-es/includes";
// import _groupBy from "lodash-es/groupBy";
// import _union from "lodash-es/union";
// import _intersection from "lodash-es/intersection";

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import FeatureShape, { Shapes } from "./FeatureShape";
import NonOverlappingLayout from "./NonOverlappingLayout";
import DefaultLayout from "./DefaultLayout";
import { getShapeByType, getColorByType } from "./ConfigHelper";

export type Feature = {
  accession: string;
  color?: string;
  fill?: string;
  shape?: Shapes;
  tooltipContent?: string;
  type?: string;
  locations?: Array<{
    fragments: Array<{
      start: number;
      end: number;
    }>;
  }>;
  feature?: Feature;
  start?: number;
  end?: number;
  opacity?: number;
};

@customElement("nightingale-track")
class NightingaleTrack extends withManager(
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

  #featureShape = new FeatureShape();
  #layoutObj?: DefaultLayout | NonOverlappingLayout;
  #originalData: Feature[] = [];
  #data: Feature[] = [];
  filters = null;

  #seq_g?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #highlighted?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #margins?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;

  getLayout() {
    if (String(this.layout).toLowerCase() === "non-overlapping")
      return new NonOverlappingLayout({
        layoutHeight: this.height,
      });
    return new DefaultLayout({
      layoutHeight: this.height,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.#layoutObj = this.getLayout();

    if (this.#data) this.createTrack();

    // this.addEventListener("load", (e) => {
    //   if (_includes(this.children, e.target)) {
    //     this.data = e.detail.payload;
    //   }
    // });
  }

  static normalizeLocations(data: Feature[]) {
    return data.map((obj) => {
      const { locations, start, end } = obj;
      return locations
        ? obj
        : Object.assign(obj, {
            locations: [
              {
                fragments: [
                  {
                    start,
                    end,
                  },
                ],
              },
            ],
          });
    });
  }

  processData(data: Feature[]) {
    this.#originalData = NightingaleTrack.normalizeLocations(data);
  }

  set data(data: Feature[]) {
    this.processData(data);
    this.applyFilters();
    this.#layoutObj = this.getLayout();
    this.createTrack();
  }
  get data() {
    return this.#data;
  }
  // TODO: re-enable filters
  // set filters(filters) {
  //   this._filters = filters;
  //   this.applyFilters();
  //   this.createTrack();
  // }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "layout") {
      this.applyFilters();
      this.#layoutObj = this.getLayout();
      this.createTrack();
    }
  }

  private getFeatureColor(f: Feature | { feature: Feature }): string {
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
    if ((f as { feature: Feature })?.feature.type) {
      return getColorByType((f as { feature: Feature }).feature.type as string);
    }
    return defaultColor;
  }

  private getFeatureFillColor(f: Feature | { feature: Feature }) {
    const defaultColor = "gray";
    if ((f as Feature).fill) {
      return (f as Feature).fill || defaultColor;
    }
    if ((f as { feature: Feature })?.feature?.fill) {
      return (f as { feature: Feature }).feature.fill || defaultColor;
    }
    return this.getFeatureColor(f);
  }

  private getShape(f: Feature | { feature: Feature }): Shapes {
    const defaultShape = "rectangle";
    if ((f as Feature).shape) {
      return (f as Feature).shape || defaultShape;
    }
    if ((f as { feature: Feature })?.feature.shape) {
      return (f as { feature: Feature }).feature.shape || defaultShape;
    }
    if (this.shape) {
      return this.shape as Shapes;
    }
    if ((f as Feature).type) {
      return getShapeByType((f as Feature).type as string) as Shapes;
    }
    if ((f as { feature: Feature }).feature.type) {
      return getShapeByType(
        (f as { feature: Feature }).feature.type as string
      ) as Shapes;
    }
    return defaultShape;
  }

  private createTrack() {
    if (!this.#data) {
      return;
    }
    this.#layoutObj?.init(this.#data);

    this.svg?.selectAll("g").remove();

    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    if (!this.svg) return;
    this.#seq_g = this.svg.append("g").attr("class", "sequence-features");
    this.#highlighted = this.svg.append("g").attr("class", "highlighted");
    this.#margins = this.svg.append("g").attr("class", "margin");

    this.createFeatures();
  }

  private createFeatures() {
    if (!this.#seq_g) return;
    const featuresG = this.#seq_g.selectAll("g.feature-group").data(this.#data);

    const locationsG = featuresG
      .enter()
      .append("g")
      .attr("class", "feature-group")
      .attr("id", (d) => `g_${d.accession}`)
      .selectAll("g.location-group")
      .data((d) =>
        (d.locations || []).map((loc) =>
          Object.assign({}, loc, {
            feature: d,
          })
        )
      )
      .enter()
      .append("g")
      .attr("class", "location-group");

    const fragmentGroup = locationsG
      .selectAll("g.fragment-group")
      .data((d) =>
        d.fragments.map((loc) =>
          Object.assign({}, loc, {
            feature: d.feature,
          })
        )
      )
      .enter()
      .append("g")
      .attr("class", "fragment-group");

    fragmentGroup
      .append("path")
      .attr("class", (f) => `${this.getShape(f)} feature`)
      .attr("d", (f) =>
        this.#featureShape.getFeatureShape(
          this.getSingleBaseWidth(),
          this.#layoutObj?.getFeatureHeight() || 0,
          f.end ? f.end - f.start + 1 : 1,
          this.getShape(f)
        )
      )
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(f.start)},${
            this.#layoutObj?.getFeatureYPos(f.feature) || 0
          })`
      )
      .attr("fill", (f) => this.getFeatureFillColor(f))
      .attr("stroke", (f) => this.getFeatureColor(f))
      .style("fill-opacity", ({ feature }) =>
        feature.opacity ? feature.opacity : 0.9
      )
      .style("stroke-opacity", ({ feature }) =>
        feature.opacity ? feature.opacity : 0.9
      );

    fragmentGroup
      .append("rect")
      .attr("class", "outer-rectangle feature")
      .attr(
        "width",
        (f) => this.getSingleBaseWidth() * (f.end ? f.end - f.start + 1 : 1)
      )
      .attr("height", this.#layoutObj?.getFeatureHeight() || 0)
      .attr(
        "transform",
        (f) =>
          `translate(${this.getXFromSeqPosition(f.start)},${
            this.#layoutObj?.getFeatureYPos(f.feature) || 0
          })`
      )
      .attr("fill", "transparent")
      .attr("stroke", "transparent")
      .call(bindEvents, this);
  }

  private applyFilters() {
    if ((this.filters || []).length <= 0) {
      this.#data = this.#originalData;
      return;
    }
    // TODO: re-enable filters
    //   // Filters are OR-ed within a category and AND-ed between categories
    //   const groupedFilters = _groupBy(this._filters, "category");
    //   const filteredGroups = Object.values(groupedFilters).map((filterGroup) => {
    //     const filteredData = filterGroup.map((filterItem) =>
    //       filterItem.filterFn(this.#originalData)
    //     );
    //     return _union(...filteredData);
    //   });
    //   const intersection = _intersection(...filteredGroups);
    //   this._data = intersection;
  }

  refresh() {
    if (this.xScale && this.#seq_g) {
      const fragmentG = this.#seq_g.selectAll("g.fragment-group").data(
        this.#data.reduce(
          (acc: unknown[], f) =>
            acc.concat(
              (f.locations || []).reduce(
                (acc2: unknown[], e) =>
                  acc2.concat(
                    e.fragments.map((loc) =>
                      Object.assign({}, loc, {
                        feature: f,
                      })
                    )
                  ),
                []
              )
            ),
          []
        )
      );

      fragmentG
        .selectAll<SVGPathElement, Feature>("path.feature")
        .attr("d", (f) =>
          this.#featureShape.getFeatureShape(
            this.getSingleBaseWidth(),
            this.#layoutObj?.getFeatureHeight() || 0,
            f?.end && f?.start ? f.end - f.start + 1 : 1,
            this.getShape(f)
          )
        )
        .attr(
          "transform",
          (f) =>
            `translate(${this.getXFromSeqPosition(
              f.start || 0
            )},${this.#layoutObj?.getFeatureYPos(f.feature as Feature)})`
        );

      fragmentG
        .selectAll<SVGRectElement, Feature>("rect.outer-rectangle")
        .attr(
          "width",
          (f) =>
            this.getSingleBaseWidth() *
            (f?.end && f?.start ? f.end - f.start + 1 : 1)
        )
        .attr("height", this.#layoutObj?.getFeatureHeight() || 0)
        .attr(
          "transform",
          (f) =>
            `translate(${this.getXFromSeqPosition(f.start || 0)},${
              this.#layoutObj?.getFeatureYPos(f.feature as Feature) || 0
            })`
        );

      // this._updateHighlight();
    }
    this.renderHighlight();
    this.renderMarginOnGroup(this.#margins);
  }

  // _updateHighlight() {
  //   this.trackHighlighter.updateHighlight();
  // }

  private renderHighlight() {
    if (!this.#highlighted) return;
    const highlighs = this.#highlighted
      .selectAll<
        SVGRectElement,
        {
          start: number;
          end: number;
        }[]
      >("rect")
      .data(this.highlightedRegion.segments);

    highlighs
      .enter()
      .append("rect")
      .style("pointer-events", "none")
      .merge(highlighs)
      .attr("fill", this["highlight-color"])
      .attr("height", this.height)
      .attr("x", (d) => this.getXFromSeqPosition(d.start))
      .attr("width", (d) => this.getSingleBaseWidth() * (d.end - d.start + 1));

    highlighs.exit().remove();
  }

  zoomRefreshed() {
    this.refresh();
  }

  firstUpdated() {
    this.createTrack();
  }

  render() {
    return html`<svg class="container"></svg>`;
  }
}

export default NightingaleTrack;

export { DefaultLayout };
export { getColorByType };
