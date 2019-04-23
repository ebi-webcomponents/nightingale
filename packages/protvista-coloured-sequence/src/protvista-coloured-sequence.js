import { select, scaleLinear } from "d3";

import hydroInterfaceScale from "./hydrophobicity-interface-scale.json";
import hydroOctanoleScale from "./hydrophobicity-octanol-scale.json";
import hydroScale from "./hydrophobicity-scale.json";

import ProtVistaSequence from "protvista-sequence";
import { ColorScaleParser } from "protvista-utils";

const supportedScales = [
  "hydrophobicity-interface-scale",
  "hydrophobicity-octanol-scale",
  "hydrophobicity-scale"
];

const defaultScale = {
  domain: [-2, 2],
  range: ["#ffdd00", "#0000FF"]
};

const MIN_BASE_SIZE = 8;

class ProtVistaColouredSequence extends ProtVistaSequence {
  static get observedAttributes() {
    return ProtVistaSequence.observedAttributes.concat(
      "scale", // One of the supported scales. TBD: a format for the scale, e.g. A:0.5,M:-3,P:3
      "color_range" // Color values per point to define a colorScale. Default: #ffdd00:-2,#0000FF:2
    );
  }

  _createSequence() {
    this.svg = select(this)
      .append("div")
      .attr("class", "")
      .append("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this._height);

    this.uniqueID = Math.random()
      .toString(36)
      .substring(7);

    this.gradient = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "scale-gradient-" + this.uniqueID);
    // .attr("gradientUnits", "userSpaceOnUse")
    // .attr("x1", 0).attr("y1", y(50))
    // .attr("x2", 0).attr("y2", y(60))

    this.seq_g = this.svg.append("g").attr("class", "background");
    this.seq_greadient = this.svg.append("rect").attr("class", "seq-gradient");

    this._getCharWidth();

    this.trackHighlighter.appendHighlightTo(this.svg);
    this.refresh();
  }
  getScaleFromAttribute() {
    let scale = null;
    if (supportedScales.indexOf(this._scale) >= 0) {
      switch (this._scale) {
        case "hydrophobicity-scale":
          return hydroScale;
        case "hydrophobicity-interface-scale":
          return hydroInterfaceScale;
        case "hydrophobicity-octanol-scale":
          return hydroOctanoleScale;
      }
    }
    // TODO: parse scale
    return scale;
  }
  refresh() {
    if (this.seq_g) {
      const scale = this.getScaleFromAttribute();
      if (scale === null) {
        console.error("The attribute scale is not valid.");
        return;
      }
      const ftWidth = this.getSingleBaseWidth();
      // const space = ftWidth - this.chWidth;
      const first = Math.round(Math.max(0, this._displaystart - 2));
      const last = Math.round(
        Math.min(this.sequence.length, this._displayend + 1)
      );
      const bases = this.sequence
        .slice(first, last)
        .split("")
        .map((aa, i) => [1 + first + i, aa]);

      this.residues = this.seq_g
        .selectAll("rect.base_bg")
        .data(ftWidth < MIN_BASE_SIZE ? [] : bases, d => d[0]);

      const colorScale = scaleLinear();
      if (this._color_range) {
        const customColorScale = ColorScaleParser(this._color_range);
        colorScale
          .domain(customColorScale.domain)
          .range(customColorScale.range);
      } else {
        colorScale.domain(defaultScale.domain).range(defaultScale.range);
      }

      this.residues
        .enter()
        .append("rect")
        .attr("class", "base_bg")
        .attr("data-base", ([pos, base]) => base)
        .attr("data-pos", ([pos, base]) => pos)
        .attr("height", this._height)
        .merge(this.residues)
        .attr("width", ftWidth)
        .attr("fill", ([pos, base]) => {
          return base.toUpperCase() in scale
            ? colorScale(scale[base.toUpperCase()])
            : "red";
        })
        .attr("x", ([pos]) => this.getXFromSeqPosition(pos));

      this.residues.exit().remove();

      const stops = this.gradient
        .selectAll("stop")
        .data(this.sequence.split(""));
      stops
        .enter()
        .append("stop")
        .merge(stops)
        .attr("offset", (_, pos) => (pos + 0.5) / this.sequence.length)
        .attr("stop-color", base => {
          return base.toUpperCase() in scale
            ? colorScale(scale[base.toUpperCase()])
            : "red";
        });
      this.gradient.exit().remove();

      this.seq_greadient
        .attr("x", this.getXFromSeqPosition(1))
        .attr("y", 0)
        .attr("height", this._height)
        .attr(
          "width",
          this.getXFromSeqPosition(this.sequence.length) -
            this.getXFromSeqPosition(0)
        )
        .style("opacity", ftWidth < MIN_BASE_SIZE ? 1 : MIN_BASE_SIZE / ftWidth)
        .attr("fill", `url(#scale-gradient-${this.uniqueID})`);

      this._updateHighlight();
    }
  }
}

export default ProtVistaColouredSequence;
