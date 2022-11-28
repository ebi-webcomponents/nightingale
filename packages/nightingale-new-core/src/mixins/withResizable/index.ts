import { property } from "lit/decorators.js";
import NightingaleBaseElement, {
  Constructor,
} from "../../nightingale-base-element";
import withDimensions from "../withDimensions";

const DEFAULT_MIN_HEIGHT = 10;
const DEFAULT_MIN_WIDTH = 10;

export declare class WithResizableInterface {
  "min-width": number;
  "min-height": number;
  onDimensionsChange(): void;
}

const withResizable = <T extends Constructor<NightingaleBaseElement>>(
  superClass: T
) => {
  class WithResizable extends withDimensions(superClass) {
    #observer?: ResizeObserver;
    @property({ type: Number })
    "min-width": number = DEFAULT_MIN_WIDTH;
    @property({ type: Number })
    "min-height": number = DEFAULT_MIN_HEIGHT;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...rest: any[]) {
      super(...rest);
      this.onResize = this.onResize.bind(this);
      this.listenForResize = this.listenForResize.bind(this);
    }

    private useAvailableWidth() {
      //Only change this.width if the value in width hasn't been set via its attribute
      if (this.getAttribute("width") === null) {
        this.style.width = "100%";
        this.width = Math.max(this.offsetWidth, this["min-width"]);
      }
    }
    private useAvailableHeight() {
      //Only change this.height if the value in height hasn't been set via its attribute
      if (this.getAttribute("height") === null) {
        this.style.height = "100%";
        this.height = Math.max(this.offsetHeight, this["min-height"]);
      }
    }
    onDimensionsChange() {}

    connectedCallback() {
      this.useAvailableWidth();
      this.useAvailableHeight();
      this.listenForResize();
      super.connectedCallback();
    }
    disconnectedCallback() {
      if (this.#observer) {
        this.#observer.unobserve(this);
      }
      super.disconnectedCallback();
    }

    private onResize() {
      this.useAvailableWidth();
      this.useAvailableHeight();
      this.onDimensionsChange();
    }

    private listenForResize() {
      this.#observer = new ResizeObserver(this.onResize);
      this.#observer.observe(this);
    }
  }
  return WithResizable as Constructor<WithResizableInterface> & T;
};

export default withResizable;
