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

export interface WithZoomInterface
  extends WithDimensionsInterface,
  withPositionInterface,
  withMarginInterface,
  WithResizableInterface {
  xScale?: ScaleLinear<number, number>;
  svg?: SVGSelection;
  getSingleBaseWidth(): number;
  getXFromSeqPosition(position: number): number;
  getSeqPositionFromX(x: number): number | undefined;
  updateScaleDomain(): void;
  applyZoomTranslation(): void;
}

const ATTRIBUTES_THAT_TRIGGER_REFRESH = ["length", "width", "height"];


const withZoom = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
) => {
  class WithZoom extends withMargin(
    withPosition(withResizable(withDimensions(superClass))),
  ) implements WithZoomInterface {
    // /** Base scale without any transformations, only updated in `updateScaleDomain` */
    // private originXScale?: ScaleLinear<number, number>;
    /** Current scale, the one used to calculate any positions. Calculated based on `display-start` and `display-end`. */
    xScale?: ScaleLinear<number, number>;

    private zoomBehavior?: ZoomBehavior<SVGSVGElement, unknown>;
    private _svg?: SVGSelection;
    private suppressEmit = false;
    private wheelHelper?: WheelHelper;

    @property({ type: Boolean })
    "use-ctrl-to-zoom" = false;

    get svg(): SVGSelection | undefined {
      return this._svg;
    }
    set svg(svg: SVGSelection) {
      console.log('set svg', svg)
      this._svg = svg;
      this.addZoomBehavior();
    }

    updateScaleDomain() {
      this.adjustZoomExtent();
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      const newV = newValue === "null" ? null : newValue;
      if (oldValue !== newV) {
        if (ATTRIBUTES_THAT_TRIGGER_REFRESH.includes(name)) {
          this.adjustZoomExtent();
          this.adjustZoom();
        }
        if (name === "display-start" || name === "display-end") {
          console.log('attributeChangedCallback', this.id, name, oldValue, newValue, 'display', this["display-start"], this["display-end"])
          this.adjustZoom();
        }
        if (name == "use-ctrl-to-zoom" && this.wheelHelper) {
          this.wheelHelper.scrollRequiresCtrl = this["use-ctrl-to-zoom"];
        }
      }
    }

    /** Initialize zoom behavior (also remove any existing zoom behavior) */
    private addZoomBehavior(): void {
      if (!this.svg) return;
      if (this.zoomBehavior) {
        // Remove any old behavior
        this.zoomBehavior.on('zoom', null);
        this.zoomBehavior = undefined;
        this.wheelHelper?.dispose();
        this.wheelHelper = undefined;
      }
      this.wheelHelper = new WheelHelper(this.svg);
      this.wheelHelper.scrollRequiresCtrl = this["use-ctrl-to-zoom"];
      this.wheelHelper.handlePan = shift => this.zoomBehavior?.translateBy(this.svg as any, PAN_SENSITIVITY * shift / this.getSingleBaseWidth(), 0);
      this.wheelHelper.handleShowHelp = () => console.warn('Use Ctrl+scroll to zoom.');

      this.zoomBehavior = d3zoom();
      this.zoomBehavior.filter(e => (e instanceof WheelEvent) ? (this.wheelHelper?.wheelAction(e).kind === 'zoom') : true);
      this.zoomBehavior.wheelDelta(e => {
        // Default function is: -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1)
        const action = this.wheelHelper?.wheelAction(e);
        return action?.kind === 'zoom' ? ZOOM_SENSITIVITY * action.delta : 0;
      });
      this.zoomBehavior.on('zoom', e => this.handleZoom(e));

      this.svg.call(this.zoomBehavior as any);
      this.adjustZoomExtent();
      this.adjustZoom();
    }

    /** Handle zoom event coming from the D3 zoom behavior */
    private handleZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
      // console.log('handleZoom', event.transform, !this.suppressEmit)
      if (!this.suppressEmit) {
        const [viewportMin, viewportMax] = this.viewport();
        this.emitZoom(event.transform.invertX(viewportMin), event.transform.invertX(viewportMax) - 1); // subtracting 1 to convert to end-inclusive display-end
      }
      // TODO emulate hover?
    }

    /** Emit a zoom event, based on the current zoom.
     * `origin` is an identifier of the event originator
     * (to avoid infinite loop when multiple component listen to zoom and change it). */
    private emitZoom(displayStart: number, displayEnd: number): void {
      // Re-clamping the values here because just D3 zoom constraints can produce values like 0.99999996
      displayStart = Math.max(displayStart, 1);
      displayEnd = Math.min(displayEnd, (this.length ?? 1));

      if (displayStart === this["display-start"] && displayEnd === this["display-end"]) return;
      // console.log('emitZoom', displayStart, displayEnd)
      this.dispatchEvent(
        // Dispatches the event so the manager can propagate this changes to other  components
        new CustomEvent("change", {
          detail: { "display-start": displayStart, "display-end": displayEnd },
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    zoomRefreshed() {
      // TODO review how this is used in subclasses, include in the interface if it is to be overridden
      super.render();
    }

    /** Convert visWorld box to zoom transform */
    private visWorldToZoomTransform(visWorld: [number, number]): ZoomTransform {
      const [viewportMin, viewportMax] = this.viewport();
      const k = (viewportMax - viewportMin) / (visWorld[1] - visWorld[0]);
      const x = viewportMin - k * visWorld[0];
      const y = 0;
      return new ZoomTransform(k, x, y);
    }

    private viewport(): [number, number] { return [this["margin-left"], this["width"] - this["margin-right"]]; }
    private displayRange(): [number, number] { return [this["display-start"] ?? 1, (this["display-end"] ?? this.length ?? 1) + 1]; }
    private wholeWorldRange(): [number, number] { return [1, (this.length ?? 1) + 1]; }


    /** Adjust zoom extent based on current data and canvas size
     * (limit maximum zoom in/out and translation to avoid getting out of the data world) */
    private adjustZoomExtent(): void {
      if (!this.zoomBehavior) return;

      const length = this.length ?? 1;
      this.zoomBehavior.translateExtent([[1, 0], [length + 1, 0]]);
      const [viewportMin, viewportMax] = this.viewport();
      const viewportWidth = viewportMax - viewportMin;
      const minZoom = viewportWidth / length; // zoom-out
      const minZoomedDatapoints = MIN_ZOOMED_COLUMNS;
      const maxZoom = Math.max(viewportWidth / minZoomedDatapoints, minZoom); // zoom-in
      this.zoomBehavior.scaleExtent([minZoom, maxZoom]);
      this.zoomBehavior.extent([[viewportMin, 0], [viewportMax, 0]]);
      console.log('adjustZoomExtent', this.length, this.width, [1, length + 1], [minZoom, maxZoom], [viewportMin, viewportMax])

    }
    /** Synchronize the state of the zoom behavior with the visWorld box (e.g. when canvas resizes) */
    private adjustZoom(): void {
      if (!this.svg) return;
      if (!this.zoomBehavior) return;
      const currentZoom = this.visWorldToZoomTransform(this.displayRange());
      console.log('adjustZoom', this.displayRange(), currentZoom)
      this.xScale = scaleLinear(this.displayRange(), this.viewport());

      this.suppressEmit = true;
      this.zoomBehavior.transform(this.svg as any, currentZoom);
      this.suppressEmit = false;
      this.zoomRefreshed();
    }

    private _zoomTranslationRequested = false;

    /** Apply zoom translation in the next frame.
     * Postponing the zoom translation to the next frame
     * helps in case several attributes are changed almost at the same time.
     * In this way, only one refresh will be called.*/
    applyZoomTranslation = () => {
      this.adjustZoom();
      // if (this._zoomTranslationRequested) return;
      // this._zoomTranslationRequested = true;
      // requestAnimationFrame(() => {
      //   this._zoomTranslationRequested = false;
      //   this._applyZoomTranslation();
      // });
    }

    override onDimensionsChange() {
      super.onDimensionsChange();
      this.svg?.attr("width", this.width);
      this.svg?.attr("height", this.height);
      this.adjustZoomExtent();
      this.adjustZoom();
    }

    getXFromSeqPosition(position: number) {
      if (!this.xScale) return -1;
      return this.xScale(position);
    }
    /** Inverse of `this.getXFromSeqPosition`. */
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

function almostEqual(a: number | undefined, b: number | undefined, epsilon = 0.0001) {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return Math.abs(a - b) < epsilon;
}