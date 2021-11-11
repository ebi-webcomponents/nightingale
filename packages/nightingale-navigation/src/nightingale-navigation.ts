import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  scaleLinear,
  ScaleLinear,
  axisBottom,
  brushX,
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
  withResizable(withMargin(withPosition(NightingaleElement)))
) {
  #x: ScaleLinear<any, any> | null;
  #dontDispatch: boolean;

  @property({ type: Number })
  rulerstart: number = 1;

  constructor() {
    super();
    this.#x = null;
    // this._padding = 10;
    this.#dontDispatch = false;
  }

  // // TODO: This is here to pass the tests, not sure why is needed.
  // // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  // disconnectedCallback() {}

  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (oldValue !== newValue && name === "rulerstart") {
  //     this._rulerstart = parseFloat(newValue);
  //     this.render();
  //   }
  // }

  // _createNavRuler() {
  //   this._x = scaleLinear().range([this._padding, this.width - this._padding]);
  //   this._x.domain([
  //     this._rulerstart,
  //     this._rulerstart + this.sequenceLength - 1,
  //   ]);

  //   this._container = select(this).append("div").attr("class", "container");

  //   this._svg = this._container
  //     .append("svg")
  //     .attr("id", "")
  //     .attr("width", this.width)
  //     .attr("height", this.height);

  //   this._xAxis = axisBottom(this._x);

  //   this._displaystartLabel = this._svg
  //     .append("text")
  //     .attr("class", "start-label")
  //     .attr("x", 0)
  //     .attr("y", this.height - this._padding);

  //   this._displayendLabel = this._svg
  //     .append("text")
  //     .attr("class", "end-label")
  //     .attr("x", this.width)
  //     .attr("y", this.height - this._padding)
  //     .attr("text-anchor", "end");
  //   this._axis = this._svg
  //     .append("g")
  //     .attr("class", "x axis")
  //     .call(this._xAxis);

  //   this._viewport = brushX()
  //     .extent([
  //       [this._padding, 0],
  //       [this.width - this._padding, this.height * 0.51],
  //     ])
  //     .on("brush", () => {
  //       if (d3Event.selection) {
  //         this._displaystart = format("d")(
  //           this._x.invert(d3Event.selection[0])
  //         );
  //         this._displayend = format("d")(this._x.invert(d3Event.selection[1]));
  //         if (!this.dontDispatch)
  //           this.dispatchEvent(
  //             new CustomEvent("change", {
  //               detail: {
  //                 displayend: this._displayend,
  //                 displaystart: this._displaystart,
  //                 extra: { transform: d3Event.transform },
  //               },
  //               bubbles: true,
  //               cancelable: true,
  //             })
  //           );
  //         this._updateLabels();
  //         this._updatePolygon();
  //       }
  //     });

  //   this._brushG = this._svg
  //     .append("g")
  //     .attr("class", "brush")
  //     .call(this._viewport);

  //   this._brushG.call(this._viewport.move, [
  //     this._x(this._displaystart),
  //     this._x(this._displayend),
  //   ]);

  //   this.polygon = this._svg
  //     .append("polygon")
  //     .attr("class", "zoom-polygon")
  //     .attr("fill", "#777")
  //     .attr("fill-opacity", "0.3");
  //   this.render();
  // }

  // onWidthChange() {
  //   if (!this._x) return;
  //   this._x.range([this._padding, this.width - this._padding]);
  //   this._svg.attr("width", this.width);
  //   this._viewport.extent([
  //     [this._padding, 0],
  //     [this.width - this._padding, this.height * 0.51],
  //   ]);
  //   this._brushG.call(this._viewport);
  //   this.render();
  // }

  render() {
    return html`<div class="container">It works</div>`;
  }
  firstUpdated() {}
  //   if (this._x) {
  //     this._container
  //       .style("padding-left", `${this.margin.left}px`)
  //       .style("padding-right", `${this.margin.right}px`)
  //       .style("padding-top", `${this.margin.top}px`)
  //       .style("padding-bottom", `${this.margin.bottom}px`);
  //     this._x.domain([
  //       this._rulerstart,
  //       this._rulerstart + this.sequenceLength - 1,
  //     ]);
  //     this._axis.call(this._xAxis);
  //     this._updatePolygon();
  //     this._updateLabels();
  //     if (this._brushG) {
  //       this.dontDispatch = true;
  //       this._brushG.call(this._viewport.move, [
  //         this._x(this._displaystart),
  //         this._x(this._displayend),
  //       ]);
  //       this.dontDispatch = false;
  //     }
  //   }
  // }

  // _updateLabels() {
  //   if (this._displaystartLabel)
  //     this._displaystartLabel.text(this._displaystart);
  //   if (this._displayendLabel)
  //     this._displayendLabel.attr("x", this.width).text(this._displayend);
  // }

  // _updatePolygon() {
  //   if (this.polygon)
  //     this.polygon.attr(
  //       "points",
  //       `${this._x(this._displaystart)},${this.height / 2}
  //       ${this._x(this._displayend)},${this.height / 2}
  //       ${this.width},${this.height}
  //       0,${this.height}`
  //     );
  // }
}

export default NightingaleNavigation;
