import ProtvistaTrack from "protvista-track";
import * as d3 from "d3";
import { scaleLinear, select, line, max, min, interpolateRainbow } from "d3";

class NightingaleLinegraphTrack extends ProtvistaTrack {
  connectedCallback() {
    super.connectedCallback();

    this._height = Number(this.getAttribute("height")) || 40;
    this._xScale = scaleLinear();
    this._yScale = scaleLinear();

    if (this._data) this._createTrack();
  }

  set data(data) {
    this._data = data;
    this._createTrack();
  }

  _createTrack() {
    select(this).selectAll("svg").remove();
    this.svg = select(this)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this._height);
    this.trackHighlighter.appendHighlightTo(this.svg);

    const range = [];
    this._data.map((d) => range.push(...d.range));
    this.minRange = min(range);
    this.maxRange = max(range);

    // Create the visualisation here
    this.refresh();
  }

  refresh() {
    if (!this.svg) return;
    this.svg.selectAll("g.chart-group").remove();
    const chartGroup = this.svg.append("g").attr("class", "chart-group");
    this._initScales();

    chartGroup
      .selectAll(".chart")
      .data(this._data)
      .enter()
      .append("path")
      .attr("class", "chart")
      .attr("id", (d) => d.name)
      .attr("d", (d) => {
        this.drawLine(d);
        return this.line(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => d.colour || interpolateRainbow(Math.random()))
      .attr("transform", "translate(0,0)")
      .call(this.bindEvents, this);
    this._updateHighlight();
  }

  _initScales() {
    this._xScale.domain([0, this.width]).range([0, this.width]);
    this._yScale
      .domain([this.minRange, this.maxRange])
      .range([this._height, 0]);
  }

  drawLine(d) {
    this._curve = d.lineCurve || "curveLinear";

    this.line = line()
      .x((d) => this._xScale(d.position))
      .y((d) => this._yScale(d.value))
      .curve(d3[this._curve]);
  }
}

export default NightingaleLinegraphTrack;
