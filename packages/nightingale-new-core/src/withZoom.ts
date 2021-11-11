import { property } from "lit/decorators.js";
import {
  scaleLinear,
  zoom as d3zoom,
  zoomIdentity,
  ScaleLinear,
  ZoomBehavior,
  Selection,
} from "d3";

import NightingaleBaseElement, {
  Constructor,
} from "./nightingale-base-element";
import withDimensions from "./withDimensions";
import withPosition from "./withPosition";
import withMargin from "./withMargin";

export declare class WithZoomInterface {}

const withZoom = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {} = {}
) => {
  class WithZoom extends withMargin(withPosition(withDimensions(superClass))) {
    _applyZoomTranslation: () => void;
    _originXScale?: ScaleLinear<any, any>;
    _xScale?: ScaleLinear<any, any>;
    _zoom?: ZoomBehavior<Element, unknown>;
    _svg?: Selection<HTMLElement, any, HTMLElement, any>;
    dontDispatch?: boolean;

    constructor(...args: any[]) {
      super(...args);

      this._updateScaleDomain = this._updateScaleDomain.bind(this);
      this._initZoom = this._initZoom.bind(this);
      this.zoomed = this.zoomed.bind(this);
      this._applyZoomTranslation = this.applyZoomTranslation.bind(this);
      let aboutToApply = false;
      // Postponing the zoom translation to the next frame.
      // This helps in case several attributes are changed almost at the same time,
      // in this way, only one refresh will be called.
      this.applyZoomTranslation = () => {
        if (aboutToApply) return;
        aboutToApply = true;
        requestAnimationFrame(() => {
          aboutToApply = false;
          this._applyZoomTranslation();
        });
      };
      // this.scrollFilter = new ScrollFilter(this);
      // this.wheelListener = (event) => this.scrollFilter.wheel(event);
    }

    connectedCallback() {
      this._updateScaleDomain();
      // The _originXScale is a way to mantain all the future transformations over the same original scale.
      // It only gets redefined if the size of the component, or the length of the sequence changes.
      if (this.xScale) this._originXScale = this.xScale.copy();
      this._initZoom();
      // if (this.hasAttribute("filter-scroll")) {
      //   document.addEventListener("wheel", this.wheelListener, { capture: true });
      // }
      super.connectedCallback();
    }

    disconnectedCallback() {
      // document.removeEventListener("wheel", this.wheelListener);
      super.disconnectedCallback();
    }

    // set width(width) {
    //   this._width = width;
    //   if (!this._zoom) return;
    //   this._updateScaleDomain();
    //   this._originXScale = this.xScale.copy();
    //   if (this.svg) this.svg.attr("width", this.width);
    //   this._zoom.scaleExtent([1, Infinity]).translateExtent([
    //     [0, 0],
    //     [this.getWidthWithMargins(), 0],
    //   ]);
    //   this.applyZoomTranslation();
    // }

    get xScale() {
      return this._xScale;
    }

    set xScale(xScale) {
      this._xScale = xScale;
    }

    get zoom() {
      return this._zoom;
    }

    set svg(svg) {
      if (!svg || !this._zoom) return;
      this._svg = svg;
      svg.call(this._zoom as any);
      this.applyZoomTranslation();
    }

    get svg() {
      return this._svg;
    }

    _updateScaleDomain() {
      this.xScale = scaleLinear()
        // The max width should match the start of the n+1 base
        .domain([1, (this.length || 0) + 1])
        .range([0, this.getWidthWithMargins()]);
    }

    _initZoom() {
      this._zoom = d3zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [this.getWidthWithMargins(), 0],
        ])
        .extent([
          [0, 0],
          [this.getWidthWithMargins(), 0],
        ])
        // TODO: deal with events
        // .filter(() => {
        //   if (!(d3Event instanceof WheelEvent)) return true;
        //   if (this.hasAttribute("scroll-filter")) {
        //     const scrollableAttribute = this.getAttribute("scrollable");
        //     if (scrollableAttribute) return scrollableAttribute === "true";
        //   }
        //   return !this.hasAttribute("use-ctrl-to-zoom") || d3Event.ctrlKey;
        // })
        .on("zoom", this.zoomed);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (!this.zoom) return;
      // eslint-disable-next-line no-param-reassign
      if (newValue === "null") newValue = null;
      if (oldValue !== newValue && name === "length") {
        this._updateScaleDomain();
        if (this.xScale) {
          this._originXScale = this.xScale.copy();
          this.applyZoomTranslation();
        }
      }
    }

    zoomed() {
      // Redefines the xScale using the original scale and transform it with the captured event data.
      //      this.xScale = d3Event.transform.rescaleX(this._originXScale);
      // If the source event is null the zoom wasn't initiated by this component, don't send event
      if (this.dontDispatch || !this.xScale) return;
      const [start, end] = this.xScale.domain(); // New positions based in the updated scale
      this.dispatchEvent(
        // Dispatches the event so the manager can propagate this changes to other  components
        new CustomEvent("change", {
          detail: {
            'display-start': Math.max(1, start),
            'display-end': Math.min(
              this.length || 0,
              Math.max(end - 1, start + 1) // To make sure it never zooms in deeper than showing 2 bases covering the full width
            ),
          },
          bubbles: true,
          cancelable: true,
        })
      );
    }

    applyZoomTranslation() {
      if (!this.svg || !this._originXScale) return;
      // Calculating the scale factor based in the current start/end coordinates and the length of the sequence.
      const k = Math.max(
        1,
        // +1 because the displayend base should be included
        this.length ||
          0 / (1 + (this['display-end'] || 0) - (this['display-start'] || 0))
      );
      // The deltaX gets calculated using the position of the first base to display in original scale
      const dx = -this._originXScale(this['display-start'] || 0);
      this.dontDispatch = true; // This is to avoid infinite loops
      this.svg.call(
        // We trigger a zoom action
        (this.zoom as any).transform,
        zoomIdentity // Identity transformation
          .scale(k) // Scaled by our scaled factor
          .translate(dx, 0) // Translated by the delta
      );
      this.dontDispatch = false;
      super.render();
    }

    render() {
      this.applyZoomTranslation();
      return super.render();
    }

    getXFromSeqPosition(position: number) {
      if (!this.xScale) return -1;
      return this["margin-left"] + this.xScale(position);
    }

    getSingleBaseWidth() {
      if (!this.xScale) return -1;
      return this.xScale(2) - this.xScale(1);
    }
  }
  return WithZoom as Constructor<WithZoomInterface> & T;
};

export default withZoom;
