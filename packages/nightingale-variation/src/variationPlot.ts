import { Selection } from "d3";
import NightingaleVariation, { VariationDatum } from "./nightingale-variation";
import { ProcessedVariationData } from "./nightingale-variation";
import { bindEvents } from "@nightingale-elements/nightingale-new-core";

export const drawVariationPlot = (
  selection: Selection<
    SVGGElement,
    VariationDatum[],
    HTMLElement | SVGElement | null,
    unknown
  >,
  element: NightingaleVariation
) => {
  const ftWidth = element.getSingleBaseWidth();
  const half = ftWidth / 2;

  const circle = selection
    .selectAll<SVGCircleElement, ProcessedVariationData>("circle")
    .data(selection.datum());

  circle.exit().remove();

  circle
    .enter()
    .append("circle")
    .merge(circle)
    .attr("class", "feature")
    .attr("title", (d) => d.transformedData.position)
    .attr("r", "5")
    .attr(
      "cx",
      (d) => element.getXFromSeqPosition(d.transformedData.position) + half
    )
    .attr(
      "cy",
      (d) => element.yScale?.(d.transformedData.mutatedType.charAt(0)) || 0
    )
    .attr("name", (d) => d.transformedData.internalID)
    .attr("fill", (d) => element.colorConfig(d))
    .call(bindEvents, element);
};
