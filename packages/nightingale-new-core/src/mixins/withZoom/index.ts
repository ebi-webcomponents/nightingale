import {
  zoom as d3zoom,
  D3ZoomEvent,
  scaleLinear,
  ScaleLinear,
  Selection,
  ZoomBehavior,
  zoomIdentity,
} from "d3";
import { property } from "lit/decorators.js";

import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import withDimensions, { WithDimensionsInterface } from "../withDimensions";
import withMargin, { withMarginInterface } from "../withMargin";
import withPosition, { withPositionInterface } from "../withPosition";
import withResizable, { WithResizableInterface } from "../withResizable";


type SVGSelection = Selection<SVGSVGElement, unknown, HTMLElement | SVGElement | null, unknown>;

export interface WithZoomInterface
  extends WithDimensionsInterface,
  withPositionInterface,
  withMarginInterface,
  WithResizableInterface {
  xScale?: ScaleLinear<number, number>;
  svg?: SVGSelection;
  updateScaleDomain(): void;
  getSingleBaseWidth(): number;
  getXFromSeqPosition(position: number): number;
  applyZoomTranslation(): void;
}
const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];

const withZoom = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
) => {
  class WithZoom extends withMargin(
    withPosition(withResizable(withDimensions(superClass))),
  ) implements WithZoomInterface {
    /** Base scale without any transformations, only updated in `updateScaleDomain` */
    private originXScale?: ScaleLinear<number, number>;
    /** Current scale, the one used to calculate any positions. Calculated based on `display-start` and `display-end`. */
    xScale?: ScaleLinear<number, number>;

    private _zoom?: ZoomBehavior<SVGSVGElement, unknown>;
    private _svg?: SVGSelection;
    private dontDispatch?: boolean;

    @property({ type: Boolean })
    "use-ctrl-to-zoom" = false;


    override connectedCallback() {
      this.updateScaleDomain();
      this._initZoom();
      super.connectedCallback();
      this.onDimensionsChange();
    }

    override disconnectedCallback() {
      super.disconnectedCallback();
    }

    get zoom() {
      return this._zoom;
    }

    set svg(svg: SVGSelection) {
      if (!svg || !this._zoom) return;
      this._svg = svg;
      svg.call(this._zoom).on("dblclick.zoom", null);
      this.applyZoomTranslation();
    }

    get svg(): SVGSelection | undefined {
      return this._svg;
    }

    updateScaleDomain() {
      this.originXScale = scaleLinear()
        // The max width should match the start of the n+1 base
        .domain([1, (this.length || 0) + 1])
        .range([0, this.getWidthWithMargins()]);
      this.xScale ??= this.originXScale.copy(); // Do not force set `xScale`, will be updated in `zoomed`
      this.zoom?.translateExtent([
        [0, 0],
        [this.getWidthWithMargins(), 0],
      ]);
      this.adjustExtent();
    }

    private adjustExtent() {
      this.zoom?.scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [this.getWidthWithMargins(), 0],
        ])
        .extent([
          [0, 0],
          [this.getWidthWithMargins(), 0],
        ]);
    }

    _initZoom() {
      this._zoom = d3zoom<SVGSVGElement, unknown>()
        .filter((event) => {
          if (event?.type === "wheel") {
            return !this["use-ctrl-to-zoom"] || event.ctrlKey;
          }
          return true;
        })
        .on("zoom", z => this.handleZoom(z));
      this.adjustExtent();
    }

    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null,
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      const newV = newValue === "null" ? null : newValue;
      if (oldValue !== newV) {
        if (ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name)) {
          this.updateScaleDomain();
        }
        // One of the observable attributes changed, so the scale needs to be redefined.
        this.applyZoomTranslation();
        if (name === 'display-start' || name === 'display-end') {
          console.log('display', this["display-start"], this["display-end"],
            'scaleExtent', ...this.zoom!.scaleExtent(), 'translateExtent', ...this.zoom!.translateExtent())
        }
      }
    }

    /** Handle zoom event coming from the D3 zoom behavior */
    private handleZoom(d3Event: D3ZoomEvent<SVGSVGElement, unknown>) {
      // Redefines the xScale using the original scale and transform it with the captured event data.
      if (!this.originXScale) return;

      // Temporary scale. It contains the transformations caused by zoom events, but not yet reflected in `display-start` and `display-end`.
      const tmpXScale = d3Event.transform.rescaleX(this.originXScale);

      if (this.dontDispatch) {
        this.xScale = tmpXScale;
      } else {
        // New positions based in the updated scale
        const [start, end] = tmpXScale.domain();
        this.dispatchEvent(
          // Dispatches the event so the manager can propagate this changes to other  components
          new CustomEvent("change", {
            detail: {
              // "display-start": Math.max(1, start),
              // "display-end": Math.min(this.length ?? 0, Math.max(end - 1, start + 1)), // To make sure it never zooms in deeper than showing 2 bases covering the full width
              "display-start": start,
              "display-end": end - 1, // To make sure it never zooms in deeper than showing 2 bases covering the full width
              // TODO re-clamping here?
            },
            bubbles: true,
            cancelable: true,
          }),
        );
      }
    }

    private _zoomTranslationRequested = false;

    /** Apply zoom translation in the next frame.
     * Postponing the zoom translation to the next frame
     * helps in case several attributes are changed almost at the same time.
     * In this way, only one refresh will be called.*/
    applyZoomTranslation = () => {
      if (this._zoomTranslationRequested) return;
      this._zoomTranslationRequested = true;
      requestAnimationFrame(() => {
        this._zoomTranslationRequested = false;
        this._applyZoomTranslation();
      });
    }

    /** Apply zoom translation immediately */
    private _applyZoomTranslation() {
      if (!this.svg || !this.originXScale) return;
      // Calculating the scale factor based in the current start/end coordinates and the length of the sequence.
      // const k = Math.max(
      //   1,
      //   // +1 because the displayend base should be included
      //   (this.length || 0) /
      //   (1 + (this["display-end"] || 0) - (this["display-start"] || 0)),
      // );
      const k = (this.length || 0) / (1 + (this["display-end"] || 0) - (this["display-start"] || 0)); // +1 because the displayend base should be included
      // TODO re-clamping here?
      
      // The deltaX gets calculated using the position of the first base to display in original scale
      const dx = -this.originXScale(this["display-start"] || 0);
      this.dontDispatch = true; // This is to avoid infinite loops
      if (this.zoom) {
        this.svg.call(
          // We trigger a zoom action
          this.zoom.transform,
          zoomIdentity // Identity transformation
            .scale(k) // Scaled by our scaled factor
            .translate(dx, 0), // Translated by the delta
        );
      }
      this.dontDispatch = false;
      this.zoomRefreshed();
    }

    zoomRefreshed() {
      super.render();
    }

    override render() {
      this.applyZoomTranslation();
      return super.render();
    }

    override onDimensionsChange() {
      super.onDimensionsChange();
      this.svg?.attr("width", this.width);
      this.svg?.attr("height", this.height);
      this.updateScaleDomain();
      this.applyZoomTranslation();
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
