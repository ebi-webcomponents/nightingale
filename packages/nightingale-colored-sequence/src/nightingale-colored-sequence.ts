import { customElement, property } from "lit/decorators.js";
import { scaleLinear, Selection } from "d3";

import NightingaleSequence, {
  SequenceBaseType,
} from "@nightingale-elements/nightingale-sequence";
import { bindEvents } from "@nightingale-elements/nightingale-new-core";

import ColorScaleParser from "./utils/ColorScaleParser";
import String2Object from "./utils/String2Object";

import hydroInterfaceScale from "./hydrophobicity-interface-scale.json";
import hydroOctanoleScale from "./hydrophobicity-octanol-scale.json";
import hydroScale from "./hydrophobicity-scale.json";
import isoelectricPointScale from "./isoelectric-point-scale.json";

const supportedScales = new Map<string, Record<string, number>>([
  ["hydrophobicity-interface-scale", hydroInterfaceScale],
  ["hydrophobicity-octanol-scale", hydroOctanoleScale],
  ["hydrophobicity-scale", hydroScale],
  ["isoelectric-point-scale", isoelectricPointScale],
]);

const defaultScale = {
  domain: [-2, 2],
  range: ["#ffdd00", "#0000FF"],
};

export type DataBlock = {
  start: number;
  end: number;
  aa: string;
  value: unknown;
  color: number;
};

const MIN_BASE_SIZE = 8;

@customElement("nightingale-colored-sequence")
class NightingaleColoredSequence extends NightingaleSequence {
  @property({ type: String, reflect: true })
  scale?: string = undefined;
  @property({ type: String, reflect: true })
  "color-range"?: string = undefined;

  #uniqueID = "";
  #gradient?: Selection<
    SVGLinearGradientElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #seq_bg?: Selection<
    SVGGElement,
    SequenceBaseType | unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #residues?: Selection<SVGRectElement, DataBlock, SVGGElement, unknown>;

  colorScale: {
    domain: number[];
    range: string[];
  } = defaultScale;

  protected override createSequence() {
    super.createSequence();

    this.#uniqueID = Math.random().toString(36).substring(7);

    this.svg?.select("g.sequence").attr("transform", null);
    this.#gradient = this.svg
      ?.append("defs")
      .append("linearGradient")
      .attr("id", `scale-gradient-${this.#uniqueID}`);
    this.svg
      ?.append("rect")
      .attr("class", "seq-gradient")
      .style("pointer-events", "none");
    // margins should be the last thing in the svg so they ar over anything else
    this.svg?.selectAll("g.margin").remove();
    this.margins = this.svg?.append("g").attr("class", "margin");
  }

  getScaleFromAttribute() {
    let scale = null;
    const attributeScale = this.scale || "";
    if (supportedScales.has(attributeScale)) {
      return supportedScales.get(attributeScale);
    }
    if (
      /([ILFVMPWHTEQCYASNDRGK]:-?\d+\.?\d*)(,[ILFVMPWHTEQCYASNDRGK]:-?\d+\.?\d*)*/.test(
        attributeScale,
      )
    ) {
      try {
        scale = String2Object(attributeScale, {
          keyFormatter: (x) => x.toUpperCase(),
          valueFormatter: (x) => parseFloat(x),
        });
      } catch (error) {
        console.error(
          `Couldn't parse the given scale "${attributeScale}"`,
          error,
        );
      }
    }
    return scale;
  }

  override renderD3() {
    if (this.seq_g) {
      this.svg?.attr("width", this.width).attr("height", this.height);

      this.seq_g.attr("width", this.width);

      const scale = this.getScaleFromAttribute();
      if (scale === null) {
        console.error("The attribute scale is not valid.");
        return;
      }
      const colorScale = scaleLinear<string, number>();
      if (this["color-range"]) {
        this.colorScale = ColorScaleParser(this["color-range"]);
      }
      colorScale.domain(this.colorScale.domain).range(this.colorScale.range);

      const ftWidth = this.getSingleBaseWidth();
      const first = Math.round(Math.max(0, this.getStart() - 2));
      const last = Math.round(
        Math.min(this.sequence?.length || 0, this.getEnd() + 1),
      );
      const bases =
        this.sequence
          ?.slice(first, last)
          .split("")
          .map<DataBlock>((aa, i) => {
            // use 0 if the base is not in the given scale
            const value =
              scale && aa.toUpperCase() in scale ? scale[aa.toUpperCase()] : 0;
            return {
              start: 1 + first + i,
              end: 1 + first + i,
              aa,
              value,
              color: colorScale(value as number),
            };
          }) || [];

      this.#residues = this.seq_g
        .selectAll<SVGRectElement, DataBlock>("rect.base_bg")
        .data(ftWidth < MIN_BASE_SIZE ? [] : bases, (d) => d.start);

      this.#residues
        .enter()
        .append("rect")
        .attr("class", "base_bg feature")
        .attr("data-base", ({ aa }) => aa)
        .attr("data-pos", ({ start }) => start)
        .attr("height", this.height)
        .merge(this.#residues)
        .attr("width", ftWidth)
        .attr("fill", ({ color }) => color)
        .attr("x", ({ start }) => this.getXFromSeqPosition(start))
        .call(bindEvents, this);

      this.#residues.exit().remove();

      const stops = this.#gradient
        ?.selectAll<SVGStopElement, string[]>("stop")
        .data((this.sequence || "").split(""));

      if (stops) {
        stops
          .enter()
          .append("stop")
          .merge(stops)
          .attr(
            "offset",
            (_, pos) => (pos + 0.5) / (this.sequence?.length || 1),
          )
          .attr("stop-color", (base) =>
            colorScale(
              scale && base.toUpperCase() in scale
                ? (scale[base.toUpperCase()] as number)
                : 0, // if the base is not in the given scale
            ),
          );
      }
      this.#gradient?.exit().remove();

      this.svg
        ?.select("rect.seq-gradient")
        .attr("x", this.getXFromSeqPosition(1))
        .attr("y", 0)
        .attr("height", this.height)
        .attr(
          "width",
          Math.max(
            0,
            this.getXFromSeqPosition(this.sequence?.length || 0) -
              this.getXFromSeqPosition(0),
          ),
        )
        .style("opacity", ftWidth < MIN_BASE_SIZE ? 1 : MIN_BASE_SIZE / ftWidth)
        .attr("fill", `url(#scale-gradient-${this.#uniqueID})`);

      this.updateHighlight();
      this.renderMarginOnGroup(this.margins);
    }
  }
}

export default NightingaleColoredSequence;
