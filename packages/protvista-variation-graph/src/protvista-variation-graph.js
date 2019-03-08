import ProtvistaTrack from "protvista-track";
import {
  scaleLinear,
  select,
  event as d3Event,
  line,
  extent,
  curveBasis
} from "d3";

class ProtvistaVariationGraph extends ProtvistaTrack {
  constructor() {
    super();
  }

  init() {
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

  connectedCallback() {
    super.connectedCallback();

    this._data = undefined;

    this._height = parseInt(this.getAttribute("height")) || 40;
    this._yScale = scaleLinear();
    this._xExtent;
    this._yExtent;
    this.init();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (!super.svg) {
      return;
    }
  }

  set data(data) {
    this._data = data;
    this.init();
    if (this._data.variants.length <= 0) {
      return;
    }

    let totalMap = {};
    let diseaseMap = {};

    this._data.variants.forEach(v => {
      if ("undefined" === typeof totalMap[v.start]) {
        totalMap[v.start] = 0;
      }
      if ("undefined" === typeof diseaseMap[v.start]) {
        diseaseMap[v.start] = 0;
      }
      totalMap[v.start]++;
      if ("undefined" !== typeof v.association) {
        v.association.forEach(a => {
          if (true === a.disease) {
            diseaseMap[v.start]++;
          }
        });
      }
    });
    this._totals_dataset = Object.keys(totalMap).map(d => {
      return { x: d, y: totalMap[d] };
    });
    this._disease_dataset = Object.keys(diseaseMap).map(d => {
      return { x: d, y: diseaseMap[d] };
    });
    this._createTrack();
  }

  _createTrack() {
    select(this)
      .selectAll("svg")
      .remove();
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
      .attr("d", this._disease_line(this._disease_dataset))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "1.5px")
      .attr("stroke-dasharray", "0")
      .attr("transform", "translate(0,0)");
    this._totals_feature = super.svg
      .append("path")
      .attr("d", this._totals_line(this._totals_dataset))
      .attr("fill", "none")
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", ".5")
      .attr("transform", "translate(0,0)");
  }
}

export default ProtvistaVariationGraph;
