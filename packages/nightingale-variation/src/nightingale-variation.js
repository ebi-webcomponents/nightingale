import NightingaleTrack from "@nightingale-elements/nightingale-track";
import { scaleLinear, scalePoint, axisLeft, axisRight } from "d3";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";
import _groupBy from "lodash-es/groupBy";
import processVariants from "./processVariants";
import VariationPlot from "./variationPlot";

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

const deepArrayOperation = (arrays, operation) => {
  if (!arrays || arrays.length <= 0) {
    return null;
  }
  const firstArray = arrays[0];
  // Iterate over positions
  firstArray.forEach((position, i) => {
    const filteredVariants = arrays.map((array) => array[i].variants);
    /* eslint-disable no-param-reassign */
    position.variants = operation(...filteredVariants);
  });
  return firstArray;
};

class NightingaleVariation extends NightingaleTrack {
  static is = "nightingale-variation";

  connectedCallback() {
    super.connectedCallback();
    const styleElt = document.createElement("style");
    styleElt.innerHTML = NightingaleVariation.css;
    this.appendChild(styleElt);
    this._height = Number(this.getAttribute("height"))
      ? Number(this.getAttribute("height"))
      : 430;
    this._width = this._width ? this._width : 0;
    this._yScale = scaleLinear();
    // scale for Amino Acids
    this._yScale = scalePoint()
      .domain(aaList)
      .range([0, this._height - this.margin.top - this.margin.bottom]);
  }

  processData(data) {
    this._originalData = processVariants(data);
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
      opacity: 0.9;
    }
    nightingale-variation .tick line,
    nightingale-variation .axis path {
      opacity: 0.1;
    }
    
    .nightingale-highlight {
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

  _createFeatures() {
    this._variationPlot = new VariationPlot();
    // Group for the main chart
    const mainChart = super.svg.select("g.sequence-features");

    // clip path prevents drawing outside of it
    const chartArea = mainChart
      .attr("transform", `translate(0, ${this.margin.top})`)
      .append("g")
      .attr("clip-path", "url(#plotAreaClip)");

    this._clipPath = mainChart
      .append("clipPath")
      .attr("id", "plotAreaClip")
      .append("rect")
      .attr("width", this.getWidthWithMargins())
      .attr("height", this._height)
      .attr("transform", `translate(0, -${this.margin.top})`);

    // This is calling the data series render code for each of the items in the data
    this._series = chartArea.datum(this._data);

    this._axisLeft = mainChart.append("g");

    this._axisRight = mainChart.append("g");

    this.updateScale();
  }

  // Overwrite filters setters as we use updateData instead of refresh
  set filters(filters) {
    super.filters = filters;
    this.updateData(this._data);
    this.refresh();
  }

  /*
   * We have to overwrite this function as variants are in arrays
   * of arrays so the regular union/intersection won't work
   */
  _applyFilters() {
    if (!this._filters || this._filters.length <= 0) {
      this._data = this._originalData;
      return;
    }
    const groupedFilters = _groupBy(this._filters, "category");
    const filteredGroups = Object.values(groupedFilters).map((filterGroup) => {
      const filteredData = filterGroup.map((filterItem) =>
        filterItem.filterFn(this._originalData)
      );
      return deepArrayOperation(filteredData, _union);
    });

    this._data = deepArrayOperation(filteredGroups, _intersection);
  }

  set colorConfig(colorConfig) {
    this._colorConfig = colorConfig;
  }

  get colorConfig() {
    return this._colorConfig;
  }

  // Calling render again
  refresh() {
    if (this._series) {
      this._clipPath.attr("width", this.getWidthWithMargins());
      this.updateScale();
      this._series.call(this._variationPlot.drawVariationPlot, this);
      this._updateHighlight();
    }
  }

  updateScale() {
    this._yAxisLScale = axisLeft()
      .scale(this._yScale)
      .tickSize(-this.getWidthWithMargins());

    this._yAxisRScale = axisRight().scale(this._yScale);

    this._axisLeft
      .attr("class", "variation-y-left axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(this._yAxisLScale);

    this._axisRight
      .attr(
        "transform",
        `translate(${this.getWidthWithMargins() - this.margin.right + 2}, 0)`
      )
      .attr("class", "variation-y-right axis")
      .call(this._yAxisRScale);
  }

  updateData(data) {
    if (this._series) {
      this._series.datum(data);
    }
  }
}

export default NightingaleVariation;
