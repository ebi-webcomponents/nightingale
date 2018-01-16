
class ProtVistaManager extends HTMLElement {

  constructor() {
    super();
    this.protvistaElements = new Set();
  }

  static get observedAttributes() {
      return ['attributes'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (name === "attributes"){
        this._attributes = newValue.split(' ');
        if (this._attributes.indexOf('type') !== -1)
          throw new Error("'type' can't be used as a protvista attribute")
        if (this._attributes.indexOf('value') !== -1)
          throw new Error("'value' can't be used as a protvista attribute")
        }
      }
  }

  _registerProtvistaDescendents(element){
    for (const child of element.children){
      if (child.localName.startsWith("protvista"))
        this.protvistaElements.add(child);
      this._registerProtvistaDescendents(child);
    }
  }

  connectedCallback() {
    this._registerProtvistaDescendents(this);
    for (const child of this.protvistaElements){

      child.addEventListener("change", e => {
        if (this._attributes.indexOf(e.detail.type) !== -1){
          for (const ch of this.protvistaElements){
            ch.setAttribute(e.detail.type, e.detail.value);
          }
        }
        for (let key in e.detail) {
          if (this._attributes.indexOf(key) !== -1){
            for (const ch of this.protvistaElements){
              ch.setAttribute(key, e.detail[key]);
            }
          }
        }
      });
    }
  }

}

export default ProtVistaManager;
