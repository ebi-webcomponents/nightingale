const LENGTH = "length";
const DISPLAY_START = "displaystart";
const DISPLAY_END = "displayend";
const HIGHLIGHT = "highlight";

class ProtVistaManager extends HTMLElement {
  constructor() {
    super();
    this.protvistaElements = new Set();
    this.attributeValues = new Map();
    this.propertyValues = new Map();
    this.mouseOver = false;
  }

  static get observedAttributes() {
    return ["attributes", LENGTH, DISPLAY_START, DISPLAY_END, HIGHLIGHT];
  }

  set length(length) {
    this.attributeValues.set(LENGTH, length);
  }

  get length() {
    return this.attributeValues.get(LENGTH);
  }

  set displaystart(displaystart) {
    this.attributeValues.set(DISPLAY_START, displaystart);
  }

  get displaystart() {
    return this.attributeValues.get(DISPLAY_START);
  }

  set displayend(displayend) {
    this.attributeValues.set(DISPLAY_END, displayend);
  }

  get displayend() {
    return this.attributeValues.get(DISPLAY_END);
  }

  set highlight(highlight) {
    this.attributeValues.set(HIGHLIGHT, highlight);
  }

  get highlight() {
    return this.attributeValues.get(HIGHLIGHT);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "attributes") {
        this._attributes = newValue.split(" ");
        if (this._attributes.indexOf("type") !== -1)
          throw new Error("'type' can't be used as a protvista attribute");
        if (this._attributes.indexOf("value") !== -1)
          throw new Error("'value' can't be used as a protvista attribute");
        this.attributeValues = new Map(
          this._attributes
            .filter(
              (attr) => !ProtVistaManager.observedAttributes.includes(attr)
            )
            .map((attr) => [attr, null])
        );
      } else {
        if (name === LENGTH) {
          this.length = newValue;
        }
        if (name === DISPLAY_START) {
          this.displaystart = newValue;
        }
        if (name === DISPLAY_END) {
          this.displayend = newValue;
        }
        if (name === HIGHLIGHT) {
          this.highlight = newValue;
        }
      }
      this.applyAttributes();
    }
  }

  register(element) {
    this.protvistaElements.add(element);
    this.applyAttributes();
  }

  unregister(element) {
    this.protvistaElements.delete(element);
  }

  _polyfillElementClosest() {
    // Polyfill for IE support, see
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = (s) => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let el = this;

        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  }

  applyAttributes() {
    this.protvistaElements.forEach((element) => {
      this.attributeValues.forEach((value, type) => {
        if (value === false || value === null || value === undefined) {
          element.removeAttribute(type);
        } else {
          element.setAttribute(type, typeof value === "boolean" ? "" : value);
        }
      });
    });
  }

  applyProperties(forElementId) {
    if (forElementId) {
      const element = this.querySelector(`#${forElementId}`);
      this.propertyValues.forEach((value, type) => {
        element[type] = value;
      });
    } else {
      this.protvistaElements.forEach((element) => {
        this.propertyValues.forEach((value, type) => {
          /* eslint-disable no-param-reassign */
          element[type] = value;
        });
      });
    }
  }

  isRegisteredAttribute(attributeName) {
    return (
      [...this.attributeValues.keys()].includes(attributeName) ||
      ProtVistaManager.observedAttributes.includes(attributeName)
    );
  }

  _changeListener(e) {
    if (!e.detail) {
      return;
    }
    switch (e.detail.handler) {
      case "property":
        this.propertyValues.set(e.detail.type, e.detail.value);
        this.applyProperties(e.detail.for);
        break;
      default:
        if (this.isRegisteredAttribute(e.detail.type)) {
          this.attributeValues.set(e.detail.type, e.detail.value);
        }
        Object.keys(e.detail).forEach((key) => {
          if (this.isRegisteredAttribute(key)) {
            this.attributeValues.set(key, e.detail[key]);
          }
        });
        this.applyAttributes();
    }
  }

  connectedCallback() {
    this.addEventListener("change", this._changeListener);
  }
}

export default ProtVistaManager;
