class ProtVistaManager extends HTMLElement {
  constructor() {
    super();
    this.protvistaElements = new Set();
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

  _setAttributes(elements, type, value) {
    for (const el of elements) {
      if (value === false) {
        el.removeAttribute(type);
      } else {
        el.setAttribute(type, typeof value === "boolean" ? "" : value);
      }
    }
  }

  register(element) {
    this.protvistaElements.add(element);
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
      Element.prototype.closest = function(s) {
        var el = this;

        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  }

  _changeListener(e) {
    if (this._attributes.indexOf(e.detail.type) !== -1) {
      this._setAttributes(
        this.protvistaElements,
        e.detail.type,
        e.detail.value
      );
    }
    for (let key in e.detail) {
      if (this._attributes.indexOf(key) !== -1) {
        this._setAttributes(this.protvistaElements, key, e.detail[key]);
      }
    }
  }

  connectedCallback() {
    this.addEventListener("change", this._changeListener);
  }
}

export default ProtVistaManager;
