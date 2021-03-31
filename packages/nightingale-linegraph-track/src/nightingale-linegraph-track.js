import ProtvistaTrack from "protvista-track";
import * as d3 from "d3";
import { scaleLinear, select, line, max, min, interpolateRainbow } from "d3";

class NightingaleLinegraphTrack extends ProtvistaTrack {
  connectedCallback() {
    super.connectedCallback();

    this._height = Number(this.getAttribute("height")) || 40;
    this._type = this.getAttribute("type") || "line-graph-track";
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
    const minimum = [];
    const maximum = [];
    this._data.forEach((d) => {
      range.push(...d.range);
      minimum.push(min(d.values, (v) => v.position));
      maximum.push(max(d.values, (v) => v.position));
    });
    this.minRange = min(range);
    this.maxRange = max(range);

    this.beginning = min(minimum);
    this.end = max(maximum);

    // Create the visualisation here
    this.chartGroup = this.svg.append("g").attr("class", "chart-group");
    this._initYScale();

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
        d.colour = d.colour || interpolateRainbow(Math.random()); // eslint-disable-line no-param-reassign
        return this.drawLine(d)(d.values);
      })
      .attr("fill", "none")
      .attr("stroke", (d) => d.colour)
      .attr("transform", "translate(0,0)");

    const mouseG = this.chartGroup
      .append("g")
      .attr("class", "mouse-over-effects");

    const lines = this.chartGroup.selectAll("path.graph");

    const mousePerLine = mouseG
      .selectAll(".mouse-per-line")
      .data(this._data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine
      .append("circle")
      .attr("r", 7)
      .style("stroke", (d) => {
        return d.colour;
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text").attr("transform", "translate(10,3)");

    const _this = this;
    mouseG
      .append("rect") // append a rect to catch mouse movements on canvas
      .attr("width", this.width) // can't catch mouse events on a g element
      .attr("height", this._height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", () => {
        // on mouse out hide circles and text
        d3.selectAll(".mouse-per-line circle").style("opacity", "0");
        d3.selectAll(".mouse-per-line text").style("opacity", "0");
      })
      .on("mousemove", () => {
        // mouse moving over canvas
        const mouse = d3.mouse(this);

        // Showing the circle and text only when the mouse is moving over the paths
        if (
          mouse[0] < _this.xScale(_this.beginning) ||
          mouse[0] > _this.xScale(_this.end) + _this.getSingleBaseWidth()
        ) {
          d3.selectAll(".mouse-per-line circle").style("opacity", "0");
          d3.selectAll(".mouse-per-line text").style("opacity", "0");
        } else {
          const features = {};
          const seqPosition = Math.floor(_this.xScale.invert(mouse[0]));

          d3.selectAll(".mouse-per-line circle").style("opacity", (d) => {
            // In case there is a gap or break in the graph, circle and text are not shown
            const value = d.values.find((v) => v.position === seqPosition);
            if (value) {
              return value.value ? "1" : "0";
            }
            return "0";
          });
          d3.selectAll(".mouse-per-line text").style("opacity", "1");

          d3.selectAll(".mouse-per-line text").text((d) => {
            const value = d.values.find((v) => v.position === seqPosition);
            features[d.name] = value;
            return value ? value.value : "";
          });

          d3.selectAll(".mouse-per-line").attr("transform", (d, i) => {
            let beginning = 0;
            let end = lines.nodes()[i].getTotalLength();
            let target = null;
            let pos = {};
            /*
             Finding the nearest point in the path to the mouse pointer using iterative dichotomy.
             Example can be found here - https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
             */
            while (true) {
              target = Math.floor((beginning + end) / 2);
              pos = lines.nodes()[i].getPointAtLength(target);
              if (
                (target === end || target === beginning) &&
                pos.x !== mouse[0]
              ) {
                break;
              }
              if (pos.x > mouse[0]) end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; // position found
            }
            return `translate(${mouse[0]},${pos.y})`;
          });

          const detail = {
            eventtype: "mouseover",
            feature: features,
            highlight: `${seqPosition}:${seqPosition}`,
            type: this._type,
            target: this,
          };
          this.dispatchEvent(
            new CustomEvent("change", {
              detail,
              bubbles: true,
              cancelable: true,
            })
          );
        }
      });
  }

  refresh() {
    if (this.chart) {
      this.chart
        .selectAll("path.graph")
        .attr("d", (d) => this.drawLine(d)(d.values));
      this._updateHighlight();
    }
  }

  _initYScale() {
    this._yScale
      .domain([this.minRange, this.maxRange])
      .range([this._height, 0]);
  }

  drawLine(d) {
    const curve = d.lineCurve || "curveLinear";

    return line()
      .defined((d) => d.value !== null) // To have gaps in the line graph
      .x(
        (d) =>
          this.getXFromSeqPosition(d.position + 1) -
          this.getSingleBaseWidth() / 2
      )
      .y((d) => this._yScale(d.value))
      .curve(d3[curve]);
  }
}

export default NightingaleLinegraphTrack;
