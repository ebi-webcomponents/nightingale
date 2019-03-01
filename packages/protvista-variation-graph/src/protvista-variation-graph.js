import ProtvistaTrack from "protvista-track";
import {
  scaleLinear,
  scalePoint,
  axisLeft,
  axisRight,
  select,
  event as d3Event,
  line,
  extent,
  max,
  curveBasis
} from "d3";

class ProtvistaVariationGraph extends ProtvistaTrack {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this._data = undefined;

    this._height = parseInt(this.getAttribute("height")) || 40;
    this._yScale = scaleLinear();
    this._xExtent;
    this._yExtent;

    this._totals_line = line()
      .x(d => this.xScale(d.x))
      .y(d => this._yScale(d.y))
      .curve(curveBasis);

    this._totals_dataset = {};
    this._totals_feature = undefined;

    this._disease_line = line()
      .x(d => this.xScale(d.x))
      .y(d => this._yScale(d.y))
      .curve(curveBasis);

    this._disease_dataset = {};
    this._disease_feature = undefined;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal);

    if (!super.svg) {
      return;
    }
  }

  set data(data) {
    this._data = data;

    if (this._data.variants.length <= 0) {
      return;
    }

    this._data.variants.forEach(v => {
      if ("undefined" === typeof this._totals_dataset[v.start]) {
        this._totals_dataset[v.start] = 0;
      }

      if ("undefined" === typeof this._disease_dataset[v.start]) {
        this._disease_dataset[v.start] = 0;
      }

      this._totals_dataset[v.start]++;
      if ("undefined" !== typeof v.association) {
        v.association.forEach(a => {
          if (true === a.disease) {
            this._disease_dataset[v.start]++;
          }
        });
      }
    });

    this._totals_dataset = this._emptyFillMissingRecords(this._totals_dataset);
    this._disease_dataset = this._emptyFillMissingRecords(
      this._disease_dataset
    );

    this._createTrack();
  }

  _emptyFillMissingRecords(dataset) {
    const sortedTotalsKeys = Object.keys(dataset).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    const totalsMin = sortedTotalsKeys[0];
    const totalsMax = sortedTotalsKeys[sortedTotalsKeys.length - 1];

    for (let i = totalsMin; i < totalsMax; i++) {
      if ("undefined" === typeof dataset[i]) {
        dataset[i] = 0;
      }
    }

    return Object.keys(dataset)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(k => ({
        x: k,
        y: dataset[k]
      }));
  }

  _createTrack() {
    super.svg = select(this)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this._height);

    // Create the visualisation here
    this._createFeatures();
    this.refresh();
  }

  _createFeatures() {
    this._xExtent = extent(this._totals_dataset, d => parseInt(d.x));
    this._yExtent = extent(this._totals_dataset, d => d.y);

    // just a bit of padding on the top
    this._yExtent[1] += 2;

    this.xScale.domain(this._xExtent).range([0, this._width]);
    this._yScale.domain(this._yExtent).range([this._height, 0]);
  }

  refresh() {
    super.svg.selectAll("path").remove();

    this._disease_feature = super.svg
      .append("path")
      .data([this._disease_dataset])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "1.5px")
      .attr("stroke-dasharray", "0")
      .attr("d", this._disease_line)
      .attr("transform", "translate(0,0)");

    this._totals_feature = super.svg
      .append("path")
      .data([this._totals_dataset])
      .attr("fill", "none")
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", ".5")
      .attr("d", this._totals_line)
      .attr("transform", "translate(0,0)");
  }
}

export default ProtvistaVariationGraph;
