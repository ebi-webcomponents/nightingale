import { PropertyValueMap, html } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { scaleSequential, Selection as d3Selection, select, EnterElement } from "d3";
import { Heatmap } from "heatmap-component";
import { Class as HeatmapClassNames } from "heatmap-component/lib/heatmap-component/class-names";
import {
  Box,
  scaleDistance,
} from "heatmap-component/lib/heatmap-component/scales";

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
import { SegmentType } from "@nightingale-elements/nightingale-new-core/dist/utils/Region";

import heatmapStyleSheet from "./heatmap-component.css";
import { State } from "heatmap-component/lib/heatmap-component/state";
import { MarkerExtensionParams } from "heatmap-component/lib/heatmap-component/extensions/marker";


const ALPHAMISSENSE_BLUE = "#3d5493";
const ALPHAMISSENSE_RED = "#9a131a";

interface HeatmapData {
  xValue: number;
  yValue: string;
  score: number;
  // unknown so we are flexible to user data formats
  [key: string]: unknown;
}

const hexComponentToNumber = (hexComp: string): number => {
  return parseInt(hexComp, 16);
};

const formatDataItem = (item: unknown): string => {
  if (typeof item === "number") return item.toFixed(3);
  else return JSON.stringify(item);
};

const hexToRgb = (
  hex: string
): { r: number; g: number; b: number; a?: number } | null => {
  let result = null;
  if (hex.length === 7)
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (hex.length === 9)
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: hexComponentToNumber(result[1]),
      g: hexComponentToNumber(result[2]),
      b: hexComponentToNumber(result[3]),
      a: hex.length === 9 ? hexComponentToNumber(result[4]) : undefined,
    }
    : null;
};


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

  /**
   * Nightingale lifecycle function to update highlight (see withHighlight)
   * has to be manually triggered from render (zoomRefreshed and updated in this case)
   */
  protected updateHighlight() {
    this.triggerHeatmapHighlight();
  }

  override attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === "highlight") {
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

    // required to allow hex with alpha channel to work with fill property
    let colorString = this["highlight-color"];
    let fillValue = 0.9;

    const highlightWidth = this["hm-highlight-width"];

    const rgb = hexToRgb(this["highlight-color"]);
    if (rgb) {
      colorString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      fillValue = rgb.a
        ? parseFloat(formatDataItem(0.9 * (rgb.a / 256.0)))
        : 0.9;
    }

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
          .heatmap-marker-x {
            fill: ${colorString};
            fill-opacity: ${fillValue};
            stroke-width: ${highlightWidth};
          }
          .heatmap-marker-y {
            fill: ${colorString};
            fill-opacity: ${fillValue};
            stroke-width: ${highlightWidth};
          }
          .heatmap-svg[pointing-data] {
            cursor: default;
          }
        </style>

        <div id="container">
          <div id="${this["heatmap-id"]}" style=${styleMap(heatmapStyles)} />
        </div>`;
    } else {
      return html` <div
        id="${this["heatmap-id"]}_loading"
        style=${styleMap(loadingStyles)}
      >
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
      this.svg = select(this).select("div#container"); // necessary for WithZoom mixin to work
      this.renderHeatmap();
      this.bindHeatmapEvents();
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

    const dataMin = Math.min(...this.heatmapData!.map((datum) => datum.score));
    const dataMax = Math.max(...this.heatmapData!.map((datum) => datum.score));

    const colorScale = scaleSequential(
      [dataMin, dataMax],
      [ALPHAMISSENSE_BLUE, ALPHAMISSENSE_RED]
    );
    hm.setColor((d) => colorScale(d.score));

    hm.setTooltip((d, _x, _y, _xIndex, _yIndex) => {
      const returnHTML = `
        <b>You are at</b> <br />
        x,y: <b>${d.xValue},${d.yValue}</b><br />
        score: <b>${formatDataItem(d.score)}</b>`;
      return returnHTML;
    });
    hm.setVisualParams({ xGapPixels: 0, yGapPixels: 0 });
    this.heatmapInstance = hm;

    this.heatmapInstance.render(this["heatmap-id"]!);
    // first zoom trigger if it exists
    this.heatmapInstance.events.render.subscribe(() => {
      // console.log('render1', this.heatmapInstance?.events.resize.value)
      this.requestUpdate();
      // console.log('render2', this.heatmapInstance?.events.resize.value)
      // setTimeout(() => {
      //   // console.log('render3', this.heatmapInstance?.events.resize.value);
      //   const state = (this.heatmapInstance as any)?.state;
      //   console.log('scales: canvas', ...state.scales.canvasToWorld.x.domain(), 'world', ...state.scales.canvasToWorld.x.range(),)
      //   // this.heatmapInstance?.events.resize.next(this.heatmapInstance.events.resize.value);
      // }, 2000)
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
    // console.log('heatmap dispatchHighlight', seqPosition)
    // console.log('svg', this.svg)
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

  /**
   * Function to trigger Heatmap highlighting from Nightingale
   */
  triggerHeatmapHighlight() {
    const heatmapInstanceMarker = this.heatmapInstance?.extensions.marker;
    if (!heatmapInstanceMarker) return;

    const params = heatmapInstanceMarker?.getParams();
    const heatmapState = (this.heatmapInstance as any).state as State<unknown, unknown, unknown>;

    // support for multiple segments
    const className = HeatmapClassNames.MarkerY;
    heatmapState.dom?.svg
      .selectAll<SVGRectElement, SegmentType>("." + className)
      .data(this.highlightedRegion.segments)
      .join(
        (enter: d3Selection<EnterElement, SegmentType, any, any>) =>
          enter
            .append("rect")
            .attr("class", className)
            .attr("rx", params.markerCornerRadius)
            .attr("ry", params.markerCornerRadius)
            .attr("x", d => heatmapState.scales.worldToSvg.x(d.start - 1))
            .attr("y", heatmapState.boxes.svg.ymin)
            .attr("width", d => scaleDistance(heatmapState.scales.worldToSvg.x, Math.max(d.end - d.start + 1, 1)))
            .attr("height", Box.height(heatmapState.boxes.svg)),
        // update is basically same as enter
        (update: d3Selection<SVGRectElement, SegmentType, any, any>) =>
          update
            .attr("x", d => heatmapState.scales.worldToSvg.x(d.start - 1))
            .attr("width", d => scaleDistance(heatmapState.scales.worldToSvg.x, Math.max(d.end - d.start + 1, 1))),
        (exit: d3Selection<SVGRectElement, SegmentType, any, any>) =>
          exit.remove(),
      );
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
