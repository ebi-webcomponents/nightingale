import Region from "./Region";

export default class TrackHighlighter {
  constructor({ element, min, max }) {
    this.element = element;
    this.region = new Region({ min, max });
  }
  set max(max) {
    this.region.max = max;
  }
  setAttributesInElement() {
    this.region.decode(this.element.getAttribute("highlight"));
    if (this.region.segments.length === 0) {
      this.element._highlightstart = parseInt(
        this.element.getAttribute("highlightstart")
      );
      this.element._highlightend = parseInt(
        this.element.getAttribute("highlightend")
      );
      if (
        this.element._highlightstart !== null &&
        this.element._highlightend !== null &&
        !isNaN(this.element._highlightstart) &&
        !isNaN(this.element._highlightend)
      ) {
        this.region.segments = [
          {
            start: this.element._highlightstart,
            end: this.element._highlightend
          }
        ];
      }
    }
  }
  setFloatAttribute(name, strValue) {
    const value = parseFloat(strValue);
    this.element[`_${name}`] = isNaN(value) ? strValue : value;
  }

  changedCallBack(name, newValue) {
    switch (name) {
      case "highlightstart":
      case "highlightend":
        this.setFloatAttribute(name, newValue);
        this.region.segments =
          isNaN(this.element._highlightstart) ||
          isNaN(this.element._highlightend) ||
          this.element._highlightstart === null ||
          this.element._highlightend === null
            ? []
            : [
                {
                  start: Math.max(
                    this.region.min,
                    this.element._highlightstart
                  ),
                  end: Math.min(this.region.max, this.element._highlightend)
                }
              ];

        break;
      default:
        this.region.decode(newValue);
    }
    this.element.refresh();
  }
  appendHighlightTo(svg) {
    this.highlighted = svg.append("g").attr("class", "highlighted");
  }
  updateHighlight() {
    const highlighs = this.highlighted
      .selectAll("rect")
      .data(this.region.segments);
    highlighs
      .enter()
      .append("rect")
      .style("opacity", 0.3)
      .attr("fill", "rgba(255, 235, 59, 0.8)")
      .style("pointer-events", "none")
      .merge(highlighs)
      .attr("height", this.element._height)
      .attr("x", d => this.element.getXFromSeqPosition(d.start))
      .attr(
        "width",
        d => this.element.getSingleBaseWidth() * (d.end - d.start + 1)
      );
    highlighs.exit().remove();
  }
}
