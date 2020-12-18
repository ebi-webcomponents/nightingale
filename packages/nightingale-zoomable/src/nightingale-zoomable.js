import {
  scaleLinear,
  zoom as d3zoom,
  zoomIdentity,
  event as d3Event,
} from "d3";
import { TrackHighlighter, ScrollFilter } from "@nightingale-elements/utils";

import NightingaleElement, {
  withDimensions,
  withPosition,
  withMargin,
  withResizable,
  withManager,
} from "@nightingale-elements/nightingale-core";

class ProtvistaZoomable extends NightingaleElement {
  static is = "nightingale-zoomable";

  constructor() {
    super();
    NightingaleZoomable._polyfillElementClosest();
    this._updateScaleDomain = this._updateScaleDomain.bind(this);
    this._initZoom = this._initZoom.bind(this);
    this.zoomed = this.zoomed.bind(this);
    this._applyZoomTranslation = this.applyZoomTranslation.bind(this);
    this._resetEventHandler = this._resetEventHandler.bind(this);
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
    this.trackHighlighter = new TrackHighlighter({ element: this, min: 1 });

    this.scrollFilter = new ScrollFilter(this);
    this.wheelListener = (event) => this.scrollFilter.wheel(event);
  }

  connectedCallback() {
    this._highlightEvent = this.getAttribute("highlight-event")
      ? this.getAttribute("highlight-event")
      : "onclick";

    this.trackHighlighter.setAttributesInElement(this);

    this._updateScaleDomain();
    // The _originXScale is a way to mantain all the future transformations over the same original scale.
    // It only gets redefined if the size of the component, or the length of the sequence changes.
    this._originXScale = this.xScale.copy();
    this._initZoom();
    this.addEventListener("error", (e) => {
      console.error(e);
    });
    this.addEventListener("click", this._resetEventHandler);
    if (this.hasAttribute("filter-scroll")) {
      document.addEventListener("wheel", this.wheelListener, { capture: true });
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._resetEventHandler);
    document.removeEventListener("wheel", this.wheelListener);
  }

  // TODO: remove when ewithHighlight
  set length(length) {
    super._length = length;
    this.trackHighlighter.max = length;
  }

