import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

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
  class ElementWithDimensions extends Element {
    _width: number;

    _height: number;

    get width() {
      return this._width;
    }

    set width(width) {
      if (this._width !== width) {
        this._width = width;
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

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withDimensions);
    }

    constructor() {
      super();
      this._width = options.width;
      this._height = options.height;
    }
  }
  return ElementWithDimensions;
};

export default withDimensions;
