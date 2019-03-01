import { select, scalePow, event as d3Event } from "d3";
class VariationPlot {
  constructor() {
    this._frequency = scalePow()
      .exponent(0.001)
      .domain([0, 1])
      .range([5, 10]);
    // Data bind otherwise babel removes it
    this.drawVariationPlot = this.drawVariationPlot.bind(this);
  }

  drawVariationPlot(selection, element) {
    const ftWidth = element.getSingleBaseWidth();
    const half = ftWidth / 2;
    // Iterate over data
    selection.each((data, i, nodes) => {
      // Generate chart
      const series = select(nodes[i]);

      // Only draw positions where there is data
      const withVariants = data.filter(elem => elem.variants.length !== 0);

      // bind data
      const bars = series.selectAll("g").data(withVariants, d => d.pos);

      bars.exit().remove();

      // On enter append for each data point
      const circle = bars
        .enter()
        .append("g")
        .merge(bars)
        .selectAll("circle")
        .data(d => d.variants);

      circle.exit().remove();

      circle
        .enter()
        .append("circle")
        .merge(circle)
        .attr("class", function(d) {
          // if (d === fv.selectedFeature) {     return 'up_pftv_variant
          // up_pftv_activeFeature'; } else {     return 'up_pftv_variant'; }
        })
        .attr("title", d => d.start)
        .attr("r", d => (d.size ? d.size : 5))
        .attr("cx", d => {
          return element.getXFromSeqPosition(d.start) + half;
        })
        .attr("cy", d => {
          return element._yScale(d.variant.charAt(0));
        })
        .attr("name", d => {
          var mutation =
            d.alternativeSequence === "*" ? "STOP" : d.alternativeSequence;
          d.internalId = "var_" + d.wildType + d.start + mutation;
          return d.internalId;
        })
        .attr("fill", d => d.color)
        .attr("tooltip-trigger", "true")
        .on("mouseover", f => {
          element.dispatchEvent(
            new CustomEvent("change", {
              detail: {
                highlightend: f.end,
                highlightstart: f.start
              },
              bubbles: true,
              cancelable: true
            })
          );
        })
        .on("click", d => {
          const tooltipData = {
            start: d.start,
            end: d.end,
            feature: {
              ...d,
              type: "Variant"
            }
          };
          element.createTooltip(d3Event, tooltipData, true);
        });
    });
  }
}

export default VariationPlot;
