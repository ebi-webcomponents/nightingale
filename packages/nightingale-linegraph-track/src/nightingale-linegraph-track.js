import ProtvistaTrack from "protvista-track";
import * as d3 from "d3";
import {
  scaleLinear,
  select,
  line,
  max,
  min,
  interpolateRainbow,
  mouse,
} from "d3";

class NightingaleLinegraphTrack extends ProtvistaTrack {
  connectedCallback() {
    super.connectedCallback();

    this._height = Number(this.getAttribute("height")) || 40;
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
    this.chartGroup = this.svg.append("g").attr("class", "chart-group");
    this._initYScale();
    this._checkSeqBaseWidth();

    this.chart = this.chartGroup
      .selectAll(".chart")
      .data(this._data)
      .enter()
      .append("g")
      .attr("class", "chart");

    this.chart
      .append("path")
      .attr("class", "graph")
      .attr("id", (d) => d.name)
      .attr("d", (d) => {
        d.colour = d.colour || interpolateRainbow(Math.random()); // eslint-disable-line no-param-reassignre
        return this.drawLine(d)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => d.colour)
      .attr("transform", "translate(0,0)")
      .on("mouseover", (d) => {
        if (this.isSeqBaseVisible) {
          const coords = mouse(this);
          this._createEvent(coords, d, "mouseover");
        }
      })
      .on("click", (d) => {
        if (this.isSeqBaseVisible) {
          const coords = mouse(this);
          this._createEvent(coords, d, "click");
        }
      });

    this._updateHighlight();
  }

  _initYScale() {
    this._yScale
      .domain([this.minRange, this.maxRange])
      .range([this._height, 0]);
  }

  drawLine(d) {
    const curve = d.lineCurve || "curveLinear";

    return line()
      .x(
        (d) =>
          this.getXFromSeqPosition(d.position + 1) -
          this.getSingleBaseWidth() / 2
      )
      .y((d) => this._yScale(d.value))
      .curve(d3[curve]);
  }

  _createEvent(coords, data, type) {
    this.addPointer(coords);
    const seqPosition = Math.floor(
      this.xScale.invert(coords[0] - this.getSingleBaseWidth() / 2)
    );
    const [value] = data.values.filter((v) => v.position === seqPosition);
    const detail = {
      eventtype: type,
      // coords: coords,
      feature: value,
      highlight: `${seqPosition}:${seqPosition}`,
    };
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  _checkSeqBaseWidth() {
    const xratio = 0.8;
    const tempNode = this.svg.append("text").attr("class", "base").text("T");
    const chWidth = tempNode.node().getBBox().width * xratio;
    tempNode.remove();
    const ftWidth = this.getSingleBaseWidth();
    this.isSeqBaseVisible = ftWidth - chWidth > 1;
  }

  addPointer(coords) {
    this.chart.selectAll("circle.pointer").remove();
    this.chart
      .append("circle")
      .attr("class", "pointer")
      .attr("cx", coords[0])
      .attr("cy", coords[1])
      .attr("r", 5)
      .attr("fill", "green")
      .attr("stroke", "black");
  }
}

export default NightingaleLinegraphTrack;
