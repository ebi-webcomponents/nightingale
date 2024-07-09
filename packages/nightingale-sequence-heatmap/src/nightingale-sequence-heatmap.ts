import { PropertyValueMap, html } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import heatmapStyleSheet from "./heatmap-component.css";

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
import { Heatmap } from "heatmap-component";
import {
  interpolateYlOrRd,
  scaleSequential,
  Selection as d3Selection,
} from "d3";
import { Class as HeatmapClassNames } from "heatmap-component/lib/heatmap-component/class-names";
import {
  Box,
  scaleDistance,
} from "heatmap-component/lib/heatmap-component/scales";
import { SegmentType } from "@nightingale-elements/nightingale-new-core/dist/utils/Region";

interface HotmapData {
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
  hex: string,
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
        withPosition(withDimensions(withHighlight(NightingaleElement))),
      ),
    ),
  ),
) {
  /**
   * Mandatory field in order for heatmap component to work properly
   */
  @property({ type: String })
  "heatmap-id"!: string;

  @property({ type: Number })
  "hm-highlight-width": number = 0;

  heatmapDomainX?: number[];
  heatmapDomainY?: string[];
  heatmapData?: HotmapData[];
  heatmapInstance?: Heatmap<number, string, HotmapData>;
  firstZoom = false;

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Nightingale lifecycle function that runs before zoomRefreshed
   * needs to be overriden so zoomRefreshed works since it's svg coupled
   * (see withZoom)
   */
  applyZoomTranslation() {
    this.zoomRefreshed();
  }

  /**
   * Nightingale lifecycle function to update zooming (see withZoom)
   */
  zoomRefreshed() {
    this.triggerHeatmapZoom();
    this.updateHighlight();
  }

  /**
   * Nightingale lifecycle function to update highlight (see withHighlight)
   * has to be manually triggered from render (zoomRefreshed and updated in this case)
   */
  protected updateHighlight() {
    this.triggerHeatmapHighlight();
  }

  /**
   * Render function
   *
   * Heatmap-components styles are injected here as a typescript variable
   * (necessary to avoid changing rollup build configs)
   *
   * @returns lit-html to render for this component
   */
  render() {
    const mainStyles = {
      width: this.width + "px",
      paddingLeft: this["margin-left"] + "px",
      paddingRight: this["margin-right"] + "px",
      paddingTop: this["margin-top"] + "px",
      paddingBottom: this["margin-bottom"] + "px",
    };
    const heatmapStyles = {
      width: this.width - this["margin-left"] - this["margin-right"] + "px",
      height: this.height + "px",
      zIndex: 1,
    };
    const loadingStyles = {
      width: this.width - 20 + "px",
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
      return html`
        <style>
          #${this["heatmap-id"]} {
            /** Position of bottom-left corner of tooltip box relative to the mouse position */
            --tooltip-offset-x: 5px;
            /** Position of bottom-left corner of tooltip box relative to the mouse position */
            --tooltip-offset-y: 8px;
          }
          .heatmap-marker-x {
            fill: ${colorString} !important;
            fill-opacity: ${fillValue} !important;
            stroke-width: ${highlightWidth} !important;
          }
          .heatmap-marker-y {
            fill: ${colorString} !important;
            fill-opacity: ${fillValue} !important;
            stroke-width: ${highlightWidth} !important;
          }
          ${heatmapStyleSheet}
        </style>

        <div class="container" style=${styleMap(mainStyles)}">
          <div id="${this["heatmap-id"]}" style=${styleMap(
            heatmapStyles,
          )}"></div>
        </div>`;
    } else {
      return html`
        <div id="${this["heatmap-id"]}_loading" style=${styleMap(
          loadingStyles,
        )}">
          <svg width="200px" height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;">
            <circle cx="75" cy="50" fill="#363a3c" r="6.39718">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.875s"></animate>
            </circle>
            <circle cx="67.678" cy="67.678" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.75s"></animate>
            </circle>
            <circle cx="50" cy="75" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.625s"></animate>
            </circle>
            <circle cx="32.322" cy="67.678" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.5s"></animate>
            </circle>
            <circle cx="25" cy="50" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.375s"></animate>
            </circle>
            <circle cx="32.322" cy="32.322" fill="#363a3c" r="4.80282">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.25s"></animate>
            </circle>
            <circle cx="50" cy="25" fill="#363a3c" r="6.40282">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.125s"></animate>
            </circle>
            <circle cx="67.678" cy="32.322" fill="#363a3c" r="7.99718">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="0s"></animate>
            </circle>
          </svg>
        </div>`;
    }
  }

  /**
   * Function runs after whole lit element update cycle is done
   * Here we bind heatmap events in case a heatmap instance does not exist
   */
  updated(
    _changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>,
  ): void {
    if (this.heatmapData && !this.heatmapInstance) {
      this.renderHeatmap();
      this.bindHeatmapEvents();
    }
    // Manual first trigger of highlight in case property is preset on component
    this.applyZoomTranslation();
  }

  /**
   * Main function accessed by the user in order to render heatmap visualization
   * @param xDomain int[]: list of 1-indexed resid ids for each residue number
   * @param yDomain string[]: list of heatmap row categories
   * @param data array of objects containing some mandatory fields: xValue (resid id), yValue (row categ) and score (float value mapped to color)
   */
  setHeatmapData(xDomain: number[], yDomain: string[], data: HotmapData[]) {
    this.heatmapDomainX = xDomain;
    this.heatmapDomainY = yDomain;
    // render heatmap if not initialized
    if (!this.heatmapData) {
      this.heatmapData = data;
    }
    // just set new data if initialized
    else {
      this.heatmapData = data;
      this.heatmapInstance!.setData({
        xDomain: xDomain,
        yDomain: yDomain,
        data: data,
        x: (d) => {
          const x = d.xValue;
          return x;
        },
        y: (d) => {
          if (d.yValue) {
            return d.yValue;
          }
          return "none";
        },
      });
    }
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
   * Necessary to bind zoom and hover events between Heatmap component and Nightingale
   */
  renderHeatmap() {
    const hm = Heatmap.create({
      xDomain: this.heatmapDomainX!,
      yDomain: this.heatmapDomainY!,
      data: this.heatmapData!,
      x: (d) => {
        const x = d.xValue;
        return x;
      },
      y: (d) => {
        if (d.yValue) {
          return d.yValue;
        }
        return "none";
      },
    });

    const dataMin = Math.min(...this.heatmapData!.map((datum) => datum.score));
    const dataMax = Math.max(...this.heatmapData!.map((datum) => datum.score));

    const colorScale = scaleSequential([dataMin, dataMax], interpolateYlOrRd);
    hm.setColor((d) => colorScale(d.score));

    hm.setTooltip((d, _x, _y, _xIndex, _yIndex) => {
      const returnHTML = `
        <b>You are at</b> <br />

        x,y: <b>${d.xValue},${d.yValue}</b><br />
        score: <b>${formatDataItem(d.score)}</b>`;
      return returnHTML;
    });
    hm.setZooming({ axis: "x" });
    hm.setVisualParams({ xGapPixels: 0, yGapPixels: 0 });
    this.heatmapInstance = hm;

    this.heatmapInstance.render(this["heatmap-id"]!);
    // first zoom trigger if it exists
    this.heatmapInstance.events.render.subscribe((_) => {
      this.requestUpdate();
    });
  }

  /**
   * Function to bind zoom and hover events between Heatmap component and Nightingale
   */
  bindHeatmapEvents() {
    if (!this.heatmapInstance) return;
    this.heatmapInstance.events.zoom.subscribe((d) => {
      // no data, stop zoom from occurring
      if (!d) return;
      // On heatmap zoom dispatch event to Nightingale
      let xDiff = d.xMin;
      // if not zoomed yet but display attr values exist
      if (!this.firstZoom && this["display-start"]) {
        xDiff = this["display-start"];
      }
      if (xDiff !== this["display-start"]) {
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              value: xDiff,
              type: "display-start",
            },
            bubbles: true,
            cancelable: true,
          }),
        );
      }
      let xMaxDiff = d.xMax - 1;
      // if not zoomed yet but display attr values exist
      if (!this.firstZoom && this["display-end"]) {
        xMaxDiff = this["display-end"];
      }
      if (xMaxDiff !== this["display-end"]) {
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              value: xMaxDiff,
              type: "display-end",
            },
            bubbles: true,
            cancelable: true,
          }),
        );
      }
      if (!this.firstZoom) {
        this.firstZoom = true;
      }
    });

    this.heatmapInstance.events.hover.subscribe((d) => {
      // data to send to nightingale can be null if hover outside boundaries
      let toSend = null;
      if (d && d.cell && d.cell.xIndex) {
        toSend = `${d.cell.xIndex + 1}:${d.cell.xIndex + 1}`;
      }
      // On heatmap zoom dispatch event to Nightingale
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: toSend,
            type: "highlight",
          },
          bubbles: true,
          cancelable: true,
        }),
      );
    });
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
    if (!this.heatmapInstance) {
      return;
    }
    // any so we can use private marker attributes
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const heatmapInstanceMarker = <any>this.heatmapInstance.extensions.marker!;

    // support for multiple segments
    const className = HeatmapClassNames.MarkerY;

    heatmapInstanceMarker.state.dom.svg
      .selectAll("." + className)
      .data(this.highlightedRegion.segments)
      .join(
        (
          enter: d3Selection<
            SVGRectElement,
            SegmentType,
            SVGElement,
            undefined
          >,
        ) =>
          enter
            .append("rect")
            .attr("class", className)
            .attr("rx", heatmapInstanceMarker.params.markerCornerRadius)
            .attr("ry", heatmapInstanceMarker.params.markerCornerRadius)
            .attr("x", (d: SegmentType) => {
              // calculate x according to worldToCanvas scale of heatmap plot
              return heatmapInstanceMarker.state.scales.worldToCanvas.x(
                d.start - 1,
              );
            })
            // y value is start of canvas
            .attr("y", heatmapInstanceMarker.state.boxes.canvas.ymin)
            .attr("width", (d: SegmentType) => {
              // calculate width according to worldToCanvas scale of heatmap plot
              // and number of residues that need to be shown
              return scaleDistance(
                heatmapInstanceMarker.state.scales.worldToCanvas.x,
                Math.max(d.end - d.start + 1, 1),
              );
            })
            // height value is canvas size
            .attr(
              "height",
              Box.height(heatmapInstanceMarker.state.boxes.canvas),
            ),
        // update is basically same as enter
        (
          update: d3Selection<
            SVGRectElement,
            SegmentType,
            SVGElement,
            undefined
          >,
        ) =>
          update
            .attr("x", (d: SegmentType) => {
              return heatmapInstanceMarker.state.scales.worldToCanvas.x(
                d.start - 1,
              );
            })
            .attr("width", (d: SegmentType) => {
              return scaleDistance(
                heatmapInstanceMarker.state.scales.worldToCanvas.x,
                Math.max(d.end - d.start + 1, 1),
              );
            }),
        (
          exit: d3Selection<SVGRectElement, SegmentType, SVGElement, undefined>,
        ) => exit.remove(),
      );
  }
}
export default NightingaleSequenceHeatmap;
