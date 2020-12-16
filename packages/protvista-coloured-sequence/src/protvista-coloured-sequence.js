import { select, scaleLinear } from "d3";

import ProtVistaSequence from "protvista-sequence";
import { ColorScaleParser, String2Object } from "protvista-utils";

import hydroInterfaceScale from "./hydrophobicity-interface-scale.json";
import hydroOctanoleScale from "./hydrophobicity-octanol-scale.json";
import hydroScale from "./hydrophobicity-scale.json";
import isoelectricPointScale from "./isoelectric-point-scale.json";

const supportedScales = [
  "hydrophobicity-interface-scale",
  "hydrophobicity-octanol-scale",
  "hydrophobicity-scale",
  "isoelectric-point-scale",
];

const defaultScale = {
  domain: [-2, 2],
  range: ["#ffdd00", "#0000FF"],
};

const MIN_BASE_SIZE = 8;

class ProtVistaColouredSequence extends ProtVistaSequence {
  static get observedAttributes() {
    return ProtVistaSequence.observedAttributes.concat(
      "scale", // One of the supported scales. Ora custom scale given in the following format. e.g. A:0.5,M:-3,P:3
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

    this.uniqueID = Math.random().toString(36).substring(7);

    this.gradient = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `scale-gradient-${this.uniqueID}`);

    this.seq_g = this.svg.append("g").attr("class", "background");
    this.seq_greadient = this.svg
      .append("rect")
      .attr("class", "seq-gradient")
      .style("pointer-events", "none");

    this._getCharSize();

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
        case "isoelectric-point-scale":
          return isoelectricPointScale;
        case "hydrophobicity-octanol-scale":
          return hydroOctanoleScale;
        default:
          return null;
      }
    }
    if (
      /([ILFVMPWHTEQCYASNDRGK]:-?\d+\.?\d*)(,[ILFVMPWHTEQCYASNDRGK]:-?\d+\.?\d*)*/.test(
        this._scale
      )
    ) {
      try {
        scale = String2Object(this._scale, {
          keyFormatter: (x) => x.toUpperCase(),
          valueFormatter: (x) => parseFloat(x),
        });
      } catch (error) {
        console.error(`Couldn't parse the given scale ${this._scale}`, error);
      }
    }
    return scale;
  }

  refresh() {
    if (this.seq_g) {
      const scale = this.getScaleFromAttribute();
      if (scale === null) {
        console.error("The attribute scale is not valid.");
        return;
      }
      const colorScale = scaleLinear();
      this.colorScale = defaultScale;
      if (this._color_range) {
        this.colorScale = ColorScaleParser(this._color_range);
      }
      colorScale.domain(this.colorScale.domain).range(this.colorScale.range);

      const ftWidth = this.getSingleBaseWidth();
      const first = Math.round(Math.max(0, this._displaystart - 2));
      const last = Math.round(
        Math.min(this.sequence.length, this._displayend + 1)
      );
      const bases = this.sequence
        .slice(first, last)
        .split("")
        .map((aa, i) => {
          // use 0 if the base is not in the given scale
          const value = aa.toUpperCase() in scale ? scale[aa.toUpperCase()] : 0;
          return {
            start: 1 + first + i,
            end: 1 + first + i,
            aa,
            value,
            colour: colorScale(value),
          };
        });

      this.residues = this.seq_g
        .selectAll("rect.base_bg")
        .data(ftWidth < MIN_BASE_SIZE ? [] : bases, (d) => d.start);

      this.residues
        .enter()
        .append("rect")
        .attr("class", "base_bg feature")
        .attr("data-base", ({ aa }) => aa)
        .attr("data-pos", ({ start }) => start)
        .attr("height", this._height)
        .merge(this.residues)
        .attr("width", ftWidth)
        .attr("fill", ({ colour }) => colour)
        .attr("x", ({ start }) => this.getXFromSeqPosition(start))
        .call(this.bindEvents, this);

      this.residues.exit().remove();

      const stops = this.gradient
        .selectAll("stop")
        .data(this.sequence.split(""));
      stops
        .enter()
        .append("stop")
        .merge(stops)
        .attr("offset", (_, pos) => (pos + 0.5) / this.sequence.length)
        .attr("stop-color", (base) =>
          colorScale(
            base.toUpperCase() in scale ? scale[base.toUpperCase()] : 0 // if the base is not in the given scale
          )
        );
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
