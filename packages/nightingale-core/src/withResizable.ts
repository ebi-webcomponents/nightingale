// eslint-disable-next-line max-classes-per-file
// import NightingaleBaseElement from "./nightingale-base-element";
import ResizeObserver from "resize-observer-polyfill";

import Registry from "./registryWith";
import { ElementWithDimensions } from "./withDimensions";

const withResizable = (
  Element: typeof ElementWithDimensions
  // options: {} = {
  // }
): any => {
  class ElementWithResizable extends Element {
    #observer: any;

    constructor() {
      super();
      this.onResize = this.onResize.bind(this);
      this.listenForResize = this.listenForResize.bind(this);
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withResizable);
    }

    get dependencies(): Array<keyof typeof Registry> {
      return super.dependencies.concat(Registry.withDimensions);
    }

    connectedCallback() {
      this.listenForResize();
      super.connectedCallback();
    }

    disconnectedCallback() {
      if (this.#observer) {
        this.#observer.unobserve(this);
      } else {
        window.removeEventListener("resize", this.onResize);
      }
      super.disconnectedCallback();
    }

    private onResize() {
      this.width = this.offsetWidth;
    }

    private listenForResize() {
      this.#observer = new ResizeObserver(this.onResize);
      this.#observer.observe(this);
    }
  }
  return ElementWithResizable;
};

export default withResizable;
