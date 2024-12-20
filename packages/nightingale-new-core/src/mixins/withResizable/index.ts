import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import withDimensions, { WithDimensionsInterface } from "../withDimensions";

const DEFAULT_MIN_HEIGHT = 10;
const DEFAULT_MIN_WIDTH = 10;

export interface WithResizableInterface extends WithDimensionsInterface {
  "min-width": number;
  "min-height": number;
  onDimensionsChange(): void;
}

const defaultOptions = {
  "min-width": DEFAULT_MIN_WIDTH,
  "min-height": DEFAULT_MIN_HEIGHT,
};

const withResizable = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T,
  options: {
    "min-width"?: number;
    "min-height"?: number;
  } = {}
) => {
  class WithResizable
    extends withDimensions(superClass)
    implements WithResizableInterface
  {
    #intitialOptions = { ...defaultOptions, ...options };
    @property({ type: Number, reflect: true })
    "min-width": number = this.#intitialOptions["min-width"];
    @property({ type: Number, reflect: true })
    "min-height": number = this.#intitialOptions["min-height"];

    onDimensionsChange() {}

    override connectedCallback() {
      super.connectedCallback();
      // Set some `width` and `height` values to avoid errors
      this.width ??= this["min-width"];
      this.height ??= this["min-height"];
      if (this.getAttribute("width") === null) this.style.width = "100%";
      if (this.getAttribute("height") === null) this.style.height = "100%";
      SingletonResizeObserver.observe(this);
    }
    override disconnectedCallback() {
      SingletonResizeObserver.unobserve(this);
      super.disconnectedCallback();
    }
  }
  return WithResizable as Constructor<WithResizableInterface> & T;
};

export default withResizable;

const SingletonResizeObserver = new ResizeObserver((entries) => {
  window.requestAnimationFrame(() => {
    for (const entry of entries) {
      const width = entry.contentBoxSize?.[0].inlineSize;
      const height = entry.contentBoxSize?.[0].blockSize;
      if (typeof width !== "undefined" && typeof height !== "undefined") {
        resize(
          entry.target as NightingaleBaseElement & WithResizableInterface,
          width,
          height
        );
      }
    }
  });
});

function resize(
  element: NightingaleBaseElement & WithResizableInterface,
  newWidth: number,
  newHeight: number
): void {
  newWidth = Math.max(newWidth, element["min-width"]);
  newHeight = Math.max(newHeight, element["min-height"]);
  let changed = false;
  if (newWidth !== element.width && element.getAttribute("width") === null) {
    element.width = newWidth;
    changed = true;
  }
  if (newHeight !== element.height && element.getAttribute("height") === null) {
    element.height = newHeight;
    changed = true;
  }
  if (changed) {
    element.onDimensionsChange();
  }
}