  set width(width) {
    this._width = width;
    if (!this._zoom) return;
    this._updateScaleDomain();
    this._originXScale = this.xScale.copy();
    if (this.svg) this.svg.attr("width", this.width);
    this._zoom.scaleExtent([1, Infinity]).translateExtent([
      [0, 0],
      [this.getWidthWithMargins(), 0],
    ]);
    this.applyZoomTranslation();
  }

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
    this._svg = svg;
    svg.call(this._zoom);
    this.applyZoomTranslation();
  }

  get svg() {
    return this._svg;
  }

  // TODO: remove when proper withMargin is implemented
  // eslint-disable-next-line class-methods-use-this
  get margin() {
    return { left: 0, right: 0, top: 0, bottom: 0 };
  }

  set fixedHighlight(region) {
    this.trackHighlighter.setFixedHighlight(region);
  }

  _updateScaleDomain() {
    this.xScale = scaleLinear()
      // The max width should match the start of the n+1 base
      .domain([1, this._length + 1])
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
      .filter(() => {
        if (!(d3Event instanceof WheelEvent)) return true;
        if (this.hasAttribute("scroll-filter")) {
          const scrollableAttribute = this.getAttribute("scrollable");
          if (scrollableAttribute) return scrollableAttribute === "true";
        }
        return !this.hasAttribute("use-ctrl-to-zoom") || d3Event.ctrlKey;
      })
      .on("zoom", this.zoomed);
  }

  static get observedAttributes() {
    return ["highlight"];
  }

  setFloatAttribute(name, strValue) {
    const value = parseFloat(strValue);
    this[`_${name}`] = Number.isNaN(value) ? strValue : value;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    const inWiths = ["width", "height", "displaystart", "displayend"];
    if (inWiths.includes(name) || !this.zoom) return;
    // eslint-disable-next-line no-param-reassign
    if (newValue === "null") newValue = null;
    if (oldValue !== newValue) {
      if (name.startsWith("highlight")) {
        this.trackHighlighter.changedCallBack(name, newValue);
        return;
      }
      this.setFloatAttribute(name, newValue);

      if (name === "length") {
        this._updateScaleDomain();
        this._originXScale = this.xScale.copy();
      }
      // One of the observable attributes changed, so the scale needs to be redefined.
      this.applyZoomTranslation();
    }
  }

  zoomed() {
    // Redefines the xScale using the original scale and transform it with the captured event data.
    this.xScale = d3Event.transform.rescaleX(this._originXScale);
    // If the source event is null the zoom wasn't initiated by this component, don't send event
    if (this.dontDispatch) return;
    const [start, end] = this.xScale.domain(); // New positions based in the updated scale
    this.dispatchEvent(
      // Dispatches the event so the manager can propagate this changes to other  components
      new CustomEvent("change", {
        detail: {
          displaystart: Math.max(1, start),
          displayend: Math.min(
            this.length,
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
      this.length / (1 + this._displayend - this._displaystart)
    );
    // The deltaX gets calculated using the position of the first base to display in original scale
    const dx = -this._originXScale(this._displaystart);
    this.dontDispatch = true; // This is to avoid infinite loops
    this.svg.call(
      // We trigger a zoom action
      this.zoom.transform,
      zoomIdentity // Identity transformation
        .scale(k) // Scaled by our scaled factor
        .translate(dx, 0) // Translated by the delta
    );
    this.dontDispatch = false;
    this.refresh();
  }

  render() {
    this.applyZoomTranslation();
  }

  _resetEventHandler(e) {
    if (!e.target.closest(".feature")) {
      this.dispatchEvent(this.createEvent("reset", null, true));
    }
  }

  getXFromSeqPosition(position) {
    return this.margin.left + this.xScale(position);
  }

  getSingleBaseWidth() {
    return this.xScale(2) - this.xScale(1);
  }

  static _getClickCoords() {
    if (!d3Event) {
      return null;
    }
    // const boundingRect = this.querySelector("svg").getBoundingClientRect();
    // Note: it would be nice to also return the position of the bottom left of the feature
    return [d3Event.pageX, d3Event.pageY];
  }

  // eslint-disable-next-line class-methods-use-this
  createEvent(
    type,
    feature = null,
    withHighlight = false,
    withId = false,
    start,
    end,
    target
  ) {
    // Variation features have a different shape
    if (feature) {
      // eslint-disable-next-line no-param-reassign
      feature = feature.feature ? feature.feature : feature;
    }
    const detail = {
      eventtype: type,
      coords: NightingaleZoomable._getClickCoords(),
      feature,
      target,
    };
    if (withHighlight) {
      if (feature && feature.fragments) {
        detail.highlight = feature.fragments
          .map((fr) => `${fr.start}:${fr.end}`)
          .join(",");
      } else if (d3Event && d3Event.shiftKey && this._highlight) {
        // If holding shift, add to the highlights
        detail.highlight = `${this._highlight},${start}:${end}`;
      } else {
        detail.highlight = start && end ? `${start}:${end}` : null;
      }
    }
    if (withId) {
      detail.selectedid = feature && feature.protvistaFeatureId;
    }
    return new CustomEvent("change", {
      detail,
      bubbles: true,
      cancelable: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  bindEvents(feature, element) {
    feature
      .on("mouseover", (f, i, group) => {
        element.dispatchEvent(
          element.createEvent(
            "mouseover",
            f,
            element._highlightEvent === "onmouseover",
            false,
            f.start,
            f.end,
            group[i]
          )
        );
      })
      .on("mouseout", () => {
        element.dispatchEvent(
          element.createEvent(
            "mouseout",
            null,
            element._highlightEvent === "onmouseover"
          )
        );
      })
      .on("click", (f, i, group) => {
        element.dispatchEvent(
          element.createEvent(
            "click",
            f,
            element._highlightEvent === "onclick",
            true,
            f.start,
            f.end,
            group[i]
          )
        );
      });
  }
}

export default withManager(
  withResizable(
    withMargin(
      withPosition(
        withDimensions(ProtvistaZoomable, {
          width: 0,
          height: 44,
        })
      ),
      {
        initialValue: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      }
    )
  )
);
