import {
  zoom as d3zoom,
  D3ZoomEvent,
  scaleLinear,
  ScaleLinear,
  Selection,
  ZoomBehavior,
  ZoomTransform,
} from "d3";
import { property } from "lit/decorators.js";

import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import withDimensions, { WithDimensionsInterface } from "../withDimensions";
import withMargin, { withMarginInterface } from "../withMargin";
import withPosition, { withPositionInterface } from "../withPosition";
import withResizable, { WithResizableInterface } from "../withResizable";
import { WheelHelper } from "./wheel-helper";


const MIN_ZOOMED_COLUMNS = 2;

const ZOOM_SENSITIVITY = 1;
const PAN_SENSITIVITY = 0.6;

type SVGSelection = Selection<SVGSVGElement, unknown, HTMLElement | SVGElement | null, unknown>;

export interface WithZoomInterface extends WithDimensionsInterface, withPositionInterface, withMarginInterface, WithResizableInterface {
  /** Current scale, the one used to calculate any positions. Calculated based on `display-start` and `display-end`. */
  xScale?: ScaleLinear<number, number>;
  /** Target for zooming events */
  svg?: SVGSelection;
  getSingleBaseWidth(): number;
  /** Compute X coordinate within this HTML element from sequence position */
  getXFromSeqPosition(position: number): number;
  /** Compute sequence position from X coordinate within this HTML element */
  getSeqPositionFromX(x: number): number | undefined;
  updateScaleDomain(): void;
  applyZoomTranslation(): void;
  /** Method to be called whenever zoom changes, subclasses can override to perform their stuff */
  zoomRefreshed(): void;
}

const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];


