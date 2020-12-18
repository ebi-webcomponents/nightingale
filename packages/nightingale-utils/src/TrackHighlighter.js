import Region from "./Region";

const combineRegions = (region1, region2) => {
  if (!region1) return region2;
  if (!region2) return region1;
  return `${region1},${region2}`;
};
export default class TrackHighlighter {
  constructor({ element, min, max }) {
    this.element = element;
    this.region = new Region({ min, max });
    this.fixedHighlight = null;
  }

  set max(max) {
    this.region.max = max;
  }

  setAttributesInElement() {
    this.region.decode(this.element.getAttribute("highlight"));
  }

  setFloatAttribute(name, strValue) {
    const value = parseFloat(strValue);
    this.element[`_${name}`] = Number.isNaN(value) ? strValue : value;
  }

  changedCallBack(name, newValue) {
    this.element._highlight = newValue;
    this.region.decode(
      combineRegions(this.fixedHighlight, this.element._highlight)
    );
    this.element.refresh();
  }

  setFixedHighlight(region) {
    this.fixedHighlight = region;
    this.region.decode(combineRegions(region, this.element._highlight));
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
      .style("opacity", 0.5)
      .attr("fill", "rgba(255, 235, 59, 0.8)")
      .style("pointer-events", "none")
      .merge(highlighs)
      .attr("height", this.element._height)
      .attr("x", (d) => this.element.getXFromSeqPosition(d.start))
      .attr(
        "width",
        (d) => this.element.getSingleBaseWidth() * (d.end - d.start + 1)
      );
    highlighs.exit().remove();
  }
}
