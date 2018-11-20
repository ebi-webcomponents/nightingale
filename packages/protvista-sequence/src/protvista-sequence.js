import { axisBottom, select } from "d3";

import ProtvistaZoomable from "protvista-zoomable";

const height = 40;

class ProtVistaSequence extends ProtvistaZoomable {
  connectedCallback() {
    super.connectedCallback();
    this._highlightstart = parseInt(this.getAttribute("highlightstart"));
    this._highlightend = parseInt(this.getAttribute("highlightend"));
    if (this.sequence) {
      this._createSequence();
    }
  }

  get data() {
    return this.sequence;
  }

  set data(data) {
    if (typeof data === "string") this.sequence = data;
    else if ("sequence" in data) this.sequence = data.sequence;
    if (this.sequence && !super.svg) {
      this._createSequence();
    }else{
      this.refresh();
    }

  }

  _createSequence() {
    super.svg = select(this)
      .append("div")
      .attr("class", "")
      .append("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", height);

    this.seq_bg = super.svg.append("g").attr("class", "background");

    this.axis = super.svg.append("g").attr("class", "x axis");

    this.seq_g = super.svg
      .append("g")
      .attr("class", "sequence")
      .attr("transform", `translate(0,${0.75 * height})`);

      this.seq_g.append("text").attr("class", "base").text("T");
      this.chWidth = this.seq_g.select("text.base")
        .node()
        .getBBox().width *
        0.8;
      this.seq_g.select("text.base").remove();
    this.highlighted = super.svg
      .append("rect")
      .attr("class", "highlighted")
      .attr("fill", "yellow")
      .attr("height", height);

    this.refresh();
  }

  refresh() {
    if (this.axis) {
      const ftWidth = this.getXFromSeqPosition(2) - this.getXFromSeqPosition(1);
      const space = ftWidth - this.chWidth;
      const half = ftWidth / 2;
      const first = Math.max(0, this._displaystart-2);
      const last = Math.min(this.sequence.length, this._displayend+1);
      const bases = space<0 ? [] : this.sequence
        .slice(first, last)
        .split("")
        .map((aa, i) => [1 + first + i, aa]);
      // console.log(this._displaystart, this._displayend);
      // console.log(bases);
      // console.log(this.xScale.range());
      // console.log(this.xScale.domain());

      this.xAxis = axisBottom(this.xScale).tickFormat(
        d => (Number.isInteger(d) ? d : "")
      );
      this.axis.call(this.xAxis);

      this.axis.attr("transform", `translate(${this.margin.left + half},0)`);
      this.axis.select(".domain").remove();
      this.axis.selectAll(".tick line").remove();

      this.bases = this.seq_g
        .selectAll("text.base")
        .data(bases, d => d[0]);
      this.bases
        .enter()
        .append("text")
        .attr("class", "base")
        .attr("text-anchor", "middle")
        .attr("x", ([pos]) => this.getXFromSeqPosition(pos) + half)
        .text(([_, d]) => d)
        .attr("style", "font-family:monospace");

      this.bases.exit().remove();

      this.bases.attr("x", ([pos]) => this.getXFromSeqPosition(pos) + half);

      this.background = this.seq_bg
        .selectAll("rect.base_bg")
        .data(bases, d => d[0]);
      this.background
        .enter()
        .append("rect")
        .attr("class", "base_bg")
        .attr("fill", ([pos]) => (pos % 2 ? "#ccc" : "#eee"))
        .attr("height", height)
        .attr("width", ftWidth)
        .attr("x", ([pos]) => this.getXFromSeqPosition(pos));
      this.background
        .attr("width", ftWidth)
        .attr("x", ([pos]) => this.getXFromSeqPosition(pos));
      this.background.exit().remove();

      this.seq_g.style("opacity", Math.min(1, space));
      this.background.style("opacity", Math.min(1, space));

      if (
        Number.isInteger(this._highlightstart) &&
        Number.isInteger(this._highlightend)
      ) {
        this.highlighted
          .attr("x", super.getXFromSeqPosition(this._highlightstart))
          .style("opacity", 0.3)
          .attr(
            "width",
            ftWidth * (this._highlightend - this._highlightstart + 1)
          );
      } else {
        this.highlighted.style("opacity", 0);
      }
    }
  }
}

export default ProtVistaSequence;
