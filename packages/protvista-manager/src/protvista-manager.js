class ProtVistaManager extends HTMLElement {

  constructor() {
    super();
    this.protvistaElements = new Set();
  }

  static get observedAttributes() {
    return ['attributes', 'displayend', 'displaystart'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "attributes") {
        this._attributes = newValue.split(' ');
        if (this._attributes.indexOf('type') !== -1)
          throw new Error("'type' can't be used as a protvista attribute");
        if (this._attributes.indexOf('value') !== -1)
          throw new Error("'value' can't be used as a protvista attribute");
      } else if (ProtVistaManager.observedAttributes.indexOf(name) !== -1) {
        this._setAttributes(this.protvistaElements, name, newValue);
      }
    }
  }

  _setAttributes(elements, type, value) {
    for (const el of elements) {
      if (value === false) {
        el.removeAttribute(type);
      } else {
        el.setAttribute(type, typeof (value) === 'boolean' ? '' : value);
      }
    }
  }

  _registerProtvistaDescendents(element) {
    for (const child of element.children) {
      if (child.isManaged)
        this.protvistaElements.add(child);
      this._registerProtvistaDescendents(child);
    }
  }

  addListeners() {
    for (const child of this.protvistaElements) {
      child.addEventListener("change", e => {
        if (this._attributes.indexOf(e.detail.type) !== -1) {
          this._setAttributes(this.protvistaElements, e.detail.type, e.detail.value);
        }
        for (let key in e.detail) {
          if (this._attributes.indexOf(key) !== -1) {
            this._setAttributes(this.protvistaElements, key, e.detail[key]);
          }
        }
      });
    }
  }

  connectedCallback() {
    this._registerProtvistaDescendents(this);
    this.addListeners();
    var that = this;

    if ('MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(mutationList => {
        that._registerProtvistaDescendents(that);
        that.addListeners();
      });
      this.mutationObserver.observe(this, {
        childList: true
      });
    }
  }

  disconnectedCallback() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

}

export default ProtVistaManager;