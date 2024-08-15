import { select, scalePow, ScalePower, Selection } from "d3";
import NightingaleVariation from "./nightingale-variation";
import { ProcessedVariationData } from "./nightingale-variation";
import { bindEvents } from "@nightingale-elements/nightingale-new-core";

class VariationPlot {
  _frequency: ScalePower<number, number>;

  constructor() {
    this._frequency = scalePow().exponent(0.001).domain([0, 1]).range([5, 10]);
    // Data bind otherwise babel removes it
    this.drawVariationPlot = this.drawVariationPlot.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  drawVariationPlot(
    selection: Selection<
      SVGGElement,
      ProcessedVariationData[],
      HTMLElement | SVGElement | null,
      unknown
    >,
    element: NightingaleVariation,
  ) {
    const ftWidth = element.getSingleBaseWidth();
    const half = ftWidth / 2;
    // Iterate over data
    selection.each((data, i, nodes) => {
      // Generate chart
      const series = select(nodes[i]);

      // Only draw positions where there is data
      const withVariants = data.filter((elem) => elem.variants.length !== 0);

      // bind data
      const bars = series
        .selectAll<SVGGElement, ProcessedVariationData>("g")
        .data(withVariants, (d) => d.pos);

      bars.exit().remove();

      // On enter append for each data point
      const circle = bars
        .enter()
        .append("g")
        .merge(bars)
        .selectAll<SVGCircleElement, ProcessedVariationData>("circle")
        .data((d) => d.variants);

      circle.exit().remove();

      circle
        .enter()
        .append("circle")
        .merge(circle)
        .attr("class", "feature")
        .attr("title", (d) => d.start)
        .attr("r", (d) => (d.size ? d.size : 5))
        .attr("cx", (d) => {
          return element.getXFromSeqPosition(d.start) + half;
        })
        .attr("cy", (d) => {
          return element.yScale?.(d.variant.charAt(0)) || 0;
        })
        .attr("name", (d) => {
          const mutation =
            d.alternativeSequence === "*" ? "STOP" : d.alternativeSequence;
          // eslint-disable-next-line no-param-reassign
          d.internalId = `var_${d.wildType}${d.start}${mutation}`;
          return d.internalId;
        })
        .attr("fill", (d) => {
          return d.color ? d.color : element.colorConfig(d);
        })
        .call(bindEvents, element);
    });
  }
}

export default VariationPlot;
