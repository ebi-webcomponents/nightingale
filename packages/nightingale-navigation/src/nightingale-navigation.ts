import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  scaleLinear,
  ScaleLinear,
  Selection,
  axisBottom,
  Axis,
  brushX,
  BrushBehavior,
  select,
  NumberValue,
} from "d3";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withManager,
  withHighlight,
} from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-navigation")
class NightingaleNavigation extends withManager(
  withResizable(
    withMargin(withPosition(withDimensions(withHighlight(NightingaleElement))))
  )
) {
  #x: ScaleLinear<number, number> | null;
  #dontDispatch: boolean;
  #svg?: Selection<SVGSVGElement, unknown, HTMLElement | null, unknown>;
  #displaystartLabel?: Selection<
    SVGTextElement,
    unknown,
    HTMLElement | null,
    unknown
  >;
  #displayendLabel?: Selection<
    SVGTextElement,
    unknown,
    HTMLElement | null,
    unknown
  >;
  #axis?: Selection<SVGGElement, unknown, HTMLElement | null, unknown>;
  #brushG?: Selection<SVGGElement, unknown, HTMLElement | null, unknown>;
  #polygon?: Selection<SVGPolygonElement, unknown, HTMLElement | null, unknown>;
  #xAxis?: Axis<NumberValue>;
  #viewport?: BrushBehavior<unknown>;
  #highlighted?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #margins?: Selection<
    SVGGElement,
    unknown,
    HTMLElement | SVGElement | null,
    unknown
  >;

  @property({ type: Number })
  rulerstart = 1;
  @property({ type: Boolean })
  "show-highlight" = false;

  constructor() {
    super();
    this.#x = null;
    this.#dontDispatch = false;
  }

  private createNavRuler() {
    this.#x = scaleLinear()
      .range([this["margin-left"], this.width - this["margin-right"]])
      .domain([this.rulerstart, this.rulerstart + (this.length || 1)]);
    this.#svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this.height);

    this.#xAxis = axisBottom(this.#x);

    this.#displaystartLabel = this.#svg
      .append("text")
      .attr("class", "start-label")
      .attr("x", this["margin-left"])
      .attr("y", this.height - this["margin-bottom"] - 2)
      .style("font-family", "sans-serif")
      .style("font-size", 12);

    this.#displayendLabel = this.#svg
      .append("text")
      .attr("class", "end-label")
      .attr("x", this.width - this["margin-right"])
      .attr("y", this.height - this["margin-bottom"] - 2)
      .attr("text-anchor", "end")
      .style("font-family", "sans-serif")
      .style("font-size", 12);

    this.#axis = this.#svg
      .append("g")
      .attr("class", "x axis")
      .call(this.#xAxis);

    this.#viewport = brushX()
      .extent([
        [this["margin-left"], 0],
        [this.width - this["margin-right"], this.height * 0.51],
      ])
      .on("brush", ({ selection, transform }) => {
        if (selection && this.#x) {
          this["display-start"] =
            Math.round(this.#x.invert(selection[0]) * 100) / 100;
          this["display-end"] =
            Math.round(this.#x.invert(selection[1]) * 100) / 100;
          if (!this.#dontDispatch)
            this.dispatchEvent(
              new CustomEvent("change", {
                detail: {
                  "display-end": this["display-end"],
                  "display-start": this["display-start"],
                  extra: { transform },
                },
                bubbles: true,
                cancelable: true,
              })
            );
          this.updateLabels();
          this.updatePolygon();
        }
      });

    this.#brushG = this.#svg
      .append("g")
      .attr("class", "brush")
      .call(this.#viewport);

    this.#brushG.call(this.#viewport.move, [
      this.#x(this.getStart()),
      this.#x(this.getEnd()),
    ]);

    this.#polygon = this.#svg
      .append("polygon")
      .attr("class", "zoom-polygon")
      .attr("fill", "#777")
      .attr("fill-opacity", "0.3");

    this.#margins = this.#svg.append("g").attr("class", "margin");
    this.createHighlight();
    this.renderD3();
  }
  private createHighlight() {
    if (!this.#svg) return;
    this.#highlighted = this.#svg.append("g").attr("class", "highlighted");
    this.updateHighlight();
  }

  onWidthChange() {
    if (!this.#x) return;
    this.#x.range([this["margin-left"], this.width - this["margin-right"]]);
    this.#svg?.attr("width", this.width);
    this.#viewport?.extent([
      [this["margin-left"], 0],
      [this.width - this["margin-right"], this.height * 0.51],
    ]);
    if (this.#viewport) this.#brushG?.call(this.#viewport);
  }

  render() {
    return html`<svg class="container"></svg>`;
  }
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("width")) {
      this.onWidthChange();
    }
    this.renderD3();
    super.updated(changedProperties);
  }

  firstUpdated() {
    this.createNavRuler();
  }
  renderD3() {
    if (this.#x && this.#axis && this.#xAxis && this.#viewport) {
      this.#x.domain([
        this.rulerstart,
        this.rulerstart + (this.length || 1) - 1,
      ]);
      this.#axis.call(this.#xAxis);
      this.updatePolygon();
      this.updateLabels();
      if (this.#brushG) {
        this.#dontDispatch = true;
        this.#brushG.call(this.#viewport.move, [
          this.#x(this.getStart()),
          this.#x(this.getEnd()),
        ]);
        this.#dontDispatch = false;
      }
      this.updateHighlight();
      this.renderMarginOnGroup(this.#margins);
    }
  }
  private updateHighlight() {
    if (!this.#highlighted) return;
    // Scale to match the range of the tracks [1,length+1]
    const s1 = scaleLinear()
      .domain([
        this["display-start"] || 1,
        (this["display-end"] || this.length || 1) + 1,
      ])
      .range([this["margin-left"], this.width - this["margin-right"]]);

    // Scale to match the range of the navigation brush [1,length]
    const s2 = scaleLinear()
      .domain([this.rulerstart, this.rulerstart + (this.length || 1)])
      .range([this["margin-left"], this.width - this["margin-right"]]);

    // Highlight Polygon
    const highlighs = this.#highlighted
      .selectAll<
        SVGPolygonElement,
        {
          start: number;
          end: number;
        }[]
      >("polygon")
      .data(this["show-highlight"] ? this.highlightedRegion.segments : []);

    highlighs
      .enter()
      .append("polygon")
      .attr("class", "highlight-polygon")
      .style("pointer-events", "none")
      .merge(highlighs)
      .attr("fill", this["highlight-color"])
      .attr("points", (segment) => {
        const start = Math.max(1, segment.start);
        const end = Math.min(this.length || 1, segment.end) + 1;
        return `${s2(start)},${this.height / 2}
        ${s2(end)},${this.height / 2}
        ${s1(end)},${this.height}
        ${s1(start)},${this.height}`;
      });

    highlighs.exit().remove();
    const highlighsRect = this.#highlighted
      .selectAll<
        SVGRectElement,
        {
          start: number;
          end: number;
        }[]
      >("rect")
      .data(this["show-highlight"] ? this.highlightedRegion.segments : []);

    // Highlight Rectangle
    highlighsRect
      .enter()
      .append("rect")
      .attr("class", "highlight-rectangle")
      .style("pointer-events", "none")
      .merge(highlighsRect)
      .attr("fill", this["highlight-color"])
      .attr("x", (segment) => s2(Math.max(1, segment.start)))
      .attr(
        "width",
        (segment) =>
          s2(Math.min(this.length || 1, segment.end) + 1) -
          s2(Math.max(1, segment.start))
      )
      .attr("y", this["margin-top"])
      .attr("height", this.height / 2);

    highlighsRect.exit().remove();
  }
  private updateLabels() {
    if (this.#displaystartLabel)
      this.#displaystartLabel
        .attr("x", this["margin-left"])
        .text(Math.round(this.getStart()));
    if (this.#displayendLabel)
      this.#displayendLabel
        .attr("x", this.width - this["margin-right"])
        .text(Math.round(this.getEnd()));
  }

  private updatePolygon() {
    if (this.#polygon && this.#x)
      this.#polygon.attr(
        "points",
        `${this.#x(this.getStart())},${this.height / 2}
        ${this.#x(this.getEnd())},${this.height / 2}
        ${this.width - this["margin-right"]},${this.height}
        ${this["margin-left"]},${this.height}`
      );
  }
  private getStart(): number {
    return this["display-start"] || 1;
  }
  private getEnd(): number {
    return (
      ((this["display-end"] || 0) > 0 ? this["display-end"] : this.length) || 1
    );
  }
}

export default NightingaleNavigation;
