// eslint-disable-next-line max-classes-per-file
import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

export interface WithDimensionsI extends NightingaleBaseElement {
  width: number;

  height: number;
}
export declare class ElementWithDimensions
  extends NightingaleBaseElement
  implements WithDimensionsI {
  width: number;

  height: number;
}

const withDimensions = (
  Element: typeof NightingaleBaseElement,
  options: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  }
): any => {
  class ElementWithDimensions extends Element implements WithDimensionsI {
    _width: number;

    _height: number;

    constructor() {
      super();
      this._width = options.width;
      this._height = options.height;
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withDimensions);
    }

    get width() {
      return this._width;
    }

    set width(width) {
      if (this._width !== width) {
        this._width = width;
        super.width = width;
        this.render();
      }
    }

    get height() {
      return this._height;
    }

    set height(height) {
      if (this._height !== height) {
        this._height = height;
        this.render();
      }
    }

    connectedCallback() {
      this.style.display = "block";
      this.style.width = "100%";
      this.width = this.offsetWidth;
      super.connectedCallback();
    }

    static get observedAttributes() {
      return Element.observedAttributes.concat(["height", "width"]);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
      const nv = newValue === "null" ? null : newValue;
      if (oldValue !== nv) {
        const value = parseFloat(nv);
        if (name === "width") {
          this.width = Number.isNaN(value) ? 0 : value;
        } else if (name === "height") {
          this.height = Number.isNaN(value) ? 0 : value;
        }
      }
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }
  return ElementWithDimensions;
};

export default withDimensions;
