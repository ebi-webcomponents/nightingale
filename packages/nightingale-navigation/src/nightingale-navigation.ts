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
  BrushSelection,
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

const HANDLE_WIDTH = 20;

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
  #handleLeft?: Selection<
    SVGPolygonElement,
    unknown,
    HTMLElement | null,
    unknown
  >;
  #handleRight?: Selection<
    SVGPolygonElement,
    unknown,
    HTMLElement | null,
    unknown
  >;
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
  #currentSelection: BrushSelection | null = null;

  @property({ type: Number })
  "ruler-start"?: number = 1;
  @property({ type: Number })
  "ruler-padding"?: number = 10;
  @property({ type: Number })
  "scale-factor"?: number = (this.length || 0) / 5 || 10;
  @property({ type: Boolean })
  "show-highlight"?: boolean = false;
  @property({ type: String })
  "handles"?: "rectangle" | "arrows" = "rectangle";

  constructor() {
    super();
    this.#x = null;
    this.#dontDispatch = false;
  }

  private createNavRuler() {
    const limit =
      this.width - this["margin-right"] - (this["ruler-padding"] as number);
    this.#x = scaleLinear()
      .range([this["margin-left"] + (this["ruler-padding"] as number), limit])
      .domain([
        this["ruler-start"] as number,
        (this["ruler-start"] as number) + (this.length || 1),
      ]);
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
        [this["margin-left"] + (this["ruler-padding"] as number), 0],
        [limit, this.height * 0.5],
      ])
      .handleSize(HANDLE_WIDTH)
      .on("end", ({ selection }) => {
        // In case is a click outside the brush, reset brush to previous position
        if (
          selection === null &&
          this.#currentSelection &&
          this.#brushG &&
          this.#viewport
        ) {
          this.#brushG.call(this.#viewport.move, this.#currentSelection);
        }
      })
      .on("brush", ({ selection, transform }) => {
        if (selection && this.#x) {
          this.#currentSelection = selection;
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
          this.updateHandles();
        }
      });

    this.#polygon = this.#svg
      .append("polygon")
      .attr("class", "zoom-polygon")
      .attr("fill", "#777")
      .attr("fill-opacity", "0.3");

    this.#brushG = this.#svg.append("g").attr("class", "brush");

    if (limit > 0) {
      // Section to add arrows to handles
      const arrowWidth = HANDLE_WIDTH;
      const arrowHeight = 0.75 * arrowWidth;

      this.#handleLeft = this.#brushG.append("polygon");
      this.#handleRight = this.#brushG.append("polygon");

      for (const [handle, side] of [
        [this.#handleLeft, "left"],
        [this.#handleRight, "right"],
      ] as const) {
        handle
          .attr("class", `custom-handle handle-${side}`)
          .attr("stroke", "#fff")
          .attr("fill", "#000")
          // Draws a ↔
          .attr(
            "points",
            `${-arrowWidth / 2} ${this.height / 4}
          ${-arrowWidth / 5} ${this.height / 4 - arrowHeight / 2}
          ${-arrowWidth / 5} ${this.height / 4 - arrowHeight / 6}
          ${arrowWidth / 5} ${this.height / 4 - arrowHeight / 6}
          ${arrowWidth / 5} ${this.height / 4 - arrowHeight / 2}
          ${arrowWidth / 2} ${this.height / 4}
          ${arrowWidth / 5} ${this.height / 4 + arrowHeight / 2}
          ${arrowWidth / 5} ${this.height / 4 + arrowHeight / 6}
          ${-arrowWidth / 5} ${this.height / 4 + arrowHeight / 6}
          ${-arrowWidth / 4} ${this.height / 4 + arrowHeight / 2}`
          );
      }
      // End of section to add arrows to handles

      this.#brushG.call(this.#viewport);

      this.#brushG.call(this.#viewport.move, [
        this.#x(this.getStart()),
        this.#x(this.getEnd()),
      ]);

      // Hides the D3 native brush area, as we'll use our own this.#polygon
      this.#brushG.select(".selection").attr("opacity", "0");
    }

    this.#margins = this.#svg.append("g").attr("class", "margin");
    this.createHighlight();
    this.renderD3();
  }
  private createHighlight() {
    if (!this.#svg) return;
    this.#highlighted = this.#svg.append("g").attr("class", "highlighted");
    this.updateHighlight();
  }

  onDimensionsChange() {
    if (!this.#x) return;
    this.#x.range([
      this["margin-left"] + (this["ruler-padding"] as number),
      this.width - this["margin-right"] - (this["ruler-padding"] as number),
    ]);
    this.#svg?.attr("width", this.width);
    this.#svg?.attr("height", this.height);
    this.#viewport?.extent([
      [this["margin-left"] + (this["ruler-padding"] as number), 0],
      [
        this.width - this["margin-right"] - (this["ruler-padding"] as number),
        this.height * 0.5 + HANDLE_WIDTH / 2,
      ],
    ]);
    if (this.#viewport) this.#brushG?.call(this.#viewport);
  }

  render() {
    return html`<svg class="container"></svg>`;
  }
  updated(changedProperties: Map<string, unknown>) {
    this.renderD3();
    super.updated(changedProperties);
  }

  firstUpdated() {
    this.createNavRuler();
  }
  renderD3() {
    if (this.#x && this.#axis && this.#xAxis && this.#viewport) {
      this.#x.domain([
        this["ruler-start"] as number,
        (this["ruler-start"] as number) + (this.length || 1) - 1,
      ]);
      this.#axis.call(this.#xAxis);
      this.updatePolygon();
      this.updateLabels();
      const position: BrushSelection = [
        this.#x(this.getStart()),
        this.#x(this.getEnd()),
      ];
      if (this.#brushG && position[0] >= 0 && position[1] >= 0) {
        this.#dontDispatch = true;
        this.#brushG.call(this.#viewport.move, position);
        this.#dontDispatch = false;
      }
      this.updateHighlight();
      this.renderMarginOnGroup(this.#margins);
    }
  }

  locate(start: number, end: number) {
    if (this.#brushG && this.#viewport && this.#x)
      this.#brushG.call(this.#viewport.move, [this.#x(start), this.#x(end)]);
  }
  zoomOut() {
    this.locate(
      Math.max(
        (this["ruler-start"] as number) || 1,
        this.getStart() - (this["scale-factor"] as number)
      ),
      Math.min(
        (this.length || 1) + (this["ruler-start"] as number) - 1,
        this.getEnd() + (this["scale-factor"] as number)
      )
    );
  }
  zoomIn() {
    const newStart = Math.min(
      this.getStart() + (this["scale-factor"] as number),
      this.getEnd() - 1
    );
    this.locate(
      newStart,
      Math.max(this.getEnd() - (this["scale-factor"] as number), newStart + 1)
    );
  }
  protected updateHighlight() {
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
      .domain([
        this["ruler-start"] as number,
        (this["ruler-start"] as number) + (this.length || 1),
      ])
      .range([
        this["margin-left"] + (this["ruler-padding"] as number),
        this.width - this["margin-right"] - (this["ruler-padding"] as number),
      ]);

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
    if (this.#polygon && this.#x) {
      const start = this.#x(this.getStart());
      const end = this.#x(this.getEnd());
      /**
       * Draws a polygon showing the zoom area in the overview with respect to
       * the visible area in the visualisation below
       *     ╭────╮
       *     │    │
       *    ╱     │
       *   ╱      │
       *  ╱       │
       * ╰────────╯
       */
      this.#polygon.attr(
        "points",
        `${start},${this.height / 2}
        ${start},0
        ${end},0
        ${end},${this.height / 2}
        ${this.width - this["margin-right"]},${this.height}
        ${this["margin-left"]},${this.height}`
      );
    }
  }

  private updateHandles() {
    if (this.#handleLeft && this.#handleRight && this.#x) {
      this.#handleLeft.attr(
        "transform",
        `translate(${this.#x(this.getStart())})`
      );
      this.#handleRight.attr(
        "transform",
        `translate(${this.#x(this.getEnd())})`
      );
    }
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
