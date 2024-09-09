import { select, Selection } from "d3";

import NightingaleBaseElement, {
  Constructor,
} from "../../../nightingale-base-element";

import withHighlight, { WithHighlightInterface } from "..";
import withZoom, { WithZoomInterface } from "../../withZoom";

export interface WithSVGHighlightInterface
  extends WithZoomInterface,
    WithHighlightInterface {
  createHighlightGroup: () => void;
  updateHighlight: () => void;
}
const withSVGHighlight = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
) => {
  class WithSVGHighlight extends withZoom(withHighlight(superClass)) {
    protected highlighted?: Selection<
      SVGGElement,
      unknown,
      HTMLElement | SVGElement | null,
      unknown
    >;

    createHighlightGroup() {
      const svg = select(this as unknown as NightingaleBaseElement).selectAll<
        SVGSVGElement,
        unknown
      >("svg");

      this.highlighted = svg.append("g").attr("class", "highlighted");
    }
    updateHighlight() {
      if (!this.highlighted) return;
      const highlighs = this.highlighted
        .selectAll<
          SVGRectElement,
          {
            start: number;
            end: number;
          }[]
        >("rect")
        .data(this.highlightedRegion.segments);

      highlighs
        .enter()
        .append("rect")
        .style("pointer-events", "none")
        .merge(highlighs)
        .attr("fill", this["highlight-color"])
        .attr("height", this.height)
        .attr("x", (d) => this.getXFromSeqPosition(d.start))
        .attr("width", (d) =>
          Math.max(0, this.getSingleBaseWidth() * (d.end - d.start + 1)),
        );

      highlighs.exit().remove();
    }
  }
  return WithSVGHighlight as Constructor<WithSVGHighlightInterface> & T;
};

export default withSVGHighlight;
