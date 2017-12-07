
class ProtVistaManager extends HTMLElement {

  constructor() {
    super();
    this._attributes = this.getAttribute('attributes').split(' ');
    if (this._attributes.indexOf('type') !== -1)
      throw new Error("'type' can't be used as a protvista attribute")
    if (this._attributes.indexOf('value') !== -1)
      throw new Error("'value' can't be used as a protvista attribute")
  }

  connectedCallback() {
    for (const child of this.children){
      child.addEventListener("change", e => {
        if (this._attributes.indexOf(e.detail.type) !== -1){
          for (const ch of this.children){
            ch.setAttribute(e.detail.type, e.detail.value);
          }
        }
        for (let key in e.detail) {
          if (this._attributes.indexOf(key) !== -1){
            for (const ch of this.children){
              ch.setAttribute(key, e.detail[key]);
            }
          }
        }
      });
    }
  }

}

export default ProtVistaManager;
