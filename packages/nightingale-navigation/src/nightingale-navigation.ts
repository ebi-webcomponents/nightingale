import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  scaleLinear,
  ScaleLinear,
  Selection,
  axisBottom,
  Axis,
  brushX,
  BrushBehavior,
  format,
  select,
  // event as d3Event,
} from "d3";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withManager,
} from "@nightingale-elements/nightingale-new-core";

@customElement("nightingale-navigation")
class NightingaleNavigation extends withManager(
  withResizable(withMargin(withPosition(withDimensions(NightingaleElement))))
) {
  #x: ScaleLinear<any, any> | null;
  #dontDispatch: boolean;
  #container?: Selection<HTMLElement, any, any, any>;
  #svg?: Selection<SVGSVGElement, any, any, any>;
  #displaystartLabel?: Selection<SVGTextElement, any, any, any>;
  #displayendLabel?: Selection<SVGTextElement, any, any, any>;
  #axis?: Selection<SVGGElement, any, any, any>;
  #brushG?: Selection<SVGGElement, any, any, any>;
  #polygon?: Selection<SVGPolygonElement, any, any, any>;
  #xAxis?: Axis<any>;
  #viewport?: BrushBehavior<unknown>;

  @property({ type: Number })
  rulerstart: number = 1;
  @property({ type: Number })
  padding: number = 10;

  constructor() {
    super();
    this.#x = null;
    this.#dontDispatch = false;
  }
  createRenderRoot() {
    return this;
  }

  private createNavRuler() {
    this.#x = scaleLinear().range([this.padding, this.width - this.padding]);
    this.#x.domain([this.rulerstart, this.rulerstart + (this.length || 0) - 1]);

    this.#container = select(this).select("div");

    this.#svg = this.#container
      .append("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this.height);

    this.#xAxis = axisBottom(this.#x);

    this.#displaystartLabel = this.#svg
      .append("text")
      .attr("class", "start-label")
      .attr("x", 0)
      .attr("y", this.height - this.padding);

    this.#displayendLabel = this.#svg
      .append("text")
      .attr("class", "end-label")
      .attr("x", this.width)
      .attr("y", this.height - this.padding)
      .attr("text-anchor", "end");

    this.#axis = this.#svg
      .append("g")
      .attr("class", "x axis")
      .call(this.#xAxis);

    this.#viewport = brushX()
      .extent([
        [this.padding, 0],
        [this.width - this.padding, this.height * 0.51],
      ])
      .on("brush", ({ selection, transform }) => {
        if (selection && this.#x) {
          this.displaystart =
            Math.round(this.#x.invert(selection[0]) * 100) / 100;
          this.displayend =
            Math.round(this.#x.invert(selection[1]) * 100) / 100;
          if (!this.#dontDispatch)
            this.dispatchEvent(
              new CustomEvent("change", {
                detail: {
                  displayend: Math.round(this.displayend),
                  displaystart: Math.round(this.displaystart),
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
    this.renderD3();
  }

  onWidthChange() {
    if (!this.#x) return;
    this.#x.range([this.padding, this.width - this.padding]);
    this.#svg?.attr("width", this.width);
    this.#viewport?.extent([
      [this.padding, 0],
      [this.width - this.padding, this.height * 0.51],
    ]);
    if (this.#viewport) this.#brushG?.call(this.#viewport);
  }

  render() {
    return html`<div class="container" />`;
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
    if (
      this.#x &&
      this.#container &&
      this.#axis &&
      this.#xAxis &&
      this.#viewport
    ) {
      this.#container
        .style("padding-left", `${this["margin-left"]}px`)
        .style("padding-right", `${this["margin-right"]}px`)
        .style("padding-top", `${this["margin-top"]}px`)
        .style("padding-bottom", `${this["margin-bottom"]}px`);
      this.#x.domain([
        this.rulerstart,
        this.rulerstart + (this.length || 0) - 1,
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
    }
  }

  private updateLabels() {
    if (this.#displaystartLabel)
      this.#displaystartLabel.text(Math.round(this.getStart()));
    if (this.#displayendLabel)
      this.#displayendLabel
        .attr("x", this.width)
        .text(Math.round(this.getEnd()));
  }

  private updatePolygon() {
    if (this.#polygon && this.#x)
      this.#polygon.attr(
        "points",
        `${this.#x(this.getStart())},${this.height / 2}
        ${this.#x(this.getEnd())},${this.height / 2}
        ${this.width},${this.height}
        0,${this.height}`
      );
  }
  private getStart(): number {
    return this.displaystart || 0;
  }
  private getEnd(): number {
    return this.displayend || this.length || 0;
  }
}

export default NightingaleNavigation;
