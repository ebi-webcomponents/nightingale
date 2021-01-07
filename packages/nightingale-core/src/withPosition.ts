import NightingaleBaseElement from "./nightingale-base-element";
import Registry from "./registryWith";

const withPosition = (
  Element: typeof NightingaleBaseElement,
  options: {
    displaystart: number;
    displayend: number;
    sequenceLength: number;
  } = {
    displaystart: 1,
    displayend: 1,
    sequenceLength: 0,
  }
): any => {
  class ElementWithPosition extends Element {
    _displaystart: number;

    _displayend: number;

    _length: number;

    constructor() {
      super();
      this._displaystart = options.displaystart;
      this._displayend = options.displayend;
      this._length = options.sequenceLength;
    }

    get implements(): Array<keyof typeof Registry> {
      return super.implements.concat(Registry.withPosition);
    }

    get displaystart() {
      return this._displaystart || 1;
    }

    set displaystart(displaystart) {
      if (this._displaystart !== displaystart) {
        this._displaystart = displaystart;
        this.render();
      }
    }

    get displayend() {
      return this._displayend || this.sequenceLength;
    }

    set displayend(displayend) {
      if (this._displayend !== displayend) {
        this._displayend = displayend;
        this.render();
      }
    }

    get sequenceLength() {
      return this._length;
    }

    set sequenceLength(length) {
      if (this._length !== length) {
        this._length = length;
        this.render();
      }
    }

    connectedCallback() {
      this._length = this.getAttribute("length")
        ? parseFloat(this.getAttribute("length"))
        : 0;

      this._displaystart = this.getAttribute("displaystart")
        ? parseFloat(this.getAttribute("displaystart"))
        : 1;
      this._displayend = this.getAttribute("displayend")
        ? parseFloat(this.getAttribute("displayend"))
        : this.sequenceLength;
      super.connectedCallback();
    }

    static get observedAttributes() {
      return Element.observedAttributes.concat([
        "displaystart",
        "displayend",
        "length",
      ]);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
      const nv = newValue === "null" ? null : newValue;
      if (oldValue !== nv) {
        const value = parseFloat(nv);
        if (name === "displaystart") {
          this.displaystart = Number.isNaN(value) ? 1 : value;
        } else if (name === "displayend") {
          this.displayend = Number.isNaN(value) ? this.sequenceLength : value;
        } else if (name === "length") {
          this.sequenceLength = Number.isNaN(value) ? 0 : value;
        }
      }
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  return ElementWithPosition;
};

export default withPosition;
