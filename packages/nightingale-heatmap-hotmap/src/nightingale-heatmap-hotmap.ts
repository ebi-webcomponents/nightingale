import { html } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from 'lit-html/directives/style-map.js';

import NightingaleElement, { customElementOnce, withDimensions, withHighlight, withManager, withMargin, withPosition, withResizable, withZoom } from "@nightingale-elements/nightingale-new-core";
import { Heatmap } from "heatmap-component";

interface HotmapData {
  xValue: number;
  yValue: string;
  score: number;
  [key: string]: any;
}

@customElementOnce("nightingale-heatmap-hotmap")
class NightingaleHeatmapHotmap extends withManager(
  withZoom(
    withResizable(
      withMargin(
        withPosition(withDimensions(withHighlight(NightingaleElement))),
      ),
    ),
  ),
) {
  @property({ type: String })
  heatmapId!: string;
  
  heatmapDomainX?: number[];
  heatmapDomainY?: string[];
  heatmapData?: HotmapData[];
  heatmapInstance?: Heatmap<number, string, HotmapData>;

  /**
   * 1st ON CREATED: Called once for each attribute on order they appear
   * 4th ON CREATED: Additional or duplicate call based on Mixins (see below:)
   *     - withResizable adds min-width, min-height
   *     - withHighlight duplicate set highlight-color
   *     - withPosition duplicate set display-start and display-end
   * 
   * 1st ON UPDATED: Called once by each attribute updated by manager
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name.startsWith("display-")
    ) {
      if (oldValue !== newValue) this.triggerHeatmapZoom();
    } else if (
      name === "highlight"
    ) {

    }
  }

  /**
   * 2nd ON CREATED
   */
  connectedCallback() {
    super.connectedCallback();
  }

  // Runs after attributeChangedCallback and before render
  shouldUpdate(changedProperties: Map<string, any>) {
    // TODO: Add check for data defined before false
    // TODO: Add check for binding functions existance before false
    // Stop render on highlight, display changes

    const hasHighlightDefined = changedProperties.has('highlight') && changedProperties.get('highlight') !== undefined;
    const hasDisplayStDefined = changedProperties.has('display-start') && changedProperties.get('display-start') !== undefined;
    const hasDisplayEndDefined = changedProperties.has('display-end') && changedProperties.get('display-end') !== undefined;

    return !hasHighlightDefined && !hasDisplayStDefined && !hasDisplayEndDefined;
  }

  /**
   * 3rd ON CREATED
   * 
   * 2nd ON UPDATED
   */
  render() {
    const mainStyles = {
      width: this.width + "px",
      paddingLeft: "10px",
      paddingRight: "10px"
    };
    const heatmapStyles = {
      width: (this.width-20) + "px",
      height: this.height + "px",
      zIndex: 1,
      display: "none"
    }
    const loadingStyles = {
      width: (this.width-20) + "px",
      textAlign: 'center'
    }
    // style tag here may seem strange but see: https://lit.dev/docs/v1/lit-html/styling-templates/#rendering-in-shadow-dom
    return html`
      <style>
        .heatmap-canvas-div > svg {
          z-index: 2;
        }
      </style>

      <div style=${styleMap(mainStyles)}">
        <div id="${this.heatmapId}" style=${styleMap(heatmapStyles)}"></div>
      </div>
      <div id="${this.heatmapId}_loading" style=${styleMap(loadingStyles)}">
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
      </div>
    `;
  }

  /**
   * 5TH (last) ON CREATED (1st is also 4th)
   */
  firstUpdated() {
    // console.log("firstUpdated")
    // console.log("")
  }

  /**
   * Heatmap render and reload
   */

  setHeatmapData(
    xDomain: number[],
    yDomain: string[],
    data: HotmapData[]
  ) {
    this.heatmapDomainX = xDomain;
    this.heatmapDomainY = yDomain;
    if (!this.heatmapData) {
      this.heatmapData = data;
      this.renderHeatmap();
    } else {
      this.heatmapData = data;
      this.heatmapInstance!.setData({
        xDomain: xDomain,
        yDomain: yDomain,
        items: data,
        x: (d) => {
          const x = d.start;
          return x;
        },
        y: (d) => {
          if (d.yValue) {
            return d.yValue
          }
          return "none";
        },
      });
    }
  }

  // Renders residue heatmap given data and heatmapId set in constructor
  renderHeatmap() {
    document.getElementById(this.heatmapId)!.style.display = "";
    document.getElementById(`${this.heatmapId}_loading`)!.style.display = "none";

    const hm = Heatmap.create({
      xDomain: this.heatmapDomainX!,
      yDomain: this.heatmapDomainY!,
      items: this.heatmapData!,
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
    hm.setTooltip(
      (d, x, y, xIndex, yIndex) => {
        let returnHTML = `
        <b>Your are at</b> <br />

        x,y: <b>${d.xValue},${d.yValue}</b><br />
        score: <b>${d.score}</b>`;
        return returnHTML;
      }
    );
    hm.setZooming({ axis: 'x' });
    hm.setVisualParams({ xGapPixels: 0, yGapPixels: 0 });
    this.heatmapInstance = hm;

    this.heatmapInstance.events.zoom.subscribe((d) => {
      if (!d) return;
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: d.xMin + 0.5,
            type: "display-start",
          },
          bubbles: true,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: d.xMax - 0.5,
            type: "display-end",
          },
          bubbles: true,
        }),
      );
    });

    this.heatmapInstance.render(this.heatmapId!);
    this.heatmapInstance.events.render.subscribe((d) => {
      this.triggerHeatmapZoom();
    });
  }

  triggerHeatmapZoom() {
    const toStart = this["display-start"]!;
    const toEnd = this["display-end"]!;

    if (this.heatmapInstance) {
      this.heatmapInstance.zoom({
        xMin: toStart - 0.5,
        xMax: toEnd + 0.5,
      });
    }
  }

  // runs after update is finished
  // updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  //   console.log("finished update");
  //   console.log(_changedProperties);
  // }
 
}
export default NightingaleHeatmapHotmap;
