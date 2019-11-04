class ProtVistaManager extends HTMLElement {
  constructor() {
    super();
    this.protvistaElements = new Set();
    this.attributeValues = new Map();
  }

  static get observedAttributes() {
    return ["attributes"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "attributes") {
        this._attributes = newValue.split(" ");
        if (this._attributes.indexOf("type") !== -1)
          throw new Error("'type' can't be used as a protvista attribute");
        if (this._attributes.indexOf("value") !== -1)
          throw new Error("'value' can't be used as a protvista attribute");
      }
    }
  }

  register(element) {
    this.protvistaElements.add(element);
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
      Element.prototype.closest = s => {
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
    this.protvistaElements.forEach(element => {
      this.attributeValues.forEach((value, type) => {
        if (value === false) {
          element.removeAttribute(type);
        } else {
          element.setAttribute(type, typeof value === "boolean" ? "" : value);
        }
      });
    });
  }

  _changeListener(e) {
    if (this._attributes.indexOf(e.detail.type) !== -1) {
      this.attributeValues.set(e.detail.type, e.detail.value);
    }
    Object.keys(e.detail).forEach(key => {
      if (this._attributes.indexOf(key) !== -1) {
        this.attributeValues.set(key, e.detail[key]);
      }
    });
    this.applyAttributes();
  }

  connectedCallback() {
    this.addEventListener("change", this._changeListener);
  }
}

export default ProtVistaManager;
