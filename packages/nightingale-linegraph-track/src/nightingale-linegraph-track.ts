import { customElement, property } from "lit/decorators.js";
import { html } from "lit";
import {
  scaleLinear,
  ScaleLinear,
  select,
  Selection,
  line,
  area,
  max,
  min,
  interpolateRainbow,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveMonotoneY,
  curveBasis,
  curveCardinal,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  curveNatural,
  CurveFactory,
  Area,
  Line,
  pointer as d3Mouse,
} from "d3";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withHighlight,
  withManager,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";

const curves: { [x: string]: CurveFactory } = {
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveMonotoneY,
  curveBasis,
  curveCardinal,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  curveNatural,
};

type LineValue = {
  position: number;
  value: number;
};
type LineData = {
  name: string;
  range: number[];
  color?: string; // (color will be assigned if not provided. Use "none" for no line color)
  fill?: string; //Create area plot using given fill color (default "none"),
  lineCurve?: keyof typeof curves; // See https://github.com/d3/d3-shape/#curves
  values: Array<LineValue>;
};

@customElement("nightingale-linegraph-track")
class NightingaleLinegraphTrack extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement)))
      )
    )
  )
) {
  @property({ type: String })
  type?: string | null;

  yScale?: ScaleLinear<number, number>;
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
  #chart?: Selection<
    SVGGElement,
    LineData,
    HTMLElement | SVGElement | null,
    unknown
  >;
  #data?: Array<LineData>;
  #minRange?: number;
  #maxRange?: number;

  constructor() {
    super();
    this.yScale = scaleLinear();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.#data) this.createTrack();
  }

  set data(data: LineData[] | undefined) {
    this.#data = data;
    this.createTrack();
  }

  get data() {
    return this.#data;
  }

  protected createTrack() {
    if (!this.#data) {
      return;
    }

    this.svg?.selectAll("g").remove();

    this.svg = select(this as unknown as NightingaleElement)
      .selectAll<SVGSVGElement, unknown>("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    if (!this.svg) return;

    this.#highlighted = this.svg.append("g").attr("class", "highlighted");
    this.#margins = this.svg.append("g").attr("class", "margin");

    const range: number[] = [];
    const minimum: number[] = [];
    const maximum: number[] = [];
    this.#data.forEach((d) => {
      range.push(...d.range);
      minimum.push(min(d.values, (v: LineValue) => v.position) || Infinity);
      maximum.push(max(d.values, (v: LineValue) => v.position) || -Infinity);
    });
    this.#minRange = min(range) || 0;
    this.#maxRange = max(range) || 0;

    const beginning = min(minimum) || 0;
    const end = max(maximum) || this.length || 0;

    // Create the visualisation here
    const chartGroup = this.svg.append("g").attr("class", "chart-group");
    this._initYScale();

    this.#chart = chartGroup
      .selectAll(".chart")
      .data(this.#data)
      .enter()
      .append("g")
      .attr("class", "chart");

    this.#chart
      .append("path")
      .attr("class", "graph")
      .attr("id", (d) => d.name)
      .attr("d", (d) => {
        d.color = d.color || interpolateRainbow(Math.random());
        // eslint-disable-next-line no-param-reassign
        d.fill = d.fill || "none";
        return this.drawLine(d)(d.values);
      })
      .attr("fill", (d) => d.fill || null)
      .attr("stroke", (d) => d.color || null)
      .attr("transform", "translate(0,0)");

    const mouseG = chartGroup.append("g").attr("class", "mouse-over-effects");

    const lines = chartGroup.selectAll<SVGPathElement, LineData>("path.graph");

    const mousePerLine = mouseG
      .selectAll(".mouse-per-line")
      .data(this.#data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine
      .append("circle")
      .attr("r", 7)
      .style("stroke", (d) => d.color || null)
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text").attr("transform", "translate(10,3)");

    mouseG
      .append("rect") // append a rect to catch mouse movements on canvas
      .attr("width", this.width) // can't catch mouse events on a g element
      .attr("height", this.height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", () => {
        // on mouse out hide circles and text
        chartGroup.selectAll(".mouse-per-line circle").style("opacity", "0");
        chartGroup.selectAll(".mouse-per-line text").style("opacity", "0");
      })
      .on("mousemove", (event) => {
        // mouse moving over canvas
        const mouse = d3Mouse(event);

        // Showing the circle and text only when the mouse is moving over the paths
        if (
          mouse[0] < (this.xScale?.(beginning) || 0) ||
          mouse[0] > (this.xScale?.(end) || 0) + this.getSingleBaseWidth()
        ) {
          chartGroup.selectAll(".mouse-per-line circle").style("opacity", "0");
          chartGroup.selectAll(".mouse-per-line text").style("opacity", "0");
        } else {
          const features: Record<string, LineValue | undefined> = {};
          const seqPosition = Math.floor(this.xScale?.invert(mouse[0]) || 0);

          chartGroup
            .selectAll<SVGCircleElement, LineData>(".mouse-per-line circle")
            .style("opacity", (d) => {
              // In case there is a gap or break in the graph, circle and text are not shown
              const value = d.values.find((v) => v.position === seqPosition);
              if (value) {
                return value.value ? "1" : "0";
              }
              return "0";
            });
          chartGroup.selectAll(".mouse-per-line text").style("opacity", "1");

          chartGroup
            .selectAll<SVGTextContentElement, LineData>(".mouse-per-line text")
            .text((d) => {
              const value = d.values.find((v) => v.position === seqPosition);
              features[d.name] = value;
              return value ? value.value : "";
            });

          chartGroup
            .selectAll<SVGGElement, LineData>(".mouse-per-line")
            .attr("transform", (d, i) => {
              let beginning = 0;
              let end = lines.nodes()[i].getTotalLength();
              let pos: DOMPoint;
              /*
             Finding the nearest point in the path to the mouse pointer using iterative dichotomy.
             Example can be found here - https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
             */
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const target = Math.floor((beginning + end) / 2);
                pos = lines.nodes()[i].getPointAtLength(target);
                if (
                  (target === end || target === beginning) &&
                  pos.x !== mouse[0]
                ) {
                  break;
                }
                if (pos.x > mouse[0]) end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; // position found
              }
              return `translate(${mouse[0]},${pos?.y || 0})`;
            });

          const detail = {
            eventtype: "mouseover",
            feature: features,
            highlight: `${seqPosition}:${seqPosition}`,
            type: this.type,
            target: this,
          };
          this.dispatchEvent(
            new CustomEvent("change", {
              detail,
              bubbles: true,
              cancelable: true,
            })
          );
        }
      });
  }

  refresh() {
    if (this.#chart) {
      this.#chart
        .selectAll<SVGPathElement, LineData>("path.graph")
        .attr("d", (d) => this.drawLine(d)(d.values));

      this.svg?.attr("width", this.width);

      this.updateHighlight();

      this.renderMarginOnGroup(this.#margins);
    }
  }

  _initYScale() {
    this.yScale
      ?.domain([this.#minRange || 0, this.#maxRange || 0])
      .range([this.height, 0]);
  }

  drawLine(d: LineData): Area<LineValue> | Line<LineValue> {
    const curve = d.lineCurve || "curveLinear";

    let graph;
    if (d.fill !== "none") {
      graph = area<LineValue>()
        .y1((d) => this.yScale?.(d.value) || 0)
        .y0(() => this.yScale?.(0) || 0);
    } else {
      graph = line<LineValue>().y((d) => this.yScale?.(d.value) || 0);
    }

    return graph
      .defined((d) => d.value !== null) // To have gaps in the line graph
      .x(
        (d) =>
          this.getXFromSeqPosition(d.position + 1) -
          this.getSingleBaseWidth() / 2
      )
      .curve(curves[curve] || curveLinear);
  }

  protected updateHighlight() {
    if (!this.#highlighted) return;
    const highlighs = this.#highlighted
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
      .attr("width", (d) => this.getSingleBaseWidth() * (d.end - d.start + 1));

    highlighs.exit().remove();
  }

  zoomRefreshed() {
    this.refresh();
  }

  firstUpdated() {
    this.createTrack();
  }

  render() {
    return html`<svg class="container"></svg>`;
  }
}

export default NightingaleLinegraphTrack;
