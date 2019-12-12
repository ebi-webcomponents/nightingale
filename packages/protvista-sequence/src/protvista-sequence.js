import { axisBottom, select } from "d3";

import ProtvistaZoomable from "protvista-zoomable";

const NUMBER_OF_TICKS = 3;

class ProtVistaSequence extends ProtvistaZoomable {
  connectedCallback() {
    super.connectedCallback();
    this.sequence = this.getAttribute("sequence");
    if (this.sequence) {
      this._createSequence();
    }
    this.addEventListener("load", e => {
      this.data = e.detail.payload;
    });
  }

  static get observedAttributes() {
    return ProtvistaZoomable.observedAttributes.concat(
      "highlightstart",
      "highlightend"
    );
  }

  get data() {
    return this.sequence;
  }

  set data(data) {
    if (typeof data === "string") this.sequence = data;
    else if ("sequence" in data) this.sequence = data.sequence;
    if (this.sequence && !super.svg) {
      this._createSequence();
    } else {
      this.refresh();
    }
  }

  _getCharWidth() {
    this.seq_g
      .append("text")
      .attr("class", "base")
      .text("T");
    this.chWidth =
      this.seq_g
        .select("text.base")
        .node()
        .getBBox().width * 0.8;
    this.seq_g.select("text.base").remove();
  }

  _createSequence() {
    super.svg = select(this)
      .append("div")
      .attr("class", "")
      .append("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this._height);

    this.seq_bg = super.svg.append("g").attr("class", "background");

    this.axis = super.svg.append("g").attr("class", "x axis");

    this.seq_g = super.svg
      .append("g")
      .attr("class", "sequence")
      .attr("transform", `translate(0,${0.75 * this._height})`);

    this._getCharWidth();
    this.trackHighlighter.appendHighlightTo(this.svg);
    this.refresh();
  }

  refresh() {
    if (this.axis) {
      const ftWidth = this.getSingleBaseWidth();
      const space = ftWidth - this.chWidth;
      const half = ftWidth / 2;
      const first = Math.round(Math.max(0, this._displaystart - 2));
      const last = Math.round(
        Math.min(this.sequence.length, this._displayend + 1)
      );
      const bases =
        space < 0
          ? []
          : this.sequence
              .slice(first, last)
              .split("")
              .map((aa, i) => {
                return { start: 1 + first + i, end: 1 + first + i, aa };
              });

      this.xAxis = axisBottom(this.xScale)
        .tickFormat(d => (Number.isInteger(d) ? d : ""))
        .ticks(NUMBER_OF_TICKS, "s");
      this.axis.call(this.xAxis);

      this.axis.attr("transform", `translate(${this.margin.left + half},0)`);
      this.axis.select(".domain").remove();
      this.axis.selectAll(".tick line").remove();

      this.bases = this.seq_g.selectAll("text.base").data(bases, d => d.start);
      this.bases
        .enter()
        .append("text")
        .attr("class", "base")
        .attr("text-anchor", "middle")
        .attr("x", d => this.getXFromSeqPosition(d.start) + half)
        .text(d => d.aa)
        .style("pointer-events", "none")
        .style("font-family", "monospace");

      this.bases.exit().remove();

      this.bases.attr("x", d => this.getXFromSeqPosition(d.start) + half);

      this.background = this.seq_bg
        .selectAll("rect.base_bg")
        .data(bases, d => d.start);
      this.background
        .enter()
        .append("rect")
        .attr("class", "base_bg feature")
        .attr("height", this._height)
        .merge(this.background)
        .attr("width", ftWidth)
        .attr("fill", d => {
          return Math.round(d.start) % 2 ? "#ccc" : "#eee";
        })
        .attr("x", d => this.getXFromSeqPosition(d.start))
        .call(this.bindEvents, this);
      this.background.exit().remove();

      this.seq_g.style("opacity", Math.min(1, space));
      this.background.style("opacity", Math.min(1, space));

      this._updateHighlight();
    }
  }

  _updateHighlight() {
    this.trackHighlighter.updateHighlight();
  }
}

export default ProtVistaSequence;
