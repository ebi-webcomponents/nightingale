import ProtvistaTrack from "protvista-track";
import {
  scaleLinear,
  select,
  line,
  max,
  min,
  curveCatmullRom,
  interpolateRainbow,
} from "d3";

class NightingaleLinegraphTrack extends ProtvistaTrack {
  constructor() {
    super();
    // Linear curve by default
    this.line = line()
      .x((d) => this._xScale(d.position))
      .y((d) => this._yScale(d.value));

    this.curve = line()
      .x((d) => this._xScale(d.position))
      .y((d) => this._yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));
  }

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

    let range = [];
    this._data.map((d) => range.push(...d.range));
    this.minRange = min(range);
    this.maxRange = max(range);

    // Create the visualisation here
    this.refresh();
  }

  refresh() {
    if (!this.svg) return;
    this.svg.selectAll("path").remove();
    this._initScales();

    this._data.map((d) => this.drawLine(d));
    this._updateHighlight();
  }

  _initScales() {
    this._xScale.domain([0, this.width]).range([0, this.width]);
    this._yScale
      .domain([this.minRange, this.maxRange])
      .range([this._height, 0]);
  }

  drawLine(d) {
    const lineCurve = d.lineCurve || "linear";
    this.svg
      .append("path")
      .attr("class", d.name)
      .attr(
        "d",
        lineCurve === "linear" ? this.line(d.values) : this.curve(d.values)
      )
      .attr("fill", "none")
      .attr("stroke", d.colour || interpolateRainbow(Math.random()))
      .attr("transform", "translate(0,0)");
  }
}

export default NightingaleLinegraphTrack;
