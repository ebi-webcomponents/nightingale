import { html, PropertyValueMap } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from 'lit-html/directives/style-map.js';

import NightingaleElement, { customElementOnce, withDimensions, withHighlight, withManager, withMargin, withPosition, withResizable, withZoom } from "@nightingale-elements/nightingale-new-core";
import { Heatmap } from "heatmap-component";

// TODO: height is not triggering a full redrawn when is changed after first render
const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];

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
  heatmapId: string | undefined;
  
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
    // console.log("attributeChangedCallback")
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name) ||
      name.startsWith("margin-")
    ) {
      // console.log("FOR: " + ATTRIBUTES_THAT_TRIGGER_REFRESH.toString())
    }
    // console.log(name, oldValue, newValue)
    // console.log("")
  }

  /**
   * 2nd ON CREATED
   */
  connectedCallback() {
    // console.log("connectedCallback")
    // console.log("")
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
    // console.log("render")
    // console.log("")
    // return html`<h1 class="hello-world-hotmap">Hi I am the hotmap container</h1>`;
    const mainStyles = {
      width: this.width + "px",
      visibility: this.heatmapData? 'visible': 'hidden',
      paddingLeft: "10px",
      paddingRight: "10px"
    };
    const heatmapStyles = {
      width: (this.width-20) + "px",
      height: this.heatmapData? this.height + "px": "0px",
    }
    const loadingStyles = {
      width: (this.width-20) + "px",
      visibility: this.heatmapData? 'hidden': 'visible',
      textAlign: 'center'
    }
    return html`
      <div style=${styleMap(mainStyles)}">
        <div id="${this.heatmapId}" style=${styleMap(heatmapStyles)}"></div>
      </div>
      <div style=${styleMap(loadingStyles)}">
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
    this.heatmapData = data;
  }

  // Renders residue heatmap given data and heatmapId set in constructor
  renderHeatmap() {
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
    this.heatmapInstance = hm;

    this.heatmapInstance.events.zoom.subscribe((d) => {
      if (!d) return;
    });

    this.heatmapInstance.render(this.heatmapId!);
    
    const that = this;
    this.heatmapInstance.events.render.subscribe((d) => {
      that.render();
    });
  }

  updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    console.log("finished update");
    if (this.heatmapData) {
      this.renderHeatmap();
    }
  }
 
}
export default NightingaleHeatmapHotmap;
