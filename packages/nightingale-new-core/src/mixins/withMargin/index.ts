import { Selection } from "d3";
import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";

import withDimensions, { WithDimensionsInterface } from "../withDimensions";


const DEFAULT_MARGIN_COLOR = "#FFFFFFDD";

export interface withMarginInterface
  extends NightingaleBaseElement,
  WithDimensionsInterface {
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
    >,
  ) => void;
}

const defaultOptions = {
  "margin-top": 0,
  "margin-bottom": 0,
  "margin-left": 10,
  "margin-right": 10,
  "margin-color": DEFAULT_MARGIN_COLOR,
};

const withMargin = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "margin-top"?: number;
    "margin-bottom"?: number;
    "margin-left"?: number;
    "margin-right"?: number;
    "margin-color"?: string | null;
  } = {},
) => {
  class WithMargin extends withDimensions(superClass) implements withMarginInterface {
    #initialOptions = { ...defaultOptions, ...options };
    @property({ type: Number })
    "margin-top": number = this.#initialOptions["margin-top"];
    @property({ type: Number })
    "margin-bottom": number = this.#initialOptions["margin-bottom"];
    @property({ type: Number })
    "margin-left": number = this.#initialOptions["margin-left"];
    @property({ type: Number })
    "margin-right": number = this.#initialOptions["margin-right"];
    @property({ type: String })
    "margin-color": string = this.#initialOptions["margin-color"] ?? DEFAULT_MARGIN_COLOR;

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
      >,
    ) {
      if (!g) return;

      if (g.select("rect").empty()) {
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-left");
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-right");
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-top");
        g.append("rect")
          .style("pointer-events", "none")
          .attr("class", "margin-bottom");
      }

      g.select("rect.margin-left")
        .attr("fill", this["margin-color"])
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this["margin-left"])
        .attr("height", this["height"]);
      g.select("rect.margin-right")
        .attr("fill", this["margin-color"])
        .attr("x", this["width"] - this["margin-right"])
        .attr("y", 0)
        .attr("width", this["margin-right"])
        .attr("height", this["height"]);
      g.select("rect.margin-top")
        .attr("fill", this["margin-color"])
        .attr("x", this["margin-left"])
        .attr("y", 0)
        .attr("width", this["width"] - this["margin-left"] - this["margin-right"])
        .attr("height", this["margin-top"]);
      g.select("rect.margin-bottom")
        .attr("fill", this["margin-color"])
        .attr("x", this["margin-left"])
        .attr("y", this["height"] - this["margin-bottom"])
        .attr("width", this["width"] - this["margin-left"] - this["margin-right"])
        .attr("height", this["margin-bottom"]);
    }
  }
  return WithMargin as Constructor<withMarginInterface> & T;
};

export default withMargin;
