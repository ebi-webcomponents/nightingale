import ProtvistaTrack from "protvista-track";
import {
  scaleLinear,
  scalePoint,
  axisLeft,
  axisRight,
  select,
  event as d3Event
} from "d3";
import processVariants from "./processVariants";
import VariationPlot from "./variationPlot";
import "../style/protvista-variation.css";

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
  "*"
];

class ProtvistaVariation extends ProtvistaTrack {
  connectedCallback() {
    super.connectedCallback();
    this._accession = this.getAttribute("accession");
    this._height = parseInt(this.getAttribute("height"))
      ? parseInt(this.getAttribute("height"))
      : 430;
    this._width = this._width ? this._width : 0;
    this._yScale = scaleLinear();
    // scale for Amino Acids
    this._yScale = scalePoint()
      .domain(aaList)
      .range([0, this._height - this.margin.top - this.margin.bottom]);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (!super.svg) {
      return;
    }
  }

  set data(data) {
    this._data = processVariants(data);
    this._createTrack();
  }

  _createFeatures() {
    this._variationPlot = new VariationPlot();
    // Group for the main chart
    const mainChart = super.svg.select("g");

    // clip path prevents drawing outside of it
    const chartArea = mainChart
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

  // Calling render again
  refresh() {
    if (this._series) {
      // this._variationPlot.xScale = super.xScale;
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

  // Calling render again with new data (after filter was used)
  updateData(data) {
    if (this._series) {
      this._series.datum(data);
      this.refresh();
    }
  }

  reset() {
    // reset zoom, filter and any selections
  }
}

export default ProtvistaVariation;
