import { html } from "lit";
import { property } from "lit/decorators.js";
import { axisBottom, select, Selection } from "d3";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withHighlight,
  withManager,
  withZoom,
  bindEvents,
  customElementOnce,
} from "@nightingale-elements/nightingale-new-core";

const DEFAULT_NUMBER_OF_TICKS = 3;

export type SequenceBaseType = { position: number; aa: string };

@customElementOnce("nightingale-sequence")
class NightingaleSequence extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement))),
      ),
    ),
  ),
) {
  @property({ type: String })
  sequence?: string | null;
  #seq_bg?: Selection<
    SVGGElement,
    SequenceBaseType | unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #axis?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  protected seq_g?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  protected highlighted?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  margins?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #bases?: Selection<
    SVGTextElement,
    SequenceBaseType,
    SVGElement | null,
    unknown
  >;
  numberOfTicks?: number;
  chWidth?: number;
  chHeight?: number;

  override connectedCallback() {
    super.connectedCallback();
    const ticks = parseInt(this.getAttribute("numberofticks") || "", 10);
    this.numberOfTicks = Number.isInteger(ticks)
      ? ticks
      : DEFAULT_NUMBER_OF_TICKS;
    this.addEventListener("load", (e: Event) => {
      this.data = (e as CustomEvent).detail.payload;
    });
  }

  get data() {
    return this.sequence || "";
  }

  set data(data: string | Record<string, unknown>) {
    if (typeof data === "string") this.sequence = data;
    else if (typeof data?.sequence === "string") this.sequence = data.sequence;

    if (this.svg) {
      this.updateScaleDomain();
      this.applyZoomTranslation();
    }
  }

  protected getCharSize() {
    if (!this.seq_g) return;
    const xratio = 0.8;
    const yratio = 1.6;
    const node = this.seq_g.select<SVGTextElement>("text.base").node();
    if (node) {
      this.chWidth = node.getBBox().width * xratio;
      this.chHeight = node.getBBox().height * yratio;
    } else {
      // Add a dummy node to measure the width
      const tempNode = this.seq_g
        .append("text")
        .attr("class", "base")
        .text("T");
      this.chWidth = (tempNode.node()?.getBBox().width || 0) * xratio;
      this.chHeight = (tempNode.node()?.getBBox().height || 0) * yratio;
      tempNode.remove();
    }
  }

  protected createSequence() {
    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this.height);

    this.#seq_bg = this.svg?.append("g").attr("class", "background");

    this.#axis = this.svg?.append("g").attr("class", "x axis");

    this.seq_g = this.svg
      ?.append("g")
      .attr("class", "sequence")
      .attr(
        "transform",
        `translate(0,${
          this["margin-top"] + 0.75 * this.getHeightWithMargins()
        })`,
      );

    this.highlighted = this.svg.append("g").attr("class", "highlighted");
    this.margins = this.svg.append("g").attr("class", "margin");
    if (this.sequence) {
      this.updateScaleDomain();
      this.applyZoomTranslation();
    }
  }

  override firstUpdated() {
    this.createSequence();
  }

  override zoomRefreshed() {
    this.renderD3();
  }

  renderD3() {
    this.getCharSize();

    this.svg?.attr("width", this.width).attr("height", this.height);

    if (this.#axis) {
      const ftWidth = this.getSingleBaseWidth();
      const space = ftWidth - (this.chWidth || 0);
      const half = ftWidth / 2;
      const first = Math.floor(Math.max(0, this.getStart() - 1));
      const last = Math.ceil(
        Math.min(this.sequence?.length || 0, this.getEnd()),
      );
      const bases: Array<SequenceBaseType> =
        space < 0
          ? []
          : this.sequence
              ?.slice(first, last)
              .split("")
              .map((aa, i) => ({
                position: 1 + first + i,
                aa,
              })) || [];

      // only add axis if there is room
      if (this.height > (this.chWidth || 0) && this.xScale) {
        const xAxis = axisBottom(this.xScale)
          .tickFormat((d) => `${Number.isInteger(d) ? d : ""}`)
          .ticks(this.numberOfTicks, "s");
        this.#axis.call(xAxis);
      }

      this.#axis.attr(
        "transform",
        `translate(${half},${this["margin-top"]})`,
      );
      this.#axis.select(".domain").remove();
      this.#axis.selectAll(".tick line").remove();
      this.#axis.selectAll(".tick text").attr("y", 2);

      const size = Math.max(
        10,
        this.chWidth || 10,
        Math.min(
          this["margin-top"] + 0.25 * this.getHeightWithMargins(),
          ftWidth - 2,
        ),
      );
      this.#axis.selectAll(".tick text").attr("font-size", size);

      if (this.seq_g) {
        this.seq_g.attr(
          "transform",
          `translate(0,${
            this["margin-top"] + 0.75 * this.getHeightWithMargins()
          })`,
        );
        this.#bases = this.seq_g.selectAll("text.base");

        const textElements = this.#bases.data(
          bases,
          (d) => (d as SequenceBaseType).position,
        );

        textElements
          .enter()
          .append("text")
          .attr("class", "base")
          .attr("text-anchor", "middle")
          .attr("x", (d) => this.getXFromSeqPosition(d.position) + half)
          .text((d) => d.aa)
          .attr("font-size", size)
          .style("pointer-events", "none")
          .style("font-family", "monospace");

        textElements.exit().remove();

        textElements
          .attr("font-size", size)
          .attr("x", (d) => this.getXFromSeqPosition(d.position) + half);

        if (this.#seq_bg) {
          const background = this.#seq_bg
            .selectAll("rect.base_bg")
            .data(bases, (d) => (d as SequenceBaseType).position);
          background
            .enter()
            .append("rect")
            .attr("class", "base_bg feature")
            .attr("height", this.getHeightWithMargins())
            .attr("width", ftWidth)
            .attr("fill", (d) => (Math.round(d.position) % 2 ? "#ccc" : "#eee"))
            .attr("x", (d) => this.getXFromSeqPosition(d.position))
            .attr("y", this["margin-top"])
            .style("opacity", Math.min(1, space))
            .call(bindEvents, this);

          background
            .attr("width", ftWidth)
            .attr("fill", (d) => (Math.round(d.position) % 2 ? "#ccc" : "#eee"))
            .attr("height", this.getHeightWithMargins())
            .attr("x", (d) => this.getXFromSeqPosition(d.position))
            .attr("y", this["margin-top"]);

          background.exit().remove();

          this.seq_g.style("opacity", Math.min(1, space));
          background.style("opacity", Math.min(1, space));
        }
      }

      this.updateHighlight();
      this.renderMarginOnGroup(this.margins);
    }
  }

  protected getStart(): number {
    return this["display-start"] || 1;
  }
  protected getEnd(): number {
    return (
      ((this["display-end"] || 0) > 0 ? this["display-end"] : this.length) || 0
    );
  }

  protected updateHighlight() {
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

  override render() {
    return html`<svg class="container"></svg>`;
  }
}

export default NightingaleSequence;
