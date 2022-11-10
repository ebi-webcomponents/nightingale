import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import { property } from "lit/decorators.js";
import { Selection } from "d3";

import withDimensions from "../withDimensions";

const DEFAULT_MARGIN_COLOR = "#FFFFFFDD";
export interface withMarginInterface extends NightingaleBaseElement {
  "margin-top": number;
  "margin-bottom": number;
  "margin-left": number;
  "margin-right": number;
  "margin-color": string;
  getWidthWithMargins: () => number;
  getHeightWithMargins: () => number;
  renderMarginOnGroup: (
    g?: Selection<
      SVGGElement,
      unknown,
      HTMLElement | SVGElement | null,
      unknown
    >
  ) => void;
}

const withMargin = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "margin-top": number;
    "margin-bottom": number;
    "margin-left": number;
    "margin-right": number;
    "margin-color"?: string | null;
  } = {
    "margin-top": 0,
    "margin-bottom": 0,
    "margin-left": 10,
    "margin-right": 10,
    "margin-color": DEFAULT_MARGIN_COLOR,
  }
) => {
  class WithMargin extends withDimensions(superClass) {
    @property({ type: Number })
    "margin-top": number = options["margin-top"];
    @property({ type: Number })
    "margin-bottom": number = options["margin-bottom"];
    @property({ type: Number })
    "margin-left": number = options["margin-left"];
    @property({ type: Number })
    "margin-right": number = options["margin-right"];
    @property({ type: String })
    "margin-color" = options["margin-color"];

    #created = false;

    getWidthWithMargins() {
      return this.width
        ? this.width - this["margin-left"] - this["margin-right"]
        : 0;
    }
    getHeightWithMargins() {
      return this.height
        ? this.height - this["margin-top"] - this["margin-bottom"]
        : 0;
    }
    renderMarginOnGroup(
      g?: Selection<
        SVGGElement,
        unknown,
        HTMLElement | SVGElement | null,
        unknown
      >
    ) {
      if (!g) return;

      if (!this.#created || g.select("rect").empty()) {
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-left")
          .attr("x", 0);
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-right");
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-top")
          .attr("width", this.width)
          .attr("x", 0)
          .attr("y", 0);
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-bottom")
          .attr("width", this.width)
          .attr("x", 0);

        this.#created = true;
      }

      g.select("rect.margin-left")
        .attr("fill", this["margin-color"] || DEFAULT_MARGIN_COLOR)
        .attr("height", this.height)
        .attr("width", this["margin-left"]);
      g.select("rect.margin-right")
        .attr("fill", this["margin-color"] || DEFAULT_MARGIN_COLOR)
        .attr("height", this.height)
        .attr("x", this.width - this["margin-right"])
        .attr("width", this["margin-right"]);
      g.select("rect.margin-top")
        .attr("fill", this["margin-color"] || DEFAULT_MARGIN_COLOR)
        .attr("height", this["margin-top"]);
      g.select("rect.margin-bottom")
        .attr("fill", this["margin-color"] || DEFAULT_MARGIN_COLOR)
        .attr("y", this.height - this["margin-bottom"])
        .attr("height", this["margin-bottom"]);
    }
  }
  return WithMargin as Constructor<withMarginInterface> & T;
};

export default withMargin;
