import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import NightingaleElement, {
  withSVGHighlight,
  withManager,
} from "@nightingale-elements/nightingale-new-core";

import {
  select,
  scalePoint,
  axisLeft,
  axisRight,
  ScalePoint,
  Selection,
} from "d3";
// import _union from "lodash-es/union";
// import _intersection from "lodash-es/intersection";
// import _groupBy from "lodash-es/groupBy";
import processVariants from "./processVariants";
import VariationPlot from "./variationPlot";
import { transformData, ProteinsAPIVariation } from "./proteinAPI";

export type VariationDatum = {
  accession: string;
  variant: string;
  start: number;
  size?: number;
  xrefNames: string[];
  hasPredictions: boolean;
  tooltipContent?: string;
  alternativeSequence?: string;
  internalId?: string;
  wildType?: string;
  color?: string;
  consequenceType: string;
};

export type VariationData = {
  sequence: string;
  variants: VariationDatum[];
};

export type ProcessedVariationData = {
  type: string;
  normal: string;
  pos: number;
  variants: VariationDatum[];
};

const aaList = [
  "G",
  "A",
  "V",
  "L",
  "I",
  "S",
  "T",
  "C",
  "M",
  "D",
  "N",
  "E",
  "Q",
  "R",
  "K",
  "H",
  "F",
  "Y",
  "W",
  "P",
  "d",
  "*",
];

@customElement("nightingale-variation")
class NightingaleVariation extends withManager(
  withSVGHighlight(NightingaleElement),
) {
  /**
   * Indicates the data is in the format of the protein API and needs to be transformed acordingly
   */
  @property({ type: Boolean, attribute: "protein-api" })
  proteinAPI?: boolean = false;
  /**
   * Indicates if the view should only include rows with at least 1 variant
   */
  @property({ type: Boolean, attribute: "condensed-view" })
  condensedView?: boolean = false;
  /**
   * Indicates if the view should only include rows with at least 1 variant
   */
  @property({ type: Number, attribute: "row-height" })
  rowHeight?: number;

  yScale?: ScalePoint<string>;

  #data: VariationData | ProteinsAPIVariation | null | undefined;

  processedData?: {
    mutationArray: ProcessedVariationData[];
    aaPresence: Record<string, boolean>;
  } | null;

  variationPlot?: VariationPlot;
  series?: Selection<
    SVGGElement,
    ProcessedVariationData[],
    HTMLElement | SVGElement | null,
    unknown
  >;
  axisLeft?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  axisRight?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  @state({})
  colorConfig: (v: VariationDatum) => string;

  constructor() {
    super();
    this.colorConfig = (_v: VariationDatum) => "pink";
    this["margin-top"] = 10;
    this["margin-bottom"] = 10;
  }

  override connectedCallback() {
    super.connectedCallback();

    // scale for Amino Acids
    this.yScale = scalePoint()
      .domain(aaList)
      .range([0, this.height - this["margin-top"] - this["margin-bottom"]]);
  }

  processData(data?: VariationData | ProteinsAPIVariation | null) {
    this.#data = data;
    const transformedData = this.proteinAPI
      ? transformData(data as ProteinsAPIVariation)
      : (data as VariationData);
    if (transformedData) this.processedData = processVariants(transformedData);
  }

  set data(data: VariationData | ProteinsAPIVariation | null | undefined) {
    if (this.#data === data) return;
    this.processData(data);
    this.createFeatures();
  }

  get data() {
    return this.#data;
  }
  static get css() {
    return `
    <style>
    nightingale-variation {
      display: flex;
      width: 100%;
    }

    nightingale-variation svg {
      background-color: #fff;
    }

    nightingale-variation circle {
      opacity: 0.6;
    }
    nightingale-variation circle:hover {
      opacity: 1;
    }
    nightingale-variation .tick line,
    nightingale-variation .axis path {
      opacity: 0.1;
      pointer-events: none;
    }

    nightingale-highlight {
      fill: #ffe999;
    }

    nightingale-variation .variation-y-right line,
    nightingale-variation .axis path {
      fill: none;
      stroke: none;
    }

    </style>
    `;
  }

  createFeatures() {
    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this.height);

    if (!this.processedData) return;

    this.variationPlot = new VariationPlot();
    // Group for the main chart
    const mainChart = this.svg
      .select("g.sequence-features")
      .attr("transform", `translate(0, ${this["margin-top"]})`);

    // clip path prevents drawing outside of it
    let chartArea = mainChart.select<SVGGElement>("g.points");
    if (chartArea.empty()) {
      chartArea = mainChart.append("g").attr("class", "points");
      this.axisLeft = mainChart.append("g");
      this.axisRight = mainChart.append("g");
    }
    // This is calling the data series render code for each of the items in the data
    this.series = chartArea.datum(this.processedData.mutationArray);

    this.updateScale();
  }

  // TODO: Filters are not a v4 feature.
  // Overwrite filters setters as we use updateData instead of refresh
  // set filters(filters) {
  //   super.filters = filters;
  //   this.updateData(this._data);
  //   this.refresh();
  // }

  /*
   * We have to overwrite this function as variants are in arrays
   * of arrays so the regular union/intersection won't work
   */
  // _applyFilters() {
  //   if (!this._filters || this._filters.length <= 0) {
  //     this._data = this._originalData;
  //     return;
  //   }
  //   const groupedFilters = _groupBy(this._filters, "category");
  //   const filteredGroups = Object.values(groupedFilters).map((filterGroup) => {
  //     const filteredData = filterGroup.map((filterItem) =>
  //       filterItem.filterFn(this._originalData)
  //     );
  //     return deepArrayOperation(filteredData, _union);
  //   });

  //   this._data = deepArrayOperation(filteredGroups, _intersection);
  // }

  // Calling render again
  override firstUpdated() {
    this.createFeatures();
    this.createHighlightGroup();
  }

  override zoomRefreshed() {
    if (this.series) {
      this.updateScale();
      if (this.variationPlot)
        this.series.call(this.variationPlot.drawVariationPlot, this);
      this.updateHighlight();
    }
  }

  updateScale() {
    if (this.yScale) {
      const aaToDisplay = aaList.filter((aa) =>
        this.condensedView ? this.processedData?.aaPresence[aa] : true,
      );
      if (this.rowHeight) {
        this.height =
          aaToDisplay.length * this.rowHeight +
          this["margin-top"] +
          this["margin-bottom"];
      }
      this.yScale
        .range([0, this.height - this["margin-top"] - this["margin-bottom"]])
        .domain(aaToDisplay);
      this.svg?.attr("width", this.width).attr("height", this.height);

      const yAxisLScale = axisLeft(this.yScale).tickSize(
        -this.getWidthWithMargins(),
      );
      this.axisLeft
        ?.attr("class", "variation-y-left axis")
        .attr("transform", `translate(${this["margin-left"]},0)`)
        .call(yAxisLScale);
      const yAxisRScale = axisRight(this.yScale);
      this.axisRight
        ?.attr(
          "transform",
          `translate(${
            this.getWidthWithMargins() - this["margin-right"] + 2
          }, 0)`,
        )
        .attr("class", "variation-y-right axis")
        .call(yAxisRScale);
    }
  }

  updateData(data: VariationData) {
    if (this.series) {
      this.series.datum(data);
    }
  }

  override render() {
    return html`<style>
        ${NightingaleVariation.css}
      </style>
      <svg class="container">
        <g class="sequence-features" />
      </svg>`;
  }
}

export default NightingaleVariation;