const withZoom = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
) => {
  class WithZoom extends withMargin(withPosition(withResizable(withDimensions(superClass)))) implements WithZoomInterface {
    xScale?: ScaleLinear<number, number>;

    private zoomBehavior?: ZoomBehavior<SVGSVGElement, unknown>;
    private _svg?: SVGSelection;
    private dontDispatch = false;
    private wheelHelper?: WheelHelper;

    @property({ type: Boolean })
    "use-ctrl-to-zoom" = false;

    get svg(): SVGSelection | undefined {
      return this._svg;
    }
    set svg(svg: SVGSelection) {
      this._svg = svg;
      this.addZoomBehavior();
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      const newV = newValue === "null" ? null : newValue;
      if (oldValue !== newV) {
        if (ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name)) {
          this.adjustZoomConstraints();
          this.adjustZoom();
        }
        if (name === "display-start" || name === "display-end") {
          this.adjustZoom();
        }
        if (name == "use-ctrl-to-zoom" && this.wheelHelper) {
          this.wheelHelper.scrollRequiresCtrl = this["use-ctrl-to-zoom"];
        }
        this.requestZoomRefreshed();
      }
    }

    override onDimensionsChange() {
      super.onDimensionsChange();
      this.svg?.attr("width", this.width);
      this.svg?.attr("height", this.height);
      this.adjustZoomConstraints();
      this.adjustZoom();
      this.requestZoomRefreshed();
    }

    /** Initialize zoom behavior (also remove any existing zoom behavior) */
    private addZoomBehavior(): void {
      if (!this.svg) return;

      // Remove any old behavior
      this.zoomBehavior?.on("zoom", null);
      this.wheelHelper?.dispose();

      // Add new behavior
      this.wheelHelper = new WheelHelper(this.svg);
      this.wheelHelper.scrollRequiresCtrl = this["use-ctrl-to-zoom"];
      this.wheelHelper.handlePan = shift => {
        if (this.svg) this.zoomBehavior?.translateBy(this.svg, PAN_SENSITIVITY * shift / this.getSingleBaseWidth(), 0);
      }

      this.zoomBehavior = d3zoom();
      this.zoomBehavior.filter(e => (e instanceof WheelEvent) ? (this.wheelHelper?.wheelAction(e).kind === "zoom") : true);
      this.zoomBehavior.wheelDelta(e => {
        const action = this.wheelHelper?.wheelAction(e);
        return action?.kind === "zoom" ? ZOOM_SENSITIVITY * action.delta : 0;
      });
      this.zoomBehavior.on("zoom", e => this.handleZoom(e));
      this.svg.call(this.zoomBehavior);

      this.adjustZoomConstraints();
      this.adjustZoom();
      this.requestZoomRefreshed();
    }

    /** Handle zoom event coming from the D3 zoom behavior */
    private handleZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
      // Only dispatch event, scale will be updated as response to attribute change
      if (!this.dontDispatch) {
        const [viewportMin, viewportMax] = this.viewport();
        this.dispatchDisplayRange(event.transform.invertX(viewportMin), event.transform.invertX(viewportMax) - 1); // subtracting 1 to convert to end-inclusive display-end
      }
    }

    /** Dispatch a "change" event with new values for "display-start" and "display-end" attributes
     * so the manager can propagate these changes to other components. */
    private dispatchDisplayRange(displayStart: number, displayEnd: number): void {
      // Re-clamping the values here because just D3 zoom constraints can produce values like 0.99999996
      displayStart = Math.max(displayStart, 1);
      displayEnd = Math.min(displayEnd, (this.length ?? 1));

      if (displayStart === this["display-start"] && displayEnd === this["display-end"]) return;

      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { "display-start": displayStart, "display-end": displayEnd },
          bubbles: true,
          cancelable: true,
        }),
      );
    }

    /** Adjust zoom constraints based on current viewport and sequence length
     * (limit maximum zoom in/out and translation to avoid getting out of the sequence range) */
    private adjustZoomConstraints(): void {
      if (!this.zoomBehavior) return;

      const length = this.length ?? 1;
      const [viewportMin, viewportMax] = this.viewport();
      const viewportWidth = viewportMax - viewportMin;
      const minZoom = viewportWidth / length; // zoom-out
      const maxZoom = Math.max(viewportWidth / MIN_ZOOMED_COLUMNS, minZoom); // zoom-in

      this.zoomBehavior.translateExtent([[1, 0], [length + 1, 0]]);
      this.zoomBehavior.scaleExtent([minZoom, maxZoom]);
      this.zoomBehavior.extent([[viewportMin, 0], [viewportMax, 0]]);
    }

    /** Synchronize `xScale` and state of the zoom behavior with the "display-start" and "display-end" attributes */
    private adjustZoom(): void {
      if (!this.svg) return;
      if (!this.zoomBehavior) return;

      const displayRange = this.displayRange();
      const viewport = this.viewport();
      this.xScale = scaleLinear(displayRange, viewport);

      this.dontDispatch = true;
      this.zoomBehavior.transform(this.svg, getZoomTransform(displayRange, viewport));
      this.dontDispatch = false;
    }

    /** Apply `zoomRefreshed` in the next animation frame.
     * Postponing rendering to the next frame
     * helps in case several attributes are changed almost at the same time.
     * In this way, only one refresh will be called.*/
    private requestZoomRefreshed = () => {
      if (this._zoomRefreshedRequested) return;
      this._zoomRefreshedRequested = true;
      requestAnimationFrame(() => {
        this._zoomRefreshedRequested = false;
        this.zoomRefreshed();
      });
    }
    private _zoomRefreshedRequested = false;

    private viewport(): [number, number] {
      return [this["margin-left"], this["width"] - this["margin-right"]];
    }

    private displayRange(): [number, number] {
      const displayStart = this["display-start"] ?? 1;
      const displayEnd = (this["display-end"] === undefined || this["display-end"] === -1) ? (this.length ?? 1) : this["display-end"];
      return [displayStart, displayEnd + 1];
    }

    updateScaleDomain() {
      this.adjustZoomConstraints();
    }

    /** Synchronize state of the zoom behavior with the display-start, display-end attributes
     * and call `zoomRefreshed` method in the next animation frame. */
    applyZoomTranslation() {
      this.adjustZoom();
      this.requestZoomRefreshed();
    }

    zoomRefreshed() {
      // to be overridden by subclasses
    }

    getXFromSeqPosition(position: number) {
      if (!this.xScale) return -1;
      return this.xScale(position);
    }

    getSeqPositionFromX(x: number): number | undefined {
      return this.xScale?.invert(x);
    }

    getSingleBaseWidth() {
      if (!this.xScale) return -1;
      return this.xScale(2) - this.xScale(1);
    }
  }
  return WithZoom as Constructor<WithZoomInterface> & T;
};

export default withZoom;


/** Convert display range (sequence numbers, end exclusive) and viewport (canvas space) to D3 zoom transform */
function getZoomTransform(displayRange: [number, number], viewport: [number, number]): ZoomTransform {
  const k = (viewport[1] - viewport[0]) / (displayRange[1] - displayRange[0]);
  const x = viewport[0] - k * displayRange[0];
  const y = 0;
  return new ZoomTransform(k, x, y);
}
