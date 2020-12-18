import {
  scaleLinear,
  axisBottom,
  brushX,
  format,
  select,
  event as d3Event,
} from "d3";

import { withMargin } from "@nightingale-elements/utils";

class NightingaleNavigation extends HTMLElement {
  static is = "nightingale-navigation";

  constructor() {
    super();
    this._x = null;
    this._padding = 0;
    this.height = 40;
    this.dontDispatch = false;
  }

  _refreshWidth() {
    this.style.display = "block";
    this.style.width = "100%";
    this.width = this.offsetWidth - this.margin.left - this.margin.right;
    if (this.width > 0) {
      this._padding = 10;
    }
  }

  connectedCallback() {
    this._refreshWidth();
    if (this.closest("nightingale-manager")) {
      this.manager = this.closest("nightingale-manager");
      this.manager.register(this);
    }
    this._length = parseFloat(this.getAttribute("length"));
    this._displaystart = parseFloat(this.getAttribute("displaystart")) || 1;
    this._displayend =
      parseFloat(this.getAttribute("displayend")) || this._length;
    this._rulerstart = parseFloat(this.getAttribute("rulerStart")) || 1;

    this._onResize = this._onResize.bind(this);

    this._createNavRuler();
  }

  disconnectedCallback() {
    if (this.manager) {
      this.manager.unregister(this);
    }
    if (this._ro) {
      this._ro.unobserve(this);
    }
    window.removeEventListener("resize", this._onResize);
  }

  static get observedAttributes() {
    return ["length", "displaystart", "displayend", "width", "rulerstart"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[`_${name}`] = parseFloat(newValue);
      this._updateNavRuler();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get margin() {
    return { bottom: 0, left: 0, top: 0, right: 0 };
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }

  _createNavRuler() {
    this._x = scaleLinear().range([this._padding, this.width - this._padding]);
    this._x.domain([this._rulerstart, this._rulerstart + this._length - 1]);

    this._container = select(this).append("div").attr("class", "container");

    this._svg = this._container
      .append("svg")
      .attr("id", "")
      .attr("width", this.width)
      .attr("height", this.height);

    this._xAxis = axisBottom(this._x);

    this._displaystartLabel = this._svg
      .append("text")
      .attr("class", "start-label")
      .attr("x", 0)
      .attr("y", this.height - this._padding);

    this._displayendLabel = this._svg
      .append("text")
      .attr("class", "end-label")
      .attr("x", this.width)
      .attr("y", this.height - this._padding)
      .attr("text-anchor", "end");
    this._axis = this._svg
      .append("g")
      .attr("class", "x axis")
      .call(this._xAxis);

    this._viewport = brushX()
      .extent([
        [this._padding, 0],
        [this.width - this._padding, this.height * 0.51],
      ])
      .on("brush", () => {
        if (d3Event.selection) {
          this._displaystart = format("d")(
            this._x.invert(d3Event.selection[0])
          );
          this._displayend = format("d")(this._x.invert(d3Event.selection[1]));
          if (!this.dontDispatch)
            this.dispatchEvent(
              new CustomEvent("change", {
                detail: {
                  displayend: this._displayend,
                  displaystart: this._displaystart,
                  extra: { transform: d3Event.transform },
                },
                bubbles: true,
                cancelable: true,
              })
            );
          this._updateLabels();
          this._updatePolygon();
        }
      });

    this._brushG = this._svg
      .append("g")
      .attr("class", "brush")
      .call(this._viewport);

    this._brushG.call(this._viewport.move, [
      this._x(this._displaystart),
      this._x(this._displayend),
    ]);

    this.polygon = this._svg
      .append("polygon")
      .attr("class", "zoom-polygon")
      .attr("fill", "#777")
      .attr("fill-opacity", "0.3");
    this._updateNavRuler();

    if ("ResizeObserver" in window) {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(this);
    }
    window.addEventListener("resize", this._onResize);
  }

  _onResize() {
    this._refreshWidth();
    this._x = this._x.range([this._padding, this.width - this._padding]);
    this._svg.attr("width", this.width);
    this._viewport.extent([
      [this._padding, 0],
      [this.width - this._padding, this.height * 0.51],
    ]);
    this._brushG.call(this._viewport);
    this._updateNavRuler();
  }

  _updateNavRuler() {
    if (this._x) {
      this._container
        .style("padding-left", `${this.margin.left}px`)
        .style("padding-right", `${this.margin.right}px`)
        .style("padding-top", `${this.margin.top}px`)
        .style("padding-bottom", `${this.margin.bottom}px`);
      this._x.domain([this._rulerstart, this._rulerstart + this._length - 1]);
      this._axis.call(this._xAxis);
      this._updatePolygon();
      this._updateLabels();
      if (this._brushG) {
        this.dontDispatch = true;
        this._brushG.call(this._viewport.move, [
          this._x(this._displaystart),
          this._x(this._displayend),
        ]);
        this.dontDispatch = false;
      }
    }
  }

  _updateLabels() {
    if (this._displaystartLabel)
      this._displaystartLabel.text(this._displaystart);
    if (this._displayendLabel)
      this._displayendLabel.attr("x", this.width).text(this._displayend);
  }

  _updatePolygon() {
    if (this.polygon)
      this.polygon.attr(
        "points",
        `${this._x(this._displaystart)},${this.height / 2}
        ${this._x(this._displayend)},${this.height / 2}
        ${this.width},${this.height}
        0,${this.height}`
      );
  }
}

export default withMargin(NightingaleNavigation);
