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
      console.log("binding");
      this._onResize = this._onResize.bind(this);
      this._listenForResize = this._listenForResize.bind(this);
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withResizable);
    }

    get dependencies(): Array<keyof typeof Registry> {
      return super.dependencies.concat(Registry.withDimensions);
    }

    connectedCallback() {
      console.log("connectedCallback");

      this._listenForResize();
      super.connectedCallback();
    }

    disconnectedCallback() {
      if (this.#observer) {
        this.#observer.unobserve(this);
      } else {
        window.removeEventListener("resize", this._onResize);
      }
      super.disconnectedCallback();
    }

    _onResize() {
      console.log("_onResize");
      this.width = this.offsetWidth;
    }

    _listenForResize() {
      console.log("_listenForResize");
      this.#observer = new ResizeObserver(this._onResize);
      this.#observer.observe(this);
    }
  }
  return ElementWithResizable;
};

export default withResizable;
