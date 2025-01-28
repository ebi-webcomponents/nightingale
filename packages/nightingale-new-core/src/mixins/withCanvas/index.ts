
import { select, Selection } from "d3";
import { PropertyValues } from "lit";
import NightingaleBaseElement, { Constructor } from "../../nightingale-base-element";
import { WithResizableInterface } from "../withResizable";


export interface WithCanvasInterface {
  /** D3 selection with this element's <canvas> node. Is automatically set to the first ancestor <canvas> node when first rendered. */
  canvas?: Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>,
  /** Canvas rendering context. */
  canvasCtx?: CanvasRenderingContext2D,
  /** Ratio of canvas logical size versus canvas display size. */
  canvasScale: number,
  /** Runs when device pixel ratio (`this.canvasScale`) changes, e.g. when browser zoom is changed or browser window is moved to a different screen. */
  onCanvasScaleChange(): void,
  /** Adjust width and height of `this.canvasCtx` based on canvas size and scale if needed (clears canvas content!). Subclass should call this method just before redrawing the canvas. */
  adjustCanvasCtxLogicalSize(): void,
}

const withCanvas = <T extends Constructor<NightingaleBaseElement & WithResizableInterface>>(
  superClass: T,
) => {
  class WithCanvas extends superClass implements WithCanvasInterface {
    canvas?: Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;
    canvasCtx?: CanvasRenderingContext2D;
    canvasScale: number = 1;

    override connectedCallback(): void {
      super.connectedCallback();
      select(window).on(`resize.WithCanvas-${this.id}`, () => this.updateCanvasScale());
    }

    override disconnectedCallback(): void {
      select(window).on(`resize.WithCanvas-${this.id}`, null);
      super.disconnectedCallback();
    }

    override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      this.canvas = select(this).selectAll<HTMLCanvasElement, unknown>("canvas");
      if (this.canvas.empty()) {
        console.error('Failed to initialize canvas context. This element contains no <canvas> node.', this);
      }
      this.canvasCtx = this.canvas.node()?.getContext("2d") ?? undefined;
      this.onDimensionsChange();
    }

    override onDimensionsChange(): void {
      super.onDimensionsChange();
      if (this.canvas && !this.canvas.empty()) {
        this.canvas.style("width", `${this.width}px`);
        this.canvas.style("height", `${this.height}px`);
        this.updateCanvasScale();
      }
    }

    onCanvasScaleChange(): void {
      // optional implementation in subclasses
    }

    adjustCanvasCtxLogicalSize() {
      if (!this.canvasCtx) return;
      const newWidth = Math.floor(this.width * this.canvasScale);
      const newHeight = Math.floor(this.height * this.canvasScale);
      if (this.canvasCtx.canvas.width !== newWidth) {
        this.canvasCtx.canvas.width = newWidth;
      }
      if (this.canvasCtx.canvas.height !== newHeight) {
        this.canvasCtx.canvas.height = newHeight;
      }
    }

    private updateCanvasScale() {
      const devicePixelRatio = getDevicePixelRatio();
      if (devicePixelRatio !== this.canvasScale) {
        this.canvasScale = devicePixelRatio;
        this.onCanvasScaleChange();
      }
    }
  }
  return WithCanvas as Constructor<WithCanvasInterface> & T;
};

function getDevicePixelRatio(): number {
  return window?.devicePixelRatio ?? 1;
}

export default withCanvas;
