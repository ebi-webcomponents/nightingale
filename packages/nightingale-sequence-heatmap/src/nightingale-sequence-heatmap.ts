import NightingaleElement, {
  customElementOnce,
  withDimensions,
  withHighlight,
  withManager,
  withMargin,
  withPosition,
  withResizable,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";
import { max, min, select, Selection } from "d3";
import { ColorScale, Heatmap } from "heatmap-component";
import { html, PropertyValueMap } from "lit";
import { styleMap } from "lit-html/directives/style-map.js";
import { property } from "lit/decorators.js";
import heatmapStyleSheet from "./heatmap-component.css";


/** Default coloring scheme (YlGn scheme from ColorBrewer) */
const DEFAULT_COLORS = "#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529".split(" ");

interface HeatmapData {
  xValue: number;
  yValue: string;
  score: number;
  // unknown so we are flexible to user data formats
  [key: string]: unknown;
}


@customElementOnce("nightingale-sequence-heatmap")
class NightingaleSequenceHeatmap extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement)))
      )
    )
  )
) {
  /**
   * Mandatory field in order for heatmap component to work properly
   */
  @property({ type: String })
  "heatmap-id"!: string;

  @property({ type: Number })
  "hm-highlight-width": number = 0;

  @property({ type: Boolean })
  "use-ctrl-to-zoom": false;

  heatmapDomainX?: number[];
  heatmapDomainY?: string[];
  heatmapData?: HeatmapData[];
  heatmapInstance?: Heatmap<number, string, HeatmapData>;
  protected highlighted?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;

  /**
   * Nightingale lifecycle function to update highlight (see withHighlight)
   * has to be manually triggered from render (zoomRefreshed and updated in this case)
   */
  protected updateHighlight() {
    if (!this.highlighted) return;

    const highlights = this.highlighted
      .selectAll<SVGRectElement, { start: number, end: number }[]>("rect")
      .data(this.highlightedRegion.segments);

    highlights
      .enter()
      .append("rect")
      .style("pointer-events", "none")
      .merge(highlights)
      .attr("fill", this["highlight-color"])
      .attr("y", 0)
      .attr("height", this.height)
      .attr("x", d => this.getXFromSeqPosition(d.start) - this["margin-left"]) // subtracting margin-left because highlights are rendered in the heatmap-component's SVG, which does not cover the margins
      .attr("width", d => Math.max(0, this.getSingleBaseWidth() * (d.end - d.start + 1)));

    highlights.exit().remove();
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === "highlight" || name === "highlight-color") {
      this.updateHighlight();
    }
    if (name === "display-start" || name === "display-end") {
      this.triggerHeatmapZoom();
    }
  }

  /**
   * Render function
   *
   * Heatmap-components styles are injected here as a typescript variable
   * (necessary to avoid changing rollup build configs)
   *
   * @returns lit-html to render for this component
   */
  override render() {
    const heatmapStyles = {
      width: this.getWidthWithMargins() + "px",
      height: this.height + "px",
      zIndex: 1,
      marginLeft: this["margin-left"] + "px",
      marginRight: this["margin-right"] + "px",
      paddingTop: this["margin-top"] + "px",
      paddingBottom: this["margin-bottom"] + "px",
    };
    const loadingStyles = {
      width: this.getWidthWithMargins() + "px",
      textAlign: "center",
    };

    if (this.heatmapData) {
      // style tag here may seem strange but see: https://lit.dev/docs/v1/lit-html/styling-templates/#rendering-in-shadow-dom
      return html` <style>
          /* Default heatmap-component CSS */
          ${heatmapStyleSheet}

          /* Nightingale CSS */
          .heatmap-tooltip-content,
          .heatmap-pinned-tooltip-content {
            line-height: 1;
          }
          .heatmap-marker-x,
          .heatmap-marker-y {
            display: none;
          }
          .heatmap-svg[pointing-data] {
            cursor: default;
          }
        </style>

        <div id="container">
          <div id="${this["heatmap-id"]}" style=${styleMap(heatmapStyles)} />
        </div>`;
    } else {
      return html` <div id="${this["heatmap-id"]}_loading" style=${styleMap(loadingStyles)}>
        ${loaderSvg}
      </div>`;
    }
  }

  /**
   * Function runs after whole lit element update cycle is done
   * Here we bind heatmap events in case a heatmap instance does not exist
   */
  override updated(
    _changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
    if (this.heatmapData && !this.heatmapInstance) {
      this.renderHeatmap();
      this.svg = select(this).select("div#container"); // necessary for WithZoom mixin to work
      this.highlighted = select(this).select("svg.heatmap-svg").append("g").classed("highlighted", true);
      this.bindHeatmapEvents();
      this.updateHighlight();
    }
  }

  /**
   * Main function accessed by the user in order to render heatmap visualization
   * @param xDomain int[]: list of 1-indexed resid ids for each residue number
   * @param yDomain string[]: list of heatmap row categories
   * @param data array of objects containing some mandatory fields: xValue (resid id), yValue (row categ) and score (float value mapped to color)
   */
  setHeatmapData(xDomain: number[], yDomain: string[], data: HeatmapData[]) {
    this.heatmapDomainX = xDomain;
    this.heatmapDomainY = yDomain;
    this.heatmapData = data;
    this.heatmapInstance?.setData({
      xDomain: xDomain,
      yDomain: yDomain,
      data: data,
      x: d => d.xValue,
      y: d => d.yValue ?? "none",
    });
    // call lit lifecycle update
    this.requestUpdate();
  }

  /**
   * Creates random data (useful for testing) base on a given
   * sequence length
   */
  createRandomFromLength() {
    const xDomain = [...Array(this["length"]).keys()].map((i) => i + 1);
    const yDomain = ["A", "B", "C"];
    const data: {
      xValue: number;
      yValue: string;
      score: number;
    }[] = [];
    for (const xVal of xDomain) {
      for (const yVal of yDomain) {
        const scoreVal = Math.random();
        data.push({
          xValue: xVal,
          yValue: yVal,
          score: scoreVal,
        });
      }
    }
    this.setHeatmapData(xDomain, yDomain, data);
  }

  /**
   * Main heatmap rendering function. Should only be triggered once
   * Necessary to bind hover and select events between Heatmap component and Nightingale
   */
  renderHeatmap() {
    const hm = Heatmap.create({
      xDomain: this.heatmapDomainX!,
      yDomain: this.heatmapDomainY!,
      data: this.heatmapData!,
      x: d => d.xValue,
      y: d => d.yValue ?? "none",
    });

    const dataMin = min(this.heatmapData?.map(d => d.score) ?? []) ?? 0;
    const dataMax = max(this.heatmapData?.map(d => d.score) ?? []) ?? 1;

    const scaleValues = DEFAULT_COLORS.map((_, i) => dataMin + (dataMax - dataMin) * i / (DEFAULT_COLORS.length - 1));
    const colorScale = ColorScale.continuous(scaleValues, DEFAULT_COLORS);
    hm.setColor((d) => colorScale(d.score));

    hm.setTooltip((d, _x, _y, _xIndex, _yIndex) => {
      const returnHTML = `
        <b>You are at</b> <br />
        x,y: <b>${d.xValue},${d.yValue}</b><br />
        score: <b>${d.score.toFixed(3)}</b>`;
      return returnHTML;
    });
    hm.setVisualParams({ xGapPixels: 0, yGapPixels: 0 });
    this.heatmapInstance = hm;

    this.heatmapInstance.render(this["heatmap-id"]!);
    // first zoom trigger if it exists
    this.heatmapInstance.events.render.subscribe(() => {
      this.requestUpdate();
    });
  }

  /**
   * Function to bind zoom and hover events between Heatmap component and Nightingale
   */
  bindHeatmapEvents() {
    if (!this.heatmapInstance) return;

    this.heatmapInstance.events.hover.subscribe((d) => {
      if (this.getAttribute("highlight-event") === "onmouseover") {
        this.dispatchHighlight(d.cell?.x);
      }
    });
    this.heatmapInstance.events.select.subscribe((d) => {
      if (this.getAttribute("highlight-event") === "onclick") {
        this.dispatchHighlight(d.cell?.x);
      }
    });
  }

  private dispatchHighlight(seqPosition: number | undefined) {
    // Data to send to nightingale can be null if pointer is outside boundaries
    const highlight = seqPosition !== undefined ? `${seqPosition}:${seqPosition}` : null;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { type: "highlight", value: highlight },
        bubbles: true,
        cancelable: true,
      })
    );
  }

  /**
   * Function to trigger Heatmap zooming from Nightingale
   */
  triggerHeatmapZoom() {
    const toStart = this["display-start"]!;
    const toEnd = this["display-end"]! + 1;
    if (this.heatmapInstance) {
      this.heatmapInstance.zoom({
        xMin: toStart,
        xMax: toEnd,
      });
    }
  }
}
export default NightingaleSequenceHeatmap;


const loaderSvg = html`
  <svg
    width="200px"
    height="200px"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style="background: none;"
  >
    <circle cx="75" cy="50" fill="#363a3c" r="6.39718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.875s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="67.678" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.75s"
      ></animate>
    </circle>
    <circle cx="50" cy="75" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.625s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="67.678" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.5s"
      ></animate>
    </circle>
    <circle cx="25" cy="50" fill="#363a3c" r="4.8">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.375s"
      ></animate>
    </circle>
    <circle cx="32.322" cy="32.322" fill="#363a3c" r="4.80282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.25s"
      ></animate>
    </circle>
    <circle cx="50" cy="25" fill="#363a3c" r="6.40282">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="-0.125s"
      ></animate>
    </circle>
    <circle cx="67.678" cy="32.322" fill="#363a3c" r="7.99718">
      <animate
        attributeName="r"
        values="4.8;4.8;8;4.8;4.8"
        times="0;0.1;0.2;0.3;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0s"
      ></animate>
    </circle>
  </svg>
`;
