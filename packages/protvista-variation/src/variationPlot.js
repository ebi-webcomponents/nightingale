import { select, scalePow } from "d3";

class VariationPlot {
  constructor() {
    this._frequency = scalePow()
      .exponent(0.001)
      .domain([0, 1])
      .range([5, 10]);
    // Data bind otherwise babel removes it
    this.drawVariationPlot = this.drawVariationPlot.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
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
        .attr("class", "feature")
        .attr("title", d => d.start)
        .attr("r", d => (d.size ? d.size : 5))
        .attr("cx", d => {
          return element.getXFromSeqPosition(d.start) + half;
        })
        .attr("cy", d => {
          return element._yScale(d.variant.charAt(0));
        })
        .attr("name", d => {
          const mutation =
            d.alternativeSequence === "*" ? "STOP" : d.alternativeSequence;
          // eslint-disable-next-line no-param-reassign
          d.internalId = `var_${d.wildType}${d.start}${mutation}`;
          return d.internalId;
        })
        .attr("fill", d =>
          element._colorConfig ? element._colorConfig(d) : d.color
        )
        .call(element.bindEvents, element);
    });
  }
}

export default VariationPlot;
